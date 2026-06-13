import { eq, and, sql } from 'drizzle-orm'
import { stokGudang, gudang, produk } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'

export default defineEventHandler(async (event) => {
  const db = await useDB()
  const query = getQuery(event)
  const idGudang = query.idGudang ? Number(query.idGudang) : undefined

  const where = idGudang ? and(eq(stokGudang.idGudang, idGudang)) : undefined

  const items = await db
    .select({
      id: stokGudang.id,
      idGudang: stokGudang.idGudang,
      gudang: gudang.nama,
      kodeGudang: gudang.kode,
      idProduk: stokGudang.idProduk,
      produk: produk.nama,
      sku: produk.sku,
      satuan: produk.satuan,
      jumlah: stokGudang.jumlah,
      diperbaruiPada: stokGudang.diperbaruiPada,
    })
    .from(stokGudang)
    .leftJoin(gudang, eq(stokGudang.idGudang, gudang.id))
    .leftJoin(produk, eq(stokGudang.idProduk, produk.id))
    .where(where)
    .orderBy(gudang.nama, produk.nama)

  return { data: items }
})
