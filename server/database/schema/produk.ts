import { bigint, decimal, mysqlTable, tinyint, varchar } from 'drizzle-orm/mysql-core';
import { pemasok } from './pemasok';

// Tabel: produk (products)
// FK: id_pemasok → pemasok.id
export const produk = mysqlTable('produk', {
  id:          bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  sku:         varchar('sku', { length: 50 }).notNull().unique(),
  nama:        varchar('nama', { length: 150 }).notNull(),
  idPemasok:   bigint('id_pemasok', { mode: 'number', unsigned: true }).notNull().references(() => pemasok.id),
  satuan:      varchar('satuan', { length: 20 }).notNull(),
  hargaTebus:  decimal('harga_tebus', { precision: 12, scale: 2 }).notNull(),
  hargaJual:   decimal('harga_jual', { precision: 12, scale: 2 }).notNull(),
  apakahAktif: tinyint('apakah_aktif').notNull().default(1),
});
