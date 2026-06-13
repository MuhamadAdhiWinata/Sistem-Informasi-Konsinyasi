import { z } from 'zod'
import { eq, and, sql } from 'drizzle-orm'
import { penyaluran, itemPenyaluran, stokGudang } from '~~/server/database/schema'
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

  // Decrement stok gudang when transitioning out of draft (sent/received)
  if (existing[0].status === 'draft' && body.status !== 'draft') {
    const items = await db
      .select()
      .from(itemPenyaluran)
      .where(eq(itemPenyaluran.idPenyaluran, id))

    for (const item of items) {
      const stock = await db
        .select()
        .from(stokGudang)
        .where(
          and(
            eq(stokGudang.idGudang, existing[0].idGudangAsal),
            eq(stokGudang.idProduk, item.idProduk),
          ),
        )
        .limit(1)

      if (!stock.length) {
        throw createError({
          statusCode: 400,
          statusMessage: `Produk ID ${item.idProduk} tidak memiliki stok di gudang`,
        })
      }

      const newJumlah = stock[0].jumlah - item.jumlahDikirim
      if (newJumlah < 0) {
        throw createError({
          statusCode: 400,
          statusMessage: `Stok tidak mencukupi untuk produk ID ${item.idProduk}`,
        })
      }

      await db
        .update(stokGudang)
        .set({
          jumlah: sql`${stokGudang.jumlah} - ${item.jumlahDikirim}`,
          diperbaruiPada: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(stokGudang.id, stock[0].id))
    }
  }

  await db
    .update(penyaluran)
    .set({ status: body.status })
    .where(eq(penyaluran.id, id))

  return { message: `Status diubah ke ${body.status}` }
})
