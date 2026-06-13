# **PRD SIKONS v1.2 | Sistem Informasi Konsinyasi Terintegrasi**

## ---

**DOKUMEN PERSYARATAN PRODUK (Product Requirements Document)**

---

| Informasi | Detail |
| :---- | :---- |
| **Versi Dokumen** | 1.2.0 (Penyelarasan Desain & Revisi v1.1) |
| **Status** | Draft — Final |
| **Teknologi Stack** | Nuxt 3 · TypeScript · Tailwind CSS · MariaDB |
| **Tanggal** | Juni 2026 |

# **1\. Ringkasan Eksekutif**

---

SIKONS (Sistem Informasi Konsinyasi Terintegrasi) adalah platform berbasis web yang dirancang untuk mendigitalisasi dan mengotomatiskan seluruh alur bisnis konsinyasi — mulai dari penerimaan barang dari Pemasok, distribusi ke Mitra/Warung, pencatatan penjualan mingguan, hingga rekonsiliasi keuangan dan laporan performa.  
Sistem ini dibangun sebagai karya ilmiah (skripsi) dengan mempertimbangkan skalabilitas UMKM, kemudahan operasional di lapangan, dan fitur kecerdasan buatan ringan untuk prediksi kebutuhan stok.

## **1.1 Tujuan Proyek**

* ---

  Menggantikan pencatatan konsinyasi manual (buku/Excel) dengan sistem digital terintegrasi.  
* Menyediakan visibilitas stok real-time bagi Penyalur di semua gudang dan Mitra.  
* Mengotomatiskan pembuatan Faktur Titip Jual dan laporan rekonsiliasi.  
* Memberikan prediksi kebutuhan stok berbasis tren penjualan historis.  
* Mendukung 4 peran pengguna dengan hak akses berbeda.

## **1.2 Stack Teknologi**

---

| Komponen | Teknologi | Alasan Pemilihan |
| :---- | :---- | :---- |
| **Frontend** | Nuxt 3 (Vue 3\) | Performa tinggi, file-based routing, dan kemampuan auto-import yang mempercepat pengembangan. |
| **Language** | TypeScript | Type-safety mencegah bug kalkulasi finansial. |
| **UI Framework** | Tailwind CSS | Utility-first, responsif untuk tampilan desktop & mobile. |
| **Database** | MariaDB | ACID-compliant, familiar, dan mudah dalam deployment. |

# **2\. Stakeholder & Peran Pengguna**

## ---

**2.1 Daftar Stakeholder**

---

| Peran | Sebutan Sistem | Perangkat Utama | Hak Akses |
| :---- | :---- | :---- | :---- |
| **Admin** | Penyalur | Desktop (Web) | Full Access — semua modul |
| **Sales** | Sales Field | Mobile (Web) | Input opname, penyaluran, request stok |
| **Warung/Toko** | Mitra | Mobile (Web) | Input laku, retur, request restock |
| **Pabrikan** | Pemasok | Desktop (Web) | Read-only: laporan & performa barang miliknya |

## **2.2 Matrix Hak Akses Modul**

---

| Modul | Penyalur | Sales Field | Mitra | Pemasok |
| :---- | :---- | :---- | :---- | :---- |
| **Master Data** | CRUD | Read | — | Read |
| **Stok Gudang** | Read | Read | — | — |
| **Manajemen Gudang** | CRUD | Read | — | — |
| **Penerimaan** | CRUD | Create | — | Read |
| **Penyaluran** | CRUD | Create | Read | — |
| **Faktur Titip Jual** | CRUD | Read | Read | — |
| **Opname Stok** | CRUD | Create | Create | — |
| **Rekonsiliasi Penyalur** | Full | — | — | — |
| **Rekonsiliasi Mitra** | — | — | Read | — |
| **Request Restock** | Approve | Forward | Create | — |
| **Prediksi Stok AI** | Full | Read | — | — |

# **3\. Entitas Data & Kamus Istilah**

---

