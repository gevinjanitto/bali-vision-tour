# Bali Vision Tour — PRD

## Original Problem Statement
Lanjutkan project GitHub `gevinjanitto/bali-vision-tour`: website tour & travel Bali (Tour Packages, Car Rental, Activities, About, Articles) sesuai desain Figma (PDF). Booking = isi data singkat → disimpan → redirect WhatsApp (nomor dummy). Halaman login admin (admin/admin) + dashboard admin untuk mengelola Tour Packages, Car Rental, Activities, Articles, Booking Requests, dengan warna menyesuaikan landing. Upload gambar ke storage. Mobile: menu bawah, header logo di tengah.

## User Personas
- **Traveler** — browses packages/fleet/activities/articles, submits quick booking → WhatsApp.
- **Admin (owner)** — logs in, manages catalogue content & images, follows up booking requests.

## Architecture
- **Frontend**: React 19 (CRA/craco), Tailwind, shadcn/ui, framer-motion, lenis smooth scroll, recharts. Routes: public (`/`, `/tour-packages[/:slug]`, `/car-rental[/:slug]`, `/activities[/:slug]`, `/about`, `/articles[/:slug]`) + admin (`/admin/login`, `/admin`, `/admin/{tours|cars|activities|articles|bookings}`).
- **Data layer**: `src/context/DataContext.jsx` loads all collections from API on mount; admin CRUD via same context. `src/lib/api.js` axios + Bearer token (localStorage).
- **Backend**: FastAPI `backend/server.py`, MongoDB (motor). JWT (PyJWT) + bcrypt, admin seeded from `.env` (`ADMIN_USERNAME/ADMIN_PASSWORD`). Seed content from `backend/seed_data.json` when collections are empty. Image upload → Emergent object storage, served via `/api/files/{path}`.
- **Endpoints**: `/api/auth/*`, `/api/content/{resource}[/{slug|id}]`, `/api/bookings`, `/api/admin/stats`, `/api/upload`, `/api/files/*`.

## Core Requirements (static)
1. Public site matches Figma direction (cream/forest/coral palette), animated, mobile bottom nav.
2. Booking saved to DB then WhatsApp redirect with prefilled message.
3. Admin auth (admin/admin), CRUD for 4 resources + bookings, image upload.
4. Dashboard overview with stats.

## Implemented (2026-06)
- Imported existing landing frontend from GitHub; wired to backend API (no more localStorage mock).
- Backend: auth, content CRUD, bookings, stats, upload/serve, seeding, indexes, brute-force lockout.
- Admin panel: login, layout (sidebar), dashboard (stat cards, 14-day chart, by-service, recent), resource pages with tabbed forms (text/number/select/switch/lines/JSON/blocks, image + gallery upload), bookings management (status, WhatsApp reply, delete).
- Landing polish: preloader signature moment, masked line-by-line hero reveal, hero parallax, editorial marquee, lenis smooth scrolling.
- Testing: iteration_1 — backend 100%, frontend 95% (only a test-automation quirk with Radix tabs, since fixed with forceMount).

## Backlog
- P1: Change-password UI in admin (endpoint exists: `/api/auth/change-password`).
- P1: Make WhatsApp number/company contact editable from admin (`/api/config`).
- P2: Reorder items (drag & drop `order`), duplicate item action.
- P2: Newsletter subscriptions stored in DB + admin list.
- P2: Rate limiting on public `/api/bookings`.
- P3: Structured editors for itinerary/timeline instead of JSON textareas.

## Credentials
See `/app/memory/test_credentials.md` (admin / admin).
