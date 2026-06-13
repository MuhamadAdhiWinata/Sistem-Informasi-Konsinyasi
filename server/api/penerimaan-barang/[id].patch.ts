import { z } from 'zod'
import { eq, and, sql } from 'drizzle-orm'
import { penerimaanBarang, itemPenerimaanBarang, stokGudang } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'
import { requireRole } from '~~/server/utils/rbac'

const bodySchema = z.object({
  status: z.literal('completed'),
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
    throw createError({ statusCode: 400, statusMessage: 'Penerimaan sudah selesai sebelumnya' })
  }

  await db.transaction(async (tx) => {
    await tx
      .update(penerimaanBarang)
      .set({ status: body.status })
      .where(eq(penerimaanBarang.id, id))

    const items = await tx
      .select()
      .from(itemPenerimaanBarang)
      .where(eq(itemPenerimaanBarang.idPenerimaan, id))

    for (const item of items) {
      const stock = await tx
        .select()
        .from(stokGudang)
        .where(
          and(
            eq(stokGudang.idGudang, existing[0].idGudang),
            eq(stokGudang.idProduk, item.idProduk),
          ),
        )
        .limit(1)

      if (stock.length) {
        await tx
          .update(stokGudang)
          .set({
            jumlah: sql`${stokGudang.jumlah} + ${item.jumlah}`,
            diperbaruiPada: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(stokGudang.id, stock[0].id))
      } else {
        await tx.insert(stokGudang).values({
          idGudang: existing[0].idGudang,
          idProduk: item.idProduk,
          jumlah: item.jumlah,
        })
      }
    }
  })

  return { message: 'Penerimaan dikonfirmasi, stok gudang diperbarui' }
})
