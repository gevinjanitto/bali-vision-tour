"""Regression tests for auth/settings/upload/newsletter/account and admin access control."""

import io
import os
import uuid
from pathlib import Path

import pytest
import requests
from pymongo import MongoClient
from PIL import Image


def _base_url() -> str:
    base = (os.environ.get("REACT_APP_BACKEND_URL") or "").strip().rstrip("/")
    if base:
        return base
    env_file = Path("/app/frontend/.env")
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if line.startswith("REACT_APP_BACKEND_URL="):
                return line.split("=", 1)[1].strip().rstrip("/")
    raise RuntimeError("REACT_APP_BACKEND_URL is not configured")


def _backend_env(key: str) -> str:
    value = os.environ.get(key)
    if value:
        return value.strip().strip('"')
    env_file = Path("/app/backend/.env")
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if line.startswith(f"{key}="):
                return line.split("=", 1)[1].strip().strip('"')
    raise RuntimeError(f"{key} is not configured")


BASE_URL = _base_url()
API = f"{BASE_URL}/api"


def _tiny_png() -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (2, 2), (255, 128, 0)).save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture(scope="session")
def admin_creds():
    # Admin auth credentials for this preview environment.
    return {"username": "admin", "password": "BaliPreview!2026"}


@pytest.fixture(scope="session")
def token(admin_creds):
    r = requests.post(f"{API}/auth/login", json=admin_creds, timeout=30)
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="session")
def headers(token):
    return {"Authorization": f"Bearer {token}"}


