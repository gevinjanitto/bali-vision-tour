from dotenv import load_dotenv
load_dotenv()

import os
import re
import uuid
import json
import logging
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional

import bcrypt
import jwt
import requests
from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, UploadFile, File
from fastapi.responses import Response
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bvt")

app = FastAPI(title="Bali Vision Tour API")
api = APIRouter(prefix="/api")

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALG = "HS256"
RESOURCES = {"tours", "cars", "activities", "articles"}
APP_NAME = "bali-vision-tour"

STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
storage_key: Optional[str] = None


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def slugify(s: str) -> str:
    s = re.sub(r"[^a-z0-9\s-]", "", (s or "").lower().strip())
    return re.sub(r"-+", "-", re.sub(r"\s+", "-", s)) or uuid.uuid4().hex[:8]


def clean(doc: Optional[dict]) -> Optional[dict]:
    if doc is None:
        return None
    doc.pop("_id", None)
    return doc


# ---------- auth ----------
def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()


def verify_password(p: str, h: str) -> bool:
    return bcrypt.checkpw(p.encode(), h.encode())


def create_token(user_id: str, username: str) -> str:
    payload = {"sub": user_id, "username": username, "type": "access", "exp": datetime.now(timezone.utc) + timedelta(days=7)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        raise HTTPException(401, "Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(401, "User not found")
    return user


class LoginBody(BaseModel):
    username: str
    password: str


@api.post("/auth/login")
async def login(body: LoginBody, request: Request, response: Response):
    ident = f"{request.client.host if request.client else 'x'}:{body.username.lower()}"
    attempt = await db.login_attempts.find_one({"identifier": ident})
    if attempt and attempt.get("count", 0) >= 5:
        locked_until = datetime.fromisoformat(attempt["last"]) + timedelta(minutes=15)
        if datetime.now(timezone.utc) < locked_until:
            raise HTTPException(429, "Too many failed attempts. Try again in 15 minutes.")
    user = await db.users.find_one({"username": body.username.lower()})
    if not user or not verify_password(body.password, user["password_hash"]):
        await db.login_attempts.update_one({"identifier": ident}, {"$inc": {"count": 1}, "$set": {"last": now_iso()}}, upsert=True)
        raise HTTPException(401, "Invalid username or password")
    await db.login_attempts.delete_one({"identifier": ident})
    token = create_token(user["id"], user["username"])
    response.set_cookie("access_token", token, httponly=True, secure=True, samesite="none", max_age=7 * 86400, path="/")
    return {"token": token, "user": {"id": user["id"], "username": user["username"], "name": user.get("name", "Admin"), "role": "admin"}}


@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


class PasswordBody(BaseModel):
    current_password: str
    new_password: str


@api.post("/auth/change-password")
async def change_password(body: PasswordBody, user: dict = Depends(get_current_user)):
    full = await db.users.find_one({"id": user["id"]})
    if not verify_password(body.current_password, full["password_hash"]):
        raise HTTPException(400, "Current password is incorrect")
    if len(body.new_password) < 4:
        raise HTTPException(400, "Password too short")
    await db.users.update_one({"id": user["id"]}, {"$set": {"password_hash": hash_password(body.new_password)}})
    return {"ok": True}


# ---------- public content ----------
def check_resource(resource: str):
    if resource not in RESOURCES:
        raise HTTPException(404, "Unknown resource")


@api.get("/content/{resource}")
async def list_resource(resource: str):
    check_resource(resource)
    items = await db[resource].find({}, {"_id": 0}).sort("order", 1).to_list(1000)
    return items


@api.get("/content/{resource}/{slug}")
async def get_resource(resource: str, slug: str):
    check_resource(resource)
    doc = await db[resource].find_one({"$or": [{"slug": slug}, {"id": slug}]}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Not found")
    return doc


@api.post("/content/{resource}", status_code=201)
async def create_resource(resource: str, body: Dict[str, Any], user: dict = Depends(get_current_user)):
    check_resource(resource)
    body.pop("_id", None)
    body["id"] = uuid.uuid4().hex[:12]
    base = slugify(body.get("slug") or body.get("title") or body.get("name") or "")
    slug = base
    i = 2
    while await db[resource].find_one({"slug": slug}):
        slug = f"{base}-{i}"
        i += 1
    body["slug"] = slug
    body["createdAt"] = now_iso()
    body["updatedAt"] = body["createdAt"]
    first = await db[resource].find_one({}, sort=[("order", 1)])
    body.setdefault("order", (first.get("order", 0) if first else 0) - 1)
    await db[resource].insert_one(dict(body))
    return clean(body)


@api.put("/content/{resource}/{item_id}")
async def update_resource(resource: str, item_id: str, body: Dict[str, Any], user: dict = Depends(get_current_user)):
    check_resource(resource)
    body.pop("_id", None)
    body.pop("id", None)
    if body.get("slug"):
        body["slug"] = slugify(body["slug"])
        clash = await db[resource].find_one({"slug": body["slug"], "id": {"$ne": item_id}})
        if clash:
            raise HTTPException(400, "Slug already in use")
    body["updatedAt"] = now_iso()
    res = await db[resource].update_one({"id": item_id}, {"$set": body})
    if res.matched_count == 0:
        raise HTTPException(404, "Not found")
    return clean(await db[resource].find_one({"id": item_id}))


@api.delete("/content/{resource}/{item_id}")
async def delete_resource(resource: str, item_id: str, user: dict = Depends(get_current_user)):
    check_resource(resource)
    res = await db[resource].delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Not found")
    return {"ok": True}


# ---------- bookings ----------
class BookingBody(BaseModel):
    type: str
    itemId: Optional[str] = None
    itemName: str
    name: str
    phone: str
    date: Optional[str] = None
    pax: Optional[int] = None
    option: Optional[str] = None
    notes: Optional[str] = None
    total: Optional[float] = None


@api.post("/bookings", status_code=201)
async def create_booking(body: BookingBody):
    doc = body.model_dump()
    doc.update({"id": uuid.uuid4().hex[:12], "status": "new", "createdAt": now_iso()})
    await db.bookings.insert_one(dict(doc))
    return clean(doc)


@api.get("/bookings")
async def list_bookings(user: dict = Depends(get_current_user)):
    return await db.bookings.find({}, {"_id": 0}).sort("createdAt", -1).to_list(2000)


class StatusBody(BaseModel):
    status: str


@api.patch("/bookings/{booking_id}")
async def update_booking(booking_id: str, body: StatusBody, user: dict = Depends(get_current_user)):
    if body.status not in {"new", "contacted", "confirmed", "cancelled"}:
        raise HTTPException(400, "Invalid status")
    res = await db.bookings.update_one({"id": booking_id}, {"$set": {"status": body.status, "updatedAt": now_iso()}})
    if res.matched_count == 0:
        raise HTTPException(404, "Not found")
    return clean(await db.bookings.find_one({"id": booking_id}))


@api.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: str, user: dict = Depends(get_current_user)):
    res = await db.bookings.delete_one({"id": booking_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Not found")
    return {"ok": True}


@api.get("/admin/stats")
async def stats(user: dict = Depends(get_current_user)):
    counts = {r: await db[r].count_documents({}) for r in RESOURCES}
    bookings = await db.bookings.find({}, {"_id": 0}).sort("createdAt", -1).to_list(2000)
    by_status = {}
    by_type = {}
    for b in bookings:
        by_status[b.get("status", "new")] = by_status.get(b.get("status", "new"), 0) + 1
        by_type[b.get("type", "Other")] = by_type.get(b.get("type", "Other"), 0) + 1
    cutoff = datetime.now(timezone.utc) - timedelta(days=13)
    daily = {}
    for i in range(14):
        d = (cutoff + timedelta(days=i)).date().isoformat()
        daily[d] = 0
    for b in bookings:
        d = b.get("createdAt", "")[:10]
        if d in daily:
            daily[d] += 1
    return {
        "counts": counts,
        "bookings": {"total": len(bookings), "byStatus": by_status, "byType": by_type},
        "recent": bookings[:6],
        "daily": [{"date": k, "count": v} for k, v in daily.items()],
    }


# ---------- storage ----------
def init_storage(force: bool = False) -> str:
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": os.environ.get("EMERGENT_LLM_KEY")}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    resp = requests.put(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": init_storage(), "Content-Type": content_type}, data=data, timeout=120)
    if resp.status_code == 404:
        resp = requests.put(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": init_storage(force=True), "Content-Type": content_type}, data=data, timeout=120)
    resp.raise_for_status()
    return resp.json()


def get_object(path: str) -> tuple:
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": init_storage()}, timeout=60)
    if resp.status_code == 404:
        resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": init_storage(force=True)}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


ALLOWED_IMG = {"image/jpeg", "image/png", "image/webp", "image/gif"}


@api.post("/upload")
async def upload(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    if file.content_type not in ALLOWED_IMG:
        raise HTTPException(400, "Only JPG, PNG, WEBP or GIF images are allowed")
    data = await file.read()
    if len(data) > 8 * 1024 * 1024:
        raise HTTPException(400, "Image must be under 8MB")
    ext = (file.filename or "img").rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else "jpg"
    path = f"{APP_NAME}/uploads/{uuid.uuid4().hex}.{ext}"
    try:
        result = put_object(path, data, file.content_type)
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(502, "Storage upload failed")
    await db.files.insert_one({"id": uuid.uuid4().hex[:12], "storage_path": result["path"], "original_filename": file.filename, "content_type": file.content_type, "size": result.get("size", len(data)), "is_deleted": False, "created_at": now_iso()})
    return {"url": f"/api/files/{result['path']}", "path": result["path"]}


@api.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(404, "File not found")
    try:
        data, ct = get_object(path)
    except Exception as e:
        logger.error(f"Download failed: {e}")
        raise HTTPException(502, "Storage download failed")
    return Response(content=data, media_type=record.get("content_type", ct), headers={"Cache-Control": "public, max-age=31536000, immutable"})


@api.get("/")
async def root():
    return {"service": "Bali Vision Tour API", "status": "ok"}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.environ.get("CORS_ORIGINS", "*").split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def seed():
    username = os.environ["ADMIN_USERNAME"].lower()
    password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"username": username})
    if not existing:
        await db.users.insert_one({"id": uuid.uuid4().hex[:12], "username": username, "name": "Administrator", "role": "admin", "password_hash": hash_password(password), "created_at": now_iso()})
    elif not verify_password(password, existing["password_hash"]) and not existing.get("password_changed"):
        await db.users.update_one({"username": username}, {"$set": {"password_hash": hash_password(password)}})
    seed_file = ROOT_DIR / "seed_data.json"
    if seed_file.exists():
        data = json.loads(seed_file.read_text())
        for resource in RESOURCES:
            if await db[resource].count_documents({}) == 0 and data.get(resource):
                docs = []
                for i, item in enumerate(data[resource]):
                    item = dict(item)
                    item["order"] = i
                    item["createdAt"] = now_iso()
                    docs.append(item)
                await db[resource].insert_many(docs)
                logger.info(f"Seeded {len(docs)} {resource}")


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("username", unique=True)
    await db.login_attempts.create_index("identifier")
    for r in RESOURCES:
        await db[r].create_index("slug")
        await db[r].create_index("id")
    await db.bookings.create_index("createdAt")
    await seed()
    try:
        init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