| Istilah Indonesia | Istilah Teknis (EN) | Contoh Nilai | Keterangan |
| :---- | :---- | :---- | :---- |
| **Pemasok** | Supplier | Wings, Mayora | Penyedia / pabrikan barang |
| **Penyalur** | Distributor | Admin Pusat | Pengelola distribusi |
| **Mitra** | Partner / Store | Warung Bu Ani | Titik retail konsinyasi |
| **Barang** | Product / SKU | wg-f1-001 | Produk unik dengan kode lokal |
| **Harga Pabrik** | Factory Price | Rp 2.500 | Harga beli dari Pemasok |
| **Harga Grosir** | Wholesale Price | Rp 3.000 | Harga distributor ke Mitra |
| **Harga Retail** | Retail Price | Rp 3.500 | Harga jual Mitra ke Konsumen |
| **Laku** | Sold Quantity | 12 pcs | Jumlah terjual di Mitra |
| **Retur** | Return Quantity | 3 pcs | Barang dikembalikan ke gudang |
| **Faktur** | Invoice | INV-2026-0001 | Dokumen sah bukti tagihan atau tanda terima titip jual barang. |
| **Opname** **Stok** | Stock Opname | SO-20260611-01 | Proses pencocokan, verifikasi, dan perhitungan fisik stok langsung di Mitra. |
| **Penyaluran** | Distribution / Delivery | DEL-2026-0021 | Proses pengiriman fisik barang dari gudang Penyalur ke Mitra. |
| **Permintaan** **Stok** | Restock Request | RR-2026-0007 | Pengajuan tambahan pasokan barang yang diinput oleh Mitra/Sales. |
| **Prediksi** **Stok** | Stock Forecast | 8 pcs (next visit) | Estimasi atau rekomendasi jumlah pasokan barang untuk kunjungan berikutnya. |
| **Gudang** | Warehouse | GDG-WNG-01 | Lokasi fisik penyimpanan aset barang milik Penyalur. |
| **Stok** **Awal** | Opening Stock | 15 pcs | Saldo awal kuantitas barang titipan dari hasil pengantaran sebelumnya. |
| **Stok** **Fisik** | Physical Stock | 0 pcs | Sisa riil barang di toko setelah dikurangi barang laku dan retur. |
| **Kondisi Retur** | Return Condition | damaged, expired | Status kelayakan barang retur (Good / Damaged / Expired). |
| **Anomali Stok** | Stock Anomaly | True / False | Penanda otomatis jika hasil hitung opname tidak konsisten atau bernilai negatif. |

# 

# **4\. Fitur Utama Sistem**

## ---

**4.1 Modul A — Master Data**

* ---

  Manajemen Pemasok: CRUD data pabrikan, kategori merek, kontak PIC.  
* Manajemen Barang (SKU): kode lokal unik, nama, satuan, Harga Pabrik, Harga Grosir, Harga Retail, status aktif.  
* Manajemen Mitra: nama, nama pemilik, nomor telepon, koordinat GPS (lat, lng), Sales ditugaskan.  
* Manajemen Gudang: kode gudang, nama gudang, alamat lengkap.  
* Manajemen User & Roles: Pengaturan hak akses untuk 4 peran utama.
* **Monitoring Stok Gudang**: Dashboard untuk melihat ketersediaan stok per gudang per produk secara real-time, termasuk filter gudang, pencarian produk, dan status stok (tersedia/habis).

## **4.2 Modul B — Penerimaan Barang**

* ---

  Form input penerimaan: pilih Pemasok, pilih Gudang tujuan, tanggal penerimaan.  
* Detail item: pilih Barang, jumlah diterima, Harga Pabrik aktual nomor referensi PO.  
* **Workflow**: Draft → Completed. Stok gudang hanya bertambah saat status dikonfirmasi (completed), bukan saat create. Edit/hapus hanya untuk status draft.

## **4.3 Modul C — Penyaluran & Faktur**

* ---

  Form penyaluran: pilih gudang asal, pilih Mitra, tanggal kirim, Sales pengantar.  
