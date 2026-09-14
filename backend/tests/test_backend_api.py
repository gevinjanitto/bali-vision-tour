"""Backend API smoke + core tests for Bali Vision Tour."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://git-sync-deploy-2.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def token(session):
    r = session.post(f"{API}/auth/login", json={"username": "admin", "password": "admin"})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data and data["user"]["role"] == "admin"
    return data["token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---------- health ----------
def test_root_ok(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


# ---------- content ----------
@pytest.mark.parametrize("resource", ["tours", "activities", "cars", "articles"])
def test_content_list(session, resource):
    r = session.get(f"{API}/content/{resource}")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) > 0, f"{resource} empty"
    # ensure no mongo _id leakage
    assert "_id" not in data[0]


def test_content_unknown_resource(session):
    r = session.get(f"{API}/content/unknown")
    assert r.status_code == 404


# ---------- settings ----------
def test_settings_get(session):
    r = session.get(f"{API}/settings")
    assert r.status_code == 200
    data = r.json()
    assert "contact" in data and "brand" in data


# ---------- auth ----------
def test_auth_me(session, auth_headers):
    r = session.get(f"{API}/auth/me", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["username"] == "admin"


def test_auth_me_unauth(session):
    r = requests.get(f"{API}/auth/me")
    assert r.status_code == 401


# ---------- bookings ----------
def test_create_booking_and_list(session, auth_headers):
    payload = {
        "type": "Tour",
        "itemId": "test-item",
        "itemName": "TEST_Booking Item",
        "name": "TEST_User",
        "phone": "+6281234567890",
        "date": "2026-02-01",
        "pax": 2,
        "notes": "automated test",
        "total": 100.0,
    }
    r = requests.post(f"{API}/bookings", json=payload)
    assert r.status_code == 201, r.text
    booking = r.json()
    assert booking["itemName"] == payload["itemName"]
    assert booking["status"] == "new"
    assert "id" in booking
    bid = booking["id"]

    # list via admin
    r2 = requests.get(f"{API}/bookings", headers=auth_headers)
    assert r2.status_code == 200
    assert any(b["id"] == bid for b in r2.json())

    # cleanup
    requests.delete(f"{API}/bookings/{bid}", headers=auth_headers)


def test_bookings_requires_auth():
    r = requests.get(f"{API}/bookings")
    assert r.status_code == 401


# ---------- activity types coverage (for filter fallback check) ----------
def test_activities_have_expected_types(session):
    r = session.get(f"{API}/content/activities")
    data = r.json()
    types = {a.get("type") for a in data}
    # ACTIVITY_TYPES includes "Wildlife & Nature" — check whether any activity has it
    print("Activity types present:", types)
    assert types  # non-empty
