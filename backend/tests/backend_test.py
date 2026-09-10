"""Backend API tests for Bali Vision Tour."""
import io
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fallback for tests: read frontend .env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.strip().split("=", 1)[1].rstrip("/")

API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json={"username": "admin", "password": "admin"})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="session")
def headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---------- Public content ----------
@pytest.mark.parametrize("resource,expected_min", [("tours", 9), ("cars", 6), ("activities", 9), ("articles", 7)])
def test_public_content_lists(resource, expected_min):
    r = requests.get(f"{API}/content/{resource}")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= expected_min, f"{resource}: got {len(data)}"


def test_content_by_slug():
    r = requests.get(f"{API}/content/tours/family-picnic-in-bali")
    assert r.status_code == 200
    data = r.json()
    assert data.get("slug") == "family-picnic-in-bali"


def test_content_slug_not_found():
    r = requests.get(f"{API}/content/tours/does-not-exist-xyz")
    assert r.status_code == 404


# ---------- Auth ----------
def test_login_success():
    r = requests.post(f"{API}/auth/login", json={"username": "admin", "password": "admin"})
    assert r.status_code == 200
    d = r.json()
    assert "token" in d and "user" in d
    assert d["user"]["role"] == "admin"


def test_login_wrong_password():
    r = requests.post(f"{API}/auth/login", json={"username": "admin", "password": "wrongpw-TEST"})
    assert r.status_code in (401, 429)


def test_auth_me(headers):
    r = requests.get(f"{API}/auth/me", headers=headers)
    assert r.status_code == 200
    assert r.json()["username"] == "admin"


def test_content_write_requires_auth():
    r = requests.post(f"{API}/content/tours", json={"title": "TEST_x", "price": 1, "category": "x"})
    assert r.status_code == 401


# ---------- Admin CRUD ----------
@pytest.mark.parametrize("resource,payload", [
    ("tours", {"title": "TEST_Tour_1", "price": 100, "category": "adventure"}),
    ("cars", {"name": "TEST_Car_1", "price": 50, "category": "suv"}),
    ("activities", {"title": "TEST_Act_1", "price": 30, "category": "water"}),
    ("articles", {"title": "TEST_Art_1", "category": "guide"}),
])
def test_crud_resource(resource, payload, headers):
    # Create
    r = requests.post(f"{API}/content/{resource}", json=payload, headers=headers)
    assert r.status_code == 201, r.text
    created = r.json()
    assert "id" in created and "slug" in created
    item_id = created["id"]

    # Verify persisted via public GET
    r = requests.get(f"{API}/content/{resource}/{created['slug']}")
    assert r.status_code == 200

    # Update
    upd = {"description": "updated"}
    r = requests.put(f"{API}/content/{resource}/{item_id}", json=upd, headers=headers)
    assert r.status_code == 200
    assert r.json().get("description") == "updated"

    # Delete
    r = requests.delete(f"{API}/content/{resource}/{item_id}", headers=headers)
    assert r.status_code == 200
    r = requests.get(f"{API}/content/{resource}/{created['slug']}")
    assert r.status_code == 404


# ---------- Bookings ----------
@pytest.fixture(scope="session")
def created_booking_id():
    payload = {"type": "Tour Package", "itemName": "TEST Package", "name": "TEST_User", "phone": "08123456789", "date": "2026-02-01", "pax": 2, "total": 200}
    r = requests.post(f"{API}/bookings", json=payload)
    assert r.status_code == 201, r.text
    d = r.json()
    assert d["status"] == "new"
    return d["id"]


def test_bookings_list(created_booking_id, headers):
    r = requests.get(f"{API}/bookings", headers=headers)
    assert r.status_code == 200
    ids = [b["id"] for b in r.json()]
    assert created_booking_id in ids


def test_bookings_patch_status(created_booking_id, headers):
    r = requests.patch(f"{API}/bookings/{created_booking_id}", json={"status": "confirmed"}, headers=headers)
    assert r.status_code == 200
    assert r.json()["status"] == "confirmed"


def test_bookings_patch_invalid_status(created_booking_id, headers):
    r = requests.patch(f"{API}/bookings/{created_booking_id}", json={"status": "bogus"}, headers=headers)
    assert r.status_code == 400


def test_bookings_delete(headers):
    payload = {"type": "Car Rental", "itemName": "TEST Car", "name": "TEST_Del", "phone": "08123", "total": 50}
    r = requests.post(f"{API}/bookings", json=payload)
    bid = r.json()["id"]
    r = requests.delete(f"{API}/bookings/{bid}", headers=headers)
    assert r.status_code == 200


# ---------- Stats ----------
def test_admin_stats(headers):
    r = requests.get(f"{API}/admin/stats", headers=headers)
    assert r.status_code == 200
    d = r.json()
    assert "counts" in d and "bookings" in d and "daily" in d
    assert len(d["daily"]) == 14
    for r_name in ["tours", "cars", "activities", "articles"]:
        assert r_name in d["counts"]


# ---------- Upload ----------
def _tiny_png() -> bytes:
    # 1x1 PNG
    return bytes.fromhex(
        "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4"
        "890000000A49444154789C6300010000000500010D0A2DB40000000049454E44AE426082"
    )


def test_upload_png_and_serve(headers):
    files = {"file": ("test.png", io.BytesIO(_tiny_png()), "image/png")}
    r = requests.post(f"{API}/upload", files=files, headers=headers)
    assert r.status_code == 200, r.text
    url = r.json()["url"]
    assert url.startswith("/api/files/")
    r2 = requests.get(f"{BASE_URL}{url}")
    assert r2.status_code == 200
    assert r2.headers["Content-Type"].startswith("image/")


def test_upload_rejects_non_image(headers):
    files = {"file": ("test.txt", io.BytesIO(b"hello"), "text/plain")}
    r = requests.post(f"{API}/upload", files=files, headers=headers)
    assert r.status_code == 400


def test_upload_requires_auth():
    files = {"file": ("test.png", io.BytesIO(_tiny_png()), "image/png")}
    r = requests.post(f"{API}/upload", files=files)
    assert r.status_code == 401
