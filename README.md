# SRE UPNVJT — Website & Dashboard
**Society of Renewable Energy — UPN Veteran Jawa Timur**

---

## Tech Stack
- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS v4 + Framer Motion
- **Database:** PostgreSQL via Supabase
- **ORM:** Drizzle ORM v0.45
- **Auth:** NextAuth.js v4

---

## Setup Awal

### 1. Clone Repo
```bash
git clone https://github.com/mraynar/sre-upnvjt.git
cd sre-upnvjt
npm install
```

### 2. Buat Project Supabase
1. Buka https://supabase.com → login → **New Project**
2. Isi nama project, buat password (simpan!)
3. Region: Northeast Asia (Tokyo)
4. Tunggu ~2 menit

### 3. Ambil Connection String
1. Supabase dashboard → klik **Connect**
2. Tab **ORM** → copy `DATABASE_URL`

### 4. Setup .env
```bash
cp .env.example .env
```
Isi file `.env`:
DATABASE_URL="postgresql://postgres.xxxx:[PASSWORD]@aws-1-xxx.pooler.supabase.com:6543/postgres"
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="4f8a1c9b2d7e5f3a6b8c0d1e2f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a"
> SUPABASE_URL dan PUBLISHABLE_KEY: Supabase → Settings → API Keys

### 5. Buat Tabel Database
Buka Supabase → **SQL Editor** → **New Query** → paste SQL di bawah → klik **Run**:

