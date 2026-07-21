# BAB 5 — PENUTUP

---

## 5.1 Kesimpulan

Berdasarkan hasil penelitian, perancangan, implementasi, dan pengujian Sistem Informasi Konsinyasi (SIKONS), dapat ditarik kesimpulan sebagai berikut:

1. Sistem Informasi Konsinyasi (SIKONS) berhasil dirancang dan dibangun sebagai platform berbasis web yang mencakup enam modul fungsional utama, yaitu Master Data, Penerimaan Barang, Penyaluran dan Faktur, Opname Stok, Rekonsiliasi Keuangan, serta Request Restock. Seluruh modul diuji menggunakan Black Box Testing dengan hasil seluruh skenario pengujian berfungsi sesuai spesifikasi kebutuhan. Sistem dibangun menggunakan Nuxt 3 dengan arsitektur monolitik yang memisahkan logika frontend dan backend dalam satu kesatuan proyek, serta menggunakan MariaDB sebagai basis data relasional yang dikelola melalui Drizzle ORM.

2. Alur bisnis konsinyasi berhasil diimplementasikan ke dalam sistem dengan workflow digital yang mencakup seluruh siklus: penerimaan barang dari pemasok dengan workflow *draft* hingga *completed* yang memperbarui stok gudang secara otomatis saat dikonfirmasi; penyaluran barang ke mitra dengan workflow *draft* hingga *sent* dan *received* yang dilengkapi auto-generate faktur titip jual; opname stok di lapangan dengan perhitungan stok fisik otomatis dan deteksi anomali stok; rekonsiliasi keuangan dengan struktur harga tiga tingkat (pabrik, grosir, retail) yang dipecah menjadi dua view sesuai peran; serta permintaan restok yang terintegrasi dengan pembuatan penyaluran otomatis saat disetujui.

3. Role-Based Access Control (RBAC) dengan empat peran pengguna — Penyalur, Sales Field, Mitra, dan Pemasok — berhasil diintegrasikan ke dalam seluruh lapisan sistem. Mekanisme `requireRole` pada setiap *endpoint* API server memvalidasi otorisasi pengguna berdasarkan perannya, sementara komposabel `useAuth` pada sisi klien mengelola *state* autentikasi dan menyediakan pembatasan akses pada level halaman dan komponen. Hasil pengujian menunjukkan bahwa pengguna dengan peran tertentu hanya dapat mengakses fitur yang sesuai dengan hak aksesnya, dan upaya akses terhadap *endpoint* yang tidak diotorisasi berhasil diblokir dengan kode status 403 (*Forbidden*).

4. Berdasarkan perbandingan dengan penelitian terdahulu, SIKONS memiliki cakupan yang lebih luas dan lebih terintegrasi. Dibandingkan dengan Bantang dan Nugroho (2023) yang berfokus pada pengelolaan stok internal perusahaan, SIKONS mencakup siklus konsinyasi yang lebih kompleks dengan melibatkan empat peran pengguna dan alur kerja yang saling terhubung. Dibandingkan dengan Putri (2024) yang menggunakan Google Spreadsheet, SIKONS menawarkan otomatisasi, basis data relasional, dan kontrol akses yang lebih baik. Dibandingkan dengan Fauzan dan Noprisson (2020) yang merancang e-commerce B2C, SIKONS menyasar model B2B dalam rantai distribusi dengan skema harga tiga tingkat dan rekonsiliasi keuangan. Namun, penelitian ini memiliki beberapa keterbatasan, yaitu: (a) modul prediksi stok berbasis kecerdasan buatan belum diimplementasikan; (b) notifikasi *real-time* belum tersedia sehingga pengguna harus memeriksa sistem secara manual untuk mengetahui perubahan status; (c) pengujian masih terbatas pada Black Box Testing manual tanpa pengujian otomatis (*unit test* dan *integration test*); serta (d) sistem belum dideploy ke lingkungan produksi sehingga belum teruji pada kondisi operasional nyata.

---

## 5.2 Saran

Berdasarkan keterbatasan dan temuan selama penelitian, berikut adalah saran yang dapat dipertimbangkan untuk pengembangan sistem lebih lanjut:

### 5.2.1 Bagi Pengembang Selanjutnya

1. **Implementasi modul prediksi stok.** Modul Prediksi Stok yang sempat direncanakan dalam PRD namun dihapus dari MVP dapat dikembangkan menggunakan algoritma *Moving Average* dari data historis penjualan. Modul ini dapat memberikan rekomendasi jumlah pengiriman untuk kunjungan berikutnya sehingga membantu Penyalur dalam merencanakan distribusi.

2. **Penambahan notifikasi *real-time*.** Sistem notifikasi menggunakan WebSocket atau *Server-Sent Events* (SSE) perlu ditambahkan agar pengguna mendapat pemberitahuan langsung saat terjadi perubahan status — misalnya saat permintaan restok disetujui atau ditolak, atau saat jadwal opname stok sudah mendekati tenggat waktu.

3. **Pengembangan aplikasi mobile.** Meskipun sistem telah responsif untuk perangkat mobile, pengembangan aplikasi mobile *native* atau *hybrid* menggunakan framework seperti Flutter atau React Native akan memberikan pengalaman pengguna yang lebih optimal bagi Sales Field dan Mitra yang bekerja di lapangan.

### 5.2.2 Bagi Peneliti Akademis

1. **Pengujian *usability* dengan responden nyata.** Penelitian selanjutnya dapat melakukan pengujian *usability* yang melibatkan pengguna dari keempat peran (Penyalur, Sales Field, Mitra, dan Pemasok) untuk mengukur tingkat kemudahan penggunaan, efisiensi waktu, dan kepuasan pengguna secara kuantitatif menggunakan kuesioner seperti SUS (*System Usability Scale*).

2. **Pengukuran performa sistem.** Pengujian *load testing* dan *stress testing* menggunakan alat seperti k6 atau Apache JMeter perlu dilakukan untuk mengukur kapasitas sistem dalam menangani jumlah pengguna dan transaksi yang besar, terutama menjelang akhir periode rekonsiliasi.

3. **Eksplorasi algoritma prediksi yang lebih kompleks.** Penelitian selanjutnya dapat mengeksplorasi algoritma prediksi yang lebih canggih seperti SARIMA (*Seasonal Autoregressive Integrated Moving Average*) atau LSTM (*Long Short-Term Memory*) untuk meningkatkan akurasi prediksi stok dengan mempertimbangkan pola musiman dan tren penjualan.

### 5.2.3 Bagi Perusahaan/Pengguna Sistem

1. **Deployment ke lingkungan produksi.** Sistem perlu dideploy ke server produksi dengan konfigurasi HTTPS, *domain* khusus, dan *backup* basis data periodik agar dapat digunakan secara operasional oleh perusahaan. Proses deployment sebaiknya menggunakan CI/CD *pipeline* untuk memudahkan pembaruan sistem di masa mendatang.

2. **Pelatihan pengguna.** Sebelum sistem digunakan secara penuh, perlu dilakukan pelatihan kepada seluruh pengguna — terutama Sales Field dan Mitra yang mungkin belum terbiasa dengan sistem digital — untuk memastikan transisi dari sistem manual ke SIKONS berjalan lancar.

3. **Digitalisasi data historis.** Data transaksi konsinyasi periode sebelumnya yang masih tercatat secara manual (buku atau *spreadsheet*) sebaiknya dimigrasikan ke dalam sistem agar tersedia riwayat data yang lengkap untuk analisis dan rekonsiliasi di masa mendatang.

---

