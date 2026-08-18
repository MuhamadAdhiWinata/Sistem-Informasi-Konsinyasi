import { desc, eq, inArray, sql } from 'drizzle-orm'
import { penyaluran, mitra, gudang, pengguna, faktur, itemPenyaluran, produk } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'

export default defineEventHandler(async (event) => {
  const user = event.context.user!
  const db = await useDB()

  let scope = undefined
  if (user.peran === 'mitra') {
    scope = eq(penyaluran.idMitra, user.idMitra!)
  } else if (user.peran === 'pemasok') {
    scope = inArray(
      penyaluran.id,
      db.select({ idPenyaluran: itemPenyaluran.idPenyaluran })
        .from(itemPenyaluran)
        .innerJoin(produk, eq(itemPenyaluran.idProduk, produk.id))
        .where(eq(produk.idPemasok, user.idPemasok!)),
    )
  }

  let totalPemasok: Record<number, string> = {}
  if (user.peran === 'pemasok') {
    const rows = await db
      .select({
        idPenyaluran: itemPenyaluran.idPenyaluran,
        total: sql<string>`SUM(${itemPenyaluran.jumlahDikirim} * ${itemPenyaluran.snapshotHargaRetail})`,
      })
      .from(itemPenyaluran)
      .innerJoin(produk, eq(itemPenyaluran.idProduk, produk.id))
      .where(eq(produk.idPemasok, user.idPemasok!))
      .groupBy(itemPenyaluran.idPenyaluran)
    totalPemasok = Object.fromEntries(rows.map(r => [r.idPenyaluran, r.total]))
  }

  const items = await db
    .select({
      id: penyaluran.id,
      nomorPenyaluran: penyaluran.nomorPenyaluran,
      tanggalPenyaluran: penyaluran.tanggalPenyaluran,
      status: penyaluran.status,
      mitra: mitra.nama,
      gudangAsal: gudang.nama,
      sales: pengguna.nama,
      nomorFaktur: faktur.nomorFaktur,
      totalNilai: faktur.totalNilai,
    })
    .from(penyaluran)
    .leftJoin(mitra, eq(penyaluran.idMitra, mitra.id))
    .leftJoin(gudang, eq(penyaluran.idGudangAsal, gudang.id))
    .leftJoin(pengguna, eq(penyaluran.idSales, pengguna.id))
    .leftJoin(faktur, eq(penyaluran.id, faktur.idPenyaluran))
    .where(scope)
    .orderBy(desc(penyaluran.id))

  if (user.peran === 'pemasok') {
    return { data: items.map(i => ({ ...i, totalNilai: totalPemasok[i.id] ?? '0' })) }
  }

  return { data: items }
})
