import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'
import { opnameStok, itemOpname } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'
import { requireRole } from '~~/server/utils/rbac'

const itemSchema = z.object({
  idProduk: z.number().int().positive(),
  stokAwal: z.number().int().min(0),
  jumlahLaku: z.number().int().min(0),
  jumlahRetur: z.number().int().min(0),
  kondisiRetur: z.enum(['good', 'damaged', 'expired']).optional(),
})

const bodySchema = z.object({
  idMitra: z.number().int().positive(),
  tanggalKunjungan: z.string().min(1),
  items: z.array(itemSchema).min(1, 'Minimal 1 item'),
})

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur', 'sales', 'mitra'])
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = await useDB()
  const user = event.context.user!

  const today = body.tanggalKunjungan.replace(/-/g, '')
  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(opnameStok)
    .where(sql`DATE(tanggal_kunjungan) = ${body.tanggalKunjungan}`)
  const seq = String((count[0]?.count || 0) + 1).padStart(4, '0')
  const nomorOpname = `OP-${today}-${seq}`

  const idOpname = await db.transaction(async (tx) => {
    const [header] = await tx.insert(opnameStok).values({
      nomorOpname,
      idMitra: body.idMitra,
      idSales: user.id,
      tanggalKunjungan: new Date(body.tanggalKunjungan),
      status: 'draft',
      dibuatOleh: user.id,
    })

    const opnameId = Number(header.insertId)
    let hasAnomaly = false

    for (const item of body.items) {
      const stokFisik = item.stokAwal - item.jumlahLaku - item.jumlahRetur
      const isAnomaly = stokFisik < 0 ? 1 : 0
      if (isAnomaly) hasAnomaly = true

      await tx.insert(itemOpname).values({
        idOpname: opnameId,
        idProduk: item.idProduk,
        stokAwal: item.stokAwal,
        jumlahLaku: item.jumlahLaku,
        jumlahRetur: item.jumlahRetur,
        stokFisik: Math.max(0, stokFisik),
        kondisiRetur: item.kondisiRetur || null,
        apakahAnomali: isAnomaly,
      })
    }

    if (hasAnomaly) {
      await tx
        .update(opnameStok)
        .set({ memilikiAnomali: 1 })
        .where(eq(opnameStok.id, opnameId))
    }

    return opnameId
  })

  return { data: { id: idOpname }, message: 'Opname stok berhasil dibuat' }
})