* Detail item: pilih Barang, jumlah kirim (auto-check validasi kecukupan stok gudung saat konfirmasi).
* **Visibility Stok**: Saat input penyaluran, sistem menampilkan sisa stok gudang untuk setiap produk yang dipilih agar user tidak perlu menebak-nebak ketersediaan.  
* **Workflow**: Draft → Sent → Received. Stok gudang hanya berkurang saat status diubah ke Sent (dikirim), bukan saat create. Validasi kecukupan stok dilakukan saat konfirmasi. Edit/hapus hanya untuk status draft.  
* Pembuatan Faktur Titip Jual otomatis dengan format penomoran INV-YYYY-NNNN.  
* Kalkulasi total nilai titip jual (jumlah dikirim × snapshot\_harga\_jual).

## **4.4 Modul D — Opname Stok & Laporan Kunjungan**

* ---

  Header kunjungan: pilih Mitra, tanggal kunjungan, nama Sales lapangan.  
* Detail per barang: Stok Awal (titipan sebelumnya), Jumlah Laku, Jumlah Retur, Kondisi Retur.  
* Sistem otomatis hitung: Stok Fisik \= Stok Awal \- Laku \- Retur.  
* Validasi anomali: Otomatis menandai indikator anomali jika hitungan kuantitas tidak konsisten atau bernilai negatif.

## **4.5 Modul E — Rekonsiliasi Keuangan**

* ---

  **Split menjadi dua view terpisah berdasarkan peran:**
* **Rekonsiliasi Penyalur** (Penyalur only): Full three-tier pricing — Harga Pabrik, Harga Grosir, Harga Retail. Menampilkan laba mitra (retail − grosir) dan laba penyalur (grosir − pabrik).
* **Rekonsiliasi Mitra** (Mitra only): Simplified — hanya Harga Grosir dan Harga Retail. Hanya menampilkan laba mitra (retail − grosir). Tidak menampilkan data harga pabrik atau laba penyalur.
* Formula Pendapatan Mitra \= Jumlah Laku × (Harga Retail \- Harga Grosir).  
* Formula Pendapatan Penyalur \= Jumlah Laku × (Harga Grosir \- Harga Pabrik).  
* Laporan rekap tagihan dan pelacakan kondisi barang retur (baik / rusak / kedaluwarsa).

## **4.6 Modul F — Request Restock**

* ---

  Mitra atau Sales membuat permohonan tambah stok via aplikasi mobile.  
* Dashboard Penyalur menerima notifikasi permohonan untuk status Approve / Reject.  
* Jika disetujui, sistem otomatis mengonversi data menjadi draft penyaluran baru.

## **4.7 Modul G — Analitik & Prediksi Stok (AI)**

* ---

  Grafik tren performa penjualan produk dan keaktifan Mitra.  
* Algoritma Prediksi: Penerapan Moving Average N kunjungan terakhir untuk estimasi rekomendasi jumlah pengiriman berikutnya.

# **5\. User Stories**

### ---

**5.1 Penyalur (Admin)**

* **US-P01 \[Must Have\]:** Sebagai Penyalur, saya ingin menambah barang baru dengan kode SKU unik, agar setiap produk dapat dilacak secara akurat.  
* **US-P02 \[Must Have\]:** Sebagai Penyalur, saya ingin mencatat penerimaan barang dari Pemasok ke gudang tertentu, agar stok gudang selalu akurat.  
* **US-P03 \[Must Have\]:** Sebagai Penyalur, saya ingin membuat penyaluran barang ke Mitra dan mencetak Faktur Titip Jual, agar ada bukti fisik yang sah.  
* **US-P04 \[Must Have\]:** Sebagai Penyalur, saya ingin melihat laporan rekonsiliasi per Mitra, agar saya dapat menghitung margin keuntungan dengan tepat.

### **5.2 Sales Field**

* **US-S01 \[Must Have\]:** Sebagai Sales, saya ingin membuat laporan opname per kunjungan dari mobile, agar input bisa dilakukan langsung di lapangan.  
* **US-S03 \[Must Have\]:** Sebagai Sales, saya ingin melihat daftar Mitra yang saya tangani beserta stok aktif masing-masing, agar kunjungan lebih efisien.