```sql
CREATE TABLE IF NOT EXISTS "role" ("id" serial PRIMARY KEY,"name" varchar(255) NOT NULL UNIQUE,"permissions" jsonb NOT NULL,"createdAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "department" ("id" serial PRIMARY KEY,"name" varchar(255) NOT NULL UNIQUE,"code" varchar(255) NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS "division" ("id" serial PRIMARY KEY,"name" varchar(255) NOT NULL,"departmentId" integer NOT NULL REFERENCES "department"("id"));
CREATE TABLE IF NOT EXISTS "user" ("id" serial PRIMARY KEY,"name" varchar(255) NOT NULL,"email" varchar(255) NOT NULL UNIQUE,"password" varchar(255) NOT NULL,"npm" varchar(255) UNIQUE,"positionName" varchar(255),"isActive" boolean DEFAULT true NOT NULL,"roleId" integer NOT NULL REFERENCES "role"("id"),"departmentId" integer REFERENCES "department"("id"),"divisionId" integer REFERENCES "division"("id"),"profilePictureUrl" varchar(500),"totalPoints" integer DEFAULT 0 NOT NULL,"createdAt" timestamp NOT NULL,"updatedAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "memberProfile" ("userId" integer PRIMARY KEY REFERENCES "user"("id"),"xp" integer DEFAULT 0 NOT NULL,"level" integer DEFAULT 1 NOT NULL);
CREATE TABLE IF NOT EXISTS "announcement" ("id" serial PRIMARY KEY,"title" varchar(255) NOT NULL,"imageUrl" varchar(1000),"actionLink" varchar(1000),"content" text NOT NULL,"targetAudience" varchar(255),"isActive" boolean DEFAULT true NOT NULL,"createdById" integer NOT NULL REFERENCES "user"("id"),"createdAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "content" ("id" serial PRIMARY KEY,"title" varchar(255) NOT NULL,"slug" varchar(255) NOT NULL UNIQUE,"body" text NOT NULL,"imageUrl" varchar(1000),"isPublished" boolean DEFAULT false NOT NULL,"updatedById" integer NOT NULL REFERENCES "user"("id"),"createdAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "event" ("id" serial PRIMARY KEY,"title" varchar(255) NOT NULL,"description" text,"bannerUrl" varchar(1000),"eventDate" timestamp NOT NULL,"location" varchar(255),"category" varchar(255),"registrationType" varchar(255),"createdAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "eventRegistration" ("id" serial PRIMARY KEY,"eventId" integer NOT NULL REFERENCES "event"("id"),"fullName" varchar(255) NOT NULL,"email" varchar(255) NOT NULL,"teamName" varchar(255),"registrationType" varchar(50) NOT NULL,"status" varchar(50) DEFAULT 'PENDING' NOT NULL,"submittedAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "memberApplication" ("id" serial PRIMARY KEY,"fullName" varchar(255) NOT NULL,"email" varchar(255) NOT NULL,"npm" varchar(255) NOT NULL,"faculty" varchar(255) NOT NULL,"motivation" text NOT NULL,"status" varchar(50) DEFAULT 'PENDING' NOT NULL,"reviewedById" integer REFERENCES "user"("id"),"appliedAt" timestamp NOT NULL,"updatedAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "merchandise" ("id" serial PRIMARY KEY,"name" varchar(255) NOT NULL,"price" numeric(10,2) NOT NULL,"description" text NOT NULL,"imageUrl" varchar(1000),"linkUrl" varchar(1000),"isAvailable" boolean DEFAULT true NOT NULL,"createdAt" timestamp NOT NULL,"updatedAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "partner" ("id" serial PRIMARY KEY,"name" varchar(255) NOT NULL,"logoUrl" varchar(1000),"websiteUrl" varchar(1000),"tier" varchar(50),"isActive" boolean DEFAULT true NOT NULL,"createdAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "task" ("id" serial PRIMARY KEY,"title" varchar(255) NOT NULL,"description" text NOT NULL,"rewardXp" integer DEFAULT 0 NOT NULL,"deadline" timestamp NOT NULL,"createdById" integer NOT NULL REFERENCES "user"("id"),"createdAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "taskSubmission" ("id" serial PRIMARY KEY,"taskId" integer NOT NULL REFERENCES "task"("id"),"memberId" integer NOT NULL REFERENCES "user"("id"),"fileUrl" varchar(1000),"status" varchar(50) NOT NULL,"feedback" text,"reviewedById" integer REFERENCES "user"("id"),"submittedAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "attendance" ("id" serial PRIMARY KEY,"memberId" integer NOT NULL REFERENCES "user"("id"),"date" timestamp NOT NULL,"status" varchar(50) NOT NULL,"notes" text,"createdAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "testimonial" ("id" serial PRIMARY KEY,"authorName" varchar(255) NOT NULL,"authorPosition" varchar(255) NOT NULL,"authorPhotoUrl" varchar(1000),"content" text NOT NULL,"isPublished" boolean DEFAULT false NOT NULL,"createdAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "systemSetting" ("id" serial PRIMARY KEY,"keyName" varchar(255) NOT NULL UNIQUE,"valueData" text NOT NULL,"updatedAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "literatureCategory" ("id" serial PRIMARY KEY,"name" varchar(255) NOT NULL,"imageUrl" varchar(1000),"description" text,"createdAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "literatureItem" ("id" serial PRIMARY KEY,"categoryId" integer NOT NULL REFERENCES "literatureCategory"("id"),"title" varchar(255) NOT NULL,"author" varchar(255),"year" integer,"driveUrl" varchar(1000) NOT NULL,"type" varchar(50),"isPublished" boolean DEFAULT false NOT NULL,"uploadedById" integer NOT NULL REFERENCES "user"("id"),"createdAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "pptModule" ("id" serial PRIMARY KEY,"title" varchar(255) NOT NULL,"description" text,"coverImageUrl" varchar(1000),"isPublished" boolean DEFAULT false NOT NULL,"createdById" integer NOT NULL REFERENCES "user"("id"),"createdAt" timestamp NOT NULL,"updatedAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "pptSlide" ("id" serial PRIMARY KEY,"moduleId" integer NOT NULL REFERENCES "pptModule"("id"),"order" integer NOT NULL,"title" varchar(255),"driveUrl" varchar(1000) NOT NULL,"notes" text,"createdAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "quiz" ("id" serial PRIMARY KEY,"title" varchar(255) NOT NULL,"description" text,"timeLimitMinutes" integer,"passingScore" integer DEFAULT 70,"rewardXp" integer DEFAULT 0 NOT NULL,"isPublished" boolean DEFAULT false NOT NULL,"createdById" integer NOT NULL REFERENCES "user"("id"),"createdAt" timestamp NOT NULL);
CREATE TABLE IF NOT EXISTS "quizQuestion" ("id" serial PRIMARY KEY,"quizId" integer NOT NULL REFERENCES "quiz"("id"),"order" integer NOT NULL,"type" varchar(50) NOT NULL,"question" text NOT NULL,"options" jsonb DEFAULT '[]',"correctOptionId" varchar(50),"points" integer DEFAULT 1 NOT NULL);
CREATE TABLE IF NOT EXISTS "quizSubmission" ("id" serial PRIMARY KEY,"quizId" integer NOT NULL REFERENCES "quiz"("id"),"memberId" integer NOT NULL REFERENCES "user"("id"),"answers" jsonb DEFAULT '[]' NOT NULL,"mcqScore" integer,"essayScore" integer,"totalScore" integer,"isPassed" boolean,"gradedById" integer REFERENCES "user"("id"),"submittedAt" timestamp NOT NULL,"gradedAt" timestamp);
CREATE TABLE IF NOT EXISTS "xpTransaction" ("id" serial PRIMARY KEY,"userId" integer NOT NULL REFERENCES "user"("id"),"amount" integer NOT NULL,"reason" varchar(255) NOT NULL,"sourceType" varchar(50),"sourceId" integer,"grantedById" integer REFERENCES "user"("id"),"createdAt" timestamp NOT NULL);
```

