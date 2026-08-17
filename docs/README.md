# SITJ — Sistem Informasi Titip Jual

Dokumentasi teknis aplikasi **SITJ (Sistem Informasi Titip Jual)**, sebuah aplikasi web untuk mengelola bisnis **konsinyasi / titip jual** barang (barang dititipkan ke mitra/toko, dibayar setelah laku terjual).

| Informasi | Keterangan |
|:-----------|:-----------|
| Nama aplikasi | SITJ — Sistem Informasi Titip Jual |
| Domain produksi | https://sikons.herlambang.store |
| Repositori (lokal) | `~/JOKI/Sistem-Informasi-Titip-Jual` |
| Kategori | Aplikasi web (full-stack) manajemen konsinyasi / distribusi |
| Dokumentasi disusun | Agustus 2026 |

> Dokumentasi ini adalah dokumentasi teknis **aplikasi** (bukan dokumen skripsi/akademik). Berisi arsitektur, skema basis data, referensi API, autentikasi & hak akses, panduan instalasi, dan panduan penggunaan beserta tangkapan layar dari aplikasi yang berjalan di domain produksi.

---

## Daftar Isi

| Dokumen | Isi |
|:---------|:-----|
| [01 — Ringkasan](01-ringkasan.md) | Gambaran umum, fitur, dan tech stack |
| [02 — Arsitektur](02-arsitektur.md) | Arsitektur sistem, struktur proyek, alur bisnis |
| [03 — Basis Data](03-database.md) | Skema database, tabel, relasi (ERD) |
| [04 — Referensi API](04-api.md) | Daftar endpoint REST API |
| [05 — Autentikasi & Hak Akses](05-autentikasi-rbac.md) | Mekanisme login, JWT, dan role pengguna |
| [06 — Instalasi & Deployment](06-instalasi-deploy.md) | Setup lokal, environment, dan Docker |
| [07 — Panduan Pengguna](07-panduan-pengguna.md) | Cara pakai per modul (dengan screenshot) |

## Akun Demo

Akun bawaan (seed) untuk mencoba aplikasi di lingkungan development:

| Role | Email | Password |
|:-----|:------|:---------|
| Penyalur (admin) | `admin@sikons.com` | `password123` |
| Sales | `rudi@sikons.com` | `password123` |
| Mitra | `budi@sikons.com` | `password123` |
| Pemasok | `wings@sikons.com` | `password123` |

> Kredensial di atas adalah data *seed* development. Akun yang digunakan di domain produksi mungkin berbeda.

## Ringkasan Tech Stack

| Lapisan | Teknologi |
|:--------|:----------|
| Framework | Nuxt 3 (Vue 3 + TypeScript, mode SSR) |
| UI | Nuxt UI (`@nuxt/ui` 2.x) + Tailwind CSS |
| Database | MySQL / MariaDB 10.10 |
| ORM | Drizzle ORM + drizzle-kit (migration) |
| Autentikasi | JWT (`jsonwebtoken`) + `bcryptjs` |
| Validasi | Zod |
| Export PDF | `html2pdf.js` (dokumen Faktur Titip Jual) |
| Runtime | Node.js ≥ 18 (image Docker `node:22-alpine`) |
| Package manager | pnpm ≥ 10 |
| Deployment | Docker Compose (db + app) |

## Fitur Utama

- **Dashboard** — ringkasan jumlah pemasok/produk/mitra/gudang/pengguna, transaksi terbaru, peringatan stok menipis, dan anomali opname.
- **Data Master** — kelola Pemasok, Produk, Mitra, Gudang, Pengguna, dan Stok Gudang.
- **Penerimaan Barang (GR)** — pencatatan barang masuk dari pemasok ke gudang.
- **Penyaluran (DEL)** — penyaluran barang titip jual ke mitra/toko, lengkap dengan Faktur Titip Jual.
- **Faktur** — daftar faktur konsinyasi, bisa dicetak / diunduh PDF.
- **Opname Stok** — pencatatan hasil kunjungan sales (barang laku, retur, hilang) beserta deteksi anomali.
- **Rekonsiliasi** — perhitungan pendapatan/laba mitra dan penyalur.
- **Multi-role** — 4 peran pengguna: penyalur (admin), sales, mitra, dan pemasok dengan menu & hak akses berbeda.

## Cepat Mulai (development)

```bash
cd ~/JOKI/Sistem-Informasi-Titip-Jual
pnpm install          # install dependensi
docker compose up -d  # jalankan database MariaDB
pnpm db:reset         # migrate + seed data dummy
pnpm dev              # jalankan dev server → http://localhost:3000
```

Lihat [06 — Instalasi & Deployment](06-instalasi-deploy.md) untuk langkah lengkap.
