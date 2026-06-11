import { bigint, decimal, int, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';
import { mitra } from './mitra';
import { produk } from './produk';

// Tabel: prediksi_stok (stock_forecasts)
// Algoritma: Moving Average N kunjungan terakhir
// FK: id_mitra → mitra.id, id_produk → produk.id
export const prediksiStok = mysqlTable('prediksi_stok', {
  id:                    bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  idMitra:               bigint('id_mitra', { mode: 'number', unsigned: true }).notNull().references(() => mitra.id),
  idProduk:              bigint('id_produk', { mode: 'number', unsigned: true }).notNull().references(() => produk.id),
  jumlahPrediksi:        int('jumlah_prediksi').notNull(),
  rataRataLaku:          decimal('rata_rata_laku', { precision: 8, scale: 2 }).notNull(),
  berdasarkanKunjungan:  int('berdasarkan_kunjungan').notNull(),
  dihasilkanPada:        timestamp('dihasilkan_pada').notNull().defaultNow(),
});
