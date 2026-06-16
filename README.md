# Developer Guide - SRE UPNVJT Website & Dashboard

Dokumen ini berisi gambaran umum mengenai arsitektur sistem, struktur folder, serta panduan pengembangan (*development tutorial*) untuk SRE UPN Veteran Jawa Timur Website & Internal Dashboard. Dokumentasi ini ditujukan bagi developer atau tim IT selanjutnya yang akan mengelola dan mengembangkan proyek ini.

---

## 1. Gambaran Sistem (System Overview)

Proyek ini dibangun menggunakan arsitektur modern berbasis React dengan Next.js App Router. Sistem ini menggabungkan *Landing Page* publik dan *Dashboard Internal* (*Content Management System* / ERP sederhana) untuk pengurus organisasi.

### Teknologi Utama (Tech Stack)
* **Framework:** Next.js (App Router) + React
* **Styling:** Tailwind CSS (dengan efek *Glassmorphism* premium)
* **Animasi:** Framer Motion
* **Autentikasi:** NextAuth.js (berbasis kredensial / NPM & Password)
* **Database:** MySQL
* **ORM:** Drizzle ORM
* **Ikon:** Lucide React

---

## 2. Struktur Folder & Penjelasan

Berikut adalah struktur direktori utama beserta penjelasannya:

```text
sre-upnjatim/
│
├── public/                    # Aset statis yang dapat diakses publik
│   ├── images/                # Gambar statis bawaan aplikasi
│   └── uploads/               # Direktori hasil upload pengguna dari dashboard
│       ├── activities/        # Foto dokumentasi program & aktivitas
│       ├── articles/          # Sampul/thumbnail artikel publikasi
│       ├── attendance_proofs/ # Bukti presensi absensi
│       ├── documents/         # Berkas bank data & dokumen
│       ├── finance_proofs/    # Bukti struk/nota buku kas digital
│       ├── merchandise/       # Foto katalog produk merchandise
│       ├── partners/          # Logo partner/sponsor
│       └── profiles/          # Foto profil pengurus (untuk halaman About)
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (dashboard)/       # Route group untuk Dashboard Internal (dilindungi middleware)
│   │   │   ├── achievements/  # Modul Prestasi & Sertifikat
│   │   │   ├── activities/    # Modul Programs & Activities
│   │   │   ├── appraisals/    # Modul Penilaian Pengurus (Appraisals)
│   │   │   ├── articles/      # Modul CMS Publikasi Artikel
│   │   │   ├── attendance/    # Modul Presensi/Absensi
│   │   │   ├── dashboard/     # Halaman utama (Overview) dashboard
│   │   │   ├── departments/   # Modul Departemen & Divisi
│   │   │   ├── documents/     # Modul Bank Data & Dokumen
│   │   │   ├── finance/       # Modul Buku Kas Digital (Pemasukan & Pengeluaran)
│   │   │   ├── inventory/     # Modul Manajemen Inventaris
│   │   │   ├── leaderboard/   # Modul Papan Peringkat Poin Aktif
│   │   │   ├── logs/          # Modul Sistem Log (Catatan Aktivitas)
│   │   │   ├── merch/         # Modul Toko SRE (Merchandise)
│   │   │   ├── partners/      # Modul Kelola Partners (Our Partners)
│   │   │   ├── projects/      # Modul Kelola Proyek Kerja
│   │   │   ├── roles/         # Modul Peran & Hak Akses
│   │   │   ├── settings/      # Pengaturan Profil, Password & Sistem
│   │   │   ├── tasks/         # Modul Tugas & Kanban Board
│   │   │   ├── users/         # Manajemen Pengurus/Anggota
│   │   │   └── layout.js      # Layout global dashboard (Sidebar & Header)
│   │   │
│   │   ├── api/               # API Routes (Backend)
│   │   │   ├── upload/        # Endpoint sentral untuk upload file (menangani prefix & auto-folder)
│   │   │   ├── auth/          # Endpoint NextAuth
│   │   │   └── ...            # Endpoint REST API untuk masing-masing modul
│   │   │
│   │   ├── about/             # Landing page: About Us (Visi, Misi, Tim)
│   │   ├── actions/           # Server Actions (Fungsi backend Next.js)
│   │   ├── activity/          # Landing page: Daftar & Detail Kegiatan
│   │   ├── article/           # Landing page: Daftar & Detail Artikel Publikasi
│   │   ├── login/             # Halaman Autentikasi/Login
│   │   ├── merchandise/       # Landing page: Katalog Toko Merch
│   │   ├── status/            # Halaman publik untuk melacak status registrasi/sertifikat
│   │   ├── error.js           # Penanganan error global (Global Error Boundary)
│   │   ├── not-found.js       # Halaman 404 Kustom (Not Found)
│   │   ├── globals.css        # Styling utama (Tailwind directives)
│   │   ├── page.js            # Landing page: Beranda (Home)
│   │   └── layout.js          # Root layout (Provider & Navbar publik)
│   ├── components/            # Komponen React yang digunakan berulang (Reusable)
│   │   ├── Footer.js          # Komponen Footer untuk public landing page
│   │   ├── Header.js          # Komponen Header/Navbar untuk public landing page
│   │   ├── NavigationWrapper.js # Komponen kondisional (menyembunyikan header di dashboard)
│   │   ├── Providers.js       # Global state providers (Next-Auth, Theme, dll)
│   │   └── ThemeToggle.js     # Tombol toggle Dark/Light Mode
│   │
│   ├── i18n/                  # Folder Dictionary (Kamus Translasi)
│   │   ├── id.json            # Teks Bahasa Indonesia
│   │   ├── en.json            # Teks English
│   │   └── LanguageProvider.js # State manager untuk pergantian bahasa (Context API)
│   │
│   ├── db/                    # Konfigurasi Database (Drizzle ORM)
│   │   └── schema.js          # Definisi skema tabel database
│   │
│   ├── lib/                   # Utilitas & Helper
│   │   ├── permissions.js     # Logika Role-Based Access Control (RBAC)
│   │   ├── cropImage.js       # Utilitas internal untuk pemotongan gambar (Canvas API)
│   │   └── db.js              # Alternatif koneksi DB
│   │
│   └── middleware.js          # Konfigurasi NextAuth middleware untuk membatasi akses (dashboard vs public)
│
├── package.json               # Dependensi proyek
└── tailwind.config.js         # Konfigurasi Tailwind & tema warna
```

