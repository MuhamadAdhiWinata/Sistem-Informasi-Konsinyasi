import { eq, sql, desc } from 'drizzle-orm'
import { opnameStok, itemOpname, mitra, produk, prediksiStok } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'
import { requireRole } from '~~/server/utils/rbac'

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur'])
  const db = await useDB()

  const mitraList = await db
    .select()
    .from(mitra)
    .where(eq(mitra.apakahAktif, 1))

  const opnameMitraMap = new Map<number, {
    idMitra: number
    mitra: string
    items: { idProduk: number; jumlahLaku: number; tanggalKunjungan: string }[]
  }>()

  for (const m of mitraList) {
    const opnameRecords = await db
      .select({
        id: opnameStok.id,
        tanggalKunjungan: opnameStok.tanggalKunjungan,
      })
      .from(opnameStok)
      .where(eq(opnameStok.idMitra, m.id))
      .orderBy(desc(opnameStok.tanggalKunjungan))

    for (const op of opnameRecords) {
      const itemRows = await db
        .select({
          idProduk: itemOpname.idProduk,
          jumlahLaku: itemOpname.jumlahLaku,
        })
        .from(itemOpname)
        .where(eq(itemOpname.idOpname, op.id))

      for (const item of itemRows) {
        if (!opnameMitraMap.has(m.id)) {
          opnameMitraMap.set(m.id, { idMitra: m.id, mitra: m.nama, items: [] })
        }
        opnameMitraMap.get(m.id)!.items.push({
          idProduk: item.idProduk,
          jumlahLaku: item.jumlahLaku,
          tanggalKunjungan: String(op.tanggalKunjungan),
        })
      }
    }
  }

  const predictions: {
    idMitra: number
    idProduk: number
    jumlahPrediksi: number
    rataRataLaku: number
    berdasarkanKunjungan: number
  }[] = []

  const N = 4

  for (const [, data] of opnameMitraMap) {
    const produkVisits = new Map<number, { totalLaku: number; count: number }>()

    for (const item of data.items) {
      if (!produkVisits.has(item.idProduk)) {
        produkVisits.set(item.idProduk, { totalLaku: 0, count: 0 })
      }
      const pv = produkVisits.get(item.idProduk)!
      if (pv.count < N) {
        pv.totalLaku += item.jumlahLaku
        pv.count++
      }
    }

    for (const [idProduk, { totalLaku, count }] of produkVisits) {
      if (count === 0) continue
      const rataRata = totalLaku / count
      const jumlahPrediksi = Math.ceil(rataRata)

      predictions.push({
        idMitra: data.idMitra,
        idProduk,
        jumlahPrediksi,
        rataRataLaku: Math.round(rataRata * 100) / 100,
        berdasarkanKunjungan: count,
      })
    }
  }

  await db.delete(prediksiStok)

  if (predictions.length) {
    await db.insert(prediksiStok).values(
      predictions.map((p) => ({
        idMitra: p.idMitra,
        idProduk: p.idProduk,
        jumlahPrediksi: p.jumlahPrediksi,
        rataRataLaku: String(p.rataRataLaku),
        berdasarkanKunjungan: p.berdasarkanKunjungan,
      })),
    )
  }

  return {
    data: predictions,
    message: `Prediksi generated untuk ${predictions.length} produk`,
  }
})
