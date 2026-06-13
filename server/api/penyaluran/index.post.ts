import { z } from 'zod'
import { eq, and, sql } from 'drizzle-orm'
import { penyaluran, itemPenyaluran, stokGudang, faktur } from '~~/server/database/schema'
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
  requireRole(event, ['penyalur', 'sales'])
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = await useDB()
  const user = event.context.user!

  const today = body.tanggalPenyaluran.replace(/-/g, '')
  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(penyaluran)
    .where(sql`DATE(tanggal_penyaluran) = ${body.tanggalPenyaluran}`)
  const seq = String((count[0]?.count || 0) + 1).padStart(4, '0')
  const nomorPenyaluran = `DEL-${today}-${seq}`

  const result = await db.transaction(async (tx) => {
    const [header] = await tx.insert(penyaluran).values({
      nomorPenyaluran,
      idGudangAsal: body.idGudangAsal,
      idMitra: body.idMitra,
      idSales: user.id,
      tanggalPenyaluran: new Date(body.tanggalPenyaluran),
      status: 'draft',
      dibuatOleh: user.id,
    })

    const idPenyaluran = Number(header.insertId)
    let totalNilai = 0

    for (const item of body.items) {
      const subtotal = item.jumlahDikirim * item.snapshotHargaJual
      totalNilai += subtotal

      await tx.insert(itemPenyaluran).values({
        idPenyaluran,
        idProduk: item.idProduk,
        jumlahDikirim: item.jumlahDikirim,
        snapshotHargaJual: String(item.snapshotHargaJual),
        snapshotHargaTebus: String(item.snapshotHargaTebus),
      })

      const existing = await tx
        .select()
        .from(stokGudang)
        .where(
          and(
            eq(stokGudang.idGudang, body.idGudangAsal),
            eq(stokGudang.idProduk, item.idProduk),
          ),
        )
        .limit(1)

      if (existing.length) {
        const newJumlah = existing[0].jumlah - item.jumlahDikirim
        if (newJumlah < 0) {
          throw createError({
            statusCode: 400,
            statusMessage: `Stok tidak mencukupi untuk produk ID ${item.idProduk}`,
          })
        }
        await tx
          .update(stokGudang)
          .set({
            jumlah: sql`${stokGudang.jumlah} - ${item.jumlahDikirim}`,
            diperbaruiPada: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(stokGudang.id, existing[0].id))
      } else {
        throw createError({
          statusCode: 400,
          statusMessage: `Produk ID ${item.idProduk} tidak memiliki stok di gudang ini`,
        })
      }
    }

    const year = new Date().getFullYear()
    const invCount = await tx
      .select({ count: sql<number>`count(*)` })
      .from(faktur)
      .where(sql`YEAR(diterbitkan_pada) = ${year}`)
    const invSeq = String((invCount[0]?.count || 0) + 1).padStart(4, '0')
    const nomorFaktur = `INV-${year}-${invSeq}`

    await tx.insert(faktur).values({
      nomorFaktur,
      idPenyaluran,
      totalNilai: String(totalNilai),
      diterbitkanPada: new Date(),
    })

    return idPenyaluran
  })

  return { data: { id: result }, message: 'Penyaluran berhasil dibuat' }
})
