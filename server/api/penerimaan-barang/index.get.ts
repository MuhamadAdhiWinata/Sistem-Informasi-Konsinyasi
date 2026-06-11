import { desc, eq } from 'drizzle-orm'
import { penerimaanBarang, pemasok, gudang, pengguna } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'

export default defineEventHandler(async (event) => {
  const db = await useDB()
  const items = await db
    .select({
      id: penerimaanBarang.id,
      nomorPenerimaan: penerimaanBarang.nomorPenerimaan,
      tanggalPenerimaan: penerimaanBarang.tanggalPenerimaan,
      pemasok: pemasok.nama,
      gudang: gudang.nama,
      penerima: pengguna.nama,
    })
    .from(penerimaanBarang)
    .leftJoin(pemasok, eq(penerimaanBarang.idPemasok, pemasok.id))
    .leftJoin(gudang, eq(penerimaanBarang.idGudang, gudang.id))
    .leftJoin(pengguna, eq(penerimaanBarang.diterimaOleh, pengguna.id))
    .orderBy(desc(penerimaanBarang.tanggalPenerimaan))
  return { data: items }
})
