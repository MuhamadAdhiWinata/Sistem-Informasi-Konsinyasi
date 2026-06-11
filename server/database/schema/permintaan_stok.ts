import { bigint, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { mitra } from './mitra';
import { pengguna } from './pengguna';
import { penyaluran } from './penyaluran';

// Tabel: permintaan_stok (restock_requests)
// FK: id_mitra, diminta_oleh, disetujui_oleh → pengguna.id, id_penyaluran → penyaluran.id
export const permintaanStok = mysqlTable('permintaan_stok', {
  id:              bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  nomorPermintaan: varchar('nomor_permintaan', { length: 50 }).notNull().unique(),
  idMitra:         bigint('id_mitra', { mode: 'number', unsigned: true }).notNull().references(() => mitra.id),
  dimintaOleh:     bigint('diminta_oleh', { mode: 'number', unsigned: true }).notNull().references(() => pengguna.id),
  status:          mysqlEnum('status', ['pending', 'approved', 'rejected', 'fulfilled']).notNull().default('pending'),
  disetujuiOleh:   bigint('disetujui_oleh', { mode: 'number', unsigned: true }).references(() => pengguna.id),
  idPenyaluran:    bigint('id_penyaluran', { mode: 'number', unsigned: true }).references(() => penyaluran.id),
});
