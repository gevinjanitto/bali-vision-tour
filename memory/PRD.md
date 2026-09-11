# PRD — Bali Vision Tour (De-Emergent + Railway Deploy)

## Original Problem Statement
User has GitHub repo `gevinjanitto/bali-vision-tour` (FastAPI + MongoDB + React). Wants it free of Emergent-specific plugins, safe to deploy on Railway, a clear database choice, and a complete Indonesian Railway deploy tutorial including DB connection.

## Architecture
- Backend: FastAPI (`/app/backend/server.py`), MongoDB via `MONGO_URL`/`DB_NAME`.
- Frontend: React (CRACO), calls backend via `REACT_APP_BACKEND_URL`.
- Database: MongoDB Atlas (M0 free).
- Image storage: Cloudinary (replaced Emergent object storage).
- Hosting target: Railway (backend + frontend as two services).

## Work Done (2026-06)
- Replaced Emergent object storage upload with Cloudinary (`/api/upload` returns Cloudinary secure_url). Removed `EMERGENT_LLM_KEY`, `INTEGRATION_PROXY_URL`, `/api/files` serve endpoint, `init_storage/put_object/get_object`.
- Removed `@emergentbase/visual-edits` dependency and its CRACO wrapper.
- Added Railway config: `backend/railway.json` + `Procfile`, `frontend/railway.json` + `Procfile`, `serve` script/dep for static frontend.
- Added `.env.example` for backend & frontend; updated `.gitignore` to exclude `.env`, `.emergent/`, `memory/`, `test_reports/`, `plan/`. Untracked committed `.env` files (removed old secret from repo).
- Wrote `DEPLOY_RAILWAY.md` — full Indonesian tutorial (Atlas, Cloudinary, GitHub push, Railway backend+frontend, env vars, CORS, verification, troubleshooting).
- Verified locally: admin login (admin/admin), content CRUD, public booking, stats, auth guard (401). Frontend renders with live data. Upload correctly gated until Cloudinary env vars set.

## Not Verified
- Live Cloudinary upload (requires real Cloudinary credentials) — will work once `CLOUDINARY_*` env vars are set on Railway.

## Backlog / Next
- P1: Test real Cloudinary upload once creds provided.
- P2: Optional Cloudinary delete on image removal.
