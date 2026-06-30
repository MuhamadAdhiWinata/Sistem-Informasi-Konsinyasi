# BAB 1 — PENDAHULUAN

---

## 1.1 Latar Belakang

Transformasi digital mendorong pelaku usaha beralih dari pencatatan manual ke sistem informasi guna meningkatkan efisiensi dan akurasi operasional (Fauzan & Noprisson, 2020). UMKM, yang berkontribusi lebih dari 60% terhadap PDB nasional dan menyerap 97% tenaga kerja, banyak menjalankan model konsinyasi (titip jual) — skema penitipan barang dari pemasok ke pengecer dengan pembayaran setelah barang terjual. Namun, di PT XYZ — objek penelitian ini — praktik pencatatan titip jual masih dilakukan secara manual menggunakan buku atau spreadsheet. Hal ini sejalan dengan temuan Ajeng Aditya Putri (2024) yang menunjukkan bahwa UMKM masih mencatat transaksi secara manual sehingga menimbulkan berbagai masalah: risiko kehilangan data, ketidakmampuan memantau stok secara real-time, rekonsiliasi keuangan yang lambat, serta keterlambatan pengambilan keputusan.

Penelitian terdahulu menunjukkan bahwa sistem informasi berbasis web mampu mengatasi permasalahan tersebut. Bantang dan Nugroho (2023) merancang sistem pengelolaan barang menggunakan Nuxt JS yang meningkatkan efisiensi dan mengurangi kesalahan data. Febyanti (2025) membuktikan bahwa sistem informasi akuntansi mempercepat proses kerja dan meminimalisir kesalahan administrasi. Studi lain tentang sistem informasi jasa titip barang ekspor-impor juga menunjukkan peningkatan efektivitas operasional (Repository Universitas Nurul Fikri, 2020). Meskipun demikian, penelitian-penelitian tersebut masih berfokus pada aspek parsial dan belum ada yang merancang sistem informasi konsinyasi terintegrasi yang mencakup seluruh alur bisnis dari penerimaan barang, distribusi, opname stok, hingga rekonsiliasi keuangan dengan struktur harga tiga tingkat (pabrik, grosir, retail).

Penelitian ini bertujuan merancang dan membangun Sistem Informasi Konsinyasi (SIKONS) berbasis web menggunakan Nuxt 3. Sistem mencakup enam modul utama: Master Data, Penerimaan Barang, Penyaluran dan Faktur, Opname Stok, Rekonsiliasi Keuangan, serta Request Restock. Pengembangan menggunakan metode Waterfall dengan pengujian Black Box Testing (Setiyani, 2019). Teknologi yang digunakan meliputi Nuxt 3, TypeScript, MariaDB, Drizzle ORM, serta RBAC untuk empat peran pengguna: Penyalur, Sales Field, Mitra, dan Pemasok. SIKONS diharapkan menjadi solusi digital komprehensif yang meningkatkan efisiensi, akurasi, dan transparansi pada sektor distribusi konsinyasi di Indonesia.

---

## 1.2 Rumusan Masalah

Berdasarkan latar belakang yang telah diuraikan, maka rumusan masalah dalam penelitian ini adalah sebagai berikut:

1. Bagaimana merancang dan membangun Sistem Informasi Konsinyasi (SIKONS) berbasis web yang mencakup modul master data, penerimaan barang, penyaluran dan faktur, opname stok, rekonsiliasi keuangan, serta request restock?
2. Bagaimana menerapkan alur bisnis konsinyasi ke dalam sistem dengan workflow yang mencakup proses penerimaan barang dari pemasok, distribusi ke mitra, pencatatan opname stok, hingga rekonsiliasi keuangan?
3. Bagaimana mengintegrasikan sistem Role-Based Access Control (RBAC) dengan empat peran pengguna (Penyalur, Sales Field, Mitra, dan Pemasok) dalam satu platform?
4. Bagaimana performa sistem berdasarkan pengujian Black Box Testing pada seluruh modul fungsional?

---

## 1.3 Ruang Lingkup

Ruang lingkup penelitian ini meliputi:

