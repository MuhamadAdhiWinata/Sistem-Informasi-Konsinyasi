import { bigint, date, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { pemasok } from './pemasok';
import { gudang } from './gudang';
import { pengguna } from './pengguna';

// Tabel: penerimaan_barang (goods_receipts)
// FK: id_pemasok, id_gudang, diterima_oleh → pengguna.id
export const penerimaanBarang = mysqlTable('penerimaan_barang', {
  id:                bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  nomorPenerimaan:   varchar('nomor_penerimaan', { length: 50 }).notNull().unique(),
  idPemasok:         bigint('id_pemasok', { mode: 'number', unsigned: true }).notNull().references(() => pemasok.id),
  idGudang:          bigint('id_gudang', { mode: 'number', unsigned: true }).notNull().references(() => gudang.id),
  diterimaOleh:      bigint('diterima_oleh', { mode: 'number', unsigned: true }).notNull().references(() => pengguna.id),
  tanggalPenerimaan: date('tanggal_penerimaan').notNull(),
  status:            mysqlEnum('status', ['draft', 'completed']).notNull().default('draft'),
});