### **5.3 Mitra / Warung**

* **US-M01 \[Must Have\]:** Sebagai Mitra, saya ingin menginput jumlah barang laku dan retur dari smartphone, agar tidak perlu menghubungi Sales secara manual.  
* **US-M02 \[Must Have\]:** Sebagai Mitra, saya ingin mengajukan Request Restock ketika stok hampir habis, agar barang tidak sampai kosong.

# **6\. Skema Database (ERD)**

---

Database menggunakan MariaDB dengan desain relasional penuh dalam Bahasa Indonesia.

## **6.1 Diagram ERD**

---

*\[ TEMPAT UNTUK MENEMPELKAN / MEMPASTE GAMBAR DIAGRAM ERD \]*

 

## **6.2 Detail Struktur Tabel (Bahasa Indonesia)**

### ---

**Tabel: pengguna (users)**

| Kolom | Tipe Data | Key | Null | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | PK | NOT NULL | Auto increment, primary key |
| nama | VARCHAR(100) |  | NOT NULL | Nama lengkap pengguna |
| email | VARCHAR(150) | UQ | NOT NULL | Email login, harus unik |
| peran | ENUM |  | NOT NULL | penyalur | sales | mitra | pemasok |
| id\_mitra | BIGINT UNSIGNED | FK | NULLABLE | Referensi ke mitra.id |
| id\_pemasok | BIGINT UNSIGNED | FK | NULLABLE | Referensi ke pemasok.id |
| apakah\_aktif | TINYINT(1) |  | NOT NULL | Default 1 (aktif) |

### **Tabel: pemasok (suppliers)**

| Kolom | Tipe Data | Key | Null | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | PK | NOT NULL | Auto increment |
| nama | VARCHAR(100) |  | NOT NULL | Nama pemasok (Wings, Mayora, dll) |
| kategori\_merek | VARCHAR(100) |  | NULLABLE | Kategori merek / grup produk |
| narahubung | VARCHAR(100) |  | NULLABLE | Nama PIC atau Contact Person |
| apakah\_aktif | TINYINT(1) |  | NOT NULL | Default 1 |

### **Tabel: produk (products)**

| Kolom | Tipe Data | Key | Null | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | PK | NOT NULL | Auto increment |
| sku | VARCHAR(50) | UQ | NOT NULL | Kode unik lokal produk (Stock Keeping Unit) |
| nama | VARCHAR(150) |  | NOT NULL | Nama lengkap produk |
| id\_pemasok | BIGINT UNSIGNED | FK | NOT NULL | Referensi ke pemasok.id |
| satuan | VARCHAR(20) |  | NOT NULL | Satuan kemasan (pcs, botol, pack) |
| harga\_pabrik | DECIMAL(12,2) |  | NOT NULL | Harga beli penyalur dari Pemasok |
| harga\_grosir | DECIMAL(12,2) |  | NOT NULL | Harga jual penyalur ke Mitra |
| harga\_retail | DECIMAL(12,2) |  | NOT NULL | Harga jual Mitra ke Konsumen |
| apakah\_aktif | TINYINT(1) |  | NOT NULL | Default 1 |

### **Tabel: gudang (warehouses)**

| Kolom | Tipe Data | Key | Null | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | PK | NOT NULL | Auto increment |
| kode | VARCHAR(20) | UQ | NOT NULL | Kode unik lokasi gudang |
| nama | VARCHAR(100) |  | NOT NULL | Nama identitas gudang |
| alamat | TEXT |  | NULLABLE | Alamat fisik gudang |
| apakah\_aktif | TINYINT(1) |  | NOT NULL | Default 1 |

### **Tabel: stok\_gudang (warehouse\_stocks)**

| Kolom | Tipe Data | Key | Null | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | PK | NOT NULL | Auto increment |
| id\_gudang | BIGINT UNSIGNED | FK | NOT NULL | Referensi ke gudang.id |
| id\_produk | BIGINT UNSIGNED | FK | NOT NULL | Referensi ke produk.id |
| jumlah | INT |  | NOT NULL | Kuantitas stok tersedia di gudang |
| diperbarui\_pada | TIMESTAMP |  | NOT NULL | Waktu pembaharuan stok terupdate |

