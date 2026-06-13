import { desc, eq } from 'drizzle-orm'
import { penyaluran, mitra, gudang, pengguna, faktur } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const db = await useDB()
  const items = await db
    .select({
      id: penyaluran.id,
      nomorPenyaluran: penyaluran.nomorPenyaluran,
      tanggalPenyaluran: penyaluran.tanggalPenyaluran,
      status: penyaluran.status,
      mitra: mitra.nama,
      gudangAsal: gudang.nama,
      sales: pengguna.nama,
      nomorFaktur: faktur.nomorFaktur,
      totalNilai: faktur.totalNilai,
    })
    .from(penyaluran)
    .leftJoin(mitra, eq(penyaluran.idMitra, mitra.id))
    .leftJoin(gudang, eq(penyaluran.idGudangAsal, gudang.id))
    .leftJoin(pengguna, eq(penyaluran.idSales, pengguna.id))
    .leftJoin(faktur, eq(penyaluran.id, faktur.idPenyaluran))
    .orderBy(desc(penyaluran.tanggalPenyaluran))

  let result = items
  if (user?.peran === 'pemasok') {
    result = items.map(i => ({ ...i, totalNilai: null }))
  }

  return { data: result }
})