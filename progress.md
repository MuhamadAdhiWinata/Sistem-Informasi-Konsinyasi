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
| 1.3 | Setup Tailwind CSS (konfigurasi + file globals) | Tailwind CSS | ✅ | @nuxt/ui (includes tailwindcss) + assets/css/main.css |
| 1.4 | Setup ESLint + Prettier | Tooling | ⏳ | |
| 1.5 | Setup struktur folder (modular) | Struktur | ✅ | pages/, server/, components/, dll |
| 1.6 | Setup environment variables (.env) | Config | ✅ | .env + runtimeConfig di nuxt.config.ts |
| 1.7 | Setup database MariaDB (koneksi + migration tool) | MariaDB | ✅ | Docker container `mariadb_local` berjalan, DB `SITJ_DB` ada |
| 1.8 | Setup ORM / DB Client (Knex / Drizzle / Prisma) | DB | ✅ | Drizzle ORM + drizzle-kit + drizzle.config.ts |
| 1.9 | Setup autentikasi (JWT + middleware) | Auth | ✅ | jsonwebtoken + bcryptjs installed |
| 1.10 | Setup RBAC middleware (per-role) | Auth | ✅ | server/middleware/auth.ts + server/utils/rbac.ts |
| 1.11 | Setup layout utama (sidebar, navbar, dark mode) | UI | ✅ | Fixed sidebar, AppTopbar, dark mode toggle, user dropdown |
| 1.12 | Setup error handling global (client + server) | Tooling | ⏳ | |

## 2. Database — Migration & Seeder

| No | Nama Tabel (Indonesia) | English | Status | Catatan |
| :-- | :--------------------- | :------ | :----- | :------ |
| 2.1 | `pengguna` | users | ✅ | Schema created |
| 2.2 | `pemasok` | suppliers | ✅ | Schema created |
| 2.3 | `produk` | products | ✅ | Schema created |
| 2.4 | `gudang` | warehouses | ✅ | Schema created |
| 2.5 | `stok_gudang` | warehouse_stocks | ✅ | Schema created |
| 2.6 | `mitra` | partners | ✅ | Schema created |
| 2.7 | `penerimaan_barang` | goods_receipts | ✅ | Schema created |
| 2.8 | `item_penerimaan_barang` | goods_receipt_items | ✅ | Schema created |
| 2.9 | `penyaluran` | distributions | ✅ | Schema created |
| 2.10 | `item_penyaluran` | distribution_items | ✅ | Schema created |
| 2.11 | `faktur` | invoices | ✅ | Schema created |
| 2.12 | `opname_stok` | stock_opnames | ✅ | Schema created |
| 2.13 | `item_opname` | opname_items | ✅ | Schema created |
| 2.14 | `permintaan_stok` | restock_requests | ✅ | Schema created |
| 2.15 | `item_permintaan_stok` | restock_request_items | ✅ | Schema created |
| 2.16 | `prediksi_stok` | stock_forecasts | ✅ | Schema created |
| 2.17 | **Seeder** data dummy | — | ✅ | Basic dummy data seeded |

## 3. Modul A — Master Data

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 3.1 | **Manajemen Pemasok (Suppliers)** — CRUD | ✅ | Backend API + Frontend pages with @nuxt/ui |
| 3.2 | **Manajemen Produk / SKU** — CRUD (+ kode unik) | ✅ | Backend API + Frontend pages with pemasok select |
| 3.3 | **Manajemen Mitra (Partners)** — CRUD (+ GPS, assign sales) | ✅ | Backend API + Frontend pages with sales select |
| 3.4 | **Manajemen Gudang (Warehouses)** — CRUD | ✅ | Backend API + Frontend pages |
| 3.5 | **Manajemen User & Roles** — CRUD (4 peran) | ✅ | Backend API + Frontend pages (excl. password hash exposure) |

| 3.6 | **Lihat Stok Gudang** — pantau stok per gudang | ✅ | `pages/stok-gudang/index.vue` + `GET /api/stok-gudang` |

### Hak Akses Modul A

| Peran | Akses | Status |
| :---- | :---- | :----- |
| Penyalur | CRUD | ✅ |
| Sales Field | Read | ✅ |
| Mitra | — | ⏳ |
| Pemasok | Read | ✅ |