def test_settings_public_get_has_no_id_or_password_fields():
    # Public settings endpoint payload safety checks.
    r = requests.get(f"{API}/settings", timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert "_id" not in data
    serialized = str(data).lower()
    assert "password" not in serialized
    assert "contact" in data and "social" in data and "brand" in data


def test_settings_put_requires_auth():
    r = requests.put(f"{API}/settings", json={}, timeout=30)
    assert r.status_code == 401


def test_upload_requires_auth():
    files = {"file": ("test.png", io.BytesIO(_tiny_png()), "image/png")}
    r = requests.post(f"{API}/upload", files=files, timeout=30)
    assert r.status_code == 401


@pytest.mark.parametrize("endpoint,method,payload", [
    ("/content/tours", "post", {"title": "TEST_x", "price": 1, "category": "x"}),
    ("/content/tours/test-id", "put", {"title": "x"}),
    ("/content/tours/test-id", "delete", None),
    ("/auth/account", "put", {"current_password": "x", "username": "testadmin"}),
])
def test_admin_writes_require_auth(endpoint, method, payload):
    # Anonymous admin writes must be rejected.
    fn = getattr(requests, method)
    kwargs = {"timeout": 30}
    if payload is not None:
        kwargs["json"] = payload
    r = fn(f"{API}{endpoint}", **kwargs)
    assert r.status_code == 401


def test_settings_rejects_javascript_links_and_bad_whatsapp(headers):
    # Input validation checks in settings PUT.
    current = requests.get(f"{API}/settings", timeout=30).json()
    bad_social = {
        **current,
        "social": {**current.get("social", {}), "instagram": "javascript:alert(1)"},
    }
    r1 = requests.put(f"{API}/settings", json=bad_social, headers=headers, timeout=30)
    assert r1.status_code == 422

    bad_phone = {
        **current,
        "contact": {**current.get("contact", {}), "whatsapp": "abc-evil"},
    }
    r2 = requests.put(f"{API}/settings", json=bad_phone, headers=headers, timeout=30)
    assert r2.status_code == 422


def test_settings_update_normalizes_whatsapp_and_restore(headers):
    # Save settings, verify normalized WA and persisted values, then restore.
    original = requests.get(f"{API}/settings", timeout=30).json()
    updated = {
        **original,
        "contact": {
            **original["contact"],
            "whatsapp": "081234567890",
            "email": "hello.qa@example.com",
            "emailLink": "mailto:hello.qa@example.com",
            "address": "Denpasar QA Address",
            "addressLink": "https://maps.google.com/?q=Denpasar",
            "whatsappMessage": "Halo QA dari testing",
        },
        "social": {
            "instagram": "https://instagram.com/balivisiontour",
            "facebook": "https://facebook.com/balivisiontour",
            "youtube": "https://youtube.com/@balivisiontour",
            "tiktok": "https://tiktok.com/@balivisiontour",
        },
    }
    try:
        put = requests.put(f"{API}/settings", json=updated, headers=headers, timeout=30)
        assert put.status_code == 200, put.text
        data = put.json()
        assert data["contact"]["whatsapp"].startswith("62")
        assert data["contact"]["whatsapp"] == "6281234567890"

        check = requests.get(f"{API}/settings", timeout=30)
        assert check.status_code == 200
        saved = check.json()
        assert saved["contact"]["email"] == "hello.qa@example.com"
        assert saved["social"]["instagram"] == "https://instagram.com/balivisiontour"
    finally:
        requests.put(f"{API}/settings", json=original, headers=headers, timeout=30)


def test_upload_gridfs_serves_image_bytes(headers):
    # Upload image then verify /api/media/{id} serves image bytes.
    files = {"file": ("tiny.png", io.BytesIO(_tiny_png()), "image/png")}
    r = requests.post(f"{API}/upload", files=files, headers=headers, timeout=30)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["url"].startswith("/api/media/")
    assert isinstance(body.get("path"), str)

    media = requests.get(f"{BASE_URL}{body['url']}", timeout=30)
    assert media.status_code == 200
    assert media.headers.get("Content-Type", "").startswith("image/")
    assert media.content.startswith(b"\x89PNG")


@pytest.mark.parametrize("filename,mime,payload", [
    ("bad.gif", "image/gif", b"GIF89a"),
    ("bad.svg", "image/svg+xml", b"<svg></svg>"),
    ("fake.png", "image/png", b"not-a-real-image"),
])
def test_upload_rejects_invalid_formats_and_fake_images(headers, filename, mime, payload):
    # Upload validation for non-supported/fake files.
    files = {"file": (filename, io.BytesIO(payload), mime)}
    r = requests.post(f"{API}/upload", files=files, headers=headers, timeout=30)
    assert r.status_code == 400


def test_upload_rejects_over_8mb(headers):
    files = {"file": ("huge.png", io.BytesIO(b"0" * (8 * 1024 * 1024 + 2)), "image/png")}
    r = requests.post(f"{API}/upload", files=files, headers=headers, timeout=30)
    assert r.status_code == 400


def test_create_rejects_gallery_over_20(headers):
    # Gallery size cap on content create.
    payload = {
        "title": f"TEST_gallery_{uuid.uuid4().hex[:6]}",
        "price": 123,
        "category": "adventure",
        "gallery": [{"src": "https://example.com/a.jpg", "label": "x"} for _ in range(21)],
    }
    r = requests.post(f"{API}/content/tours", json=payload, headers=headers, timeout=30)
    assert r.status_code == 422


def test_newsletter_persists_subscriber_in_db():
    # Newsletter persistence check against MongoDB.
    email = f"qa_{uuid.uuid4().hex[:8]}@example.com"
    r = requests.post(f"{API}/newsletter", json={"email": email}, timeout=30)
    assert r.status_code == 200
    assert r.json().get("ok") is True

    mongo = MongoClient(_backend_env("MONGO_URL"), serverSelectionTimeoutMS=5000)
    db = mongo[_backend_env("DB_NAME")]
    saved = db.newsletter.find_one({"email": email})
    assert saved is not None
    assert saved.get("email") == email


def test_account_validation_token_revocation_and_restore(admin_creds):
    # Account validation and token_version invalidation checks with full restore.
    login = requests.post(f"{API}/auth/login", json=admin_creds, timeout=30)
    assert login.status_code == 200
    token1 = login.json()["token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    wrong_current = requests.put(
        f"{API}/auth/account",
        headers=headers1,
        json={"current_password": "wrong-pass", "username": "admin"},
        timeout=30,
    )
    assert wrong_current.status_code == 400

    invalid_username = requests.put(
        f"{API}/auth/account",
        headers=headers1,
        json={"current_password": admin_creds["password"], "username": "@@"},
        timeout=30,
    )
    assert invalid_username.status_code == 400

    short_password = requests.put(
        f"{API}/auth/account",
        headers=headers1,
        json={"current_password": admin_creds["password"], "username": "admin", "new_password": "short"},
        timeout=30,
    )
    assert short_password.status_code == 400

    temp_username = f"qaadmin{uuid.uuid4().hex[:6]}"
    temp_password = "QaTempPass!2026"
    changed = False
    token2 = None
    try:
        change = requests.put(
            f"{API}/auth/account",
            headers=headers1,
            json={"current_password": admin_creds["password"], "username": temp_username, "new_password": temp_password},
            timeout=30,
        )
        assert change.status_code == 200, change.text
        changed = True

        stale = requests.get(f"{API}/auth/me", headers=headers1, timeout=30)
        assert stale.status_code == 401

        old_login = requests.post(f"{API}/auth/login", json=admin_creds, timeout=30)
        assert old_login.status_code == 401

        new_login = requests.post(
            f"{API}/auth/login",
            json={"username": temp_username, "password": temp_password},
            timeout=30,
        )
        assert new_login.status_code == 200
        token2 = new_login.json()["token"]
    finally:
        if changed and token2:
            restore = requests.put(
                f"{API}/auth/account",
                headers={"Authorization": f"Bearer {token2}"},
                json={
                    "current_password": temp_password,
                    "username": admin_creds["username"],
                    "new_password": admin_creds["password"],
                },
                timeout=30,
            )
            assert restore.status_code == 200, restore.text

    final_login = requests.post(f"{API}/auth/login", json=admin_creds, timeout=30)
    assert final_login.status_code == 200
