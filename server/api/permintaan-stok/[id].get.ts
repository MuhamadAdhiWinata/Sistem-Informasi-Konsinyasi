import { eq } from 'drizzle-orm'
import { permintaanStok, itemPermintaanStok, mitra, pengguna, produk, penyaluran } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'
import { requireRole, requireOwnership } from '~~/server/utils/rbac'

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur', 'sales', 'mitra'])
  const id = Number(getRouterParam(event, 'id'))
  const db = await useDB()

  const header = await db
    .select({
      id: permintaanStok.id,
      nomorPermintaan: permintaanStok.nomorPermintaan,
      status: permintaanStok.status,
      idMitra: permintaanStok.idMitra,
      mitra: mitra.nama,
      pemohon: pengguna.nama,
      disetujuiOleh: permintaanStok.disetujuiOleh,
      idPenyaluran: permintaanStok.idPenyaluran,
      nomorPenyaluran: penyaluran.nomorPenyaluran,
    })
    .from(permintaanStok)
    .leftJoin(mitra, eq(permintaanStok.idMitra, mitra.id))
    .leftJoin(pengguna, eq(permintaanStok.dimintaOleh, pengguna.id))
    .leftJoin(penyaluran, eq(permintaanStok.idPenyaluran, penyaluran.id))
    .where(eq(permintaanStok.id, id))
    .limit(1)

  if (!header.length) {
    throw createError({ statusCode: 404, statusMessage: 'Permintaan not found' })
  }

  requireOwnership(event, { idMitra: header[0].idMitra })

  const items = await db
    .select({
      id: itemPermintaanStok.id,
      idProduk: itemPermintaanStok.idProduk,
      produk: produk.nama,
      sku: produk.sku,
      satuan: produk.satuan,
      jumlahDiminta: itemPermintaanStok.jumlahDiminta,
      jumlahDisetujui: itemPermintaanStok.jumlahDisetujui,
    })
    .from(itemPermintaanStok)
    .leftJoin(produk, eq(itemPermintaanStok.idProduk, produk.id))
    .where(eq(itemPermintaanStok.idPermintaan, id))

  return { data: { ...header[0], items } }
})
