import { eq, and } from 'drizzle-orm'
import { penerimaanBarang, itemPenerimaanBarang, pemasok, gudang, pengguna, produk } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const db = await useDB()

  const header = await db
    .select({
      id: penerimaanBarang.id,
      nomorPenerimaan: penerimaanBarang.nomorPenerimaan,
      tanggalPenerimaan: penerimaanBarang.tanggalPenerimaan,
      idPemasok: penerimaanBarang.idPemasok,
      pemasok: pemasok.nama,
      idGudang: penerimaanBarang.idGudang,
      gudang: gudang.nama,
      penerima: pengguna.nama,
    })
    .from(penerimaanBarang)
    .leftJoin(pemasok, eq(penerimaanBarang.idPemasok, pemasok.id))
    .leftJoin(gudang, eq(penerimaanBarang.idGudang, gudang.id))
    .leftJoin(pengguna, eq(penerimaanBarang.diterimaOleh, pengguna.id))
    .where(eq(penerimaanBarang.id, id))
    .limit(1)

  if (!header.length) {
    throw createError({ statusCode: 404, statusMessage: 'Penerimaan not found' })
  }

  const items = await db
    .select({
      id: itemPenerimaanBarang.id,
      idProduk: itemPenerimaanBarang.idProduk,
      produk: produk.nama,
      sku: produk.sku,
      satuan: produk.satuan,
      gambar: produk.gambar,
      jumlah: itemPenerimaanBarang.jumlah,
      hargaTebusAktual: itemPenerimaanBarang.hargaTebusAktual,
    })
    .from(itemPenerimaanBarang)
    .leftJoin(produk, eq(itemPenerimaanBarang.idProduk, produk.id))
    .where(eq(itemPenerimaanBarang.idPenerimaan, id))

  return { data: { ...header[0], items } }
})
