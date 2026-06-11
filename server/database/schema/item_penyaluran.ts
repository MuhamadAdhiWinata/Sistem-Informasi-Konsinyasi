import { bigint, decimal, int, mysqlTable } from 'drizzle-orm/mysql-core';
import { penyaluran } from './penyaluran';
import { produk } from './produk';

// Tabel: item_penyaluran (distribution_items)
// FK: id_penyaluran → penyaluran.id, id_produk → produk.id
export const itemPenyaluran = mysqlTable('item_penyaluran', {
  id:                 bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  idPenyaluran:       bigint('id_penyaluran', { mode: 'number', unsigned: true }).notNull().references(() => penyaluran.id),
  idProduk:           bigint('id_produk', { mode: 'number', unsigned: true }).notNull().references(() => produk.id),
  jumlahDikirim:      int('jumlah_dikirim').notNull(),
  snapshotHargaJual:  decimal('snapshot_harga_jual', { precision: 12, scale: 2 }).notNull(),
  snapshotHargaTebus: decimal('snapshot_harga_tebus', { precision: 12, scale: 2 }).notNull(),
});
