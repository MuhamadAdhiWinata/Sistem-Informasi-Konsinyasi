import { z } from 'zod'
import { eq, and, sql } from 'drizzle-orm'
import { permintaanStok, itemPermintaanStok, penyaluran, itemPenyaluran, stokGudang, faktur, produk } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'
import { requireRole } from '~~/server/utils/rbac'

const bodySchema = z.object({
  action: z.enum(['approved', 'rejected']),
  idGudangAsal: z.number().int().positive().optional(),
  items: z.array(z.object({
    id: z.number().int().positive(),
    jumlahDisetujui: z.number().int().positive(),
  })).optional(),
})

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur'])
  const id = Number(getRouterParam(event, 'id'))
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = await useDB()
  const user = event.context.user!

  const existing = await db
    .select()
    .from(permintaanStok)
    .where(eq(permintaanStok.id, id))
    .limit(1)

  if (!existing.length) {
    throw createError({ statusCode: 404, statusMessage: 'Permintaan not found' })
  }

  if (existing[0].status !== 'pending') {
    throw createError({ statusCode: 400, statusMessage: 'Permintaan sudah diproses' })
  }

  if (body.action === 'rejected') {
    await db
      .update(permintaanStok)
      .set({ status: 'rejected', disetujuiOleh: user.id })
      .where(eq(permintaanStok.id, id))
    return { message: 'Permintaan ditolak' }
  }

  if (!body.idGudangAsal) {
    throw createError({ statusCode: 400, statusMessage: 'Pilih gudang asal untuk approval' })
  }

  const result = await db.transaction(async (tx) => {
    await tx
      .update(permintaanStok)
      .set({ status: 'approved', disetujuiOleh: user.id })
      .where(eq(permintaanStok.id, id))

    if (body.items && body.items.length) {
      for (const bi of body.items) {
        await tx
          .update(itemPermintaanStok)
          .set({ jumlahDisetujui: bi.jumlahDisetujui })
          .where(eq(itemPermintaanStok.id, bi.id))
      }
    }

    const items = await tx
      .select({
        id: itemPermintaanStok.id,
        idProduk: itemPermintaanStok.idProduk,
        jumlahDiminta: itemPermintaanStok.jumlahDiminta,
        jumlahDisetujui: itemPermintaanStok.jumlahDisetujui,
      })
      .from(itemPermintaanStok)
      .where(eq(itemPermintaanStok.idPermintaan, id))

    const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const count = await tx
      .select({ count: sql<number>`count(*)` })
      .from(penyaluran)
      .where(sql`DATE(tanggal_penyaluran) = CURDATE()`)
    const seq = String((count[0]?.count || 0) + 1).padStart(4, '0')
    const nomorPenyaluran = `DEL-${today}-${seq}`

    const [penyaluranResult] = await tx.insert(penyaluran).values({
      nomorPenyaluran,
      idGudangAsal: body.idGudangAsal!,
      idMitra: existing[0].idMitra,
      idSales: user.id,
      tanggalPenyaluran: new Date(),
      status: 'draft',
      dibuatOleh: user.id,
    })
    const idPenyaluran = Number(penyaluranResult.insertId)

    let totalNilai = 0
    for (const item of items) {
      const approvedQty = item.jumlahDisetujui || item.jumlahDiminta

      const [produkData] = await tx
        .select({ hargaRetail: produk.hargaRetail, hargaPabrik: produk.hargaPabrik, hargaGrosir: produk.hargaGrosir })
        .from(produk)
        .where(eq(produk.id, item.idProduk))
        .limit(1)

      const hargaRetail = Number(produkData?.hargaRetail || 0)
      const hargaGrosir = Number(produkData?.hargaGrosir || 0)

      await tx.insert(itemPenyaluran).values({
        idPenyaluran,
        idProduk: item.idProduk,
        jumlahDikirim: approvedQty,
        snapshotHargaRetail: String(hargaRetail),
        snapshotHargaGrosir: String(hargaGrosir),
      })

      const existingStok = await tx
        .select()
        .from(stokGudang)
        .where(
          and(
            eq(stokGudang.idGudang, body.idGudangAsal!),
            eq(stokGudang.idProduk, item.idProduk),
          ),
        )
        .limit(1)

      if (existingStok.length) {
        await tx
          .update(stokGudang)
          .set({
            jumlah: sql`${stokGudang.jumlah} - ${approvedQty}`,
            diperbaruiPada: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(stokGudang.id, existingStok[0].id))
      }

      totalNilai += approvedQty * hargaRetail
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

    await tx
      .update(permintaanStok)
      .set({ status: 'fulfilled', idPenyaluran })
      .where(eq(permintaanStok.id, id))

    return idPenyaluran
  })

  return { data: { idPenyaluran: result }, message: 'Permintaan disetujui dan penyaluran dibuat' }
})
