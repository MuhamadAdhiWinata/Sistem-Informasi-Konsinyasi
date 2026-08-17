import { desc, eq, inArray } from 'drizzle-orm'
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

  let result = items
  if (user.peran === 'pemasok') {
    result = items.map(i => ({ ...i, totalNilai: null }))
  }

  return { data: result }
})