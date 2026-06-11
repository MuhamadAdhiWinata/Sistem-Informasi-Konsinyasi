import { bigint, mysqlTable, text, tinyint, varchar } from 'drizzle-orm/mysql-core';

// Tabel: gudang (warehouses)
export const gudang = mysqlTable('gudang', {
  id:          bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  kode:        varchar('kode', { length: 20 }).notNull().unique(),
  nama:        varchar('nama', { length: 100 }).notNull(),
  alamat:      text('alamat'),
  apakahAktif: tinyint('apakah_aktif').notNull().default(1),
});
