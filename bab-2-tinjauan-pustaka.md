# BAB 2 — TINJAUAN PUSTAKA DAN DASAR TEORI

---

## 2.1 Tinjauan Pustaka

Transformasi digital di sektor distribusi dan rantai pasok telah mendorong banyak penelitian tentang sistem informasi yang mendukung pengelolaan barang, pencatatan transaksi, dan pelaporan keuangan. Penelitian-penelitian tersebut menjadi landasan dalam pengembangan Sistem Informasi Konsinyasi (SIKONS). Sub-bab ini mengkaji secara kritis enam artikel dari jurnal dan proceeding yang relevan, mencakup aspek teknis implementasi, metodologi pengujian, serta sistem pengelolaan barang dan distribusi.

Bantang dan Nugroho (2023) merancang sistem informasi pengelolaan barang berbasis web menggunakan framework Nuxt JS di sebuah perusahaan distributor. Penelitian ini menggunakan metode Waterfall dan menghasilkan sistem yang mencakup fitur pencatatan stok masuk dan keluar, manajemen data barang, serta laporan inventaris. Pengujian dilakukan menggunakan Black Box Testing yang menunjukkan seluruh fungsi berjalan sesuai kebutuhan pengguna. Relevansi penelitian ini dengan SIKONS terletak pada kesamaan penggunaan framework Nuxt JS dan metode Waterfall, yang membuktikan bahwa Nuxt JS layak digunakan untuk sistem pengelolaan barang berskala distributor. Perbedaannya terletak pada cakupan bisnis — penelitian Bantang dan Nugroho berfokus pada pengelolaan stok internal perusahaan, sedangkan SIKONS mencakup siklus konsinyasi yang lebih kompleks dengan melibatkan empat peran pengguna dan alur kerja penerimaan, penyaluran, opname, serta rekonsiliasi.

Setiyani (2019) melakukan pengujian sistem informasi inventory pada perusahaan distributor farmasi menggunakan metode Black Box Testing. Penelitian ini menekankan pentingnya validasi fungsionalitas sistem melalui pengujian berbasis skenario tanpa mengetahui struktur internal kode. Teknik equivalence partitioning dan boundary value analysis digunakan untuk merancang kasus uji yang efektif. Hasil penelitian menunjukkan bahwa Black Box Testing mampu mengidentifikasi cacat fungsional secara efisien pada tahap akhir pengembangan. Penelitian ini menjadi acuan penting dalam merancang strategi pengujian sistem informasi distribusi. Dalam konteks SIKONS, pendekatan Black Box Testing diadaptasi menjadi pengujian fungsional yang menekankan validasi alur kerja sistem melalui skenario penggunaan nyata dan dokumentasi visual.

Fauzan dan Noprisson (2020) menganalisis dan merancang aplikasi e-commerce untuk jasa titip oleh-oleh produk tradisional. Penelitian ini menggunakan metode analisis PIECES (Performance, Information, Economy, Control, Efficiency, Service) untuk mengidentifikasi kebutuhan sistem. Hasilnya berupa rancangan aplikasi yang memfasilitasi transaksi penitipan barang antara pelanggan dan pembeli. Relevansinya dengan SIKONS terletak pada domain bisnis titip jual yang serupa, di mana barang dititipkan oleh pemilik kepada pihak lain untuk dijualkan. Namun, Fauzan dan Noprisson berfokus pada model e-commerce business-to-consumer (B2C), sedangkan SIKONS berfokus pada model business-to-business (B2B) dalam rantai distribusi konsinyasi dengan skema harga tiga tingkat dan integrasi antar-modul yang lebih kompleks.

Febyanti (2025) meneliti peran sistem informasi akuntansi dalam meningkatkan kinerja karyawan divisi purchasing di PT Semen Indonesia Distributor. Penelitian ini menggunakan metode kualitatif deskriptif dan menemukan bahwa sistem informasi akuntansi mempercepat proses kerja, meminimalisir kesalahan administrasi, serta meningkatkan akurasi pelaporan keuangan. Temuan ini relevan dengan modul rekonsiliasi keuangan pada SIKONS yang mengotomatiskan perhitungan pendapatan mitra dan penyalur berdasarkan data transaksi penjualan. Perbedaannya, Febyanti menganalisis peran sistem yang sudah ada, sedangkan SIKONS membangun sistem dari tahap perancangan hingga implementasi dengan pendekatan pengembangan perangkat lunak yang terstruktur.

