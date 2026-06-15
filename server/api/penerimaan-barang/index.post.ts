import { z } from 'zod'
import { sql } from 'drizzle-orm'
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
  requireRole(event, ['penyalur', 'sales'])
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = await useDB()
  const user = event.context.user!

  // Generate nomor penerimaan: GR-YYYYMMDD-NNNN
  const today = body.tanggalPenerimaan.replace(/-/g, '')
  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(penerimaanBarang)
    .where(sql`DATE(tanggal_penerimaan) = ${body.tanggalPenerimaan}`)
  const seq = String((count[0]?.count || 0) + 1).padStart(4, '0')
  const nomorPenerimaan = `GR-${today}-${seq}`

  const idPenerimaan = await db.transaction(async (tx) => {
    const [result] = await tx.insert(penerimaanBarang).values({
      nomorPenerimaan,
      idPemasok: body.idPemasok,
      idGudang: body.idGudang,
      diterimaOleh: user.id,
      tanggalPenerimaan: new Date(body.tanggalPenerimaan),
      status: 'draft',
    })

    const idPenerimaan = Number(result.insertId)

    for (const item of body.items) {
      await tx.insert(itemPenerimaanBarang).values({
        idPenerimaan,
        idProduk: item.idProduk,
        jumlah: item.jumlah,
        hargaPabrikAktual: String(item.hargaPabrikAktual),
      })
    }

    return idPenerimaan
  })

  return { data: { id: idPenerimaan }, message: 'Penerimaan barang berhasil (menunggu konfirmasi)' }
})
