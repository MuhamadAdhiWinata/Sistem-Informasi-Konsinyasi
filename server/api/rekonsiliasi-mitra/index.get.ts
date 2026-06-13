import { eq, sql } from 'drizzle-orm'
import { opnameStok, itemOpname, mitra, produk } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'

export default defineEventHandler(async (event) => {
  requireRole(event, ['mitra'])
  const db = await useDB()
  const currentUser = event.context.user!
  const idMitra = currentUser.idMitra!

  const rows = await db
    .select({
      idMitra: opnameStok.idMitra,
      mitra: mitra.nama,
      telepon: mitra.telepon,
      totalOpname: sql<number>`count(distinct ${opnameStok.id})`,
      totalLaku: sql<number>`coalesce(sum(${itemOpname.jumlahLaku}), 0)`,
      totalRetur: sql<number>`coalesce(sum(${itemOpname.jumlahRetur}), 0)`,
      returBaik: sql<number>`coalesce(sum(case when ${itemOpname.kondisiRetur} = 'good' then ${itemOpname.jumlahRetur} else 0 end), 0)`,
      returRusak: sql<number>`coalesce(sum(case when ${itemOpname.kondisiRetur} = 'damaged' then ${itemOpname.jumlahRetur} else 0 end), 0)`,
      returExpired: sql<number>`coalesce(sum(case when ${itemOpname.kondisiRetur} = 'expired' then ${itemOpname.jumlahRetur} else 0 end), 0)`,
      totalPendapatan: sql<number>`coalesce(sum(${itemOpname.jumlahLaku} * (${produk.hargaRetail} - ${produk.hargaGrosir})), 0)`,
    })
    .from(opnameStok)
    .innerJoin(mitra, eq(opnameStok.idMitra, mitra.id))
    .innerJoin(itemOpname, eq(itemOpname.idOpname, opnameStok.id))
    .innerJoin(produk, eq(itemOpname.idProduk, produk.id))
    .where(eq(opnameStok.idMitra, idMitra))
    .groupBy(opnameStok.idMitra, mitra.nama, mitra.telepon)

  return { data: rows }
})