Putri (2024) merancang sistem pencatatan transaksi dan pelaporan keuangan menggunakan Google Spreadsheet pada Percetakan Tunas Karya yang masih melakukan pencatatan manual. Penelitian ini mengidentifikasi permasalahan umum UMKM: ketidakakuratan data stok, keterlambatan laporan keuangan, dan risiko kehilangan catatan fisik. Solusi berbasis spreadsheet yang dihasilkan terbukti meningkatkan efisiensi pencatatan, namun tetap memiliki keterbatasan dalam hal akses multi-pengguna, otomatisasi alur kerja, dan kontrol akses berbasis peran. Temuan ini memperkuat urgensi pengembangan SIKONS sebagai sistem terintegrasi yang mengatasi keterbatasan spreadsheet melalui basis data relasional, workflow status, dan RBAC.

Implementasi sistem informasi pemasaran berbasis web dalam kegiatan jasa titip barang ekspor-impor pada bisnis Tourgether.in (2020) menunjukkan bagaimana sistem berbasis web dapat meningkatkan efektivitas operasional layanan titip barang. Penelitian ini mendokumentasikan implementasi nyata sistem titip barang yang mencakup pencatatan barang titipan, pelacakan status pengiriman, dan pelaporan. Relevansinya dengan SIKONS terletak pada domain bisnis penitipan barang dan validasi bahwa sistem berbasis web merupakan solusi yang tepat untuk digitalisasi layanan titip. Keterbatasannya adalah belum mencakup skema konsinyasi dengan harga bertingkat dan rekonsiliasi keuangan yang menjadi fokus utama SIKONS.

Berdasarkan kajian terhadap enam penelitian tersebut, dapat disimpulkan bahwa penelitian-penelitian sebelumnya telah memberikan kontribusi pada masing-masing aspek secara parsial — baik dari sisi teknis implementasi Nuxt JS (Bantang & Nugroho, 2023), metode pengujian (Setiyani, 2019), analisis kebutuhan sistem titip (Fauzan & Noprisson, 2020), peran sistem informasi akuntansi (Febyanti, 2025), permasalahan pencatatan manual UMKM (Putri, 2024), maupun implementasi sistem titip barang (Repository Universitas Nurul Fikri, 2020). Namun, belum ada penelitian yang merancang dan membangun sistem informasi konsinyasi terintegrasi yang mencakup seluruh siklus bisnis — dari penerimaan barang, penyaluran ke mitra, opname stok, rekonsiliasi keuangan dengan struktur harga tiga tingkat, hingga request restock — dalam satu platform dengan dukungan RBAC untuk empat peran pengguna. SIKONS hadir untuk mengisi celah tersebut.

---

## 2.2 Dasar Teori

### 2.2.1 Sistem Informasi

Sistem informasi adalah sekumpulan komponen yang saling berhubungan untuk mengumpulkan, memproses, menyimpan, dan mendistribusikan informasi guna mendukung pengambilan keputusan dan pengendalian dalam suatu organisasi (Laudon & Laudon, 2020). Sistem informasi manajemen (SIM) merupakan subsistem yang secara khusus menyediakan informasi bagi manajemen untuk mendukung perencanaan dan pengambilan keputusan pada tingkat operasional, taktis, dan strategis. SIKONS merupakan SIM yang dirancang untuk mendukung pengelolaan siklus konsinyasi pada perusahaan distribusi.

### 2.2.2 Sistem Informasi Manajemen Distribusi

Sistem informasi manajemen distribusi adalah sistem yang mengintegrasikan proses-proses dalam rantai distribusi mulai dari pengadaan barang dari pemasok, penyimpanan di gudang, hingga penyaluran ke pelanggan atau mitra (Bowersox et al., 2013). Tujuan utama sistem ini adalah memastikan ketersediaan produk di tempat yang tepat, waktu yang tepat, jumlah yang tepat, dan biaya yang optimal.

Rantai pasok konsinyasi memiliki karakteristik unik karena barang yang disalurkan tetap menjadi milik pemasok atau distributor hingga barang tersebut terjual kepada konsumen akhir. Hal ini menuntut sistem informasi yang mampu melacak pergerakan barang secara real-time, mencatat data penjualan dan retur, serta menghitung pendapatan berdasarkan skema bagi hasil yang telah disepakati. SIKONS mengakomodasi kebutuhan tersebut melalui enam modul yang saling terintegrasi.