---

## 3. Tutorial Menjalankan & Mengelola Web

### Menjalankan Proyek di Lokal
1. Pastikan Anda telah menginstal **Node.js** (versi 18+) dan server **MySQL** yang berjalan lokal.
2. Buat database di MySQL (misalnya `sre_upnjatim`).
3. Konfigurasikan file `.env` di root direktori dengan format:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/sre_upnjatim"
   NEXTAUTH_SECRET="random_secret_string"
   NEXTAUTH_URL="http://localhost:3000"
   ```
4. Jalankan perintah instalasi dependensi:
   ```bash
   npm install
   ```
5. Jalankan development server:
   ```bash
   npm run dev
   ```
6. Akses web melalui `http://localhost:3000`. Untuk login ke dashboard, gunakan `http://localhost:3000/login`.

### Aturan Unggah Berkas (File Uploads)
Sistem memiliki endpoint API tersentralisasi di `/api/upload`. 
- Fungsi ini secara otomatis mengelompokkan file ke sub-direktori `/public/uploads/<folder-name>`.
- Format penamaan file sudah dibuat profesional: `NAMAFOLDER_timestamp_random.ext` (Contoh: `MERCHANDISE_1623..._x1y2.jpg`).

### Pengaturan Role dan Permission
Hak akses diatur dalam file `src/lib/permissions.js`. Terdapat beberapa role utama: `SUPER_ADMIN`, `ADMIN`, `USER`.
Modul seperti *Overview* dan *Settings* dapat diakses oleh semua pengguna. Namun, penambahan/penghapusan data di modul inti dikontrol oleh *permissions* (create, update, delete).

---

## 4. Tutorial Database & Migrasi (SANGAT PENTING)

Sistem database diakses menggunakan **Drizzle ORM**. File utama pendefinisian skema ada di `src/db/schema.js`.

> [!WARNING]
> **ATURAN KRITIS (CRITICAL RULE):** 
> Sangat dilarang keras menggunakan perintah `npx drizzle-kit push` atau sinkronisasi langsung bawaan Drizzle pada environment proyek ini.

### Cara Melakukan Perubahan Skema Database
Jika Anda perlu menambahkan tabel baru, menambah kolom, atau mengubah tipe data, **JANGAN** menggunakan Drizzle Kit CLI secara langsung.

1. **Ubah Skema di `schema.js`:**
   Tambahkan kolom atau tabel baru pada file `src/db/schema.js`.
2. **Gunakan Script `alter_db.js`:**
   Untuk menerapkan perubahan secara aktual di database MySQL, gunakan script migrasi manual yang telah disediakan. Buka file `alter_db.js` dan tulis kueri DDL (Data Definition Language) SQL Anda secara manual.
   
   Contoh isi `alter_db.js` untuk menambah kolom:
   ```javascript
   import mysql from 'mysql2/promise';
   import dotenv from 'dotenv';
   dotenv.config();

   async function alterDb() {
     const connection = await mysql.createConnection(process.env.DATABASE_URL);
     try {
       // TULIS QUERY SQL MANUAL ANDA DI SINI
       await connection.query('ALTER TABLE articles ADD COLUMN views INT DEFAULT 0');
       console.log('Database altered successfully.');
     } catch (err) {
       console.error('Error altering database:', err);
     } finally {
       await connection.end();
     }
   }

   alterDb();
   ```
