# Bali Vision Tour — PRD

## Original problem statement
Dari project https://github.com/gevinjanitto/bali-vision-tour:
1. Footer: link "Admin" sejajar dengan copyright.
2. Admin: auto-logout jika tidak ada interaksi / halaman ditutup selama 15 menit (dengan peringatan 1 menit sebelum logout).
3. Admin: WYSIWYG editor untuk form yang panjang (semua field deskripsi/konten panjang).
4. Background pura seperti halaman Car Rental dipakai juga di halaman Activities, Tour Packages, dan Articles (gambar & style sama persis).

## Architecture
- Frontend: React 19 (CRACO + Tailwind + shadcn), framer-motion, lenis, TipTap v3 (`@tiptap/react`, `@tiptap/starter-kit`), DOMPurify.
- Backend: FastAPI + Motor (MongoDB), JWT auth, GridFS image fallback (Cloudinary optional).
- Env: `backend/.env` → MONGO_URL, DB_NAME, CORS_ORIGINS, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD. `frontend/.env` → REACT_APP_BACKEND_URL.
- Admin creds: see `/app/memory/test_credentials.md`.

## User personas
- Wisatawan (public): melihat tour, mobil, aktivitas, artikel, booking via WhatsApp.
- Admin: mengelola konten via `/admin`.

## Implemented (2026-06)
- Repo di-clone & dijalankan di /app (backend seeded otomatis).
- Footer: copyright + "Admin" dalam satu baris (`footer-bottom-left`), payment badges di kanan.
- Idle logout (`admin/IdleLogout.jsx`): 15 menit tanpa mousemove/klik/keydown/scroll → logout; dialog peringatan 60 detik sebelumnya (tombol "Tetap masuk" / "Logout sekarang"); timestamp aktivitas di localStorage `bvt_admin_last_active`, sehingga halaman yang ditutup >15 menit lalu dibuka lagi langsung logout.
- WYSIWYG TipTap (`admin/RichTextEditor.jsx`), field type `richtext`: tours.longDescription, cars.longDesc, activities.longDescription, articles.author.bio, dan blok "Paragraf" isi artikel. Disimpan sebagai HTML; dirender di publik lewat `components/RichText.jsx` (sanitasi DOMPurify, kompatibel dengan data lama berupa teks/array).
- Hero Activities, Tour Packages, Articles memakai `IMG.bedugul` (sama dengan Car Rental).
- Testing agent iteration 1: 100% pass (backend & frontend).

## Backlog
- P1: Rich text untuk short description (saat ini tetap textarea karena dipakai di kartu dengan clamp).
- P2: Upload gambar inline di editor artikel.
- P2: Konfigurasi durasi idle-logout dari halaman Akun Admin.
