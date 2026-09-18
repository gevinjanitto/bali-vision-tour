"""Regression: settings brand no 'entity' key, PUT requires auth and persists texts."""
import os
import requests

BASE_URL = (os.environ.get("REACT_APP_BACKEND_URL") or "https://git-sync-deploy-2.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


def _token():
    r = requests.post(f"{API}/auth/login", json={"username": "admin", "password": "admin"})
    assert r.status_code == 200
    return r.json()["token"]


def test_settings_brand_has_no_entity_key():
    r = requests.get(f"{API}/settings")
    assert r.status_code == 200
    brand = r.json().get("brand", {})
    assert "entity" not in brand, f"brand should not include entity key: {list(brand.keys())}"


def test_put_settings_without_auth_401():
    r = requests.put(f"{API}/settings", json={})
    assert r.status_code == 401


def test_put_settings_with_auth_persists_texts():
    tok = _token()
    headers = {"Authorization": f"Bearer {tok}", "Content-Type": "application/json"}
    current = requests.get(f"{API}/settings").json()
    body = {**current, "texts": {**current.get("texts", {}), "TEST_key_x": "TEST_value_y"}}
    r = requests.put(f"{API}/settings", json=body, headers=headers)
    assert r.status_code == 200, r.text
    got = requests.get(f"{API}/settings").json()
    assert got["texts"].get("TEST_key_x") == "TEST_value_y"
    # cleanup
    cleaned = {**got, "texts": {k: v for k, v in got["texts"].items() if k != "TEST_key_x"}}
    r2 = requests.put(f"{API}/settings", json=cleaned, headers=headers)
    assert r2.status_code == 200
    got2 = requests.get(f"{API}/settings").json()
    assert "TEST_key_x" not in got2.get("texts", {})
