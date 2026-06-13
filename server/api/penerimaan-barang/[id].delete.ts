import { eq } from 'drizzle-orm'
import { penerimaanBarang, itemPenerimaanBarang } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'
import { requireRole } from '~~/server/utils/rbac'

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur'])
  const id = Number(getRouterParam(event, 'id'))
  const db = await useDB()

  const existing = await db
    .select()
    .from(penerimaanBarang)
    .where(eq(penerimaanBarang.id, id))
    .limit(1)

  if (!existing.length) {
    throw createError({ statusCode: 404, statusMessage: 'Penerimaan not found' })
  }

  if (existing[0].status === 'completed') {
    throw createError({ statusCode: 400, statusMessage: 'Tidak bisa menghapus penerimaan yang sudah selesai' })
  }

  await db.transaction(async (tx) => {
    await tx.delete(itemPenerimaanBarang).where(eq(itemPenerimaanBarang.idPenerimaan, id))
    await tx.delete(penerimaanBarang).where(eq(penerimaanBarang.id, id))
  })

  return { message: 'Penerimaan berhasil dihapus' }
})
