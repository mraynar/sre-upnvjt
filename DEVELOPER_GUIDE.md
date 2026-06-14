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
│   │   │   ├── activities/    # Modul Programs & Activities
│   │   │   ├── articles/      # Modul CMS Publikasi Artikel
│   │   │   ├── attendance/    # Modul Presensi/Absensi
│   │   │   ├── dashboard/     # Halaman utama (Overview) dashboard
│   │   │   ├── departments/   # Modul Departemen & Divisi
│   │   │   ├── documents/     # Modul Bank Data & Dokumen
│   │   │   ├── finance/       # Modul Buku Kas Digital (Pemasukan & Pengeluaran)
│   │   │   ├── inventory/     # Modul Manajemen Inventaris
│   │   │   ├── merch/         # Modul Toko SRE (Merchandise)
│   │   │   ├── partners/      # Modul Kelola Partners (Our Partners)
│   │   │   ├── settings/      # Pengaturan Profil & Password Pengguna
│   │   │   ├── users/         # Manajemen Pengurus/Anggota (Super Admin)
│   │   │   └── layout.js      # Layout global dashboard (Sidebar & Header)
│   │   │
│   │   ├── api/               # API Routes (Backend)
│   │   │   ├── upload/        # Endpoint sentral untuk upload file (menangani prefix & auto-folder)
│   │   │   ├── auth/          # Endpoint NextAuth
│   │   │   └── ...            # Endpoint REST API untuk masing-masing modul
│   │   │
│   │   ├── about/             # Landing page: About Us (Visi, Misi, Tim)
│   │   ├── articles/          # Landing page: Publikasi Artikel
│   │   ├── page.js            # Landing page: Beranda (Home)
│   │   └── layout.js          # Root layout (Provider & Navbar publik)
│   │
│   ├── db/                    # Konfigurasi Database (Drizzle ORM)
│   │   ├── index.js           # Koneksi ke MySQL
│   │   └── schema.js          # Definisi skema tabel database
│   │
│   ├── lib/                   # Utilitas & Helper
│   │   ├── permissions.js     # Logika Role-Based Access Control (RBAC)
│   │   ├── cropImage.js       # Utilitas internal untuk pemotongan gambar (Canvas API)
│   │   └── db.js              # Alternatif koneksi DB
│   │
│   └── middleware.js          # Konfigurasi NextAuth middleware untuk membatasi akses (dashboard vs public)
│
├── alter_db.js                # SCRIPT WAJIB untuk modifikasi skema database (DDL)
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

---

*Panduan ini dirancang untuk memastikan kesinambungan arsitektur, gaya kode, dan keamanan basis data untuk generasi developer SRE UPNVJT selanjutnya. Selamat berkarya!*
