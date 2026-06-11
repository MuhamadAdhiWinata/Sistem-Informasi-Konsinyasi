import { bigint, date, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { gudang } from './gudang';
import { mitra } from './mitra';
import { pengguna } from './pengguna';

// Tabel: penyaluran (distributions)
// FK: id_gudang_asal, id_mitra, id_sales, dibuat_oleh → pengguna.id
export const penyaluran = mysqlTable('penyaluran', {
  id:               bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  nomorPenyaluran:  varchar('nomor_penyaluran', { length: 50 }).notNull().unique(),
  idGudangAsal:     bigint('id_gudang_asal', { mode: 'number', unsigned: true }).notNull().references(() => gudang.id),
  idMitra:          bigint('id_mitra', { mode: 'number', unsigned: true }).notNull().references(() => mitra.id),
  idSales:          bigint('id_sales', { mode: 'number', unsigned: true }).notNull().references(() => pengguna.id),
  tanggalPenyaluran: date('tanggal_penyaluran').notNull(),
  status:           mysqlEnum('status', ['draft', 'sent', 'received']).notNull().default('draft'),
  dibuatOleh:       bigint('dibuat_oleh', { mode: 'number', unsigned: true }).notNull().references(() => pengguna.id),
});
