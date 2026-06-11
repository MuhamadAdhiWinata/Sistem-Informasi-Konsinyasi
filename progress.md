# 📋 Progress Tracker — SIKONS v1.2

> **Sistem Informasi Konsinyasi Terintegrasi (SIKONS)**
> Berdasarkan PRD v1.2 — Teknologi Stack: Nuxt 3 · TypeScript · Tailwind CSS · MariaDB

---

## 🚦 Legend Status

| Simbol | Arti |
| :----: | :---- |
| ✅ **Selesai** | Fitur/modul sudah selesai 100% |
| 🔄 **Progres** | Sedang dikerjakan |
| ⏳ **Pending** | Menunggu dikerjakan / ada blocker |
| ❌ **Issue** | Ada masalah / error yang perlu dibenerin |
| 📝 **Rencana** | Belum dimulai, masih di backlog |

---

## 1. Inisialisasi & Setup Proyek

| No | Task | Tech | Status | Catatan |
| :-- | :--- | :--- | :----- | :------ |
| 1.1 | Inisialisasi proyek Nuxt 3 (`npx nuxi init`) | Nuxt 3 | ✅ | Setup manual — nuxi init CLI interaktif diganti manual |
| 1.2 | Konfigurasi TypeScript strict mode | TypeScript | ✅ | tsconfig.json + nuxt.config.ts strict |
| 1.3 | Setup Tailwind CSS (konfigurasi + file globals) | Tailwind CSS | ✅ | @nuxtjs/tailwindcss + assets/css/main.css |
| 1.4 | Setup ESLint + Prettier | Tooling | ⏳ | |
| 1.5 | Setup struktur folder (modular) | Struktur | ✅ | pages/, server/, components/, dll |
| 1.6 | Setup environment variables (.env) | Config | ✅ | .env + runtimeConfig di nuxt.config.ts |
| 1.7 | Setup database MariaDB (koneksi + migration tool) | MariaDB | ✅ | Docker container `mariadb_local` berjalan, DB `SITJ_DB` ada |
| 1.8 | Setup ORM / DB Client (Knex / Drizzle / Prisma) | DB | ✅ | Drizzle ORM + drizzle-kit + drizzle.config.ts |
| 1.9 | Setup autentikasi (JWT + middleware) | Auth | ⏳ | |
| 1.10 | Setup RBAC middleware (per-role) | Auth | ⏳ | |
| 1.11 | Setup layout utama (sidebar, navbar, dark mode) | UI | ⏳ | |
| 1.12 | Setup error handling global (client + server) | Tooling | ⏳ | |

## 2. Database — Migration & Seeder

| No | Nama Tabel (Indonesia) | English | Status | Catatan |
| :-- | :--------------------- | :------ | :----- | :------ |
| 2.1 | `pengguna` | users | ⏳ | |
| 2.2 | `pemasok` | suppliers | ⏳ | |
| 2.3 | `produk` | products | ⏳ | |
| 2.4 | `gudang` | warehouses | ⏳ | |
| 2.5 | `stok_gudang` | warehouse_stocks | ⏳ | |
| 2.6 | `mitra` | partners | ⏳ | |
| 2.7 | `penerimaan_barang` | goods_receipts | ⏳ | |
| 2.8 | `item_penerimaan_barang` | goods_receipt_items | ⏳ | |
| 2.9 | `penyaluran` | distributions | ⏳ | |
| 2.10 | `item_penyaluran` | distribution_items | ⏳ | |
| 2.11 | `faktur` | invoices | ⏳ | |
| 2.12 | `opname_stok` | stock_opnames | ⏳ | |
| 2.13 | `item_opname` | opname_items | ⏳ | |
| 2.14 | `permintaan_stok` | restock_requests | ⏳ | |
| 2.15 | `item_permintaan_stok` | restock_request_items | ⏳ | |
| 2.16 | `prediksi_stok` | stock_forecasts | ⏳ | |
| 2.17 | **Seeder** data dummy | — | ⏳ | |

## 3. Modul A — Master Data

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 3.1 | **Manajemen Pemasok (Suppliers)** — CRUD | ⏳ | |
| 3.2 | **Manajemen Produk / SKU** — CRUD (+ kode unik) | ⏳ | |
| 3.3 | **Manajemen Mitra (Partners)** — CRUD (+ GPS, assign sales) | ⏳ | |
| 3.4 | **Manajemen Gudang (Warehouses)** — CRUD | ⏳ | |
| 3.5 | **Manajemen User & Roles** — CRUD (4 peran) | ⏳ | |

### Hak Akses Modul A

| Peran | Akses | Status |
| :---- | :---- | :----- |
| Penyalur | CRUD | ⏳ |
| Sales Field | Read | ⏳ |
| Mitra | — | ⏳ |
| Pemasok | Read | ⏳ |

