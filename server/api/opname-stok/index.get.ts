import { desc, eq } from 'drizzle-orm'
import { opnameStok, mitra, pengguna } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'
import { requireRole } from '~~/server/utils/rbac'

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur', 'sales', 'mitra'])
  const user = event.context.user!
  const db = await useDB()
  const items = await db
    .select({
      id: opnameStok.id,
      nomorOpname: opnameStok.nomorOpname,
      tanggalKunjungan: opnameStok.tanggalKunjungan,
      status: opnameStok.status,
      memilikiAnomali: opnameStok.memilikiAnomali,
      mitra: mitra.nama,
      sales: pengguna.nama,
    })
    .from(opnameStok)
    .leftJoin(mitra, eq(opnameStok.idMitra, mitra.id))
    .leftJoin(pengguna, eq(opnameStok.idSales, pengguna.id))
    .where(user.peran === 'mitra' ? eq(opnameStok.idMitra, user.idMitra!) : undefined)
    .orderBy(desc(opnameStok.id))
  return { data: items }
})
