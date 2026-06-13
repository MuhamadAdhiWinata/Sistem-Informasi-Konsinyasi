import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { penerimaanBarang, itemPenerimaanBarang } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'
import { requireRole } from '~~/server/utils/rbac'

const itemSchema = z.object({
  idProduk: z.number().int().positive(),
  jumlah: z.number().int().positive(),
  hargaPabrikAktual: z.number().positive(),
})

const bodySchema = z.object({
  idPemasok: z.number().int().positive(),
  idGudang: z.number().int().positive(),
  tanggalPenerimaan: z.string().min(1),
  items: z.array(itemSchema).min(1, 'Minimal 1 item'),
})

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur'])
  const id = Number(getRouterParam(event, 'id'))
  const body = await readValidatedBody(event, bodySchema.parse)
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
    throw createError({ statusCode: 400, statusMessage: 'Tidak bisa mengedit penerimaan yang sudah selesai' })
  }

  await db.transaction(async (tx) => {
    await tx
      .update(penerimaanBarang)
      .set({
        idPemasok: body.idPemasok,
        idGudang: body.idGudang,
        tanggalPenerimaan: body.tanggalPenerimaan,
      })
      .where(eq(penerimaanBarang.id, id))

    await tx
      .delete(itemPenerimaanBarang)
      .where(eq(itemPenerimaanBarang.idPenerimaan, id))

    for (const item of body.items) {
      await tx.insert(itemPenerimaanBarang).values({
        idPenerimaan: id,
        idProduk: item.idProduk,
        jumlah: item.jumlah,
        hargaPabrikAktual: String(item.hargaPabrikAktual),
      })
    }
  })

  return { message: 'Penerimaan berhasil diperbarui' }
})
