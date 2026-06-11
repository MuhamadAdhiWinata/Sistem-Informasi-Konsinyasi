import { bigint, mysqlEnum, mysqlTable, tinyint, varchar } from 'drizzle-orm/mysql-core';

// Tabel: pengguna
// FK: id_mitra → mitra.id, id_pemasok → pemasok.id (di-define relasi di index.ts)
export const pengguna = mysqlTable('pengguna', {
  id:           bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  nama:         varchar('nama', { length: 100 }).notNull(),
  email:        varchar('email', { length: 150 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  peran:        mysqlEnum('peran', ['penyalur', 'sales', 'mitra', 'pemasok']).notNull(),
  idMitra:      bigint('id_mitra', { mode: 'number', unsigned: true }),
  idPemasok:    bigint('id_pemasok', { mode: 'number', unsigned: true }),
  apakahAktif:  tinyint('apakah_aktif').notNull().default(1),
});
