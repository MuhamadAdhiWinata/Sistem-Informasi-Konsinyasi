import { bigint, decimal, int, mysqlTable } from 'drizzle-orm/mysql-core';
import { penerimaanBarang } from './penerimaan_barang';
import { produk } from './produk';

// Tabel: item_penerimaan_barang (goods_receipt_items)
// FK: id_penerimaan → penerimaan_barang.id, id_produk → produk.id
export const itemPenerimaanBarang = mysqlTable('item_penerimaan_barang', {
  id:              bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  idPenerimaan:    bigint('id_penerimaan', { mode: 'number', unsigned: true }).notNull().references(() => penerimaanBarang.id),
  idProduk:        bigint('id_produk', { mode: 'number', unsigned: true }).notNull().references(() => produk.id),
  jumlah:          int('jumlah').notNull(),
  hargaPabrikAktual: decimal('harga_pabrik_aktual', { precision: 12, scale: 2 }).notNull(),
});
