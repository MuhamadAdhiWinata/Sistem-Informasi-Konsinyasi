import { eq, sql } from 'drizzle-orm'
import { opnameStok, itemOpname, mitra, produk, penyaluran } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur'])
  const db = await useDB()

  const rows = await db
    .select({
      idMitra: opnameStok.idMitra,
      mitra: mitra.nama,
      telepon: mitra.telepon,
      totalOpname: sql<number>`count(distinct ${opnameStok.id})`,
      totalPenyaluran: sql<number>`(select count(*) from ${penyaluran} where ${penyaluran.idMitra} = ${opnameStok.idMitra})`,
      totalLaku: sql<number>`coalesce(sum(${itemOpname.jumlahLaku}), 0)`,
      totalRetur: sql<number>`coalesce(sum(${itemOpname.jumlahRetur}), 0)`,
      totalHilang: sql<number>`coalesce(sum(${itemOpname.hilang}), 0)`,
      returBaik: sql<number>`coalesce(sum(case when ${itemOpname.kondisiRetur} = 'good' then ${itemOpname.jumlahRetur} else 0 end), 0)`,
      returRusak: sql<number>`coalesce(sum(case when ${itemOpname.kondisiRetur} = 'damaged' then ${itemOpname.jumlahRetur} else 0 end), 0)`,
      returExpired: sql<number>`coalesce(sum(case when ${itemOpname.kondisiRetur} = 'expired' then ${itemOpname.jumlahRetur} else 0 end), 0)`,
      totalPendapatanMitra:
        sql<number>`coalesce(sum(${itemOpname.jumlahLaku} * (${produk.hargaRetail} - ${produk.hargaGrosir}) - case when ${itemOpname.penanggungHilang} = 'mitra' then ${itemOpname.hilang} * ${produk.hargaGrosir} else 0 end), 0)`,
      totalPendapatanPenyalur:
        sql<number>`coalesce(sum(${itemOpname.jumlahLaku} * (${produk.hargaGrosir} - ${produk.hargaPabrik}) - case when ${itemOpname.penanggungHilang} = 'penyalur' then ${itemOpname.hilang} * ${produk.hargaPabrik} else 0 end + case when ${itemOpname.penanggungHilang} = 'mitra' then ${itemOpname.hilang} * (${produk.hargaGrosir} - ${produk.hargaPabrik}) else 0 end), 0)`,
    })
    .from(opnameStok)
    .innerJoin(mitra, eq(opnameStok.idMitra, mitra.id))
    .innerJoin(itemOpname, eq(itemOpname.idOpname, opnameStok.id))
    .innerJoin(produk, eq(itemOpname.idProduk, produk.id))
    .groupBy(opnameStok.idMitra, mitra.nama, mitra.telepon)
    .orderBy(sql`coalesce(sum(${itemOpname.jumlahLaku} * (${produk.hargaRetail} - ${produk.hargaGrosir})), 0) desc`)

  return { data: rows }
})