3. **Eksekusi Script:**
   Jalankan file tersebut menggunakan Node:
   ```bash
   node alter_db.js
   ```

Pendekatan ini memastikan stabilitas data dan meminimalisir kesalahan sinkronisasi tak terduga yang sering terjadi akibat Drizzle Kit di ekosistem database lokal yang datanya sudah terisi.

### Inisialisasi Database di Server Baru (Fresh Install)
Jika Anda baru saja memindahkan proyek ini ke *server production* baru dan **databasenya masih kosong sepenuhnya**, maka `alter_db.js` tentu tidak efisien karena Anda harus membuat semua tabel dari nol. 

Untuk inisialisasi awal (*setup* pertama kali), Anda memiliki 2 opsi yang aman:

**Opsi 1: Menggunakan Drizzle Push (Hanya Sekali di Awal)**
Aturan larangan `drizzle-kit push` ditujukan untuk database yang sudah berisi data agar data tidak hilang. Namun, jika database **benar-benar baru dan kosong**, Anda **diperbolehkan** menjalankan perintah ini untuk membuat ulang seluruh skema secara otomatis:
```bash
npx drizzle-kit push
```
*(Setelah tabel terbentuk, kembalilah mematuhi aturan penggunaan `alter_db.js` untuk perubahan-perubahan selanjutnya).*

**Opsi 2: Menggunakan SQL Dump (Direkomendasikan)**
Lakukan *export* dari database lokal Anda menggunakan `mysqldump` atau *tool* seperti phpMyAdmin / DBeaver, lalu *import* file `.sql` tersebut ke database di server *production*. Pendekatan ini lebih direkomendasikan karena akan membawa beserta data bawaan (seperti akun Super Admin pertama).

### Seeding Data Awal (Super Admin)
Jika Anda menggunakan Opsi 1 (Drizzle Push) atau baru saja membersihkan database, Anda memerlukan akun awal untuk bisa masuk ke dalam sistem. Sebuah skrip *seeder* telah disediakan untuk membuat `Role` `SUPER_ADMIN` dan akun penggunanya.

Jalankan perintah berikut di terminal:
```bash
node seed.mjs
```

Setelah berhasil dijalankan, Anda bisa masuk menggunakan:
- **Email:** `admin@sreupnjatim.com`
- **Password:** `password123`

> [!TIP]
> Sangat disarankan untuk segera mengganti password ini setelah Anda berhasil login ke lingkungan *production*!

---

## 5. Fitur Tambahan & Panduan Khusus

### Dukungan Multibahasa (i18n)
Sistem dilengkapi fitur dwibahasa (Bahasa Indonesia & English).
- Translasi disimpan di `src/i18n/id.json` dan `en.json`.
- Pengguna (Super Admin) dapat mengganti bahasa bawaan (*default*) sistem melalui **Settings > System (Super Admin)**. 
- Komponen menggunakan *hook* `useLanguage()` dan fungsi `t('key')` untuk menampilkan teks terjemahan yang menyesuaikan secara langsung (*real-time*).

### Fleksibilitas Tautan Bukti (File & Link)
Pada modul-modul pelaporan (seperti *Finance*, *Attendance*, *Achievements*, dan *Documents*), sistem memperbolehkan dua tipe pengumpulan bukti:
1. **Upload File Langsung** (Sistem akan otomatis melemparnya ke `/api/upload` dan merapikan foldernya).
2. **Tautan Eksternal (URL)** (Misalnya: Link Google Drive, Sertifikat Digital, Trello).

Jika pengguna memilih kondisi tertentu (seperti Izin/Sakit pada *Attendance*), sistem akan otomatis melakukan validasi untuk memastikan salah satu dari tipe bukti ini terisi.

### Optimalisasi *Connection Pool* di Development
Sistem sudah menerapkan *singleton caching* pada objek koneksi Drizzle di `src/lib/db.js`. 
Saat Anda menjalankan `npm run dev`, fitur *hot-reload* dari Next.js tidak akan membanjiri (*exhaust*) koneksi server database Anda, sehingga mencegah error `ER_CON_COUNT_ERROR` yang umum terjadi saat pengembangan.

---

*Panduan ini dirancang untuk memastikan kesinambungan arsitektur, gaya kode, dan keamanan basis data untuk generasi developer SRE UPNVJT selanjutnya. Selamat berkarya!*
