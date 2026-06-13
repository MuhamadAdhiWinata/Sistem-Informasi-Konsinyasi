import { eq } from 'drizzle-orm'
import { penyaluran, itemPenyaluran, faktur } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'
import { requireRole } from '~~/server/utils/rbac'

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur'])
  const id = Number(getRouterParam(event, 'id'))
  const db = await useDB()

  const existing = await db
    .select()
    .from(penyaluran)
    .where(eq(penyaluran.id, id))
    .limit(1)

  if (!existing.length) {
    throw createError({ statusCode: 404, statusMessage: 'Penyaluran not found' })
  }

  if (existing[0].status !== 'draft') {
    throw createError({ statusCode: 400, statusMessage: 'Only draft penyaluran can be deleted' })
  }

  await db.transaction(async (tx) => {
    await tx.delete(itemPenyaluran).where(eq(itemPenyaluran.idPenyaluran, id))
    await tx.delete(faktur).where(eq(faktur.idPenyaluran, id))
    await tx.delete(penyaluran).where(eq(penyaluran.id, id))
  })

  return { message: 'Penyaluran berhasil dihapus' }
})
