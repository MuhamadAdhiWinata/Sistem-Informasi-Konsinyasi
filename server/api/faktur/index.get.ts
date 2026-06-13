import { eq, desc, sql } from 'drizzle-orm'
import { faktur, penyaluran, mitra, gudang } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'

export default defineEventHandler(async (event) => {
  const db = await useDB()

  const data = await db
    .select({
      id: faktur.id,
      nomorFaktur: faktur.nomorFaktur,
      idPenyaluran: faktur.idPenyaluran,
      totalNilai: faktur.totalNilai,
      diterbitkanPada: faktur.diterbitkanPada,
      urlPdf: faktur.urlPdf,
      nomorPenyaluran: penyaluran.nomorPenyaluran,
      mitra: mitra.nama,
      gudang: gudang.nama,
      tanggalPenyaluran: penyaluran.tanggalPenyaluran,
      statusPenyaluran: penyaluran.status,
    })
    .from(faktur)
    .leftJoin(penyaluran, eq(faktur.idPenyaluran, penyaluran.id))
    .leftJoin(mitra, eq(penyaluran.idMitra, mitra.id))
    .leftJoin(gudang, eq(penyaluran.idGudangAsal, gudang.id))
    .orderBy(desc(faktur.diterbitkanPada))

  return { data }
})
