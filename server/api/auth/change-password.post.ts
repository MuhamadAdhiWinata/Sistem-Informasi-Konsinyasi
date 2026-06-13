import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { pengguna } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'
import { verifyPassword, hashPassword } from '~~/server/utils/auth'

const bodySchema = z.object({
  currentPassword: z.string().min(1, 'Password saat ini wajib diisi'),
  newPassword: z.string().min(6, 'Password baru minimal 6 karakter'),
})

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readValidatedBody(event, bodySchema.parse)
  const db = await useDB()

  const [existing] = await db.select().from(pengguna).where(eq(pengguna.id, user.id)).limit(1)
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'User tidak ditemukan' })

  const isValid = await verifyPassword(body.currentPassword, existing.passwordHash)
  if (!isValid) throw createError({ statusCode: 400, statusMessage: 'Password saat ini salah' })

  const newHash = await hashPassword(body.newPassword)
  await db.update(pengguna).set({ passwordHash: newHash }).where(eq(pengguna.id, user.id))

  return { message: 'Password berhasil diubah' }
})
