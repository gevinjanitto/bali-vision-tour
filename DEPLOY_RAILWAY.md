# 🚀 Tutorial Deploy "Bali Vision Tour" di Railway

Panduan lengkap (bahasa Indonesia) untuk deploy aplikasi ini di **Railway** — mulai dari database, penyimpanan gambar, sampai frontend & backend online. Ikuti berurutan dari atas ke bawah.

Aplikasi terdiri dari 3 bagian:

| Bagian | Teknologi | Di mana |
|---|---|---|
| **Backend (API)** | FastAPI (Python) | Service di Railway |
| **Frontend (website)** | React | Service di Railway |
| **Database** | MongoDB | **MongoDB Atlas** (gratis) |
| **Penyimpanan gambar** | **Cloudinary** (gratis) | Cloud |

> Aplikasi ini **sudah tidak memakai plugin khusus Emergent**. Semua bisa jalan di mana saja.

---

## 📋 Ringkasan Langkah

1. Siapkan database → **MongoDB Atlas**
2. Siapkan penyimpanan gambar → **Cloudinary**
3. Push kode ke **GitHub**
4. Deploy **Backend** di Railway
5. Deploy **Frontend** di Railway
6. Hubungkan keduanya + verifikasi

Perkiraan waktu: 20–30 menit.

---

## 1️⃣ Buat Database di MongoDB Atlas (GRATIS)

Railway tidak menyediakan MongoDB bawaan yang mudah, jadi kita pakai MongoDB Atlas (free tier M0, cukup untuk situs kecil–menengah).

1. Buka https://www.mongodb.com/cloud/atlas/register dan daftar akun gratis.
2. Setelah masuk, klik **Build a Database** → pilih paket **M0 (FREE)** → pilih provider & region terdekat (mis. AWS / Singapore) → **Create**.
3. **Buat user database:**
   - Di menu **Database Access** → **Add New Database User**.
   - Authentication Method: **Password**.
   - Username: mis. `bvtuser` — Password: buat password kuat (**catat!**, hindari karakter `@ : / ?` supaya tidak menyulitkan di URL).
   - Built-in Role: **Read and write to any database** → **Add User**.
4. **Izinkan akses jaringan:**
   - Di menu **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) → **Confirm**.
   - (Ini diperlukan karena IP Railway dinamis.)
5. **Ambil connection string:**
   - Kembali ke **Database** → klik **Connect** pada cluster → **Drivers**.
   - Pilih Driver **Python**, salin string yang bentuknya seperti:
     ```
     mongodb+srv://bvtuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - **Ganti `<password>`** dengan password user tadi.
   - Simpan string ini — nanti jadi nilai **`MONGO_URL`**.

> Nama database (**`DB_NAME`**) bebas Anda tentukan, mis. `bali_vision_tour`. Aplikasi akan otomatis membuat koleksi & mengisi data awal (seed) saat pertama jalan.

---

## 2️⃣ Buat Akun Cloudinary untuk Gambar (GRATIS)

Gambar yang di-upload lewat admin panel akan disimpan di Cloudinary (CDN cepat, free tier besar).

1. Daftar gratis di https://cloudinary.com/users/register_free
2. Setelah login, buka **Dashboard** (ikon roda gigi / Programmable Media Dashboard).
3. Catat 3 nilai ini:
   - **Cloud Name** → jadi `CLOUDINARY_CLOUD_NAME`
   - **API Key** → jadi `CLOUDINARY_API_KEY`
   - **API Secret** (klik "reveal") → jadi `CLOUDINARY_API_SECRET`

> Kredensial ini hanya dipakai di **backend** (aman, tidak pernah terekspos ke browser).

---

## 3️⃣ Push Kode ke GitHub

Kode Anda sudah berada di repo GitHub `bali-vision-tour`. Pastikan versi terbaru (yang sudah tanpa Emergent + berisi file `railway.json`) sudah ter-push.

Jika Anda mengubah dari komputer lokal:
```bash
git add .
git commit -m "Siap deploy Railway: Cloudinary + config Railway"
git push origin main
```

> File `.env` **tidak** ikut ter-push (sudah masuk `.gitignore`). Ini benar — kredensial diisi langsung di Railway. Gunakan `backend/.env.example` & `frontend/.env.example` sebagai acuan nama variabel.

---

## 4️⃣ Deploy BACKEND di Railway

1. Buka https://railway.app → login (bisa pakai GitHub).
2. **New Project** → **Deploy from GitHub repo** → pilih repo `bali-vision-tour`.
   - Jika diminta, izinkan Railway mengakses repo Anda.
3. Railway akan membuat 1 service. Buka service itu → tab **Settings**:
   - **Root Directory**: isi `backend`  ← **PENTING** (karena backend ada di folder `backend/`).
   - **Start Command**: biasanya terdeteksi otomatis dari `railway.json`. Jika kosong, isi:
     ```
     uvicorn server:app --host 0.0.0.0 --port $PORT
     ```
4. Buka tab **Variables** → tambahkan variabel berikut (klik **New Variable** satu per satu):

   | Variable | Nilai |
   |---|---|
   | `MONGO_URL` | connection string dari Atlas (langkah 1) |
   | `DB_NAME` | `bali_vision_tour` |
   | `JWT_SECRET` | string acak panjang (mis. hasil dari `openssl rand -hex 32`) |
   | `ADMIN_USERNAME` | `admin` (atau username pilihan Anda) |
   | `ADMIN_PASSWORD` | password admin yang kuat |
   | `CLOUDINARY_CLOUD_NAME` | dari Cloudinary (langkah 2) |
   | `CLOUDINARY_API_KEY` | dari Cloudinary |
   | `CLOUDINARY_API_SECRET` | dari Cloudinary |
   | `CORS_ORIGINS` | sementara isi `*` dulu (nanti diperbaiki di langkah 6) |

5. Buat backend bisa diakses publik: tab **Settings** → bagian **Networking** → **Generate Domain**.
   - Railway memberi URL seperti `https://bali-vision-tour-backend-production.up.railway.app`.
   - **Catat URL ini** → ini `REACT_APP_BACKEND_URL` untuk frontend.