1. Objek Penelitian: Sistem Informasi Konsinyasi (SIKONS) — sebuah platform berbasis web yang menangani seluruh siklus bisnis konsinyasi mulai dari master data, penerimaan barang, penyaluran, opname stok, rekonsiliasi keuangan, hingga request restock.
2. Model Pengembangan: Waterfall dengan tahapan analisis kebutuhan, desain sistem, implementasi, dan pengujian.
3. Metode Pengujian: Black Box Testing yang berfokus pada pengujian fungsionalitas antarmuka pengguna dan API tanpa menguji struktur internal kode.
4. Platform Sistem: Berbasis web (web application) yang diakses melalui peramban desktop dan mobile.
5. Arsitektur Sistem: Monolitik dengan pemisahan frontend dan backend dalam satu kesatuan proyek Nuxt 3, server-side rendering pada halaman tertentu, serta RESTful API untuk komunikasi data.
6. Teknologi Utama: Nuxt 3 sebagai framework utama, TypeScript untuk type-safety, MariaDB sebagai basis data relasional, Drizzle ORM untuk interaksi basis data, JWT untuk autentikasi, Zod untuk validasi data, serta Nuxt UI dan Tailwind CSS untuk antarmuka.
7. Entitas Data: Lima belas tabel basis data yang mencakup pengguna, pemasok, produk, gudang, stok gudang, mitra, penerimaan barang, item penerimaan, penyaluran, item penyaluran, faktur, opname stok, item opname, permintaan stok, dan item permintaan stok.
8. Peran Pengguna: Empat peran dengan hierarki akses berbeda — Penyalur (full access), Sales Field (create opname dan penyaluran), Mitra (input laku/retur dan request restock), serta Pemasok (read-only laporan).
9. Alur Bisnis Utama: Penerimaan barang dari pemasok (draft → completed), penyaluran ke mitra (draft → sent → received), opname stok di lapangan (draft → submitted → verified), rekonsiliasi keuangan dengan struktur harga tiga tingkat (pabrik, grosir, retail), dan permintaan restok (pending → approved/rejected).
10. Variabel Pengujian: Fungsionalitas CRUD setiap modul, validasi workflow status, perhitungan otomatis (stok fisik, total faktur, pendapatan), deteksi anomali stok, serta pembatasan akses berdasarkan peran pengguna.

---

## 1.4 Tujuan Penelitian

Tujuan penelitian ini adalah:

1. Menghasilkan Sistem Informasi Konsinyasi (SIKONS) berbasis web yang mencakup enam modul fungsional — Master Data, Penerimaan Barang, Penyaluran dan Faktur, Opname Stok, Rekonsiliasi Keuangan, serta Request Restock.
2. Mengintegrasikan enam modul tersebut ke dalam satu platform dengan alur data yang saling terhubung, sehingga data penerimaan barang, penyaluran, opname, dan rekonsiliasi dapat diakses secara real-time.
3. Mengimplementasikan Role-Based Access Control (RBAC) untuk mengatur hak akses empat peran pengguna — Penyalur, Sales Field, Mitra, dan Pemasok — pada setiap fitur sistem.
4. Memvalidasi seluruh fungsionalitas sistem melalui Black Box Testing yang mencakup pengujian CRUD, workflow status, perhitungan otomatis, deteksi anomali, serta pembatasan akses antar peran.

---

## 1.5 Manfaat Penelitian

Manfaat yang diharapkan dari penelitian ini adalah sebagai berikut:

### 1.5.1 Bagi Pengembangan Ilmu Pengetahuan dan Teknologi

1. Menjadi referensi penerapan Nuxt 3 dan Drizzle ORM pada sistem informasi manajemen distribusi dan konsinyasi.
2. Mendokumentasikan integrasi enam modul bisnis konsinyasi (master data, penerimaan barang, penyaluran, opname stok, rekonsiliasi keuangan, dan request restock) dalam satu platform.
3. Menjadi acuan akademik bagi penelitian serupa yang menggunakan metode Waterfall dan Black Box Testing.

### 1.5.2 Bagi Pertimbangan Pengambilan Kebijakan

1. Menyediakan gambaran teknis dan operasional bagi pelaku usaha distribusi dalam merencanakan digitalisasi proses bisnis konsinyasi.
2. Menjadi referensi bagi instansi terkait dalam menyusun kebijakan digitalisasi UMKM sektor distribusi.

### 1.5.3 Bagi Kepentingan Profesi