### **Tabel: mitra (partners)**

| Kolom | Tipe Data | Key | Null | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | PK | NOT NULL | Auto increment |
| nama | VARCHAR(100) |  | NOT NULL | Nama outlet / toko / warung mitra |
| nama\_pemilik | VARCHAR(100) |  | NOT NULL | Nama pemilik outlet mitra |
| telepon | VARCHAR(20) |  | NULLABLE | Nomor telepon aktif |
| lat | DECIMAL(10,8) |  | NULLABLE | Titik koordinat Latitude GPS |
| lng | DECIMAL(11,8) |  | NULLABLE | Titik koordinat Longitude GPS |
| id\_sales\_ditugaskan | BIGINT UNSIGNED | FK | NULLABLE | Sales lapangan penanggung jawab (pengguna.id) |
| apakah\_aktif | TINYINT(1) |  | NOT NULL | Default 1 |

### **Tabel: penerimaan\_barang (goods\_receipts)**

| Kolom | Tipe Data | Key | Null | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | PK | NOT NULL | Auto increment |
| nomor\_penerimaan | VARCHAR(50) | UQ | NOT NULL | Nomor manifes penerimaan unik |
| id\_pemasok | BIGINT UNSIGNED | FK | NOT NULL | Referensi ke pemasok.id |
| id\_gudang | BIGINT UNSIGNED | FK | NOT NULL | Gudang tujuan masuk barang |
| diterima\_oleh | BIGINT UNSIGNED | FK | NOT NULL | User penerima laporan (pengguna.id) |
| tanggal\_penerimaan | DATE |  | NOT NULL | Tanggal fisik penerimaan barang |
| status | ENUM('draft','completed') |  | NOT NULL | draft \| completed — stok hanya masuk saat completed |

### **Tabel: item\_penerimaan\_barang (goods\_receipt\_items)**

| Kolom | Tipe Data | Key | Null | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | PK | NOT NULL | Auto increment |
| id\_penerimaan | BIGINT UNSIGNED | FK | NOT NULL | Referensi ke penerimaan\_barang.id |
| id\_produk | BIGINT UNSIGNED | FK | NOT NULL | Referensi ke produk.id |
| jumlah | INT |  | NOT NULL | Kuantitas barang yang diterima |
| harga\_pabrik\_aktual | DECIMAL(12,2) |  | NOT NULL | Harga pabrik aktual saat transaksi |

### **Tabel: penyaluran (distributions)**

| Kolom | Tipe Data | Key | Null | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | PK | NOT NULL | Auto increment |
| nomor\_penyaluran | VARCHAR(50) | UQ | NOT NULL | Nomor manifes pengiriman unik |
| id\_gudang\_asal | BIGINT UNSIGNED | FK | NOT NULL | Gudang asal barang dikeluarkan |
| id\_mitra | BIGINT UNSIGNED | FK | NOT NULL | Mitra tujuan pengiriman |
| id\_sales | BIGINT UNSIGNED | FK | NOT NULL | Sales lapangan pengantar (pengguna.id) |
| tanggal\_penyaluran | DATE |  | NOT NULL | Tanggal pengiriman dilakukan |
| status | ENUM |  | NOT NULL | draft | sent | received |
| dibuat\_oleh | BIGINT UNSIGNED | FK | NOT NULL | User pembuat manifes (pengguna.id) |

### **Tabel: item\_penyaluran (distribution\_items)**

| Kolom | Tipe Data | Key | Null | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | PK | NOT NULL | Auto increment |
| id\_penyaluran | BIGINT UNSIGNED | FK | NOT NULL | Referensi ke penyaluran.id |
| id\_produk | BIGINT UNSIGNED | FK | NOT NULL | Referensi ke produk.id |
| jumlah\_dikirim | INT |  | NOT NULL | Kuantitas barang dikirim |
| snapshot\_harga\_retail | DECIMAL(12,2) |  | NOT NULL | Snapshot Harga Retail saat penyaluran |
| snapshot\_harga\_grosir | DECIMAL(12,2) |  | NOT NULL | Snapshot Harga Grosir saat penyaluran |

