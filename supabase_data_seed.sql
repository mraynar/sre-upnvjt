SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict 4d75oZOnl7T1DEXfbRuaWQCPMGKExTsp0jzZNfDdK8PLiWkMdk1Zbs6ym9hw8D1

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: postgres
--



--
-- Data for Name: department; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."department" ("id", "name", "code") VALUES
	(1, 'System Administration', 'SYS'),
	(2, 'Member', ''),
	(3, 'Operations', 'OPS');


--
-- Data for Name: division; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."role" ("id", "name", "permissions", "createdAt") VALUES
	(1, 'SUPER_ADMIN', '{"all": true}', '2026-07-04 15:59:41.184'),
	(2, 'MEMBER', '{}', '2026-07-04 15:59:43.172'),
	(4, 'STAFF', '{}', '2026-07-10 18:32:44'),
	(5, 'Staff', '{"canAccessStaffPortal": true}', '2026-07-10 11:40:26.766');


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user" ("id", "name", "email", "password", "npm", "positionName", "isActive", "roleId", "departmentId", "divisionId", "profilePictureUrl", "totalPoints", "createdAt", "updatedAt") VALUES
	(1, 'Super Administrator', 'admin@sre.co.id', '$2b$10$A7BVvtzllEAMQXtdprzcJufXcJkVcI0Kp7.H0rPntPl92L6q.BMeK', NULL, NULL, true, 1, 1, NULL, NULL, 0, '2026-07-04 15:59:42.353', '2026-07-04 15:59:42.353'),
	(3, 'Alexandrio Z', 'alex@sre.upnjatim.ac.id', '$2b$10$KeZnaX1lyCSqSFREc/K6deTMg8SDS503kew6WaOw6YHV08zPfRpj2', '20081010001', NULL, true, 1, NULL, NULL, NULL, 0, '2026-07-05 07:43:12.350627', '2026-07-05 07:43:12.350627'),
	(4, 'Bagas Ksatria', 'bagas@sre.upnjatim.ac.id', '$2b$10$KeZnaX1lyCSqSFREc/K6deTMg8SDS503kew6WaOw6YHV08zPfRpj2', '20081010002', NULL, true, 1, NULL, NULL, NULL, 0, '2026-07-05 07:43:12.771094', '2026-07-05 07:43:12.771094'),
	(5, 'Citra Kirana', 'citra@sre.upnjatim.ac.id', '$2b$10$KeZnaX1lyCSqSFREc/K6deTMg8SDS503kew6WaOw6YHV08zPfRpj2', '20081010003', NULL, true, 1, NULL, NULL, NULL, 0, '2026-07-05 07:43:13.177108', '2026-07-05 07:43:13.177108'),
	(6, 'Dion Mahesa', 'dion@sre.upnjatim.ac.id', '$2b$10$KeZnaX1lyCSqSFREc/K6deTMg8SDS503kew6WaOw6YHV08zPfRpj2', '20081010004', NULL, true, 1, NULL, NULL, NULL, 0, '2026-07-05 07:43:13.586042', '2026-07-05 07:43:13.586042'),
	(7, 'Elara Putri', 'elara@sre.upnjatim.ac.id', '$2b$10$KeZnaX1lyCSqSFREc/K6deTMg8SDS503kew6WaOw6YHV08zPfRpj2', '20081010005', NULL, true, 1, NULL, NULL, NULL, 0, '2026-07-05 07:43:13.99205', '2026-07-05 07:43:13.99205'),
	(8, 'Farhan Syah', 'farhan@sre.upnjatim.ac.id', '$2b$10$KeZnaX1lyCSqSFREc/K6deTMg8SDS503kew6WaOw6YHV08zPfRpj2', '20081010006', NULL, true, 1, NULL, NULL, NULL, 0, '2026-07-05 07:43:14.401681', '2026-07-05 07:43:14.401681'),
	(9, 'Staff Contoh', 'staff@sre.co.id', '$2b$10$RvgjfNQ7bMc.gW3Qg3UsjOMtn.lqZ0hUzvgIOHGXXfkVLtwvkbDrO', '2023000001', 'Staff Operations', true, 4, 3, NULL, NULL, 10, '2026-07-10 11:40:27.681', '2026-07-10 11:40:27.681'),
	(2, 'Default Member', 'member@sre.co.id', '$2b$10$k.X.Bn/J0awUId/v7uinOOa1Oh0bWFh0pO7houTozz46TAE/ILEGG', '000000000000', NULL, true, 2, 2, NULL, NULL, 30, '2026-07-04 15:59:44.151', '2026-07-04 15:59:44.151');