## 4. Modul B — Penerimaan Barang

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 4.1 | Form penerimaan (header: pemasok, gudang, tanggal) | ✅ | pages/penerimaan-barang/create.vue |
| 4.2 | Detail item (produk, jumlah, harga tebus aktual) | ✅ | Dynamic items table in create form |
| 4.3 | Auto-update stok gudang (`stok_gudang.jumlah`) | ✅ | Stok hanya bertambah saat konfirmasi (completed), bukan saat draft |
| 4.4 | View / daftar penerimaan barang | ✅ | pages/penerimaan-barang/index.vue + [id].vue + edit/[id].vue |
| 4.5 | Cetak Surat Jalan Penerimaan | ✅ | `pages/penerimaan-barang/[id]/print.vue` |
| 4.6 | Status & Konfirmasi Penerimaan (draft → completed) | ✅ | Kolom `status` + PATCH confirm + stok gudang bertambah |
| 4.7 | Edit penerimaan (draft only) | ✅ | PUT API + pages/penerimaan-barang/edit/[id].vue |
| 4.8 | Hapus penerimaan (draft only) | ✅ | DELETE API + modal konfirmasi di list & detail |

### Hak Akses Modul B

| Peran | Akses | Status |
| :---- | :---- | :----- |
| Penyalur | CRUD | ✅ |
| Sales Field | Create | ✅ |
| Mitra | — | ⏳ |
| Pemasok | Read | ⏳ |

## 5. Modul C — Penyaluran & Faktur

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 5.1 | Form penyaluran (gudang asal, mitra, sales, tanggal) | ✅ | pages/penyaluran/create.vue |
| 5.2 | Detail item (produk, jumlah kirim, validasi stok) | ✅ | Dynamic items table + stok validation in transaction |
| 5.3 | Auto-generate nomor penyaluran | ✅ | DEL-YYYYMMDD-NNNN in POST API |
| 5.4 | Auto-decrement stok gudang | ✅ | Stok hanya berkurang saat konfirmasi (sent), bukan saat draft |
| 5.5 | Auto-generate Faktur Titip Jual (INV-YYYY-NNNN) | ✅ | Auto-created in POST API |
| 5.6 | Kalkulasi total nilai faktur | ✅ | jumlahDikirim × snapshotHargaJual per item |
| 5.7 | Daftar penyaluran + filter status | ✅ | pages/penyaluran/index.vue |
| 5.8 | Tampilkan stok tersedia saat input item penyaluran | ✅ | Kolom "Stok: XX" muncul di form create saat pilih produk |
| 5.9 | Daftar faktur + cetak/download PDF | ✅ | `pages/faktur/index.vue`, `pages/penyaluran/[id]/print.vue` + `html2pdf.js` |
| 5.10 | Edit penyaluran (draft only) | ✅ | PUT API + pages/penyaluran/[id]/edit.vue |
| 5.11 | Hapus penyaluran (draft only) | ✅ | DELETE API + modal konfirmasi di list & detail |

### Hak Akses Modul C

| Peran | Akses | Status |
| :---- | :---- | :----- |
| Penyalur | CRUD | ✅ |
| Sales Field | Create | ✅ |
| Mitra | Read | ⏳ |
| Pemasok | — | ⏳ |

## 6. Modul D — Opname Stok & Laporan Kunjungan

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 6.1 | Header opname (mitra, sales, tanggal kunjungan) | ✅ | pages/opname-stok/create.vue |
| 6.2 | Detail item (stok awal, laku, retur, kondisi retur) | ✅ | Dynamic items table with live preview |
| 6.3 | Auto-hitung stok fisik = stok awal − laku − retur | ✅ | Live calc in form + server-side |
| 6.4 | Validasi anomali (flag `memiliki_anomali`) | ✅ | Auto-detect: stok fisik < 0 → anomaly flag |
| 6.5 | Daftar opname + filter status/mitra | ✅ | pages/opname-stok/index.vue |

### Hak Akses Modul D