### **Tabel: faktur (invoices)**

| Kolom | Tipe Data | Key | Null | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | PK | NOT NULL | Auto increment |
| nomor\_faktur | VARCHAR(50) | UQ | NOT NULL | Nomor seri dokumen faktur (unik) |
| id\_penyaluran | BIGINT UNSIGNED | FK | NOT NULL | One-to-one relasi dengan penyaluran.id |
| total\_nilai | DECIMAL(14,2) |  | NOT NULL | Total nilai barang titip jual yang disalurkan |
| diterbitkan\_pada | TIMESTAMP |  | NOT NULL | Waktu faktur diterbitkan |
| url\_pdf | VARCHAR(255) |  | NULLABLE | Path tautan berkas fisik PDF faktur |

### **Tabel: opname\_stok (stock\_opnames)**

| Kolom | Tipe Data | Key | Null | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | PK | NOT NULL | Auto increment |
| nomor\_opname | VARCHAR(50) | UQ | NOT NULL | Nomor kode laporan opname (unik) |
| id\_mitra | BIGINT UNSIGNED | FK | NOT NULL | Mitra sasaran objek kunjungan opname |
| id\_sales | BIGINT UNSIGNED | FK | NOT NULL | Sales pencatat pelaksana (pengguna.id) |
| tanggal\_kunjungan | DATE |  | NOT NULL | Tanggal kunjungan lapangan dilakukan |
| status | ENUM |  | NOT NULL | draft | submitted | verified |
| memiliki\_anomali | TINYINT(1) |  | NOT NULL | Flag indikasi jika ditemukan selisih anomali |
| dibuat\_oleh | BIGINT UNSIGNED | FK | NOT NULL | User pembuat rekaman (pengguna.id) |

### **Tabel: item\_opname (opname\_items)**

| Kolom | Tipe Data | Key | Null | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | PK | NOT NULL | Auto increment |
| id\_opname | BIGINT UNSIGNED | FK | NOT NULL | Referensi ke opname\_stok.id |
| id\_produk | BIGINT UNSIGNED | FK | NOT NULL | Referensi ke produk.id |
| stok\_awal | INT |  | NOT NULL | Stok tercatat awal pada siklus sebelumnya |
| jumlah\_laku | INT |  | NOT NULL | Kuantitas barang terjual laku |
| jumlah\_retur | INT |  | NOT NULL | Kuantitas barang diretur/dikembalikan |
| stok\_fisik | INT |  | NOT NULL | Hasil sisa sediaan riil di lapangan |
| kondisi\_retur | ENUM |  | NULLABLE | good | damaged | expired |
| apakah\_anomali | TINYINT(1) |  | NOT NULL | Flag penanda ketidaksesuaian rekam hitung |

### **Tabel: permintaan\_stok (restock\_requests)**

| Kolom | Tipe Data | Key | Null | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | PK | NOT NULL | Auto increment |
| nomor\_permintaan | VARCHAR(50) | UQ | NOT NULL | Nomor seri formulir permintaan restok |
| id\_mitra | BIGINT UNSIGNED | FK | NOT NULL | Mitra pemohon restock |
| diminta\_oleh | BIGINT UNSIGNED | FK | NOT NULL | User pembuat dokumen (mitra/sales) |
| status | ENUM |  | NOT NULL | pending | approved | rejected | fulfilled |
| disetujui\_oleh | BIGINT UNSIGNED | FK | NULLABLE | Penyalur penanggung jawab (pengguna.id) |
| id\_penyaluran | BIGINT UNSIGNED | FK | NULLABLE | Tautan draft penyaluran kelanjutan |

### **Tabel: item\_permintaan\_stok (restock\_request\_items)**