### 2.2.3 Konsinyasi (Titip Jual)

Konsinyasi atau titip jual adalah perjanjian di mana pemilik barang (consignor) menitipkan barangnya kepada pihak lain (consignee) untuk dijualkan dengan pembayaran setelah barang terjual (Utami, 2017). Dalam skema konsinyasi, risiko barang tidak laku tetap berada pada pemilik barang, sementara pihak penitip menerima komisi atau margin dari hasil penjualan. Konsinyasi banyak diterapkan pada usaha retail karena memungkinkan pengecer untuk menyediakan variasi produk tanpa perlu mengeluarkan modal besar untuk pembelian stok.

Pada praktik distribusi di Indonesia, skema konsinyasi melibatkan tiga tingkatan harga: harga pabrik (harga beli distributor dari pemasok), harga grosir (harga jual distributor ke mitra/pengecer), dan harga retail (harga jual mitra ke konsumen) (Utami, 2017). Selisih antara harga retail dan harga grosir merupakan margin keuntungan mitra, sedangkan selisih antara harga grosir dan harga pabrik merupakan margin keuntungan distributor. SIKONS mengadopsi struktur harga tiga tingkat ini dalam modul rekonsiliasi keuangannya.

### 2.2.4 Nuxt 3 dan TypeScript

Nuxt 3 adalah framework pengembangan aplikasi web berbasis Vue.js yang menyediakan arsitektur modular, server-side rendering (SSR), static site generation (SSG), dan file-based routing secara bawaan (Nuxt, 2025). Nuxt 3 menggunakan kompiler Vite untuk pengembangan yang cepat dan Nitro engine untuk sisi server yang ringan dan fleksibel. Struktur direktori Nuxt 3 memisahkan komponen frontend pada direktori `pages/`, `components/`, dan `layouts/`, sedangkan logika backend diletakkan pada direktori `server/api/` untuk menangani RESTful API.

TypeScript adalah superset dari JavaScript yang menambahkan tipe statis (static typing) pada bahasa pemrograman JavaScript (Microsoft, 2022). TypeScript memungkinkan deteksi kesalahan pada tahap kompilasi, dokumentasi kode yang lebih baik melalui tipe data eksplisit, serta dukungan alat pengembangan yang lebih canggih seperti autocomplete dan refactoring. Dalam SIKONS, TypeScript digunakan secara strict mode untuk memastikan type-safety pada seluruh kode, terutama pada kalkulasi finansial yang sensitif terhadap kesalahan tipe data numerik.

### 2.2.5 MariaDB

MariaDB adalah sistem manajemen basis data relasional (RDBMS) open-source yang dikembangkan sebagai fork dari MySQL. MariaDB mendukung fitur ACID (Atomicity, Consistency, Isolation, Durability) yang menjamin keandalan transaksi basis data. Basis data relasional menyimpan data dalam bentuk tabel-tabel yang saling berhubungan melalui kunci primer (primary key) dan kunci asing (foreign key), sehingga memungkinkan pengambilan data yang kompleks melalui perintah SQL (Structured Query Language) (Connolly & Begg, 2015).

SIKONS menggunakan MariaDB versi 10.10 yang berjalan dalam container Docker. Basis data SIKONS terdiri dari lima belas tabel yang merepresentasikan seluruh entitas bisnis konsinyasi — mulai dari pengguna, pemasok, produk, gudang, mitra, penerimaan barang, penyaluran, faktur, opname stok, hingga permintaan stok. Penggunaan ACID pada MariaDB memastikan konsistensi data pada transaksi multi-tabel, misalnya saat konfirmasi penerimaan barang yang secara atomik menambah stok gudang dan mengubah status penerimaan.

### 2.2.6 Drizzle ORM

Drizzle ORM adalah Object-Relational Mapping (ORM) berbasis TypeScript yang dirancang dengan prinsip type-safety dan performa tinggi (Drizzle, 2025). Berbeda dengan ORM tradisional yang menggunakan pendekatan active record atau data mapper, Drizzle menggunakan pendekatan SQL-like query builder yang memberikan kontrol penuh terhadap query SQL tanpa kehilangan keamanan tipe. Schema didefinisikan dalam kode TypeScript dan secara otomatis menghasilkan tipe-tipe yang dapat digunakan di seluruh aplikasi.

