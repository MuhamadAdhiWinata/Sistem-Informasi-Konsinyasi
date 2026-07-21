# ABSTRAK

UMKM yang menjalankan model bisnis konsinyasi (titip jual) masih banyak mencatat transaksi secara manual menggunakan buku atau *spreadsheet*, yang menyebabkan risiko kehilangan data, ketidakmampuan memantau stok secara *real-time*, dan rekonsiliasi keuangan yang lambat. Penelitian ini bertujuan merancang dan membangun Sistem Informasi Konsinyasi (SIKONS) berbasis web untuk mendigitalisasi seluruh siklus konsinyasi dari penerimaan barang hingga rekonsiliasi keuangan.

SIKONS dikembangkan menggunakan metode Waterfall dengan teknologi Nuxt 3, TypeScript, MariaDB, dan Drizzle ORM. Sistem terdiri dari enam modul: Master Data, Penerimaan Barang, Penyaluran dan Faktur, Opname Stok, Rekonsiliasi Keuangan, serta Request Restock. *Role-Based Access Control* (RBAC) diimplementasikan untuk empat peran pengguna: Penyalur, Sales Field, Mitra, dan Pemasok. Pengujian dilakukan menggunakan *Black Box Testing* pada seluruh modul fungsional.

Hasil pengujian menunjukkan bahwa seluruh skenario fungsional — meliputi CRUD setiap modul, *workflow* status, perhitungan otomatis stok fisik dan total faktur, deteksi anomali stok, kalkulasi pendapatan tiga tingkat harga, serta pembatasan akses antar peran — berfungsi sesuai spesifikasi. SIKONS berhasil mengintegrasikan alur data dari penerimaan barang hingga rekonsiliasi keuangan dalam satu platform terpadu dengan akurasi perhitungan yang terjamin.

**Kata Kunci:** *black box testing*; *konsinyasi*; *Nuxt 3*; *RBAC*; *web application*