| Kolom | Tipe Data | Key | Null | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | PK | NOT NULL | Auto increment |
| id\_permintaan | BIGINT UNSIGNED | FK | NOT NULL | Referensi ke permintaan\_stok.id |
| id\_produk | BIGINT UNSIGNED | FK | NOT NULL | Referensi ke produk.id |
| jumlah\_diminta | INT |  | NOT NULL | Kuantitas volume stok yang dimohon Mitra |
| jumlah\_disetujui | INT |  | NULLABLE | Kuantitas volume yang di-approve Penyalur |

### **Tabel: prediksi\_stok (stock\_forecasts)**

| Kolom | Tipe Data | Key | Null | Keterangan |
| :---- | :---- | :---- | :---- | :---- |
| id | BIGINT UNSIGNED | PK | NOT NULL | Auto increment |
| id\_mitra | BIGINT UNSIGNED | FK | NOT NULL | Referensi ke mitra.id |
| id\_produk | BIGINT UNSIGNED | FK | NOT NULL | Referensi ke produk.id |
| jumlah\_prediksi | INT |  | NOT NULL | Volume estimasi kirim siklus berikutnya |
| rata\_rata\_laku | DECIMAL(8,2) |  | NOT NULL | Rata-rata penjualan historis produk |
| berdasarkan\_kunjungan | INT |  | NOT NULL | Jumlah basis data riwayat kunjungan (N) |
| dihasikan\_pada | TIMESTAMP |  | NOT NULL | Waktu eksekusi kalkulasi algoritma |

# **7\. Alur Kerja Sistem (Business Flow)**

## ---

**7.1 Alur Utama Konsinyasi**

---

| No | Tahap | Aktivitas | Aktor Utama |
| :---- | :---- | :---- | :---- |
| 1 | Penerimaan Barang | Penyalur mencatat barang masuk dari Pemasok (draft) → konfirmasi penerimaan → stok gudang bertambah → cetak surat jalan. | Penyalur |
| 2 | Penyaluran | Penyalur/Sales membuat distribusi ke Mitra (draft) → tandai dikirim → stok gudang berkurang → Faktur Titip Jual diterbitkan. | Penyalur / Sales |
| 3 | Konfirmasi Mitra | Mitra menerima barang dan mengkonfirmasi di sistem → status distribusi = received. | Mitra / Sales |
| 4 | Opname per Kunjungan | Sales mengunjungi Mitra → input Laku & Retur → sistem validasi → anomali tertandai otomatis. | Sales / Mitra |
| 5 | Rekonsiliasi Penyalur | Penyalur melihat laporan per Mitra → three-tier pricing (pabrik/grosir/retail) → kalkulasi laba mitra & laba penyalur otomatis → export. | Penyalur |
| 6 | Rekonsiliasi Mitra | Mitra melihat laporan pendapatan sendiri → hanya laba mitra (retail − grosir) → tanpa data distributor. | Mitra |

# **8\. Persyaratan Non-Fungsional**

---

| Kategori | Metrik Target | Detail |
| :---- | :---- | :---- |
| **Performa** | LCP \< 2.5 detik | Halaman utama (dashboard) harus terisi konten \< 2.5s pada koneksi 4G. |
| **Responsivitas** | Mobile-first | Semua halaman input berfungsi penuh di layar 360px (smartphone entry-level). |
| **Keamanan** | Auth \+ RBAC | JWT authentication, middleware RBAC di semua API route Nuxt. |
| **Keandalan DB** | ACID compliant | Transaksi multi-tabel menggunakan MariaDB transactions (BEGIN/COMMIT/ROLLBACK). |

# **9\. Spesifikasi Teknis**

## ---

**9.1 Algoritma Moving Average (Prediksi Stok)**

---

Forecast(n+1) \= Σ Laku(n-k ... n) / N

* N \= jumlah kunjungan yang dijadikan basis (default: 4 kunjungan terakhir, konfigurabel).  
* Hasil pembulatan otomatis ke atas (Math.ceil) untuk memastikan pemenuhan ambang batas sediaan minimum Mitra terjamin tanpa kehabisan stok.

— Akhir Dokumen PRD SIKONS v1.2 —