Keunggulan utama Drizzle ORM meliputi: (1) type-safety penuh yang memastikan struktur query sesuai dengan skema basis data pada tahap kompilasi; (2) dukungan migrasi otomatis yang menghasilkan file migrasi dari perubahan skema; (3) performa yang mendekati SQL mentah karena tidak ada overhead mapping yang berat; dan (4) kemudahan integrasi dengan framework modern seperti Nuxt 3 (Drizzle, 2025). Dalam SIKONS, Drizzle ORM digunakan untuk semua interaksi basis data termasuk operasi CRUD, query agregasi untuk laporan rekonsiliasi, dan transaksi multi-tabel.

### 2.2.7 Role-Based Access Control (RBAC)

Role-Based Access Control (RBAC) adalah model pengendalian akses di mana hak akses diberikan berdasarkan peran (role) pengguna dalam organisasi, bukan berdasarkan identitas individu (Sandhu et al., 1996). RBAC mencakup empat komponen inti: pengguna (user), peran (role), hak akses (permission), dan sesi (session). Setiap pengguna ditempatkan dalam satu atau lebih peran, dan setiap peran memiliki kumpulan hak akses terhadap sumber daya sistem.

Implementasi RBAC pada SIKONS membagi pengguna ke dalam empat peran: Penyalur dengan akses penuh ke seluruh modul, Sales Field dengan hak input opname dan penyaluran, Mitra dengan hak input laku/retur dan request restock, serta Pemasok dengan akses read-only laporan. Autentikasi menggunakan JWT (JSON Web Token) yang memuat informasi peran pengguna dalam payload token. Middleware RBAC pada Nuxt 3 memvalidasi token dan memeriksa hak akses setiap kali pengguna mengakses halaman atau API route.

---

## Daftar Pustaka

Bantang, T. S., & Nugroho, A. (2023). Rancang bangun sistem informasi pengelolaan barang berbasis web menggunakan framework Nuxt JS. *Jurnal Inovtek Polbeng Seri Informatika*, *8*(1), 55–65.

Bowersox, D. J., Closs, D. J., & Cooper, M. B. (2013). *Supply chain logistics management* (4th ed.). McGraw-Hill.

Connolly, T., & Begg, C. (2015). *Database systems: A practical approach to design, implementation, and management* (6th ed.). Pearson.

Drizzle. (2025). *Drizzle ORM documentation*. https://orm.drizzle.team/docs/

Fauzan, E., & Noprisson, H. (2020). Analisa & perancangan aplikasi e-commerce jasa titip oleh-oleh produk tradisional. *Jurnal Ilmu Teknik Dan Komputer*, *4*(2), 135–145.

Febyanti, A. (2025). Peran sistem informasi akuntansi dalam rangka meningkatkan kinerja karyawan divisi purchasing di PT Semen Indonesia Distributor. *Jurnal Ekonomi, Koperasi & Kewirausahaan*, *14*(1), 45–58.

Implementasi sistem informasi pemasaran berbasis web dalam kegiatan jasa titip barang ekspor impor pada bisnis Tourgether.in. (2020). *Repository Universitas Nurul Fikri*.

Laudon, K. C., & Laudon, J. P. (2020). *Management information systems: Managing the digital firm* (16th ed.). Pearson.

Microsoft. (2022). *TypeScript documentation*. https://www.typescriptlang.org/docs/

Nuxt. (2025). *Nuxt 3 documentation*. https://nuxt.com/docs/

Putri, A. A. (2024). Perancangan sistem pencatatan transaksi dan pelaporan keuangan menggunakan Google Spreadsheet (Studi Kasus Percetakan Tunas Karya) [D4 thesis, Politeknik Negeri Jakarta]. Repository Politeknik Negeri Jakarta.

Sandhu, R., Coyne, E. J., Feinstein, H. L., & Youman, C. E. (1996). Role-based access control models. *IEEE Computer*, *29*(2), 38–47.

Setiyani, L. (2019). Pengujian sistem informasi inventory pada perusahaan distributor farmasi menggunakan metode black box testing. *Techno Xplore: Jurnal Ilmu Komputer dan Teknologi Informasi*, *4*(1), 30–38.

Utami, C. W. (2017). *Manajemen ritel: Strategi dan implementasi operasional bisnis ritel modern* (2nd ed.). Salemba Empat.