--
-- Data for Name: announcement; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: attendanceSession; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."attendanceSession" ("id", "title", "description", "date", "startTime", "endTime", "isActive", "createdById", "createdAt", "token") VALUES
	(1, 'Rapat Kerja', NULL, '2026-07-12 06:50:55', NULL, NULL, true, 1, '2026-07-10 15:02:39', 'ABCDE');


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."attendance" ("id", "memberId", "status", "notes", "createdAt", "sessionId") VALUES
	(7, 2, 'PRESENT', NULL, '2026-07-12 00:23:40.676', 1);


--
-- Data for Name: content; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: documentCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."documentCategory" ("id", "name", "description", "createdAt") VALUES
	(1, 'Modul Utama & Panduan', NULL, NULL),
	(2, 'Korespondensi Eksternal', NULL, NULL),
	(3, 'Perizinan & Birokrasi Internal/Fasilitas Kampus', NULL, NULL);


--
-- Data for Name: documentItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."documentItem" ("id", "categoryId", "title", "description", "fileUrl", "uploadedById", "createdAt") VALUES
	(1, 1, 'Proposal Kegiatan', NULL, 'https://docs.google.com/document/d/1tYPq7Hrs7_U9DZVhMBuOj6lTRUl1V4wnAsKPg7j4Xec/edit?tab=t.0', 1, '2026-07-10 19:16:56'),
	(2, 2, 'Permohonan Narasumber', NULL, 'https://docs.google.com/document/d/1MYVmE4DbVuo8GF164EXtsIeuACGYHfoG/edit', 1, '2026-07-10 19:16:58'),
	(3, 3, 'Surat Izin Kegiatan', NULL, 'https://docs.google.com/document/d/1YsdvC3PWkbmd24EGNhBFT6qAtbhHNCfl/edit', 1, '2026-07-10 19:17:01');


--
-- Data for Name: event; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: eventRegistration; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: literatureCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."literatureCategory" ("id", "name", "imageUrl", "description", "createdAt") VALUES
	(1, 'Solar Energy & Photovoltaics', 'categories/solar.webp', 'Literatur mengenai teknologi panel surya, sistem PLTS, perkembangan sel surya, serta instalasi skala rumahan hingga industri.', '2026-07-07 02:12:27.758364'),
	(2, 'Wind & Aero-Energy', 'categories/wind.webp', 'Buku, jurnal, dan dokumen teknis terkait turbin angin, potensi angin lokal, pengembangan PLTB, serta mekanika fluida udara.', '2026-07-07 02:12:27.758364'),
	(3, 'Bioenergy & Biomass', 'categories/biomass.webp', 'Studi mengenai konversi bahan organik menjadi energi, termasuk biofuel, biogas, biodiesel, dan pemanfaatan limbah sisa makanan.', '2026-07-07 02:12:27.758364'),
	(4, 'Hydro & Marine Energy', 'categories/hydro.webp', 'Dokumen seputar pembangkit listrik berbasis air, mencakup mikrohidro, hidroelektrik, serta energi arus dan pasang surut laut.', '2026-07-07 02:12:27.758364'),
	(5, 'Geothermal Energy', 'categories/geothermal.webp', 'Kajian mendalam seputar pemanfaatan energi panas bumi, eksplorasi sumur geothermal, dan pengelolaan reservoir panas bumi.', '2026-07-07 02:12:27.758364');


--
-- Data for Name: literatureItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."literatureItem" ("id", "categoryId", "title", "author", "year", "driveUrl", "type", "isPublished", "uploadedById", "createdAt") VALUES
	(1, 1, 'Solar Cell Device Physics', 'Stephen Fonash', 2010, 'https://drive.google.com/file/d/1oZRd69hzDMnkHT0pc9x6l90o0JUgLjVz/view?usp=sharing', 'Book', true, 1, '2026-07-07 10:41:13');


--
-- Data for Name: memberApplication; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: memberProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."memberProfile" ("userId", "xp", "level") VALUES
	(3, 450, 8),
	(4, 820, 14),
	(5, 1200, 20),
	(6, 320, 5),
	(7, 1550, 25),
	(8, 95, 2),
	(9, 10, 1),
	(2, 515, 6);


