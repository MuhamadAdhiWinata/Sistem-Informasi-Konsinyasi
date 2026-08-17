import { desc, eq } from 'drizzle-orm'
import { penerimaanBarang, pemasok, gudang, pengguna } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'
import { requireRole } from '~~/server/utils/rbac'

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur', 'sales', 'pemasok'])
  const user = event.context.user!
  const db = await useDB()
  const items = await db
    .select({
      id: penerimaanBarang.id,
      nomorPenerimaan: penerimaanBarang.nomorPenerimaan,
      tanggalPenerimaan: penerimaanBarang.tanggalPenerimaan,
      status: penerimaanBarang.status,
      pemasok: pemasok.nama,
      gudang: gudang.nama,
      penerima: pengguna.nama,
    })
    .from(penerimaanBarang)
    .leftJoin(pemasok, eq(penerimaanBarang.idPemasok, pemasok.id))
    .leftJoin(gudang, eq(penerimaanBarang.idGudang, gudang.id))
    .leftJoin(pengguna, eq(penerimaanBarang.diterimaOleh, pengguna.id))
    .where(user.peran === 'pemasok' ? eq(penerimaanBarang.idPemasok, user.idPemasok!) : undefined)
    .orderBy(desc(penerimaanBarang.id))
  return { data: items }
})
