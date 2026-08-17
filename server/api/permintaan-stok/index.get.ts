import { desc, eq } from 'drizzle-orm'
import { permintaanStok, mitra, pengguna } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'
import { requireRole } from '~~/server/utils/rbac'

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur', 'sales', 'mitra'])
  const user = event.context.user!
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
    .where(user.peran === 'mitra' ? eq(permintaanStok.idMitra, user.idMitra!) : undefined)
    .orderBy(desc(permintaanStok.id))
  return { data: items }
})