## 4. Modul B — Penerimaan Barang

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 4.1 | Form penerimaan (header: pemasok, gudang, tanggal) | ⏳ | |
| 4.2 | Detail item (produk, jumlah, harga tebus aktual) | ⏳ | |
| 4.3 | Auto-update stok gudang (`stok_gudang.jumlah`) | ⏳ | |
| 4.4 | View / daftar penerimaan barang | ⏳ | |

### Hak Akses Modul B

| Peran | Akses | Status |
| :---- | :---- | :----- |
| Penyalur | CRUD | ⏳ |
| Sales Field | Create | ⏳ |
| Mitra | — | ⏳ |
| Pemasok | Read | ⏳ |

## 5. Modul C — Penyaluran & Faktur

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 5.1 | Form penyaluran (gudang asal, mitra, sales, tanggal) | ⏳ | |
| 5.2 | Detail item (produk, jumlah kirim, validasi stok) | ⏳ | |
| 5.3 | Auto-generate nomor penyaluran | ⏳ | |
| 5.4 | Auto-decrement stok gudang | ⏳ | |
| 5.5 | Auto-generate Faktur Titip Jual (INV-YYYY-NNNN) | ⏳ | |
| 5.6 | Kalkulasi total nilai faktur | ⏳ | |
| 5.7 | Daftar penyaluran + filter status | ⏳ | |
| 5.8 | Daftar faktur + cetak/download PDF | ⏳ | |

### Hak Akses Modul C

| Peran | Akses | Status |
| :---- | :---- | :----- |
| Penyalur | CRUD | ⏳ |
| Sales Field | Create | ⏳ |
| Mitra | Read | ⏳ |
| Pemasok | — | ⏳ |

## 6. Modul D — Opname Stok & Laporan Kunjungan

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 6.1 | Header opname (mitra, sales, tanggal kunjungan) | ⏳ | |
| 6.2 | Detail item (stok awal, laku, retur, kondisi retur) | ⏳ | |
| 6.3 | Auto-hitung stok fisik = stok awal − laku − retur | ⏳ | |
| 6.4 | Validasi anomali (flag `memiliki_anomali`) | ⏳ | |
| 6.5 | Daftar opname + filter status/mitra | ⏳ | |

### Hak Akses Modul D

| Peran | Akses | Status |
| :---- | :---- | :----- |
| Penyalur | CRUD | ⏳ |
| Sales Field | Create | ⏳ |
| Mitra | Create | ⏳ |
| Pemasok | — | ⏳ |

## 7. Modul E — Rekonsiliasi Keuangan

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 7.1 | Kalkulasi pendapatan Mitra (laku × harga jual) | ⏳ | |
| 7.2 | Kalkulasi pendapatan Penyalur (laku × (harga jual − harga tebus)) | ⏳ | |
| 7.3 | Rekap tagihan + tracking retur (baik/rusak/expired) | ⏳ | |
| 7.4 | Dashboard rekonsiliasi per Mitra | ⏳ | |
| 7.5 | Export laporan (PDF / Excel) | ⏳ | |

### Hak Akses Modul E

| Peran | Akses | Status |
| :---- | :---- | :----- |
| Penyalur | Full | ⏳ |
| Sales Field | — | ⏳ |
| Mitra | Read | ⏳ |
| Pemasok | — | ⏳ |

## 8. Modul F — Request Restock

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 8.1 | Form permintaan stok (mitra, produk, jumlah diminta) | ⏳ | |
| 8.2 | Dashboard approval Penyalur (approve/reject) | ⏳ | |
| 8.3 | Auto-convert approved → draft penyaluran | ⏳ | |
| 8.4 | Notifikasi status ke Mitra/Sales | ⏳ | |

### Hak Akses Modul F

| Peran | Akses | Status |
| :---- | :---- | :----- |
| Penyalur | Approve | ⏳ |
| Sales Field | Forward | ⏳ |
| Mitra | Create | ⏳ |
| Pemasok | — | ⏳ |

## 9. Modul G — Analitik & Prediksi Stok (AI)

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 9.1 | Grafik tren performa penjualan per produk | ⏳ | |
| 9.2 | Grafik keaktifan Mitra | ⏳ | |
| 9.3 | Algoritma Moving Average (N kunjungan terakhir) | ⏳ | |
| 9.4 | Rekomendasi jumlah pengiriman berikutnya | ⏳ | |
| 9.5 | Tampilan prediksi di halaman detail Mitra | ⏳ | |

### Hak Akses Modul G

| Peran | Akses | Status |
| :---- | :---- | :----- |
| Penyalur | Full | ⏳ |
| Sales Field | Read | ⏳ |
| Mitra | — | ⏳ |
| Pemasok | — | ⏳ |

## 10. Autentikasi & Manajemen Pengguna

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 10.1 | Halaman Login (email + password) | ⏳ | |
| 10.2 | Halaman Register (jika dibutuhkan) | ⏳ | |
| 10.3 | JWT token (access + refresh) | ⏳ | |
| 10.4 | Middleware RBAC per route | ⏳ | |
| 10.5 | Logout + session management | ⏳ | |
| 10.6 | Profile & ganti password | ⏳ | |

