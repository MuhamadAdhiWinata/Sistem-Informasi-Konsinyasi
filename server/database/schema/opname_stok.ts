import { bigint, date, mysqlEnum, mysqlTable, tinyint, varchar } from 'drizzle-orm/mysql-core';
import { mitra } from './mitra';
import { pengguna } from './pengguna';

// Tabel: opname_stok (stock_opnames)
// FK: id_mitra, id_sales, dibuat_oleh → pengguna.id
export const opnameStok = mysqlTable('opname_stok', {
  id:               bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  nomorOpname:      varchar('nomor_opname', { length: 50 }).notNull().unique(),
  idMitra:          bigint('id_mitra', { mode: 'number', unsigned: true }).notNull().references(() => mitra.id),
  idSales:          bigint('id_sales', { mode: 'number', unsigned: true }).notNull().references(() => pengguna.id),
  tanggalKunjungan: date('tanggal_kunjungan').notNull(),
  status:           mysqlEnum('status', ['draft', 'submitted', 'verified']).notNull().default('draft'),
  memilikiAnomali:  tinyint('memiliki_anomali').notNull().default(0),
  dibuatOleh:       bigint('dibuat_oleh', { mode: 'number', unsigned: true }).notNull().references(() => pengguna.id),
});
