import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { opnameStok } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'
import { requireRole } from '~~/server/utils/rbac'

const bodySchema = z.object({
  status: z.enum(['draft', 'submitted', 'verified']),
})

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur', 'sales'])
  const id = Number(getRouterParam(event, 'id'))
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = await useDB()

  const existing = await db
    .select()
    .from(opnameStok)
    .where(eq(opnameStok.id, id))
    .limit(1)

  if (!existing.length) {
    throw createError({ statusCode: 404, statusMessage: 'Opname not found' })
  }

  if (body.status === 'verified') {
    requireRole(event, ['penyalur'])
  }

  await db
    .update(opnameStok)
    .set({ status: body.status })
    .where(eq(opnameStok.id, id))

  return { message: `Status diubah ke ${body.status}` }
})
