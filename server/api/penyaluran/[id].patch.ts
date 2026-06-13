import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { penyaluran } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'
import { requireRole } from '~~/server/utils/rbac'

const bodySchema = z.object({
  status: z.enum(['draft', 'sent', 'received']),
})

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur', 'sales'])
  const id = Number(getRouterParam(event, 'id'))
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = await useDB()

  const existing = await db
    .select()
    .from(penyaluran)
    .where(eq(penyaluran.id, id))
    .limit(1)

  if (!existing.length) {
    throw createError({ statusCode: 404, statusMessage: 'Penyaluran not found' })
  }

  if (body.status === 'received') {
    requireRole(event, ['penyalur'])
  }

  await db
    .update(penyaluran)
    .set({ status: body.status })
    .where(eq(penyaluran.id, id))

  return { message: `Status diubah ke ${body.status}` }
})
