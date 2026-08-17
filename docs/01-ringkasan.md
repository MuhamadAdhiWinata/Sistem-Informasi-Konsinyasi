# 01 — Ringkasan Aplikasi

## Gambaran Umum

**SITJ (Sistem Informasi Titip Jual)** adalah aplikasi web untuk mengelola model bisnis **konsinyasi / titip jual** pada jaringan distribusi minuman dan barang konsumsi. Dalam model ini:

1. **Pemasok** memasok barang ke **penyalur (distributor)**.
2. Penyalur menyimpan barang di **gudang**, lalu **menyalurkan** (menitipkan) barang ke **mitra** (toko/warung).
3. Barang yang dititipkan **tetap milik penyalur** sampai **laku terjual**.
4. **Sales** melakukan kunjungan berkala dan **opname stok** — menghitung barang yang laku, retur, dan hilang.
5. Berdasarkan hasil opname, sistem menghitung **pendapatan/laba** untuk mitra dan penyalur (rekonsiliasi), serta menerbitkan **Faktur Titip Jual**.

Aplikasi mencatat seluruh siklus tersebut secara terstruktur dan memberikan visibilitas stok, transaksi, dan keuangan antar pihak.

## Model Bisnis (ringkas)

```
Pemasok ──kirim──▶ Penyalur (gudang) ──titip jual──▶ Mitra (toko) ──jual──▶ Konsumen akhir
                      ▲                                  │
                      │            (barang laku / retur / hilang)
                      └──────── rekonsiliasi & setoran ◀─┘  (via opname sales)
```

Setiap produk memiliki tiga tingkat harga:
- **Harga Pabrik** (`harga_pabrik`) — harga beli dari pemasok.
- **Harga Grosir** (`harga_grosir`) — harga "setor"/titip ke mitra (dasar nilai setoran).
- **Harga Retail** (`harga_retail`) — harga jual akhir ke konsumen.

Selisih harga grosir vs retail menjadi dasar perhitungan **laba mitra**, sedangkan selisih pabrik vs grosir menjadi dasar **laba penyalur**.

## Fitur per Modul

### 1. Dashboard
Halaman ringkasan berisi kartu statistik (total pemasok, produk, mitra, gudang, pengguna, penerimaan, penyaluran, opname), akses cepat ke master data & transaksi, tabel penyaluran terbaru, peringatan **stok menipis**, dan daftar **anomali opname**.

### 2. Data Master
| Modul | Deskripsi |
|:------|:----------|
| Pemasok | Data pemasok/supplier (nama, kategori merek, narahubung). |
| Produk | Katalog produk (SKU, nama, satuan, tiga tingkat harga, pemasok). |
| Mitra | Data mitra/toko (nama, pemilik, telepon, alamat, koordinat, sales yang ditugaskan). |
| Gudang | Lokasi penyimpanan barang. |
| Pengguna | Akun sistem beserta role-nya (penyalur, sales, mitra, pemasok). |
| Stok Gudang | Saldo stok per produk per gudang. |

### 3. Penerimaan Barang (GR)
Pencatatan barang masuk dari pemasok ke gudang (nomor GR, pemasok, gudang, tanggal, daftar item + harga pabrik aktual). Setiap penerimaan yang selesai otomatis menambah stok gudang.

### 4. Penyaluran (DEL)
Pencatatan penyaluran barang titip jual ke mitra (nomor DEL, gudang asal, mitra, sales, daftar item + snapshot harga grosir & retail). Terdapat alur status: `draft → sent → received`. Menyalurkan barang otomatis mengurangi stok gudang dan menerbitkan **Faktur Titip Jual**.

### 5. Faktur
Daftar faktur konsinyasi (nomor faktur, penyaluran terkait, total nilai). Faktur dapat dibuka untuk dicetak atau diunduh sebagai PDF.

### 6. Opname Stok
Pencatatan hasil kunjungan sales ke mitra (stok awal, jumlah laku, retur dengan kondisi, hilang). Sistem menghitung stok fisik dan mendeteksi **anomali** jika stok fisik tidak sesuai.

### 7. Rekonsiliasi
- **Rekonsiliasi Penyalur** (untuk penyalur/admin): ringkasan pendapatan & laba per mitra.
- **Rekonsiliasi Mitra** (untuk mitra): ringkasan setoran & pendapatan mitra itu sendiri.

### 8. Permintaan Stok (Restok)
Fitur permintaan restok dari mitra (ada di kode, `nomorPermintaan`, status `pending → approved → fulfilled`), namun **tidak ditampilkan di menu navigasi** pada rilis saat ini (dikomentari di sidebar).

## Tech Stack

| Lapisan | Teknologi | Versi |
|:--------|:----------|:------|
| Framework | Nuxt | ^3.16 |
| UI Framework | @nuxt/ui | ^2.22 |
| Vue | vue | 3.5.13 |
| CSS | Tailwind CSS (via @nuxtjs/tailwindcss) | ^6.13 |
| ORM | drizzle-orm | ^0.40 |
| Migration | drizzle-kit | ^0.30 |
| Database | MySQL / MariaDB | 10.10 (Docker) |
| Driver DB | mysql2 | ^3.12 |
| Auth | jsonwebtoken | ^9.0 |
| Hash password | bcryptjs | ^3.0 |
| Validasi | zod | ^3.24 |
| Export PDF | html2pdf.js | ^0.14 |
| Ikon | lucide-vue-next | 0.368 |
| TypeScript | — | ^5.7 |

## Prasyarat (Runtime)

- Node.js ≥ 18 (image produksi memakai `node:22-alpine`)
- pnpm ≥ 10
- Docker & Docker Compose (untuk database MariaDB dan deployment)
- MySQL/MariaDB (jika tidak memakai Docker)
