CREATE TABLE `faktur` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`nomor_faktur` varchar(50) NOT NULL,
	`id_penyaluran` bigint unsigned NOT NULL,
	`total_nilai` decimal(14,2) NOT NULL,
	`diterbitkan_pada` timestamp NOT NULL DEFAULT (now()),
	`url_pdf` varchar(255),
	CONSTRAINT `faktur_id` PRIMARY KEY(`id`),
	CONSTRAINT `faktur_nomor_faktur_unique` UNIQUE(`nomor_faktur`)
);
--> statement-breakpoint
CREATE TABLE `gudang` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`kode` varchar(20) NOT NULL,
	`nama` varchar(100) NOT NULL,
	`alamat` text,
	`apakah_aktif` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `gudang_id` PRIMARY KEY(`id`),
	CONSTRAINT `gudang_kode_unique` UNIQUE(`kode`)
);
--> statement-breakpoint
CREATE TABLE `pengguna` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`nama` varchar(100) NOT NULL,
	`email` varchar(150) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`peran` enum('penyalur','sales','mitra','pemasok') NOT NULL,
	`id_mitra` bigint unsigned,
	`id_pemasok` bigint unsigned,
	`apakah_aktif` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `pengguna_id` PRIMARY KEY(`id`),
	CONSTRAINT `pengguna_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `pemasok` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`nama` varchar(100) NOT NULL,
	`kategori_merek` varchar(100),
	`narahubung` varchar(100),
	`apakah_aktif` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `pemasok_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `produk` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`sku` varchar(50) NOT NULL,
	`nama` varchar(150) NOT NULL,
	`id_pemasok` bigint unsigned NOT NULL,
	`satuan` varchar(20) NOT NULL,
	`harga_tebus` decimal(12,2) NOT NULL,
	`harga_jual` decimal(12,2) NOT NULL,
	`apakah_aktif` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `produk_id` PRIMARY KEY(`id`),
	CONSTRAINT `produk_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `mitra` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`nama` varchar(100) NOT NULL,
	`nama_pemilik` varchar(100) NOT NULL,
	`telepon` varchar(20),
	`lat` decimal(10,8),
	`lng` decimal(11,8),
	`id_sales_ditugaskan` bigint unsigned,
	`apakah_aktif` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `mitra_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stok_gudang` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`id_gudang` bigint unsigned NOT NULL,
	`id_produk` bigint unsigned NOT NULL,
	`jumlah` int NOT NULL DEFAULT 0,
	`diperbarui_pada` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stok_gudang_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `penerimaan_barang` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`nomor_penerimaan` varchar(50) NOT NULL,
	`id_pemasok` bigint unsigned NOT NULL,
	`id_gudang` bigint unsigned NOT NULL,
	`diterima_oleh` bigint unsigned NOT NULL,
	`tanggal_penerimaan` date NOT NULL,
	CONSTRAINT `penerimaan_barang_id` PRIMARY KEY(`id`),
	CONSTRAINT `penerimaan_barang_nomor_penerimaan_unique` UNIQUE(`nomor_penerimaan`)
);
--> statement-breakpoint
CREATE TABLE `item_penerimaan_barang` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`id_penerimaan` bigint unsigned NOT NULL,
	`id_produk` bigint unsigned NOT NULL,
	`jumlah` int NOT NULL,
	`harga_tebus_aktual` decimal(12,2) NOT NULL,
	CONSTRAINT `item_penerimaan_barang_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `penyaluran` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`nomor_penyaluran` varchar(50) NOT NULL,
	`id_gudang_asal` bigint unsigned NOT NULL,
	`id_mitra` bigint unsigned NOT NULL,
	`id_sales` bigint unsigned NOT NULL,
	`tanggal_penyaluran` date NOT NULL,
	`status` enum('draft','sent','received') NOT NULL DEFAULT 'draft',
	`dibuat_oleh` bigint unsigned NOT NULL,
	CONSTRAINT `penyaluran_id` PRIMARY KEY(`id`),
	CONSTRAINT `penyaluran_nomor_penyaluran_unique` UNIQUE(`nomor_penyaluran`)
);
--> statement-breakpoint
CREATE TABLE `item_penyaluran` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`id_penyaluran` bigint unsigned NOT NULL,
	`id_produk` bigint unsigned NOT NULL,
	`jumlah_dikirim` int NOT NULL,
	`snapshot_harga_jual` decimal(12,2) NOT NULL,
	`snapshot_harga_tebus` decimal(12,2) NOT NULL,
	CONSTRAINT `item_penyaluran_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `opname_stok` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`nomor_opname` varchar(50) NOT NULL,
	`id_mitra` bigint unsigned NOT NULL,
	`id_sales` bigint unsigned NOT NULL,
	`tanggal_kunjungan` date NOT NULL,
	`status` enum('draft','submitted','verified') NOT NULL DEFAULT 'draft',
	`memiliki_anomali` tinyint NOT NULL DEFAULT 0,
	`dibuat_oleh` bigint unsigned NOT NULL,
	CONSTRAINT `opname_stok_id` PRIMARY KEY(`id`),
	CONSTRAINT `opname_stok_nomor_opname_unique` UNIQUE(`nomor_opname`)
);
--> statement-breakpoint
CREATE TABLE `item_opname` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`id_opname` bigint unsigned NOT NULL,
	`id_produk` bigint unsigned NOT NULL,
	`stok_awal` int NOT NULL,
	`jumlah_laku` int NOT NULL,
	`jumlah_retur` int NOT NULL,
	`stok_fisik` int NOT NULL,
	`kondisi_retur` enum('good','damaged','expired'),
	`apakah_anomali` tinyint NOT NULL DEFAULT 0,
	CONSTRAINT `item_opname_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `permintaan_stok` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`nomor_permintaan` varchar(50) NOT NULL,
	`id_mitra` bigint unsigned NOT NULL,
	`diminta_oleh` bigint unsigned NOT NULL,
	`status` enum('pending','approved','rejected','fulfilled') NOT NULL DEFAULT 'pending',
	`disetujui_oleh` bigint unsigned,
	`id_penyaluran` bigint unsigned,
	CONSTRAINT `permintaan_stok_id` PRIMARY KEY(`id`),
	CONSTRAINT `permintaan_stok_nomor_permintaan_unique` UNIQUE(`nomor_permintaan`)
);
--> statement-breakpoint
CREATE TABLE `item_permintaan_stok` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`id_permintaan` bigint unsigned NOT NULL,
	`id_produk` bigint unsigned NOT NULL,
	`jumlah_diminta` int NOT NULL,
	`jumlah_disetujui` int,
	CONSTRAINT `item_permintaan_stok_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prediksi_stok` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`id_mitra` bigint unsigned NOT NULL,
	`id_produk` bigint unsigned NOT NULL,
	`jumlah_prediksi` int NOT NULL,
	`rata_rata_laku` decimal(8,2) NOT NULL,
	`berdasarkan_kunjungan` int NOT NULL,
	`dihasilkan_pada` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prediksi_stok_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `faktur` ADD CONSTRAINT `faktur_id_penyaluran_penyaluran_id_fk` FOREIGN KEY (`id_penyaluran`) REFERENCES `penyaluran`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `produk` ADD CONSTRAINT `produk_id_pemasok_pemasok_id_fk` FOREIGN KEY (`id_pemasok`) REFERENCES `pemasok`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mitra` ADD CONSTRAINT `mitra_id_sales_ditugaskan_pengguna_id_fk` FOREIGN KEY (`id_sales_ditugaskan`) REFERENCES `pengguna`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stok_gudang` ADD CONSTRAINT `stok_gudang_id_gudang_gudang_id_fk` FOREIGN KEY (`id_gudang`) REFERENCES `gudang`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stok_gudang` ADD CONSTRAINT `stok_gudang_id_produk_produk_id_fk` FOREIGN KEY (`id_produk`) REFERENCES `produk`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `penerimaan_barang` ADD CONSTRAINT `penerimaan_barang_id_pemasok_pemasok_id_fk` FOREIGN KEY (`id_pemasok`) REFERENCES `pemasok`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `penerimaan_barang` ADD CONSTRAINT `penerimaan_barang_id_gudang_gudang_id_fk` FOREIGN KEY (`id_gudang`) REFERENCES `gudang`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `penerimaan_barang` ADD CONSTRAINT `penerimaan_barang_diterima_oleh_pengguna_id_fk` FOREIGN KEY (`diterima_oleh`) REFERENCES `pengguna`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `item_penerimaan_barang` ADD CONSTRAINT `item_penerimaan_barang_id_penerimaan_penerimaan_barang_id_fk` FOREIGN KEY (`id_penerimaan`) REFERENCES `penerimaan_barang`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `item_penerimaan_barang` ADD CONSTRAINT `item_penerimaan_barang_id_produk_produk_id_fk` FOREIGN KEY (`id_produk`) REFERENCES `produk`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `penyaluran` ADD CONSTRAINT `penyaluran_id_gudang_asal_gudang_id_fk` FOREIGN KEY (`id_gudang_asal`) REFERENCES `gudang`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `penyaluran` ADD CONSTRAINT `penyaluran_id_mitra_mitra_id_fk` FOREIGN KEY (`id_mitra`) REFERENCES `mitra`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `penyaluran` ADD CONSTRAINT `penyaluran_id_sales_pengguna_id_fk` FOREIGN KEY (`id_sales`) REFERENCES `pengguna`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `penyaluran` ADD CONSTRAINT `penyaluran_dibuat_oleh_pengguna_id_fk` FOREIGN KEY (`dibuat_oleh`) REFERENCES `pengguna`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `item_penyaluran` ADD CONSTRAINT `item_penyaluran_id_penyaluran_penyaluran_id_fk` FOREIGN KEY (`id_penyaluran`) REFERENCES `penyaluran`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `item_penyaluran` ADD CONSTRAINT `item_penyaluran_id_produk_produk_id_fk` FOREIGN KEY (`id_produk`) REFERENCES `produk`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `opname_stok` ADD CONSTRAINT `opname_stok_id_mitra_mitra_id_fk` FOREIGN KEY (`id_mitra`) REFERENCES `mitra`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `opname_stok` ADD CONSTRAINT `opname_stok_id_sales_pengguna_id_fk` FOREIGN KEY (`id_sales`) REFERENCES `pengguna`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `opname_stok` ADD CONSTRAINT `opname_stok_dibuat_oleh_pengguna_id_fk` FOREIGN KEY (`dibuat_oleh`) REFERENCES `pengguna`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `item_opname` ADD CONSTRAINT `item_opname_id_opname_opname_stok_id_fk` FOREIGN KEY (`id_opname`) REFERENCES `opname_stok`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `item_opname` ADD CONSTRAINT `item_opname_id_produk_produk_id_fk` FOREIGN KEY (`id_produk`) REFERENCES `produk`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `permintaan_stok` ADD CONSTRAINT `permintaan_stok_id_mitra_mitra_id_fk` FOREIGN KEY (`id_mitra`) REFERENCES `mitra`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `permintaan_stok` ADD CONSTRAINT `permintaan_stok_diminta_oleh_pengguna_id_fk` FOREIGN KEY (`diminta_oleh`) REFERENCES `pengguna`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `permintaan_stok` ADD CONSTRAINT `permintaan_stok_disetujui_oleh_pengguna_id_fk` FOREIGN KEY (`disetujui_oleh`) REFERENCES `pengguna`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `permintaan_stok` ADD CONSTRAINT `permintaan_stok_id_penyaluran_penyaluran_id_fk` FOREIGN KEY (`id_penyaluran`) REFERENCES `penyaluran`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `item_permintaan_stok` ADD CONSTRAINT `item_permintaan_stok_id_permintaan_permintaan_stok_id_fk` FOREIGN KEY (`id_permintaan`) REFERENCES `permintaan_stok`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `item_permintaan_stok` ADD CONSTRAINT `item_permintaan_stok_id_produk_produk_id_fk` FOREIGN KEY (`id_produk`) REFERENCES `produk`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prediksi_stok` ADD CONSTRAINT `prediksi_stok_id_mitra_mitra_id_fk` FOREIGN KEY (`id_mitra`) REFERENCES `mitra`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prediksi_stok` ADD CONSTRAINT `prediksi_stok_id_produk_produk_id_fk` FOREIGN KEY (`id_produk`) REFERENCES `produk`(`id`) ON DELETE no action ON UPDATE no action;