1. Bagi Penyalur: memantau stok real-time, mengotomatiskan faktur, dan mempercepat rekonsiliasi keuangan dengan laporan tiga tingkat harga.
2. Bagi Sales Field: mencatat opname stok dan laporan kunjungan langsung dari perangkat mobile.
3. Bagi Mitra: melaporkan barang laku dan retur serta mengajukan restok secara mandiri.
4. Bagi Pemasok: memantau performa penjualan produk secara transparan.

### 1.5.4 Bagi Masyarakat pada Umumnya

1. Meningkatkan efisiensi distribusi barang sehingga produk lebih tersedia di warung dan toko kelontong.
2. Mendukung UMKM sektor perdagangan dengan sistem informasi berbasis web yang mudah diakses.
3. Memberikan wawasan tentang pemanfaatan teknologi informasi untuk meningkatkan produktivitas usaha kecil dan menengah.

---

## 1.6 Sistematika Penulisan

Penelitian ini disusun dalam lima bab yang saling terkait secara sistematis. Berikut merupakan gambaran umum dari masing-masing bab.

Bab 1 Pendahuluan berisi latar belakang masalah yang mendasari penelitian, rumusan masalah, ruang lingkup, tujuan dan manfaat penelitian, serta sistematika penulisan. Bab ini memberikan gambaran umum mengenai urgensi dilakukannya penelitian dan arah pembahasan secara keseluruhan.

Bab 2 Tinjauan Pustaka menguraikan landasan teori yang digunakan dalam penelitian, mencakup konsep dasar sistem informasi, model bisnis konsinyasi, framework Nuxt 3, basis data MariaDB, serta metode pengembangan Waterfall dan Black Box Testing. Bab ini juga membahas penelitian-penelitian terdahulu yang relevan sebagai bahan perbandingan dan acuan.

Bab 3 Metode Penelitian menjelaskan tahapan penelitian yang dilakukan secara sistematis. Uraian meliputi metode pengembangan sistem yang digunakan, alat dan bahan yang mendukung penelitian, serta prosedur atau langkah-langkah penelitian dari awal hingga akhir termasuk teknik pengujian yang diterapkan.

Bab 4 Hasil dan Pembahasan menyajikan implementasi dari sistem yang telah dibangun. Bab ini menjelaskan hasil perancangan sistem, tampilan antarmuka setiap modul, serta hasil pengujian Black Box Testing yang dilakukan untuk memvalidasi fungsionalitas sistem secara keseluruhan.

Bab 5 Penutup berisi kesimpulan dari seluruh rangkaian penelitian dan saran yang ditujukan bagi pengembangan sistem lebih lanjut maupun bagi peneliti selanjutnya yang ingin mengangkat topik serupa.

---

**Daftar Pustaka (sementara)**

Bantang, T. S., & Nugroho, A. (2023). Rancang bangun sistem informasi pengelolaan barang berbasis web menggunakan framework Nuxt JS. *Jurnal Inovtek Polbeng Seri Informatika*, *8*(1), 55–65.

Fauzan, E., & Noprisson, H. (2020). Analisa & perancangan aplikasi e-commerce jasa titip oleh-oleh produk tradisional. *Jurnal Ilmu Teknik Dan Komputer*, *4*(2), 135–145.

Febyanti, A. (2025). Peran sistem informasi akuntansi dalam rangka meningkatkan kinerja karyawan divisi purchasing di PT Semen Indonesia Distributor. *Jurnal Ekonomi, Koperasi & Kewirausahaan*, *14*(1), 45–58.

Implementasi sistem informasi pemasaran berbasis web dalam kegiatan jasa titip barang ekspor impor pada bisnis Tourgether.in. (2020). *Repository Universitas Nurul Fikri*.

Putri, A. A. (2024). Perancangan sistem pencatatan transaksi dan pelaporan keuangan menggunakan Google Spreadsheet (Studi Kasus Percetakan Tunas Karya) [D4 thesis, Politeknik Negeri Jakarta]. Repository Politeknik Negeri Jakarta.

Setiyani, L. (2019). Pengujian sistem informasi inventory pada perusahaan distributor farmasi menggunakan metode black box testing. *Techno Xplore: Jurnal Ilmu Komputer dan Teknologi Informasi*, *4*(1), 30–38.
