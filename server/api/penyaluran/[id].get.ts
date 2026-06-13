import { eq } from 'drizzle-orm'
import { penyaluran, itemPenyaluran, mitra, gudang, pengguna, produk, faktur } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'
import { requireRole } from '~~/server/utils/rbac'

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur', 'sales', 'mitra', 'pemasok'])
  const id = Number(getRouterParam(event, 'id'))
  const db = await useDB()
  const user = event.context.user!

  const header = await db
    .select({
      id: penyaluran.id,
      nomorPenyaluran: penyaluran.nomorPenyaluran,
      tanggalPenyaluran: penyaluran.tanggalPenyaluran,
      status: penyaluran.status,
      idMitra: penyaluran.idMitra,
      mitra: mitra.nama,
      telepon: mitra.telepon,
      idGudangAsal: penyaluran.idGudangAsal,
      gudangAsal: gudang.nama,
      sales: pengguna.nama,
      dibuatOleh: pengguna.nama,
    })
    .from(penyaluran)
    .leftJoin(mitra, eq(penyaluran.idMitra, mitra.id))
    .leftJoin(gudang, eq(penyaluran.idGudangAsal, gudang.id))
    .leftJoin(pengguna, eq(penyaluran.idSales, pengguna.id))
    .where(eq(penyaluran.id, id))
    .limit(1)

  if (!header.length) {
    throw createError({ statusCode: 404, statusMessage: 'Penyaluran not found' })
  }

  let items = await db
    .select({
      id: itemPenyaluran.id,
      idProduk: itemPenyaluran.idProduk,
      produk: produk.nama,
      sku: produk.sku,
      satuan: produk.satuan,
      gambar: produk.gambar,
      jumlahDikirim: itemPenyaluran.jumlahDikirim,
      snapshotHargaJual: itemPenyaluran.snapshotHargaJual,
      snapshotHargaTebus: itemPenyaluran.snapshotHargaTebus,
    })
    .from(itemPenyaluran)
    .leftJoin(produk, eq(itemPenyaluran.idProduk, produk.id))
    .where(eq(itemPenyaluran.idPenyaluran, id))

  if (user.peran === 'pemasok') {
    items = items.map(i => ({
      ...i,
      snapshotHargaJual: '0',
      snapshotHargaTebus: '0',
    }))
  }

  const fakturData = await db
    .select()
    .from(faktur)
    .where(eq(faktur.idPenyaluran, id))
    .limit(1)

  return { data: { ...header[0], items, faktur: fakturData[0] || null } }
})
