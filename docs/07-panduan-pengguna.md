# 07 — Panduan Pengguna

Panduan ini menjelaskan cara menggunakan SITJ per modul, disertai tangkapan layar aplikasi yang berjalan di domain produksi (https://sikons.herlambang.store).

> Semua screenshot diambil dari aplikasi live (Agustus 2026), role utama **Penyalur (admin)**. Panduan khusus role **Mitra**, **Sales**, dan **Pemasok** ada di bagian akhir.

## 1. Login

Buka `https://sikons.herlambang.store`. Aplikasi mengarahkan pengguna yang belum login ke halaman login.

![Halaman login SITJ](screenshots/01-login.png)

*Gambar 1 — Halaman login.*

1. Masukkan **Email** dan **Password**.
2. Klik tombol **Masuk Sekarang**.
3. Jika berhasil, pengguna diarahkan ke Dashboard dengan menu sesuai rolenya.

## 2. Dashboard

Dashboard adalah halaman ringkasan yang menampilkan:

- **Kartu statistik** — total pemasok, produk, mitra, gudang, pengguna, penerimaan, penyaluran, dan opname.
- **Akses cepat** — kartu navigasi ke Data Master dan Transaksi.
- **Penyaluran Terbaru** — tabel transaksi penyaluran terkini.
- (Tambahan) peringatan **stok menipis** dan daftar **anomali opname**.

![Dashboard SITJ](screenshots/02-dashboard.png)

*Gambar 2 — Dashboard role penyalur.*

## 3. Data Master

### 3.1 Pemasok

Menu **Data Master → Pemasok** menampilkan daftar pemasok beserta kategori merek dan narahubung. Tombol **Tambah Pemasok** untuk menambah data baru.

![Daftar pemasok](screenshots/03-master-pemasok.png)

*Gambar 3 — Modul Pemasok.*

### 3.2 Produk

Menu **Data Master → Produk** menampilkan katalog produk (SKU, nama, satuan, tiga tingkat harga, pemasok). Harga terdiri dari **Harga Pabrik**, **Harga Grosir**, dan **Harga Retail**.

![Daftar produk](screenshots/04-master-produk.png)

*Gambar 4 — Modul Produk.*

### 3.3 Mitra

Menu **Data Master → Mitra** menampilkan daftar toko/mitra beserta pemilik, telepon, alamat, dan sales yang ditugaskan.

![Daftar mitra](screenshots/05-master-mitra.png)

*Gambar 5 — Modul Mitra.*

### 3.4 Gudang

Menu **Data Master → Gudang** menampilkan lokasi gudang penyimpanan.

![Daftar gudang](screenshots/06-master-gudang.png)

*Gambar 6 — Modul Gudang.*

### 3.5 Pengguna

Menu **Data Master → Pengguna** menampilkan akun sistem beserta role (penyalur, sales, mitra, pemasok) dan status aktif.

![Daftar pengguna](screenshots/07-master-pengguna.png)

*Gambar 7 — Modul Pengguna.*

### 3.6 Stok Gudang

Menu **Stok Gudang** menampilkan saldo stok per produk per gudang secara real-time (bertambah saat penerimaan, berkurang saat penyaluran).

![Stok gudang](screenshots/08-stok-gudang.png)

*Gambar 8 — Modul Stok Gudang.*

## 4. Penerimaan Barang (GR)

Menu **Transaksi → Penerimaan** mencatat barang masuk dari pemasok ke gudang.

![Daftar penerimaan barang](screenshots/09-penerimaan-list.png)

*Gambar 9 — Daftar penerimaan barang.*

Klik ikon mata pada baris untuk melihat **detail penerimaan** (header + daftar item + harga pabrik aktual).

![Detail penerimaan](screenshots/10-penerimaan-detail.png)

*Gambar 10 — Detail penerimaan barang.*

Setiap penerimaan dapat **dicetak / diunduh PDF** sebagai dokumen penerimaan (surat jalan masuk).

![Cetak penerimaan](screenshots/11-penerimaan-print.png)

*Gambar 11 — Tampilan cetak dokumen penerimaan.*

## 5. Penyaluran (DEL)

Menu **Transaksi → Penyaluran** mencatat penyaluran barang titip jual ke mitra.

![Daftar penyaluran](screenshots/12-penyaluran-list.png)

*Gambar 12 — Daftar penyaluran.*

Klik ikon mata untuk melihat **detail penyaluran**: mitra, gudang asal, sales, tanggal, status, tabel item (dengan harga snapshot), serta panel **Faktur Titip Jual** yang terkait.

![Detail penyaluran](screenshots/13-penyaluran-detail.png)

*Gambar 13 — Detail penyaluran beserta faktur terkait.*

Tombol **Cetak** membuka dokumen **Faktur Titip Jual** yang dapat dicetak atau diunduh sebagai PDF (`html2pdf`).

![Faktur Titip Jual](screenshots/14-penyaluran-print.png)

*Gambar 14 — Dokumen Faktur Titip Jual (print view).*

## 6. Faktur

Menu **Transaksi → Faktur** menampilkan seluruh faktur konsinyasi yang telah diterbitkan (nomor faktur, penyaluran terkait, total nilai, tanggal terbit).

![Daftar faktur](screenshots/15-faktur-list.png)

*Gambar 15 — Daftar faktur.*

## 7. Opname Stok

Menu **Transaksi → Opname** mencatat hasil kunjungan sales ke mitra.

![Daftar opname](screenshots/16-opname-list.png)

*Gambar 16 — Daftar opname stok.*

Klik ikon mata untuk melihat **detail opname**: stok awal, jumlah laku, retur (kondisi), hilang, stok fisik, dan penanda anomali.

![Detail opname](screenshots/17-opname-detail.png)

*Gambar 17 — Detail opname stok.*

## 8. Rekonsiliasi Penyalur

Menu **Transaksi → Rekonsiliasi Penyalur** menampilkan ringkasan pendapatan & laba per mitra (total opname, penyaluran, laku, retur, hilang, laba mitra, laba penyalur, dan rasio laba).

![Rekonsiliasi penyalur](screenshots/18-rekonsiliasi-penyalur-list.png)

*Gambar 18 — Ringkasan rekonsiliasi per mitra.*

Klik **Detail** untuk melihat rincian rekonsiliasi satu mitra.

![Detail rekonsiliasi](screenshots/19-rekonsiliasi-penyalur-detail.png)

*Gambar 19 — Detail rekonsiliasi mitra.*

## 9. Profil

Menu **Profil** menampilkan data akun yang sedang login serta fitur **ganti password**.

![Profil pengguna](screenshots/20-profile.png)

*Gambar 20 — Halaman profil & ganti password.*

---

## Panduan per Role

### Role Mitra (Toko)

Mitra memiliki menu lebih ringkas: **Dashboard**, **Penyaluran** (melihat barang titipan masuk), dan **Rekonsiliasi Mitra** (melihat pendapatan sendiri).

![Dashboard mitra](screenshots/21-mitra-dashboard.png)

*Gambar 21 — Dashboard role mitra.*

![Penyaluran mitra](screenshots/22-mitra-penyaluran.png)

*Gambar 22 — Daftar penyaluran (titipan) versi mitra.*

![Rekonsiliasi mitra](screenshots/23-mitra-rekonsiliasi.png)

*Gambar 23 — Rekonsiliasi mitra.*

### Role Sales

Sales mengakses **Dashboard**, **Produk**, **Mitra**, **Stok Gudang**, **Penyaluran**, dan **Opname** (input hasil kunjungan).

![Dashboard sales](screenshots/24-sales-dashboard.png)

*Gambar 24 — Dashboard role sales.*

![Opname sales](screenshots/25-sales-opname.png)

*Gambar 25 — Input opname oleh sales.*

### Role Pemasok

Pemasok mengakses **Dashboard**, **Produk**, **Penerimaan**, dan **Penyaluran** (terkait pemasoknya).

![Dashboard pemasok](screenshots/26-pemasok-dashboard.png)

*Gambar 26 — Dashboard role pemasok.*

![Produk pemasok](screenshots/27-pemasok-produk.png)

*Gambar 27 — Produk versi pemasok.*

---

## Video Demo

Demo walkthrough aplikasi tersedia di `video/demo-sitj.webm` (format WebM/VP8, dapat diputar di browser atau VLC).
