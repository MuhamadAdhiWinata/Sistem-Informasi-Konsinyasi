import { desc, eq, sql } from 'drizzle-orm'
import { prediksiStok, mitra, produk } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'

export default defineEventHandler(async (event) => {
  const db = await useDB()
  const items = await db
    .select({
      id: prediksiStok.id,
      idMitra: prediksiStok.idMitra,
      mitra: mitra.nama,
      idProduk: prediksiStok.idProduk,
      produk: produk.nama,
      sku: produk.sku,
      satuan: produk.satuan,
      jumlahPrediksi: prediksiStok.jumlahPrediksi,
      rataRataLaku: prediksiStok.rataRataLaku,
      berdasarkanKunjungan: prediksiStok.berdasarkanKunjungan,
      dihasilkanPada: prediksiStok.dihasilkanPada,
    })
    .from(prediksiStok)
    .leftJoin(mitra, eq(prediksiStok.idMitra, mitra.id))
    .leftJoin(produk, eq(prediksiStok.idProduk, produk.id))
    .orderBy(desc(prediksiStok.dihasilkanPada))

  return { data: items }
})
