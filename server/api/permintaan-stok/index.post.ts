import { z } from 'zod'
import { sql } from 'drizzle-orm'
import { permintaanStok, itemPermintaanStok } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'
import { requireRole } from '~~/server/utils/rbac'

const itemSchema = z.object({
  idProduk: z.number().int().positive(),
  jumlahDiminta: z.number().int().positive(),
})

const bodySchema = z.object({
  idMitra: z.number().int().positive(),
  items: z.array(itemSchema).min(1, 'Minimal 1 item'),
})

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur', 'sales', 'mitra'])
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = await useDB()
  const user = event.context.user!

  // Mitra hanya bisa request restock untuk dirinya sendiri
  const idMitra = user.peran === 'mitra' ? user.idMitra! : body.idMitra

  const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(permintaanStok)
    .where(sql`DATE(nomor_permintaan) IS NOT NULL`)
  const seq = String((count[0]?.count || 0) + 1).padStart(4, '0')
  const nomorPermintaan = `RR-${today}-${seq}`

  const [header] = await db.insert(permintaanStok).values({
    nomorPermintaan,
    idMitra,
    dimintaOleh: user.id,
    status: 'pending',
  })
  const idPermintaan = Number(header.insertId)

  for (const item of body.items) {
    await db.insert(itemPermintaanStok).values({
      idPermintaan,
      idProduk: item.idProduk,
      jumlahDiminta: item.jumlahDiminta,
    })
  }

  return { data: { id: idPermintaan, nomorPermintaan }, message: 'Permintaan restok berhasil dibuat' }
})