6. Railway otomatis build & deploy. Cek tab **Deployments** → **View Logs**. Kalau sukses akan muncul `Uvicorn running` dan `Cloudinary storage configured`.
7. Tes cepat: buka `https://<url-backend>/api/` di browser → harus muncul:
   ```json
   {"service":"Bali Vision Tour API","status":"ok"}
   ```

---

## 5️⃣ Deploy FRONTEND di Railway

Kita tambahkan service kedua di project yang sama.

1. Di halaman project Railway → klik **+ New** (atau **Create** / **Add Service**) → **GitHub Repo** → pilih repo `bali-vision-tour` yang sama.
2. Buka service baru ini → tab **Settings**:
   - **Root Directory**: isi `frontend`  ← **PENTING**.
   - **Build Command** & **Start Command** terbaca otomatis dari `frontend/railway.json`:
     - Build: `yarn install && yarn build`
     - Start: `yarn serve`
   - Jika tidak terbaca, isi manual seperti di atas.
3. Buka tab **Variables** → tambahkan:

   | Variable | Nilai |
   |---|---|
   | `REACT_APP_BACKEND_URL` | URL backend dari langkah 4.5 (mis. `https://bali-vision-tour-backend-production.up.railway.app`) |

   > ⚠️ Variabel ini dipakai saat **build**. Kalau diubah, frontend harus **di-redeploy** agar berpengaruh.
4. tab **Settings** → **Networking** → **Generate Domain** untuk frontend.
   - Dapat URL seperti `https://bali-vision-tour-frontend-production.up.railway.app`.
   - **Catat URL ini** → ini domain website Anda & yang dipakai untuk `CORS_ORIGINS`.
5. Tunggu build selesai (React build butuh beberapa menit).

---

## 6️⃣ Hubungkan Frontend ↔ Backend (CORS) + Verifikasi

1. Kembali ke **service Backend** → tab **Variables** → ubah `CORS_ORIGINS` dari `*` menjadi URL frontend Anda:
   ```
   https://bali-vision-tour-frontend-production.up.railway.app
   ```
   (tanpa garis miring `/` di akhir. Boleh beberapa domain, pisahkan dengan koma.)
2. Backend akan otomatis redeploy setelah variabel berubah.
3. Buka URL **frontend** di browser → website Bali Vision Tour tampil. 🎉
4. **Tes Admin Panel:**
   - Buka `https://<url-frontend>/admin`
   - Login dengan `ADMIN_USERNAME` / `ADMIN_PASSWORD` yang Anda set di backend.
   - Coba tambah/edit paket tur dan **upload gambar** → gambar akan tersimpan di Cloudinary dan tampil di website.
5. **Tes booking** dari sisi pengunjung untuk memastikan data masuk ke Dashboard admin.

---

## ✅ Selesai!

Website Anda sekarang online sepenuhnya di Railway, terhubung ke MongoDB Atlas & Cloudinary, tanpa ketergantungan Emergent.

---

## 🔧 Troubleshooting

**Website tampil tapi data kosong / gagal muncul**
- Cek `REACT_APP_BACKEND_URL` di frontend benar (ada `https://`, tanpa `/` di akhir) lalu **redeploy frontend**.
- Buka Console browser (F12) — kalau ada error CORS, pastikan `CORS_ORIGINS` di backend = URL frontend persis.

**Login admin gagal / "Invalid username or password"**
- Pastikan `ADMIN_USERNAME` & `ADMIN_PASSWORD` sudah diisi di backend. Username otomatis dibaca huruf kecil.
- Jika salah 5x, akun terkunci 15 menit (proteksi brute force) — tunggu lalu coba lagi.

**Upload gambar gagal / "Image storage is not configured"**
- Berarti `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` belum lengkap di backend.

**Backend gagal start / error MongoDB**
- Cek `MONGO_URL` benar & `<password>` sudah diganti.
- Pastikan Atlas **Network Access** = `0.0.0.0/0`.

**Gambar lama tidak muncul**
- Gambar yang dulu diupload ke Emergent tidak ikut pindah. Upload ulang lewat admin panel; gambar baru otomatis ke Cloudinary.

---

## 📄 Daftar Environment Variable (ringkasan)

### Backend (service `backend`)
```
MONGO_URL=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=bali_vision_tour
JWT_SECRET=isi_string_acak_panjang
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password_kuat_anda
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
CORS_ORIGINS=https://url-frontend-anda.up.railway.app
```

### Frontend (service `frontend`)
```
REACT_APP_BACKEND_URL=https://url-backend-anda.up.railway.app
```
