import { eq, desc } from 'drizzle-orm'
import { prediksiStok, produk } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'

export default defineEventHandler(async (event) => {
  const idMitra = Number(getRouterParam(event, 'idMitra'))
  const db = await useDB()

  const items = await db
    .select({
      id: prediksiStok.id,
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
    .leftJoin(produk, eq(prediksiStok.idProduk, produk.id))
    .where(eq(prediksiStok.idMitra, idMitra))
    .orderBy(desc(prediksiStok.jumlahPrediksi))

  return { data: items }
})
