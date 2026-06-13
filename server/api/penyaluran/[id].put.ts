import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { penyaluran, itemPenyaluran } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'
import { requireRole } from '~~/server/utils/rbac'

const itemSchema = z.object({
  idProduk: z.number().int().positive(),
  jumlahDikirim: z.number().int().positive(),
  snapshotHargaJual: z.number().positive(),
  snapshotHargaTebus: z.number().positive(),
})

const bodySchema = z.object({
  idGudangAsal: z.number().int().positive(),
  idMitra: z.number().int().positive(),
  tanggalPenyaluran: z.string().min(1),
  items: z.array(itemSchema).min(1, 'Minimal 1 item'),
})

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur'])
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

  if (existing[0].status !== 'draft') {
    throw createError({ statusCode: 400, statusMessage: 'Tidak bisa mengedit penyaluran yang sudah dikonfirmasi' })
  }

  await db.transaction(async (tx) => {
    await tx
      .update(penyaluran)
      .set({
        idGudangAsal: body.idGudangAsal,
        idMitra: body.idMitra,
        tanggalPenyaluran: new Date(body.tanggalPenyaluran),
      })
      .where(eq(penyaluran.id, id))

    await tx
      .delete(itemPenyaluran)
      .where(eq(itemPenyaluran.idPenyaluran, id))

    for (const item of body.items) {
      await tx.insert(itemPenyaluran).values({
        idPenyaluran: id,
        idProduk: item.idProduk,
        jumlahDikirim: item.jumlahDikirim,
        snapshotHargaJual: String(item.snapshotHargaJual),
        snapshotHargaTebus: String(item.snapshotHargaTebus),
      })
    }
  })

  return { message: 'Penyaluran berhasil diperbarui' }
})
