import { bigint, decimal, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { penyaluran } from './penyaluran';

// Tabel: faktur (invoices)
// FK: id_penyaluran → penyaluran.id (relasi one-to-one)
export const faktur = mysqlTable('faktur', {
  id:             bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  nomorFaktur:    varchar('nomor_faktur', { length: 50 }).notNull().unique(),
  idPenyaluran:   bigint('id_penyaluran', { mode: 'number', unsigned: true }).notNull().references(() => penyaluran.id),
  totalNilai:     decimal('total_nilai', { precision: 14, scale: 2 }).notNull(),
  diterbitkanPada: timestamp('diterbitkan_pada').notNull().defaultNow(),
  urlPdf:         varchar('url_pdf', { length: 255 }),
});
