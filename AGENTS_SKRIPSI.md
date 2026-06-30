# Panduan AI untuk Menulis Skripsi SIKONS

> File ini adalah panduan wajib bagi AI agent (ChatGPT, Claude, Gemini, dll) yang membantu proses penulisan skripsi SIKONS.
> Baca file ini SEBELUM menulis bab apapun. Ikuti semua aturan tanpa pengecualian.

---

## 1. Identitas Skripsi

| Properti | Nilai |
|:---------|:------|
| **Judul** | Rancang Bangun Sistem Informasi Konsinyasi (SIKONS) Berbasis Web menggunakan Framework Nuxt 3 |
| **Nama Sistem** | SIKONS — Sistem Informasi Konsinyasi |
| **Jenis** | Skripsi / Karya Ilmiah |
| **PRD** | `PRD_SIKONS_v1.2.md` |
| **Progress Skripsi** | `progress-skripsi.md` |
| **Referensi** | `REFRENSI.md` |

---

## 2. Struktur Penulisan Skripsi

| Bab | Judul | Sub-Bab Utama |
|:----|:------|:--------------|
| **BAB 1** | Pendahuluan | 1.1 Latar Belakang, 1.2 Rumusan Masalah, 1.3 Batasan Masalah, 1.4 Tujuan Penelitian, 1.5 Manfaat Penelitian |
| **BAB 2** | Tinjauan Pustaka | 2.1 Landasan Teori, 2.2 Penelitian Terkait, 2.3 Kerangka Berpikir |
| **BAB 3** | Metode Penelitian | 3.1 Metode Pengembangan Sistem, 3.2 Alat dan Bahan, 3.3 Prosedur Penelitian |
| **BAB 4** | Hasil dan Pembahasan | 4.1 Implementasi Sistem, 4.2 Tampilan Antarmuka, 4.3 Hasil Pengujian |
| **BAB 5** | Penutup | 5.1 Kesimpulan, 5.2 Saran |

---

## 3. Data Teknis Proyek

### 3.1 Tech Stack

| Layer | Teknologi | Versi |
|:------|:-----------|:------|
| **Frontend Framework** | Nuxt 3 (Vue 3) | ^3.16 |
| **Bahasa Pemrograman** | TypeScript | Strict mode |
| **UI Library** | Nuxt UI (@nuxt/ui) | ^2.x |
| **Styling** | Tailwind CSS | Latest |
| **Database** | MariaDB | 10.10 |
| **ORM** | Drizzle ORM | ^0.40 |
| **Validasi** | Zod | ^3.24 |
| **Autentikasi** | JWT (jsonwebtoken + bcryptjs) | — |
| **Package Manager** | pnpm | 10.x |

### 3.2 Modul Aplikasi

| Modul | Nama | Fitur Utama |
|:------|:-----|:------------|
| A | Master Data | CRUD Pemasok, Produk, Mitra, Gudang, User |
| B | Penerimaan Barang | Catat barang masuk, workflow draft→completed, auto-update stok gudang |
| C | Penyaluran & Faktur | Distribusi ke mitra, auto-generate faktur (INV-YYYY-NNNN), workflow draft→sent→received |
| D | Opname Stok | Kunjungan lapangan, input laku/retur, auto-hitung stok fisik, deteksi anomali |
| E | Rekonsiliasi Keuangan | Three-tier pricing (pabrik→grosir→retail), split view Penyalur & Mitra |
| F | Request Restock | Permintaan tambah stok, approval Penyalur, auto-convert ke penyaluran |

### 3.3 Tabel Database (15 tabel aktif)

1. `pengguna` (users)
2. `pemasok` (suppliers)
3. `produk` (products) — dengan SKU unik, tiga tingkat harga
4. `gudang` (warehouses)
5. `stok_gudang` (warehouse_stocks)
6. `mitra` (partners) — dengan koordinat GPS, assign sales
7. `penerimaan_barang` (goods_receipts) — workflow draft→completed
8. `item_penerimaan_barang` (goods_receipt_items)
9. `penyaluran` (distributions) — workflow draft→sent→received
10. `item_penyaluran` (distribution_items) — snapshot harga
11. `faktur` (invoices) — auto-generated
12. `opname_stok` (stock_opnames) — dengan flag anomali
13. `item_opname` (opname_items) — stok awal, laku, retur, stok fisik
14. `permintaan_stok` (restock_requests)
15. `item_permintaan_stok` (restock_request_items)

> Detail skema ada di `PRD_SIKONS_v1.2.md` bagian 6.2

### 3.4 Peran Pengguna

| Peran | Kode | Hak Akses |
|:------|:-----|:----------|
| Admin/Penyalur | `penyalur` | Full access semua modul |
| Sales Field | `sales` | Create opname & penyaluran, read master data |
| Mitra (Warung) | `mitra` | Input laku/retur, request restock |
| Pemasok (Pabrikan) | `pemasok` | Read-only laporan performa produk |

---

## 4. Metode Penelitian

| Aspek | Detail |
|:------|:--------|
| **Metode Pengembangan** | Waterfall (sistematis dan sekuensial) |
| **Tahapan** | Analisis Kebutuhan → Desain Sistem → Implementasi → Pengujian → Pemeliharaan |
| **Metode Pengujian** | Black Box Testing |
| **Tools Pengujian** | Browser testing manual |

---

## 5. Aturan Penulisan

### Wajib:
1. Gunakan Bahasa Indonesia formal (EYD)
2. Setiap klaim/fakta harus bersitasi (APA 7th)
3. Gunakan referensi dari `REFRENSI.md`
4. Format sitasi: (Penulis, Tahun) atau Penulis (Tahun)
5. Update `progress-skripsi.md` setiap bab selesai
6. Setelah menulis bab, beri summary perubahan di akhir

### Dilarang:
1. Klaim tanpa sumber referensi
2. Plagiarisme — tulis ulang dengan bahasa sendiri
3. Mengubah data teknis proyek (stack, tabel, fitur)
4. Menambahkan fitur yang tidak ada di PRD/codebase
5. Menggunakan kata "saya" — ganti "penulis" atau "peneliti"

---

## 6. Cara Meminta Bantuan

| Permintaan | Contoh Prompt |
|:-----------|:--------------|
| Buat BAB | "Buat bab 1 pendahuluan lengkap" |
| Revisi BAB | "Revisi bab 3 metode penelitian, tambah detail pengujian" |
| Tambah sub-bab | "Tambah sub-bab arsitektur sistem di bab 3" |
| Buat tabel | "Buat tabel perbandingan 3 penelitian terkait" |
| Sitasi | "Beri sitasi APA untuk kalimat tentang e-commerce" |

> AI akan membaca `AGENTS_SKRIPSI.md`, `REFRENSI.md`, dan `PRD_SIKONS_v1.2.md` sebelum menulis.

---

## 7. Istilah Penting

| Istilah | Arti |
|:--------|:------|
| Konsinyasi | Titip jual — barang dititipkan ke mitra, bayar setelah laku |
| SKU | Stock Keeping Unit — kode unik produk |
| RBAC | Role-Based Access Control |
| JWT | JSON Web Token — token autentikasi |
| Three-tier pricing | Harga 3 tingkat: pabrik → grosir → retail |
| Opname Stok | Pencocokan stok fisik dengan catatan sistem |
| Waterfall | Metode pengembangan linier sekuensial |
| Black Box Testing | Pengujian fungsional tanpa melihat struktur internal kode |

---

*AGENTS_SKRIPSI.md harus dibaca AI di awal setiap sesi penulisan.*
