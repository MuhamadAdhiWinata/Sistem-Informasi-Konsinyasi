import { bigint, decimal, mysqlTable, tinyint, varchar } from 'drizzle-orm/mysql-core';
import { pengguna } from './pengguna';

// Tabel: mitra (partners/stores)
// FK: id_sales_ditugaskan → pengguna.id
export const mitra = mysqlTable('mitra', {
  id:                 bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  nama:               varchar('nama', { length: 100 }).notNull(),
  namaPemilik:        varchar('nama_pemilik', { length: 100 }).notNull(),
  telepon:            varchar('telepon', { length: 20 }),
  alamat:             varchar('alamat', { length: 255 }),
  lat:                decimal('lat', { precision: 10, scale: 8 }),
  lng:                decimal('lng', { precision: 11, scale: 8 }),
  idSalesDitugaskan:  bigint('id_sales_ditugaskan', { mode: 'number', unsigned: true }).references(() => pengguna.id),
  apakahAktif:        tinyint('apakah_aktif').notNull().default(1),
});
