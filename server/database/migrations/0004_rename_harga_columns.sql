ALTER TABLE `produk` CHANGE COLUMN `harga_tebus` `harga_pabrik` decimal(12,2) NOT NULL;
ALTER TABLE `produk` CHANGE COLUMN `harga_jual_penyalur` `harga_grosir` decimal(12,2) NOT NULL;
ALTER TABLE `produk` CHANGE COLUMN `harga_jual` `harga_retail` decimal(12,2) NOT NULL;
ALTER TABLE `item_penerimaan_barang` CHANGE COLUMN `harga_tebus_aktual` `harga_pabrik_aktual` decimal(12,2) NOT NULL;
ALTER TABLE `item_penyaluran` CHANGE COLUMN `snapshot_harga_jual` `snapshot_harga_retail` decimal(12,2) NOT NULL;
ALTER TABLE `item_penyaluran` CHANGE COLUMN `snapshot_harga_tebus` `snapshot_harga_pabrik` decimal(12,2) NOT NULL;
