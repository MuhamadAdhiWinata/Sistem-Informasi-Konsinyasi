import { bigint, int, mysqlEnum, mysqlTable, tinyint } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm'
import { opnameStok } from './opname_stok';
import { produk } from './produk';

// Tabel: item_opname (opname_items)
// FK: id_opname → opname_stok.id, id_produk → produk.id
// Kalkulasi: stok_fisik = stok_awal - jumlah_laku - jumlah_retur - hilang (dihitung di aplikasi)
export const itemOpname = mysqlTable('item_opname', {
  id:            bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  idOpname:      bigint('id_opname', { mode: 'number', unsigned: true }).notNull().references(() => opnameStok.id),
  idProduk:      bigint('id_produk', { mode: 'number', unsigned: true }).notNull().references(() => produk.id),
  stokAwal:      int('stok_awal').notNull(),
  jumlahLaku:    int('jumlah_laku').notNull(),
  jumlahRetur:   int('jumlah_retur').notNull(),
  hilang:            int('hilang').notNull().default(0),
  penanggungHilang: mysqlEnum('penanggung_hilang', ['penyalur', 'mitra']).notNull().default('penyalur'),
  stokFisik:         int('stok_fisik').notNull(),
  kondisiRetur:  mysqlEnum('kondisi_retur', ['good', 'damaged', 'expired']),
  apakahAnomali: tinyint('apakah_anomali').notNull().default(0),
});