### 6. Seed Data Awal
```bash
node seed.mjs
```

Akun default:

| Role | Email | Password |
|---|---|---|
| Super Admin | admin@sre.co.id | admin123 |
| Member | member@sre.co.id | member123 |

> Ganti password setelah pertama login!

### 7. Jalankan Project
```bash
npm run dev
```
Buka: http://localhost:3000

---

## Git Workflow

### Sebelum Mulai Kerja
```bash
git checkout main
git pull origin main
```

### Buat Branch
```bash
git checkout -b feature/[nama]-[modul]
```

### Commit & Push
```bash
git add .
git commit -m "feat: deskripsi singkat"
git push origin feature/[nama]-[modul]
```

### Pull Request
1. Buka github.com/mraynar/sre-upnvjt
2. Klik **Compare & pull request**
3. Tulis deskripsi + screenshot
4. **Jangan merge sendiri — tunggu review Raynar**

### Aturan
- Dilarang push langsung ke `main`
- Dilarang edit file milik staff lain tanpa konfirmasi
- Satu branch = satu fitur
- Jangan commit file `.env`
- Update Progress Tracker setiap ada perubahan

### Konvensi Branch
| Nama | Format |
|---|---|
| Raynar | feature/raynar-[modul] |
| Ghulam | feature/ghulam-[modul] |
| Riko | feature/riko-[modul] |
| Kaka | feature/kaka-[modul] |

### Konvensi Commit
| Prefix | Kegunaan |
|---|---|
| feat: | Fitur baru |
| fix: | Perbaikan bug |
| style: | Perubahan tampilan |
| refactor: | Refactor kode |
| docs: | Update dokumentasi |

---

## Role & Akses

| Role | Akses |
|---|---|
| SUPER_ADMIN | Semua fitur admin |
| STAFF_ACE | Bank Literatur, Quiz |
| STAFF_HR | Tugas, PPT, Quiz, Leaderboard |
| MEMBER | Materi, Quiz, Leaderboard, Absensi |
| Visitor | Halaman publik |

---

## Struktur Folder
src/
├── app/
│   ├── (dashboard)/    # Panel admin
│   ├── (member)/       # Halaman member
│   ├── api/            # API routes
│   ├── actions/        # Server actions
│   └── [halaman publik]
├── components/         # Komponen global
├── db/schema.js        # Schema database
├── lib/
│   ├── db.js           # Koneksi database
│   └── permissions.js  # RBAC
└── middleware.js        # Route protection

