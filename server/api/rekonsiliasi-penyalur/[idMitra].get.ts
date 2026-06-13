import { eq, sql, desc } from 'drizzle-orm'
import { opnameStok, itemOpname, mitra, produk, pengguna } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur'])
  const idMitra = Number(getRouterParam(event, 'idMitra'))
  const db = await useDB()

  const mitraData = await db
    .select()
    .from(mitra)
    .where(eq(mitra.id, idMitra))
    .limit(1)

  if (!mitraData.length) {
    throw createError({ statusCode: 404, statusMessage: 'Mitra not found' })
  }

  const opnameList = await db
    .select({
      id: opnameStok.id,
      nomorOpname: opnameStok.nomorOpname,
      tanggalKunjungan: opnameStok.tanggalKunjungan,
      status: opnameStok.status,
      sales: pengguna.nama,
    })
    .from(opnameStok)
    .leftJoin(pengguna, eq(opnameStok.idSales, pengguna.id))
    .where(eq(opnameStok.idMitra, idMitra))
    .orderBy(desc(opnameStok.tanggalKunjungan))

  const items = await db
    .select({
      idOpname: itemOpname.idOpname,
      produk: produk.nama,
      sku: produk.sku,
      satuan: produk.satuan,
      stokAwal: itemOpname.stokAwal,
      jumlahLaku: itemOpname.jumlahLaku,
      jumlahRetur: itemOpname.jumlahRetur,
      stokFisik: itemOpname.stokFisik,
      kondisiRetur: itemOpname.kondisiRetur,
      apakahAnomali: itemOpname.apakahAnomali,
      hargaTebus: produk.hargaTebus,
      hargaJualPenyalur: produk.hargaJualPenyalur,
      hargaJual: produk.hargaJual,
      marginMitra: sql<number>`${produk.hargaJual} - ${produk.hargaJualPenyalur}`,
      marginPenyalur: sql<number>`${produk.hargaJualPenyalur} - ${produk.hargaTebus}`,
      pendapatanMitra: sql<number>`${itemOpname.jumlahLaku} * (${produk.hargaJual} - ${produk.hargaJualPenyalur})`,
      pendapatanPenyalur: sql<number>`${itemOpname.jumlahLaku} * (${produk.hargaJualPenyalur} - ${produk.hargaTebus})`,
    })
    .from(itemOpname)
    .innerJoin(produk, eq(itemOpname.idProduk, produk.id))
    .innerJoin(opnameStok, eq(itemOpname.idOpname, opnameStok.id))
    .where(eq(opnameStok.idMitra, idMitra))

  const itemsByOpname = new Map<number, typeof items>()
  for (const item of items) {
    if (!itemsByOpname.has(item.idOpname)) {
      itemsByOpname.set(item.idOpname, [])
    }
    itemsByOpname.get(item.idOpname)!.push(item)
  }

  const summary = await db
    .select({
      totalLaku: sql<number>`coalesce(sum(${itemOpname.jumlahLaku}), 0)`,
      totalRetur: sql<number>`coalesce(sum(${itemOpname.jumlahRetur}), 0)`,
      returBaik: sql<number>`coalesce(sum(case when ${itemOpname.kondisiRetur} = 'good' then ${itemOpname.jumlahRetur} else 0 end), 0)`,
      returRusak: sql<number>`coalesce(sum(case when ${itemOpname.kondisiRetur} = 'damaged' then ${itemOpname.jumlahRetur} else 0 end), 0)`,
      returExpired: sql<number>`coalesce(sum(case when ${itemOpname.kondisiRetur} = 'expired' then ${itemOpname.jumlahRetur} else 0 end), 0)`,
      totalPendapatanMitra: sql<number>`coalesce(sum(${itemOpname.jumlahLaku} * (${produk.hargaJual} - ${produk.hargaJualPenyalur})), 0)`,
      totalPendapatanPenyalur: sql<number>`coalesce(sum(${itemOpname.jumlahLaku} * (${produk.hargaJualPenyalur} - ${produk.hargaTebus})), 0)`,
    })
    .from(itemOpname)
    .innerJoin(produk, eq(itemOpname.idProduk, produk.id))
    .innerJoin(opnameStok, eq(itemOpname.idOpname, opnameStok.id))
    .where(eq(opnameStok.idMitra, idMitra))

  const opnameWithItems = opnameList.map((o) => ({
    ...o,
    items: itemsByOpname.get(o.id) || [],
  }))

  return {
    data: {
      mitra: mitraData[0],
      opnameList: opnameWithItems,
      summary: summary[0],
    },
  }
})
