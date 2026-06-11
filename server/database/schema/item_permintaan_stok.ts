import { bigint, int, mysqlTable } from 'drizzle-orm/mysql-core';
import { permintaanStok } from './permintaan_stok';
import { produk } from './produk';

// Tabel: item_permintaan_stok (restock_request_items)
// FK: id_permintaan → permintaan_stok.id, id_produk → produk.id
export const itemPermintaanStok = mysqlTable('item_permintaan_stok', {
  id:              bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  idPermintaan:    bigint('id_permintaan', { mode: 'number', unsigned: true }).notNull().references(() => permintaanStok.id),
  idProduk:        bigint('id_produk', { mode: 'number', unsigned: true }).notNull().references(() => produk.id),
  jumlahDiminta:   int('jumlah_diminta').notNull(),
  jumlahDisetujui: int('jumlah_disetujui'),
});
