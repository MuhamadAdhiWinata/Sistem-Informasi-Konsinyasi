import { bigint, mysqlTable, tinyint, varchar } from 'drizzle-orm/mysql-core';

// Tabel: pemasok (suppliers)
export const pemasok = mysqlTable('pemasok', {
  id:            bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  nama:          varchar('nama', { length: 100 }).notNull(),
  kategoriMerek: varchar('kategori_merek', { length: 100 }),
  narahubung:    varchar('narahubung', { length: 100 }),
  apakahAktif:   tinyint('apakah_aktif').notNull().default(1),
});
