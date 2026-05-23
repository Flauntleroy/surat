# Nomor Surat - Sistem Penomoran Surat Digital

Aplikasi penomoran surat digital yang modern dan fleksibel. Dibangun dengan Next.js, PostgreSQL (Neon), dan shadcn/ui.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 7
- **Auth**: NextAuth v5 (Google OAuth)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Deployment**: Vercel

## Fitur

- Login dengan Google
- Template nomor surat fleksibel (bisa diatur sesuka hati)
- Generate nomor surat otomatis berdasarkan template
- Dashboard dengan statistik
- Responsive (mobile-friendly)
- Modern, clean, minimalist UI

## Format Template

Placeholder yang tersedia:

| Placeholder | Deskripsi |
|---|---|
| `{NUMBER}` | Nomor urut (001, 002, ...) |
| `{PREFIX}` | Prefix surat (SKL, UND, ...) |
| `{DIVISION}` | Kode divisi (DWP, HRD, ...) |
| `{MONTH}` | Bulan romawi (I, II, ..., XII) |
| `{MONTH_NUM}` | Bulan angka (01-12) |
| `{YEAR}` | Tahun penuh (2025) |
| `{YEAR_SHORT}` | Tahun singkat (25) |
| `{DAY}` | Tanggal (01-31) |

**Contoh**: `{PREFIX}/{NUMBER}/{DIVISION}/{MONTH}/{YEAR}` → `SKL/001/DWP/V/2025`

## Setup

### 1. Clone & Install

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` ke `.env` dan isi:

```env
# Database - Neon PostgreSQL
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# NextAuth
AUTH_SECRET="generate-with: openssl rand -base64 32"
AUTH_URL="http://localhost:3000"

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### 3. Setup Database

```bash
npx prisma migrate dev --name init
```

### 4. Run Development Server

```bash
npm run dev
```

## Setup Google OAuth

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih yang sudah ada
3. Aktifkan Google+ API
4. Buat OAuth 2.0 credentials
5. Tambahkan authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID dan Client Secret ke `.env`

## Deploy ke Vercel

1. Push ke GitHub
2. Import project di Vercel
3. Tambahkan environment variables
4. Deploy

Untuk production, update `AUTH_URL` ke domain Vercel dan tambahkan redirect URI di Google Cloud Console.