---

## Panduan Konfigurasi Google Drive OAuth 2.0 (Upload File Tugas)

Aplikasi ini menggunakan **Google Drive OAuth 2.0 (Refresh Token)** untuk mengunggah file tugas secara langsung tanpa terkena limitasi kuota 0 GB milik *Service Account*. Sistem ini memanfaatkan kuota Drive pribadi / Workspace Anda yang lega (misal: 15 GB atau 5 TB).

Berikut adalah cara mendapatkan **Client ID**, **Client Secret**, dan **Refresh Token** untuk mengisi file `.env`:

### Langkah 1: Mendapatkan Client ID & Secret
1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat proyek baru atau pilih proyek yang sudah ada.
3. Di menu sebelah kiri, masuk ke **APIs & Services** > **Credentials**.
4. Klik tombol **+ CREATE CREDENTIALS** > pilih **OAuth client ID**. 
   *(Jika Anda belum pernah mengatur OAuth, sistem akan meminta Anda mengatur **Consent Screen** terlebih dahulu. Pilih tipe "External", isi nama aplikasi, dan yang paling penting: **tambahkan email Anda sendiri ke bagian "Test users"**. Setelah itu kembali ke halaman Credentials).*
5. Pilih **Application type:** `Web application`.
6. Pada kolom **Authorized redirect URIs**, wajib masukkan URL ini secara persis:
   `https://developers.google.com/oauthplayground`
7. Klik **Create/Simpan**.
8. Anda akan mendapatkan **Client ID** dan **Client Secret**. Salin dan masukkan kedua kode tersebut ke dalam variabel `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` di file `.env` Anda.

### Langkah 2: Mendapatkan Refresh Token
1. Buka halaman resmi [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/).
2. Di pojok kanan atas layar, klik ikon **Gear (Pengaturan)**.
3. Centang kotak **Use your own OAuth credentials**.
4. Masukkan **Client ID** dan **Client Secret** Anda ke dalam kotak yang tersedia, lalu klik *Close*.
5. Di panel sebelah kiri (Step 1), cari dan klik grup **Drive API v3**.
6. Centang *scope* (izin) yang bertuliskan: `https://www.googleapis.com/auth/drive`.
7. Klik tombol biru **Authorize APIs** di bagian bawah.
8. Anda akan diarahkan ke halaman *Login* Google. Silakan *login* menggunakan akun Google (email) yang ingin Anda gunakan sebagai penampung data tugas (yang kapasitasnya lega).
9. Jika ada peringatan *"Google hasn't verified this app"*, hiraukan saja (karena ini aplikasi Anda sendiri). Klik **Continue / Lanjutkan**.
10. Setelah diarahkan kembali ke OAuth Playground, perhatikan panel **Step 2**.
11. Klik tombol biru **Exchange authorization code for tokens**.
12. Halaman akan menampilkan **Refresh token**. Salin kode *Refresh token* tersebut dan masukkan ke dalam variabel `GOOGLE_REFRESH_TOKEN` di file `.env` Anda!

**Selesai!** 
Aplikasi SRE Anda kini memiliki akses mutlak ke Google Drive Anda secara permanen. *Access Token* yang berdurasi 1 jam akan otomatis diperbarui (*auto-refresh*) oleh server Next.js di balik layar setiap kali kedaluwarsa. 

> **PENTING:** Jika aplikasi Anda di Google Cloud Console berstatus **"Testing"** (di halaman *OAuth consent screen*), maka **Refresh Token hanya akan bertahan selama 7 HARI**. Agar *Refresh Token* bersifat abadi/permanen selamanya, pastikan Anda mengeklik tombol **PUBLISH APP** (Ubah statusnya menjadi *"In production"*) di halaman *OAuth consent screen* tersebut!

---

*SRE UPNVJT Web Development Division — 2026*