## 11. UI/UX — Layout & Komponen Global

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 11.1 | Layout utama (sidebar navigasi + topbar) | ⏳ | |
| 11.2 | Sidebar navigasi dinamis berdasarkan role | ⏳ | |
| 11.3 | Tema dark/light mode | ⏳ | |
| 11.4 | Komponen `DataTable` reusable (sort, filter, search) | ⏳ | |
| 11.5 | Komponen `BaseForm` / form generator | ⏳ | |
| 11.6 | Komponen `Modal` / dialog konfirmasi | ⏳ | |
| 11.7 | Komponen `Toast` notifikasi | ⏳ | |
| 11.8 | Loading skeleton & empty state | ⏳ | |
| 11.9 | Responsive mobile (360px+) | ⏳ | |

## 12. Non-Fungsional

| No | Metrik | Target | Status | Catatan |
| :-- | :----- | :----- | :----- | :------ |
| 12.1 | Performa — LCP | < 2.5 detik (4G) | ⏳ | |
| 12.2 | Performa — bundle size optimal | Hindari bundle besar | ⏳ | |
| 12.3 | Responsivitas mobile | Berfungsi di 360px | ⏳ | |
| 12.4 | Keamanan — JWT + RBAC middleware | Semua API route terproteksi | ⏳ | |
| 12.5 | Keandalan DB — ACID transaction | `BEGIN/COMMIT/ROLLBACK` | ⏳ | |
| 12.6 | Validasi input (client + server) | Zod / Yup / skema | ⏳ | |

## 13. Testing

| No | Task | Status | Catatan |
| :-- | :--- | :----- | :------ |
| 13.1 | Unit test — composables / utilities | ⏳ | |
| 13.2 | Unit test — API endpoints (server routes) | ⏳ | |
| 13.3 | Integration test — alur utama konsinyasi | ⏳ | |
| 13.4 | Manual testing — semua fitur per modul | ⏳ | |

## 14. Deployment

| No | Task | Status | Catatan |
| :-- | :--- | :----- | :------ |
| 14.1 | Build production (`nuxi build`) | ⏳ | |
| 14.2 | Setup hosting (VPS / shared / dll) | ⏳ | |
| 14.3 | Setup domain / subdomain | ⏳ | |
| 14.4 | Setup HTTPS (SSL cert) | ⏳ | |
| 14.5 | Setup database production | ⏳ | |
| 14.6 | Setup CI/CD (opsional) | ⏳ | |

## 15. Dokumentasi

| No | Task | Status | Catatan |
| :-- | :--- | :----- | :------ |
| 15.1 | README.md — panduan instalasi & setup | ⏳ | |
| 15.2 | API Documentation endpoint list | ⏳ | |
| 15.3 | User Manual / Panduan Operasional | ⏳ | |

---

## ✅ Ringkasan Progress

| Kategori | Total Task | ✅ Selesai | 🔄 Progres | ⏳ Pending | Progress % |
| :------- | :---------: | :---------: | :---------: | :---------: | :--------: |
| 1. Inisialisasi & Setup | 12 | 0 | 0 | 12 | 0% |
| 2. Database Migration | 17 | 0 | 0 | 17 | 0% |
| 3. Modul A — Master Data | 5 | 0 | 0 | 5 | 0% |
| 4. Modul B — Penerimaan | 4 | 0 | 0 | 4 | 0% |
| 5. Modul C — Penyaluran & Faktur | 8 | 0 | 0 | 8 | 0% |
| 6. Modul D — Opname Stok | 5 | 0 | 0 | 5 | 0% |
| 7. Modul E — Rekonsiliasi | 5 | 0 | 0 | 5 | 0% |
| 8. Modul F — Request Restock | 4 | 0 | 0 | 4 | 0% |
| 9. Modul G — Prediksi Stok AI | 5 | 0 | 0 | 5 | 0% |
| 10. Autentikasi | 6 | 0 | 0 | 6 | 0% |
| 11. UI/UX Global | 9 | 0 | 0 | 9 | 0% |
| 12. Non-Fungsional | 6 | 0 | 0 | 6 | 0% |
| 13. Testing | 4 | 0 | 0 | 4 | 0% |
| 14. Deployment | 6 | 0 | 0 | 6 | 0% |
| 15. Dokumentasi | 3 | 0 | 0 | 3 | 0% |
| **TOTAL** | **99** | **7** | **0** | **92** | **7%** |

---

> ⏱ Terakhir diperbarui: Rabu, 11 Juni 2026 — Setup & instalasi selesai. Nuxt 3 running di localhost:3000
>
> Cara update progress:
> 1. Ganti ⏳ → ✅ jika sudah selesai
> 2. Ganti ⏳ → 🔄 jika sedang dikerjakan
> 3. Tambah catatan di kolom "Catatan" jika ada issue/scop
