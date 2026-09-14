# Bali Vision Tour

Website tour & travel Bali (React + FastAPI + MongoDB) dengan admin panel di `/admin/login`.

## Struktur
- `backend/` — FastAPI API (`/api/*`), MongoDB via Motor, upload gambar ke Cloudinary. Deploy: Railway (`railway.json`, `Procfile`).
- `frontend/` — React (CRACO + Tailwind). Deploy: Vercel/Railway dengan **Root Directory = `frontend`**.

## Menjalankan lokal
```bash
# backend
cd backend && cp .env.example .env   # isi nilainya
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# frontend
cd frontend && cp .env.example .env  # REACT_APP_BACKEND_URL=http://localhost:8001
yarn install && yarn start
```

## Environment variables
| Backend | Keterangan |
|---|---|
| `MONGO_URL` | Connection string MongoDB Atlas |
| `DB_NAME` | Nama database, mis. `bali_vision_tour` |
| `JWT_SECRET` | String acak panjang (`python -c "import secrets;print(secrets.token_hex(48))"`) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Akun admin awal — **jangan pakai `admin/admin` di produksi** |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Penyimpanan gambar |
| `CORS_ORIGINS` | Domain frontend, pisahkan koma |

| Frontend | Keterangan |
|---|---|
| `REACT_APP_BACKEND_URL` | URL backend Railway (tanpa `/api`) |

Panduan deploy lengkap: [DEPLOY_RAILWAY.md](DEPLOY_RAILWAY.md).
