# Panduan Deployment - Nomor Surat

Panduan lengkap untuk deploy aplikasi Nomor Surat ke **Vercel** dengan database **Neon PostgreSQL** dan autentikasi **Google OAuth**.

---

## Daftar Isi

1. [Setup Database (Neon)](#1-setup-database-neon)
2. [Setup Google OAuth](#2-setup-google-oauth)
3. [Konfigurasi Environment Variables](#3-konfigurasi-environment-variables)
4. [Migrasi Database](#4-migrasi-database)
5. [Deploy ke Vercel](#5-deploy-ke-vercel)
6. [Post-Deployment](#6-post-deployment)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Setup Database (Neon)

### 1.1 Buat Akun Neon

1. Buka [https://neon.tech](https://neon.tech)
2. Klik **Sign Up** (bisa pakai GitHub, Google, atau email)
3. Pilih plan **Free** (cukup untuk development & small production)

### 1.2 Buat Project Baru

1. Setelah login, klik **New Project**
2. Isi detail:
   - **Project name**: `surat-dwp` (atau nama lain sesuka hati)
   - **Region**: Pilih yang terdekat (misal `Southeast Asia` atau `Singapore`)
   - **Postgres version**: Biarkan default (terbaru)
3. Klik **Create Project**

### 1.3 Buat Database

Setelah project dibuat, Neon otomatis membuat database `neondb`. Kamu bisa pakai itu langsung, atau buat database baru:

1. Di dashboard Neon, buka tab **Databases** (di sidebar kiri)
2. Klik **New Database**
3. Isi:
   - **Branch**: `main` (Default)
   - **Database name**: `surat_dwp` (atau biarkan `neondb`)
   - **Owner**: `neondb_owner` (default)
4. Klik **Create**

### 1.4 Ambil Connection String

1. Di dashboard Neon, klik **Connect** atau buka panel **Connection Details**
2. Pastikan setting:
   - **Branch**: `main`
   - **Database**: database yang baru dibuat (`surat_dwp` atau `neondb`)
   - **Role**: `neondb_owner`
3. Copy **Connection string** yang formatnya seperti ini:

```
postgresql://neondb_owner:AbCdEfG123@ep-cool-name-123456.ap-southeast-1.aws.neon.tech/surat_dwp?sslmode=require
```

> ⚠️ **Penting**: Pastikan ada `?sslmode=require` di akhir URL. Neon membutuhkan SSL.

### 1.5 Struktur Connection String

```
postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require
```

| Bagian | Contoh | Keterangan |
|--------|--------|------------|
| USER | `neondb_owner` | Username database |
| PASSWORD | `AbCdEfG123` | Password (auto-generated) |
| HOST | `ep-cool-name-123456.ap-southeast-1.aws.neon.tech` | Endpoint Neon |
| DATABASE | `surat_dwp` | Nama database |

---

## 2. Setup Google OAuth

### 2.1 Buat Project di Google Cloud

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Klik dropdown project di atas → **New Project**
3. Isi:
   - **Project name**: `Nomor Surat`
   - **Organization**: Biarkan default
4. Klik **Create**
5. Pastikan project yang baru dibuat sudah terpilih (lihat dropdown di atas)

### 2.2 Konfigurasi OAuth Consent Screen

1. Di sidebar, buka **APIs & Services** → **OAuth consent screen**
2. Pilih **External** → klik **Create**
3. Isi form:
   - **App name**: `Nomor Surat`
   - **User support email**: Email kamu
   - **Developer contact information**: Email kamu
4. Klik **Save and Continue**
5. Di halaman **Scopes**, klik **Add or Remove Scopes**
   - Centang: `email`, `profile`, `openid`
   - Klik **Update** → **Save and Continue**
6. Di halaman **Test users** (opsional untuk testing):
   - Tambahkan email Google yang akan dipakai untuk test
   - Klik **Save and Continue**
7. Klik **Back to Dashboard**

### 2.3 Buat OAuth Credentials

1. Di sidebar, buka **APIs & Services** → **Credentials**
2. Klik **+ Create Credentials** → **OAuth client ID**
3. Isi:
   - **Application type**: `Web application`
   - **Name**: `Nomor Surat Web`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (development)
     - `https://your-app.vercel.app` (production, tambahkan nanti setelah deploy)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://your-app.vercel.app/api/auth/callback/google` (production)
4. Klik **Create**
5. **Catat** Client ID dan Client Secret yang muncul

> 💡 **Tips**: Setelah deploy ke Vercel dan dapat domain, kembali ke sini untuk menambahkan URL production.

### 2.4 Publish App (untuk Production)

Selama masih di mode "Testing", hanya user yang ditambahkan di Test Users yang bisa login. Untuk production:

1. Buka **OAuth consent screen**
2. Klik **Publish App**
3. Konfirmasi

> ⚠️ Untuk app internal/kecil, Google biasanya langsung approve. Untuk app besar mungkin perlu verifikasi.

---

## 3. Konfigurasi Environment Variables

### 3.1 File `.env` (Local Development)

Edit file `.env` di root project:

```env
# Database - Neon PostgreSQL
DATABASE_URL="postgresql://neondb_owner:PASSWORD@ep-xxx.region.aws.neon.tech/surat_dwp?sslmode=require"

# NextAuth
AUTH_SECRET="hasil-dari-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"

# Google OAuth
AUTH_GOOGLE_ID="123456789-abcdefg.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="GOCSPX-abcdefghijklmnop"
```

### 3.2 Generate AUTH_SECRET

Jalankan salah satu command ini di terminal:

**Windows (PowerShell):**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

Copy hasilnya ke `AUTH_SECRET`.

### 3.3 Checklist Environment Variables

| Variable | Sumber | Contoh |
|----------|--------|--------|
| `DATABASE_URL` | Neon Dashboard → Connection Details | `postgresql://...?sslmode=require` |
| `AUTH_SECRET` | Generate sendiri (random 32 bytes base64) | `K7gN2x...` |
| `AUTH_URL` | URL app kamu | `http://localhost:3000` |
| `AUTH_GOOGLE_ID` | Google Cloud → Credentials | `123...apps.googleusercontent.com` |
| `AUTH_GOOGLE_SECRET` | Google Cloud → Credentials | `GOCSPX-...` |

---

## 4. Migrasi Database

### 4.1 Jalankan Migrasi

Setelah `.env` terisi dengan benar, jalankan:

```bash
npx prisma migrate dev --name init
```

Ini akan:
- Membuat folder `prisma/migrations/` dengan SQL migration
- Membuat semua tabel di database Neon
- Generate ulang Prisma Client

### 4.2 Verifikasi

Cek di Neon Dashboard → **Tables** tab, seharusnya ada tabel:
- `User`
- `Account`
- `Session`
- `VerificationToken`
- `LetterTemplate`
- `Letter`

### 4.3 (Opsional) Seed Data

Jika ingin menambahkan template default, buat file `prisma/seed.ts`:

```typescript
import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.letterTemplate.create({
    data: {
      name: "Surat Keluar",
      format: "{PREFIX}/{NUMBER}/{DIVISION}/{MONTH}/{YEAR}",
      prefix: "SKL",
      division: "DWP",
      isDefault: true,
    },
  });

  console.log("Seed berhasil!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Jalankan dengan:
```bash
npx tsx prisma/seed.ts
```

---

## 5. Deploy ke Vercel

### 5.1 Push ke GitHub

```bash
git add .
git commit -m "Initial commit - Nomor Surat app"
git remote add origin https://github.com/USERNAME/surat-dwp.git
git push -u origin main
```

### 5.2 Import Project di Vercel

1. Buka [https://vercel.com](https://vercel.com) dan login
2. Klik **Add New** → **Project**
3. Pilih repository `surat-dwp` dari GitHub
4. Vercel akan auto-detect Next.js

### 5.3 Konfigurasi Environment Variables di Vercel

Di halaman deployment, buka **Environment Variables** dan tambahkan:

| Key | Value | Environment |
|-----|-------|-------------|
| `DATABASE_URL` | Connection string dari Neon | Production, Preview, Development |
| `AUTH_SECRET` | Random string yang sudah di-generate | Production, Preview, Development |
| `AUTH_URL` | `https://your-app.vercel.app` | Production |
| `AUTH_GOOGLE_ID` | Google Client ID | Production, Preview, Development |
| `AUTH_GOOGLE_SECRET` | Google Client Secret | Production, Preview, Development |

> ⚠️ **AUTH_URL**: Setelah deploy pertama, kamu akan dapat domain dari Vercel (misal `surat-dwp.vercel.app`). Update variable ini dengan domain tersebut.

### 5.4 Deploy

1. Klik **Deploy**
2. Tunggu build selesai (biasanya 1-2 menit)
3. Setelah berhasil, kamu akan dapat URL seperti `https://surat-dwp.vercel.app`

### 5.5 Jalankan Migrasi untuk Production

Setelah deploy pertama, jalankan migrasi ke database production:

```bash
npx prisma migrate deploy
```

> Ini menjalankan migration yang sudah ada di `prisma/migrations/` tanpa membuat migration baru.

Atau jika belum pernah migrate sama sekali, jalankan dari local dengan DATABASE_URL production:

```bash
DATABASE_URL="postgresql://...production-url..." npx prisma migrate deploy
```

---

## 6. Post-Deployment

### 6.1 Update Google OAuth Redirect URI

Setelah dapat domain Vercel:

1. Buka [Google Cloud Console](https://console.cloud.google.com/) → **Credentials**
2. Edit OAuth client yang sudah dibuat
3. Tambahkan di **Authorized JavaScript origins**:
   ```
   https://surat-dwp.vercel.app
   ```
4. Tambahkan di **Authorized redirect URIs**:
   ```
   https://surat-dwp.vercel.app/api/auth/callback/google
   ```
5. Klik **Save**

### 6.2 Update AUTH_URL di Vercel

1. Buka Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Update `AUTH_URL` menjadi `https://surat-dwp.vercel.app`
3. **Redeploy** agar perubahan berlaku

### 6.3 Custom Domain (Opsional)

1. Di Vercel Dashboard → **Settings** → **Domains**
2. Tambahkan domain custom (misal `surat.company.com`)
3. Ikuti instruksi DNS yang diberikan Vercel
4. Jangan lupa update juga:
   - `AUTH_URL` di Vercel env vars
   - Redirect URI di Google Cloud Console

### 6.4 Test Login

1. Buka URL production
2. Klik "Masuk dengan Google"
3. Pilih akun Google
4. Seharusnya redirect ke `/dashboard`

---

## 7. Troubleshooting

### Error: "Connection refused" atau "timeout"

- Pastikan `DATABASE_URL` benar dan ada `?sslmode=require`
- Cek apakah IP tidak di-block (Neon free tier biasanya open)
- Pastikan database sudah di-migrate

### Error: "OAuthCallbackError"

- Pastikan redirect URI di Google Cloud Console **persis sama** dengan URL app + `/api/auth/callback/google`
- Pastikan `AUTH_SECRET` sudah di-set
- Pastikan `AUTH_GOOGLE_ID` dan `AUTH_GOOGLE_SECRET` benar

### Error: "NEXT_REDIRECT" saat build

- Ini normal untuk halaman yang melakukan redirect. Vercel menangani ini dengan benar.

### Error: "PrismaClientInitializationError"

- Pastikan `DATABASE_URL` terisi di environment variables Vercel
- Jalankan `npx prisma migrate deploy` untuk memastikan tabel sudah dibuat
- Pastikan `npx prisma generate` sudah jalan saat build (sudah otomatis via postinstall)

### Login berhasil tapi redirect ke halaman kosong

- Pastikan `AUTH_URL` di Vercel sesuai dengan domain yang dipakai
- Clear cookies browser dan coba lagi

### Tabel tidak ditemukan di database

- Jalankan `npx prisma migrate deploy` dari local dengan DATABASE_URL production
- Atau jalankan `npx prisma db push` sebagai alternatif cepat (tanpa migration history)

---

## Ringkasan Alur Deployment

```
1. Buat database di Neon
   └── Copy connection string

2. Setup Google OAuth
   └── Catat Client ID & Secret

3. Isi .env lokal
   └── Test di localhost

4. Migrate database
   └── npx prisma migrate dev --name init

5. Push ke GitHub

6. Import di Vercel
   └── Isi environment variables
   └── Deploy

7. Update Google OAuth redirect URI
   └── Tambahkan URL production

8. Test login di production ✓
```

---

## Biaya

| Service | Plan | Biaya |
|---------|------|-------|
| Neon | Free | $0/bulan (0.5 GB storage, auto-suspend) |
| Vercel | Hobby | $0/bulan (personal projects) |
| Google OAuth | - | Gratis |

> Untuk production dengan traffic tinggi, pertimbangkan upgrade ke Neon Pro ($19/bulan) dan Vercel Pro ($20/bulan).
