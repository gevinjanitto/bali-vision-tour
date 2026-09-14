"""Public website content with authenticated, validated administration."""
import re
from datetime import datetime, timezone
from typing import Any
from urllib.parse import urlsplit

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, field_validator


def valid_link(value: str, schemes=("http", "https"), relative=False) -> str:
    value = value.strip()
    if not value:
        return value
    if any(ord(c) < 32 for c in value) or "\\" in value:
        raise ValueError("Link tidak valid")
    if relative and value.startswith(("/", "#")) and not value.startswith("//"):
        return value
    parsed = urlsplit(value)
    if parsed.scheme not in schemes or (parsed.scheme in {"http", "https"} and not parsed.netloc):
        raise ValueError("Gunakan link https:// yang valid")
    if parsed.username or parsed.password:
        raise ValueError("Link tidak boleh berisi kredensial")
    return value


class Contact(BaseModel):
    whatsapp: str = "6282247479695"
    phone: str = "+62 822 4747 9695"
    email: str = "hello@balivisiontour.com"
    emailLink: str = ""
    address: str = "Denpasar, Bali, Indonesia"
    addressLink: str = ""
    whatsappMessage: str = "Halo Bali Vision Tour! Saya ingin bertanya tentang layanan Anda."

    @field_validator("whatsapp")
    @classmethod
    def phone_number(cls, v):
        if not re.fullmatch(r"[+\d\s()-]+", v):
            raise ValueError("Nomor WhatsApp hanya boleh berisi angka")
        v = re.sub(r"\D", "", v)
        if v.startswith("0"):
            v = "62" + v[1:]
        if not re.fullmatch(r"[1-9]\d{7,14}", v):
            raise ValueError("Nomor WhatsApp harus 8–15 digit termasuk kode negara")
        return v

    @field_validator("email")
    @classmethod
    def email_address(cls, v):
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", v):
            raise ValueError("Alamat email tidak valid")
        return v.strip()

    @field_validator("emailLink")
    @classmethod
    def email_link(cls, v):
        return valid_link(v, ("http", "https", "mailto"))

    @field_validator("addressLink")
    @classmethod
    def address_link(cls, v):
        return valid_link(v)


class Social(BaseModel):
    instagram: str = ""
    facebook: str = ""
    youtube: str = ""
    tiktok: str = ""

    @field_validator("*")
    @classmethod
    def links(cls, v):
        return valid_link(v)


class Brand(BaseModel):
    name: str = "Bali Vision Tour"
    title: str = "Bali Vision"
    tagline: str = "TOUR & TRAVEL"
    legal: str = "PT. Bali Vision Tour"
    entity: str = "PT Mesari Loka Karya"
    logo: str = "/logo-icon.png"
    logoLight: str = ""
    logoMode: str = "icon"
    favicon: str = "/logo-icon.png"

    @field_validator("logo", "logoLight", "favicon")
    @classmethod
    def image_link(cls, v):
        return valid_link(v, relative=True)

    @field_validator("logoMode")
    @classmethod
    def mode(cls, v):
        if v not in {"icon", "full"}:
            raise ValueError("Pilih icon atau full")
        return v


class SiteSettings(BaseModel):
    contact: Contact = Field(default_factory=Contact)
    social: Social = Field(default_factory=Social)
    brand: Brand = Field(default_factory=Brand)
    texts: dict[str, str] = Field(default_factory=dict)
    blocks: dict[str, Any] = Field(default_factory=dict)
    updatedAt: str = ""

    @field_validator("texts", "blocks")
    @classmethod
    def safe_content(cls, data):
        def walk(v, depth=0):
            if depth > 12:
                raise ValueError("Konten terlalu kompleks")
            if isinstance(v, dict):
                for k, child in v.items():
                    if k.startswith("$") or k in {"__proto__", "constructor", "prototype"}:
                        raise ValueError("Nama kolom tidak valid")
                    walk(child, depth + 1)
            elif isinstance(v, list):
                if len(v) > 200:
                    raise ValueError("Maksimal 200 item per daftar")
                for child in v:
                    walk(child, depth + 1)
            elif isinstance(v, str):
                if len(v) > 30000 or re.match(r"\s*(javascript|data|vbscript):", v, re.I):
                    raise ValueError("Konten atau link tidak valid")
        walk(data)
        return data

    @field_validator("blocks")
    @classmethod
    def block_shapes(cls, blocks):
        object_blocks = {"images", "about", "footer", "policies"}
        string_lists = {"homeMarquee", "trendingTags"}
        object_lists = {"navigation", "homeStats", "homeCategories", "destinations", "homeFeatures", "testimonials", "airportRates", "carInclusions", "activityWhy", "tourPerks", "faqFacts"}
        for key, value in blocks.items():
            if key in object_blocks and not isinstance(value, dict):
                raise ValueError(f"Format bagian {key} tidak valid")
            if key in string_lists and (not isinstance(value, list) or any(not isinstance(v, str) for v in value)):
                raise ValueError(f"Format daftar {key} tidak valid")
            if key in object_lists and (not isinstance(value, list) or any(not isinstance(v, dict) for v in value)):
                raise ValueError(f"Format daftar {key} tidak valid")
        return blocks


def make_settings_router(db, get_current_user):
    router = APIRouter(prefix="/api")

    @router.get("/settings", response_model=SiteSettings)
    async def read_settings():
        doc = await db.settings.find_one({"id": "website"}, {"_id": 0, "id": 0})
        return SiteSettings(**(doc or {}))

    @router.put("/settings", response_model=SiteSettings)
    async def save_settings(body: SiteSettings, user=Depends(get_current_user)):
        body.updatedAt = datetime.now(timezone.utc).isoformat()
        await db.settings.update_one({"id": "website"}, {"$set": body.model_dump()}, upsert=True)
        return body

    return router