| Peran | Akses | Status |
| :---- | :---- | :----- |
| Penyalur | CRUD | ✅ |
| Sales Field | Create | ✅ |
| Mitra | Create | ✅ |
| Pemasok | — | ⏳ |

## 7. Modul E — Rekonsiliasi Keuangan

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 7.1 | Kalkulasi pendapatan Mitra = laku × (harga retail − harga grosir) | ✅ | SQL aggregation di API |
| 7.2 | Kalkulasi pendapatan Penyalur = laku × (harga grosir − harga pabrik) | ✅ | SQL aggregation di API |
| 7.3 | Rekap tagihan + tracking retur (baik/rusak/expired) | ✅ | Retur breakdown per kondisi |
| 7.4 | Dashboard Rekonsiliasi Penyalur — full three-tier pricing | ✅ | pages/rekonsiliasi-penyalur/ — harga pabrik, grosir, retail + margin/unit & ×qty |
| 7.5 | Dashboard Rekonsiliasi Mitra — simplified, no penyalur profit | ✅ | pages/rekonsiliasi-mitra/ — hanya laba mitra, tanpa harga pabrik/laba penyalur |
| 7.6 | Export laporan (CSV) + Cetak per view | ✅ | Export CSV + window.print() per masing-masing view |

### Hak Akses Modul E

| Peran | Akses | Status |
| :---- | :---- | :----- |
| Penyalur | Full (Rekonsiliasi Penyalur) | ✅ |
| Sales Field | — | ⏳ |
| Mitra | Read-only (Rekonsiliasi Mitra) | ✅ |
| Pemasok | — | ⏳ |

## 8. Modul F — Request Restock

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 8.1 | Form permintaan stok (mitra, produk, jumlah diminta) | ✅ | pages/permintaan-stok/create.vue |
| 8.2 | Dashboard approval Penyalur (approve/reject) | ✅ | pages/permintaan-stok/[id].vue + PATCH API |
| 8.3 | Auto-convert approved → draft penyaluran | ✅ | Transaksi: approve → create penyaluran + faktur + update stok |
| 8.4 | Notifikasi status ke Mitra/Sales | ⏳ | Pending — perlu real-time notification system |

### Hak Akses Modul F

| Peran | Akses | Status |
| :---- | :---- | :----- |
| Penyalur | Approve | ✅ |
| Sales Field | Forward | ⏳ |
| Mitra | Create | ✅ |
| Pemasok | — | ⏳ |

## 9. Modul G — Analitik & Prediksi Stok (AI)

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 9.1 | Grafik tren performa penjualan per produk | ⏳ | Pending — butuh chart library |
| 9.2 | Grafik keaktifan Mitra | ⏳ | Pending — butuh chart library |
| 9.3 | Algoritma Moving Average (N kunjungan terakhir) | ✅ | Server-side dengan N=4 default |
| 9.4 | Rekomendasi jumlah pengiriman berikutnya | ✅ | Math.ceil(rata-rata) prediksi |
| 9.5 | Tampilan prediksi di halaman detail Mitra | ✅ | pages/prediksi-stok + grouped by mitra |

### Hak Akses Modul G

| Peran | Akses | Status |
| :---- | :---- | :----- |
| Penyalur | Full | ✅ |
| Sales Field | Read | ⏳ |
| Mitra | — | ⏳ |
| Pemasok | — | ⏳ |

## 10. Autentikasi & Manajemen Pengguna

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 10.1 | Halaman Login (email + password) | ✅ | pages/auth/login.vue glassmorphism |
| 10.2 | Halaman Register (jika dibutuhkan) | ⏳ | |
| 10.3 | JWT token (access + refresh) | ✅ | Access token generated via util |
| 10.4 | Middleware RBAC per route | ✅ | Middleware checks token |
| 10.5 | Logout + session management | ✅ | Sidebar logout + composable |
| 10.6 | Profile & ganti password | ⏳ | |

## 11. UI/UX — Layout & Komponen Global

