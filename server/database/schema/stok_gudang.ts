import { bigint, int, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';
import { gudang } from './gudang';
import { produk } from './produk';

// Tabel: stok_gudang (warehouse_stocks)
// FK: id_gudang → gudang.id, id_produk → produk.id
export const stokGudang = mysqlTable('stok_gudang', {
  id:              bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  idGudang:        bigint('id_gudang', { mode: 'number', unsigned: true }).notNull().references(() => gudang.id),
  idProduk:        bigint('id_produk', { mode: 'number', unsigned: true }).notNull().references(() => produk.id),
  jumlah:          int('jumlah').notNull().default(0),
  diperbaruiPada:  timestamp('diperbarui_pada').notNull().defaultNow().onUpdateNow(),
});