--
-- Data for Name: merchandise; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: partner; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pptModule; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."pptModule" ("id", "title", "description", "coverImageUrl", "isPublished", "createdById", "createdAt", "updatedAt", "notes") VALUES
	(1, 'Modul 1 - Energi Baru Terbarukan', 'Memmbahas tentang energi baru terbarukan', 'https://imgs.search.brave.com/6ufaEoFmo2JCz-EkWG03RH2PurPFloyBsOadQpyxpN4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2xpZGVtb2RlbC5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIz/NzEyLTAxLWlucHV0/LXRvLTQtaXRlbS1v/dXRwdXQtcG93ZXJw/b2ludC10ZW1wbGF0/ZS0xNng5LTEtNTU4/eDMxNC5qcGc', true, 1, '2026-07-05 21:31:49', '2026-07-05 21:31:50', '<h1>📚 MATERI INTI: Manajemen State & Efisiensi Data</h1>
<p>State management adalah metode untuk mengatur kondisi data pada aplikasi web. Jika data tersebut dikelola secara sembarangan, performa aplikasi Next.js akan menurun akibat proses <i>re-rendering</i> yang berlebihan di sisi browser mahasiswa.</p>

<blockquote>State yang tidak dioptimasi dengan baik dapat mengakibatkan konsumsi memori browser membengkak hingga <b>dua kali lipat</b> dari batas normal.</blockquote>

<h3>1. Aturan Emas Pengelolaan Data</h3>
<p>Untuk memastikan performa halaman member (bagian Kaka) tetap berjalan ringan, tim developer wajib mematuhi aturan berikut:</p>
<ul>
    <li>Gunakan <strong>Lazy Loading</strong> pada setiap komponen berat atau slider carousel gambar.</li>
    <li>Gunakan format gambar modern seperti <strong>.webp</strong> untuk menghemat kuota internet pengguna hingga 60%.</li>
    <li>Gunakan caching lokal di sisi client untuk data-data statis yang jarang berubah seperti profil atau daftar materi lama.</li>
</ul>

<h3>2. Langkah Penanganan Masalah</h3>
<p>Jika aplikasi mendadak terasa lambat atau <i>freeze</i> saat digeser, lakukan investigasi dengan urutan berikut:</p>
<ol>
    <li>Periksa tab <em>Network</em> pada inspect element browser untuk melihat ukuran aset yang diunduh.</li>
    <li>Pastikan URL gambar sudah dialihkan menggunakan CDN internal <a href="https://lh3.googleusercontent.com/d/">lh3.googleusercontent.com</a> bawaan Google untuk bypass pembatasan rate limit.</li>
    <li>Jalankan perintah pengujian performa secara lokal sebelum melakukan proses deployment ke server hosting.</li>
</ol>

<p>Dengan menerapkan standarisasi elemen di atas, seluruh teks pengumuman, literatur, maupun catatan materi kuliah yang diinput oleh Riko via panel Super Admin akan langsung ter-<i>render</i> secara aman, konsisten, dan rapi di sisi aplikasi mahasiswa.</p>');


--
-- Data for Name: pptSlide; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."pptSlide" ("id", "moduleId", "order", "title", "fileUrl", "createdAt") VALUES
	(1, 1, 1, '', '1.webp', '2026-07-05 21:43:51'),
	(2, 1, 2, '', '2.webp', '2026-07-06 06:44:05'),
	(3, 1, 3, NULL, '3.webp', '2026-07-06 17:32:18'),
	(4, 1, 4, NULL, '4.webp', '2026-07-06 17:32:38'),
	(5, 1, 5, NULL, '5.webp', '2026-07-06 17:32:51');


--
-- Data for Name: quiz; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."quiz" ("id", "title", "description", "timeLimitMinutes", "passingScore", "rewardXp", "isPublished", "createdById", "createdAt") VALUES
	(1, 'Ujicoba Quiz', 'Ini adalah ujicoba untuk sebuah quiz', 60, 40, 30, true, 1, '2026-07-11 18:59:12');


--
-- Data for Name: quizQuestion; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."quizQuestion" ("id", "quizId", "order", "type", "question", "options", "correctOptionId", "points") VALUES
	(2, 1, 2, 'multiple_choice_complex', 'Dari daftar di bawah ini, manakah yang merupakan mikrokontroler atau modul yang sudah dilengkapi dengan konektivitas Wi-Fi bawaan secara native? (Pilih semua yang benar)', '[{"id": "opt_a", "text": "ESP32"}, {"id": "opt_b", "text": "Arduino Uno R3"}, {"id": "opt_c", "text": "ESP8266"}, {"id": "opt_d", "text": "Arduino Nano Standard"}]', 'opt_a,opt_c', 20),
	(3, 1, 3, 'true_false', 'Perintah ''git cherry-pick'' digunakan untuk menyalin seluruh commit dari branch lain secara massal tanpa terkecuali.', '[{"id": "opt_true", "text": "Benar"}, {"id": "opt_false", "text": "Salah"}]', 'opt_false', 10),
	(4, 1, 4, 'short_answer', 'Apakah nama kelas utility Tailwind CSS yang digunakan untuk memberikan efek transparansi blur pada latar belakang seperti kaca (glassmorphism), misalnya ''backdrop-blur-md''?', '[]', 'backdrop-blur', 20),
	(1, 1, 1, 'multiple_choice', 'Lapisan hierarki IoT yang bertindak sebagai pancaindra digital untuk mengambil data fisik langsung dari lingkungan adalah...', '[{"id": "opt_a", "text": "Connectivity Layer yang bertugas mengelola protokol komunikasi, perutean data (routing), serta memastikan transfer data dari perangkat keras menuju jaringan cloud berjalan tanpa hambatan menggunakan enkripsi end-to-end yang aman."}, {"id": "opt_b", "text": "Application Layer yang berfungsi sebagai antarmuka pengguna (user interface) akhir, menyajikan visualisasi data grafik secara real-time, mengelola kontrol perangkat jarak jauh, serta mengirimkan notifikasi push secara instan kepada user."}, {"id": "opt_c", "text": "Platform Layer (IoT Middleware) yang bertanggung jawab atas manajemen siklus perangkat, pemrosesan logika analitik tingkat lanjut, penyimpanan big data secara terstruktur, serta integrasi API pihak ketiga secara skalabel."}, {"id": "opt_d", "text": "Data from Things / Sensor Layer yang bertindak langsung di area fisik untuk menangkap sinyal analog dari lingkungan melalui aktuator, mengubahnya menjadi data digital, dan melakukan penyaringan data awal pada level paling bawah."}]', 'opt_d', 10);


--
-- Data for Name: quizSubmission; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."quizSubmission" ("id", "quizId", "memberId", "answers", "mcqScore", "essayScore", "totalScore", "isPassed", "gradedById", "submittedAt", "gradedAt") VALUES
	(14, 1, 2, '[{"answer": ["opt_c", "opt_a"], "questionId": 2}, {"answer": "opt_false", "questionId": 3}, {"answer": "backdrop-blur", "questionId": 4}, {"answer": "opt_d", "questionId": 1}]', 40, 20, 60, true, NULL, '2026-07-12 00:22:27.985', NULL);


--
-- Data for Name: shortlink; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."shortlink" ("id", "slug", "originalUrl", "description", "clicks", "createdById", "createdAt") VALUES
	(2, 'test', 'https://google.com', '', 1, 9, '2026-07-11 23:58:15.87');


--
-- Data for Name: systemSetting; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: task; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."task" ("id", "title", "description", "rewardXp", "deadline", "createdById", "createdAt", "formTemplateId", "folderId", "maxUploadSizeMb", "allowMultipleFiles", "submissionType") VALUES
	(3, '[UJI-COBA] Validasi Sistem Integrasi Data Dummy dan Simulasi Perhitungan Reward Poin Pengguna Skala Sandbox', '=== DESKRIPSI TUGAS PERCOBAAN (SISTEM PENGUJIAN INTEGRASI) ===

Tugas ini merupakan modul uji coba (sandbox) yang dirancang untuk memvalidasi alur kerja pengiriman tugas pada platform, mulai dari proses pembuatan, distribusi, hingga mekanisme validasi tenggat waktu. Seluruh pengguna diharapkan dapat mencoba melakukan submission pada tugas ini untuk memastikan tidak ada kendala teknis pada sistem penyerahan berkas.

TUJUAN INSTRUKSIONAL:
1. Menguji responsivitas sistem terhadap input data dummy dengan struktur JSON.
2. Memastikan fungsionalitas perhitungan Reward XP (30 XP) berjalan secara otomatis dan akurat setelah tugas dinyatakan selesai.
3. Melakukan simulasi pembatasan waktu (hard deadline) yang dijadwalkan berakhir pada tanggal 7 Juli 2026 pukul 09:17:17.

PETUNJUK PELAKSANAAN:
- Langkah 1: Bacalah seluruh komponen objek JSON tugas yang telah disediakan oleh instruktur (Created By ID: 1).
- Langkah 2: Buatlah sebuah file dokumentasi singkat yang berisi umpan balik mengenai performa sistem saat Anda membuka halaman tugas ini.
- Langkah 3: Unggah file tersebut melalui tombol Submit yang tersedia di bagian bawah halaman sebelum waktu tenggat berakhir.
- Langkah 4: Pastikan status tugas Anda berubah menjadi Menunggu Penilaian atau Selesai.

CATATAN PENTING & KETENTUAN:
* Karena formTemplateId bernilai null, Anda dibebaskan untuk mengirimkan format file apa saja selama ukurannya tidak melebihi 2MB.
* Keterlambatan pengiriman bahkan hanya satu detik setelah pukul 09:17:17 pada hari H akan menyebabkan sistem menolak berkas Anda secara otomatis, dan perolehan 30 XP akan hangus.
* Jika Anda menemukan bug atau error selama proses pengujian ini, segera ambil tangkapan layar (screenshot) dan laporkan kepada administrator sistem.', 30, '2026-07-07 09:17:17', 1, '2026-07-05 09:17:55', NULL, NULL, 1, true, 'FILE');


--
-- Data for Name: taskSubmission; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."taskSubmission" ("id", "taskId", "memberId", "fileUrl", "status", "feedback", "reviewedById", "submittedAt") VALUES
	(7, 3, 2, 'https://drive.google.com/file/d/1-gM_Wxq3V6IUlc6dweXEWsT0dlXuk0kl/view?usp=drivesdk', 'APPROVED', NULL, NULL, '2026-07-12 00:22:55.21');


--
-- Data for Name: testimonial; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: xpTransaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."xpTransaction" ("id", "userId", "amount", "reason", "sourceType", "sourceId", "grantedById", "createdAt") VALUES
	(3, 2, 30, 'Task', NULL, NULL, 1, '2026-07-05 09:22:43'),
	(4, 2, 50, 'Tugas', NULL, NULL, NULL, '2026-07-05 09:30:12'),
	(7, 2, 10, 'Presensi (Hadir)', 'attendance', 3, NULL, '2026-07-10 08:44:26.631'),
	(9, 2, 15, 'Menyelesaikan Kuis: Ujicoba Quiz', 'quiz', 7, NULL, '2026-07-11 13:38:48.012'),
	(15, 2, 30, 'Menyelesaikan Kuis: Ujicoba Quiz', 'quiz', 12, NULL, '2026-07-11 23:55:05.496'),
	(18, 2, 10, 'Membaca modul materi: Modul 1 - Energi Baru Terbarukan', 'ppt_module', 1, NULL, '2026-07-12 00:21:07.693'),
	(19, 2, 30, 'Menyelesaikan Kuis: Ujicoba Quiz', 'quiz', 14, NULL, '2026-07-12 00:22:28.598'),
	(20, 2, 10, 'Presensi (Hadir)', 'attendance', 7, NULL, '2026-07-12 00:23:41.492');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: postgres
--

SELECT pg_catalog.setval('"drizzle"."__drizzle_migrations_id_seq"', 1, false);


--
-- Name: announcement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."announcement_id_seq"', 1, false);


--
-- Name: attendanceSession_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."attendanceSession_id_seq"', 1, true);


--
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."attendance_id_seq"', 7, true);


--
-- Name: content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."content_id_seq"', 1, false);


--
-- Name: department_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."department_id_seq"', 3, true);


--
-- Name: division_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."division_id_seq"', 1, false);


--
-- Name: documentCategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."documentCategory_id_seq"', 3, true);


--
-- Name: documentItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."documentItem_id_seq"', 3, true);


--
-- Name: eventRegistration_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."eventRegistration_id_seq"', 1, false);


--
-- Name: event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."event_id_seq"', 1, false);


--
-- Name: literatureCategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."literatureCategory_id_seq"', 8, true);


--
-- Name: literatureItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."literatureItem_id_seq"', 1, true);


--
-- Name: memberApplication_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."memberApplication_id_seq"', 1, false);


--
-- Name: merchandise_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."merchandise_id_seq"', 1, false);


--
-- Name: partner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."partner_id_seq"', 1, false);


--
-- Name: pptModule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."pptModule_id_seq"', 1, true);


--
-- Name: pptSlide_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."pptSlide_id_seq"', 5, true);


--
-- Name: quizQuestion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."quizQuestion_id_seq"', 4, true);


--
-- Name: quizSubmission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."quizSubmission_id_seq"', 14, true);


--
-- Name: quiz_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."quiz_id_seq"', 1, true);


--
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."role_id_seq"', 5, true);


--
-- Name: shortlink_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."shortlink_id_seq"', 2, true);


--
-- Name: systemSetting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."systemSetting_id_seq"', 1, false);


--
-- Name: taskSubmission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."taskSubmission_id_seq"', 7, true);


--
-- Name: task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."task_id_seq"', 3, true);


--
-- Name: testimonial_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."testimonial_id_seq"', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."user_id_seq"', 9, true);


--
-- Name: xpTransaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."xpTransaction_id_seq"', 20, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict 4d75oZOnl7T1DEXfbRuaWQCPMGKExTsp0jzZNfDdK8PLiWkMdk1Zbs6ym9hw8D1

RESET ALL;