| No | Fitur | Status | Catatan |
| :-- | :---- | :----- | :------ |
| 11.1 | Layout utama (sidebar navigasi + topbar) | ✅ | Fixed sidebar + AppTopbar + mobile hamburger |
| 11.2 | Sidebar navigasi dinamis berdasarkan role | ⏳ | |
| 11.3 | Tema dark/light mode | ✅ | Tailwind dark mode with toggle |
| 11.4 | Komponen `DataTable` reusable (sort, filter, search) | ✅ | Menggunakan `<UTable>` dari `@nuxt/ui` |
| 11.5 | Komponen `BaseForm` / form generator | ✅ | Menggunakan `<UForm>` dari `@nuxt/ui` |
| 11.6 | Komponen `Modal` / dialog konfirmasi | ✅ | Menggunakan `<UModal>` dari `@nuxt/ui` |
| 11.7 | Komponen `Toast` notifikasi | ✅ | Menggunakan `useToast()` dari `@nuxt/ui` |
| 11.8 | Loading skeleton & empty state | ✅ | Bawaan `<USkeleton>` dari `@nuxt/ui` |
| 11.9 | Responsive mobile (360px+) | ✅ | Tailwind mobile-first setup |

## 12. Non-Fungsional

| No | Metrik | Target | Status | Catatan |
| :-- | :----- | :----- | :----- | :------ |
| 12.1 | Performa — LCP | < 2.5 detik (4G) | ⏳ | |
| 12.2 | Performa — bundle size optimal | Hindari bundle besar | ⏳ | |
| 12.3 | Responsivitas mobile | Berfungsi di 360px | ✅ | Tested sidebars |
| 12.4 | Keamanan — JWT + RBAC middleware | Semua API route terproteksi | ✅ | Middleware global on /api/** |
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
| 1. Inisialisasi & Setup | 12 | 10 | 0 | 2 | 83% |
| 2. Database Migration | 17 | 17 | 0 | 0 | 100% |
| 3. Modul A — Master Data | 6 | 6 | 0 | 0 | 100% |
| 4. Modul B — Penerimaan | 8 | 8 | 0 | 0 | 100% |
| 5. Modul C — Penyaluran & Faktur | 11 | 11 | 0 | 0 | 100% |
| 6. Modul D — Opname Stok | 5 | 5 | 0 | 0 | 100% |
| 7. Modul E — Rekonsiliasi | 6 | 6 | 0 | 0 | 100% |
| 8. Modul F — Request Restock | 4 | 3 | 0 | 1 | 75% |
| 9. Modul G — Prediksi Stok AI | 5 | 3 | 0 | 2 | 60% |
| 10. Autentikasi | 6 | 5 | 0 | 1 | 83% |
| 11. UI/UX Global | 9 | 8 | 0 | 1 | 88% |
| 12. Non-Fungsional | 6 | 2 | 0 | 4 | 33% |
| 13. Testing | 4 | 0 | 0 | 4 | 0% |
| 14. Deployment | 6 | 0 | 0 | 6 | 0% |
| 15. Dokumentasi | 3 | 0 | 0 | 3 | 0% |
| **TOTAL** | **107** | **84** | **0** | **23** | **79%** |

---

> ⏱ Terakhir diperbarui: Sabtu, 13 Juni 2026 — Rekonsiliasi split: penyalur view (full three-tier) & mitra view (simplified, no penyalur profit).
>
> 🚀 **Workflow Stok & Approval (v2):**
> - **Penerimaan Barang**: Stok gudang hanya bertambah saat dikonfirmasi (`draft → completed`), bukan saat create. Edit/hapus hanya untuk draft. PUT endpoint + edit page.
> - **Penyaluran**: Stok gudang hanya berkurang saat ditandai Dikirim (`draft → sent`), bukan saat create. Edit/hapus hanya untuk draft. PUT endpoint + edit page.
> - **Seed**: Disesuaikan — completed GR & sent/received DEL yang memengaruhi stok; draft GR/DEL tidak mengubah stok.
> - **List actions**: Edit & Hapus buttons di index + detail page (penerimaan & penyaluran), dengan RBAC & status check.
>
> 🚀 **Modul G — Prediksi Stok AI (Moving Average) (v1):**
> - **Algoritma**: Moving Average — untuk setiap (mitra, produk), ambil N=4 kunjungan terakhir, rata-rata jumlahLaku → ceil → prediksi
> - **API**: `POST /api/prediksi-stok/generate` (run algorithm), `GET /api/prediksi-stok` (list), `GET /api/prediksi-stok/:idMitra` (per mitra)
> - **Frontend**: Dashboard grouped by mitra dengan tabel produk + prediksi
> - **Sidebar**: menu "Prediksi" ditambahkan
> - **Pending**: Grafik tren (butuh chart library), integrasi prediksi di halaman mitra
> 🚀 **Modul F — Request Restock (v1):**
> - **API**: `GET /api/permintaan-stok`, `POST /api/permintaan-stok`, `GET /api/permintaan-stok/:id`, `PATCH /api/permintaan-stok/:id`
> - **Create**: Mitra/Sales bisa buat permintaan (RR-YYYYMMDD-NNNN)
> - **Approval**: Penyalur approve (pilih gudang asal) → auto-create penyaluran + faktur + decrement stok
> - **Reject**: Penyalur tolak → status 'rejected'
> - **Frontend**: List + Create + Detail with approval panel
> - **Sidebar**: menu "Restok" ditambahkan
> - **Pending**: Notifikasi real-time, adjust jumlah disetujui per item
> 🚀 **Modul E — Rekonsiliasi Keuangan (v2 — Split Penyalur & Mitra):**
> - **Split**: Modul E dipecah menjadi dua view terpisah dengan API & halaman masing-masing
> - **Rekonsiliasi Penyalur** (`/rekonsiliasi-penyalur`): Full three-tier pricing — Harga Pabrik, Harga Grosir, Harga Retail. Menampilkan laba mitra (retail - grosir) dan laba penyalur (grosir - pabrik). Ditambah margin/unit + laba ×qty. RBAC: penyalur only.
> - **Rekonsiliasi Mitra** (`/rekonsiliasi-mitra`): Simplified — hanya menampilkan harga grosir & harga retail, laba mitra (retail - grosir). Tidak menampilkan harga pabrik, laba penyalur, atau margin ratio. RBAC: mitra only, data terfilter oleh `idMitra` user login.
> - **API**: `GET /api/rekonsiliasi-penyalur` + `GET /api/rekonsiliasi-penyalur/:idMitra` (penyalur), `GET /api/rekonsiliasi-mitra` + `GET /api/rekonsiliasi-mitra/:idMitra` (mitra)
> - **Pendapatan Mitra** = SUM(laku × (hargaJual − hargaJualPenyalur))
> - **Pendapatan Penyalur** = SUM(laku × (hargaJualPenyalur − hargaTebus))
> - **Rumus baru**: Harga tiga tingkat (tebus → penyalur → retail) diterapkan konsisten di kedua view
> - **Sidebar**: menu "Rekonsiliasi Penyalur" (penyalur role) + "Rekonsiliasi Mitra" (mitra role)
> - Old `pages/rekonsiliasi/` + `server/api/rekonsiliasi/` dihapus
> 🚀 **Modul D — Opname Stok & Laporan Kunjungan (v1):**
> - **API**: `GET /api/opname-stok`, `POST /api/opname-stok`, `GET /api/opname-stok/:id`, `PATCH /api/opname-stok/:id`
> - **POST** dalam 1 transaksi: insert header + items + auto-hitung stokFisik + deteksi anomali
> - **Stok Fisik** = stokAwal − jumlahLaku − jumlahRetur (Math.max 0)
> - **Anomali**: Auto-flag item jika stokFisik < 0, header `memilikiAnomali` = 1 jika ada item anomali
> - **Status workflow**: draft → submitted → verified (hanya penyalur bisa verify)
> - **Frontend**: `pages/opname-stok/` — list (index), create (form + dynamic items + live stokFisik preview + anomaly highlight), detail (header cards + full item table)
> - **Sidebar**: menu "Opname" ditambahkan
> - **RBAC**: Penyalur CRUD, Sales & Mitra Create
> 🚀 **Modul C — Penyaluran & Faktur (v1):**
> - **API**: `GET /api/penyaluran`, `POST /api/penyaluran`, `GET /api/penyaluran/:id`, `PATCH /api/penyaluran/:id`
> - **POST** dalam 1 transaksi: insert header + items + auto-decrement `stok_gudang` + auto-generate faktur `INV-YYYY-NNNN`
> - **Stok validation**: Cek kecukupan stok sebelum decrement; tolak jika stok kurang
> - **Faktur**: Auto-generated dengan total nilai (∑ jumlahDikirim × snapshotHargaJual)
> - **Status workflow**: draft → sent → received (hanya penyalur bisa mark received)
> - **Frontend**: `pages/penyaluran/` — list (index), create (form + dynamic items), detail (header cards + items + faktur card)
> - **Sidebar**: menu "Penyaluran" ditambahkan
> - **RBAC**: Penyalur CRUD, Sales Field Create
> - **Pending**: Cetak/download PDF faktur, daftar faktur terpisah
> 🔧 **Bug Fix v1 (solved):**
> - **useApi.ts**: Ganti `new Headers()` → plain object spread agar bearer token benar-benar terkirim di header (ofetch Nuxt 3.16 overwrite Headers instance)
> - **AppSidebar**: Fix akses `user.value` di computed (sebelumnya akses `user.nama` di object Ref)
> - **Hapus** `Sidebar.vue` & `Topbar.vue` (dead code)
> - **pages/index.vue**: Ganti `(auth.user as any)` → `auth.user.value`, ganti `(r as any)` → typed cast
> - **color="neutral" fix**: Ganti semua `color="neutral"` → `color="gray"` (@nuxt/ui v2 tidak punya `neutral`)
>
> 🔄 **Template Alignment v1 (done):**
> - **app.vue**: Tambah `<NuxtLayout>` agar layout system aktif
> - **app.config.ts**: primary `green`, gray `zinc` (sesuai dashboard-template.nuxt.dev)
> - **layouts/auth.vue**: Ganti `slate` → `zinc`
> - **Semua pages**: Ganti `text-slate-900` → `text-zinc-900`, `bg-slate-*` → `bg-zinc-*`
> - **default.vue**: Restructure — sidebar `fixed`, konten `lg:ml-64`/`lg:ml-16`, mobile hamburger floating
> - **AppSidebar.vue**: Redesign — logo header, nav items, user dropdown (profile, dark mode toggle, logout)
> - **AppTopbar.vue**: Dibuat ulang — minimal header dengan hamburger (mobile), page title, search
> - **main.css**: HSL variables + utility classes (`bg-background`, `text-foreground`, dll)
> 💰 **Harga Realistis (updated):**
> - **Per-unit pricing**: Semua harga diubah ke harga per pcs/botol/kotak/sachet (bukan per karton)
> - **Coca-Cola 390ml**: Tebus Rp 4.500 → Penyalur Rp 5.200 → Retail Rp 6.000
> - **Yakult**: Tebus Rp 1.700 → Penyalur Rp 1.900 → Retail Rp 2.200
> - **Tolak Angin**: Tebus Rp 1.200 → Penyalur Rp 1.400 → Retail Rp 1.700
> - **Seed fix**: `snapshotHargaJual` di item_penyaluran menggunakan `hargaJualPenyalur` (bukan `hargaJual`)
> - **Dampak**: Faktur & rekonsiliasi jadi lebih realistis (ratusan rb bukan jutaan)
> 🖨️ **Cetak & Export (v1):**
> - **Faktur PDF**: `pages/penyaluran/[id]/print.vue` — format invoice A4, tombol Cetak + Download PDF via html2pdf.js
> - **Daftar Faktur**: `pages/faktur/index.vue` + `GET /api/faktur` — daftar faktur terpisah
> - **Surat Jalan**: `pages/penerimaan-barang/[id]/print.vue` — format surat jalan A4
> - **Rekonsiliasi CSV**: Export CSV dari halaman index rekonsiliasi
> - **Cetak Rekonsiliasi**: `window.print()` di halaman detail rekonsiliasi
> - **url_pdf**: Kolom di tabel faktur otomatis terisi path cetak
> - **Sidebar**: Menu "Faktur" ditambahkan di grup Transaksi
> Cara update progress:
> 1. Ganti ⏳ → ✅ jika sudah selesai
> 2. Ganti ⏳ → 🔄 jika sedang dikerjakan
> 3. Tambah catatan di kolom "Catatan" jika ada issue/scop
