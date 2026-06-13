import { desc, eq } from 'drizzle-orm'
import { permintaanStok, mitra, pengguna } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'

export default defineEventHandler(async (event) => {
  const db = await useDB()
  const items = await db
    .select({
      id: permintaanStok.id,
      nomorPermintaan: permintaanStok.nomorPermintaan,
      status: permintaanStok.status,
      mitra: mitra.nama,
      pemohon: pengguna.nama,
      idPenyaluran: permintaanStok.idPenyaluran,
    })
    .from(permintaanStok)
    .leftJoin(mitra, eq(permintaanStok.idMitra, mitra.id))
    .leftJoin(pengguna, eq(permintaanStok.dimintaOleh, pengguna.id))
    .orderBy(desc(permintaanStok.id))
  return { data: items }
})
