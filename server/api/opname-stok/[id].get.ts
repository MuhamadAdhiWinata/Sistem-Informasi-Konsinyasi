import { eq } from 'drizzle-orm'
import { opnameStok, itemOpname, mitra, pengguna, produk } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const db = await useDB()

  const header = await db
    .select({
      id: opnameStok.id,
      nomorOpname: opnameStok.nomorOpname,
      tanggalKunjungan: opnameStok.tanggalKunjungan,
      status: opnameStok.status,
      memilikiAnomali: opnameStok.memilikiAnomali,
      idMitra: opnameStok.idMitra,
      mitra: mitra.nama,
      telepon: mitra.telepon,
      sales: pengguna.nama,
    })
    .from(opnameStok)
    .leftJoin(mitra, eq(opnameStok.idMitra, mitra.id))
    .leftJoin(pengguna, eq(opnameStok.idSales, pengguna.id))
    .where(eq(opnameStok.id, id))
    .limit(1)

  if (!header.length) {
    throw createError({ statusCode: 404, statusMessage: 'Opname not found' })
  }

  const items = await db
    .select({
      id: itemOpname.id,
      idProduk: itemOpname.idProduk,
      produk: produk.nama,
      sku: produk.sku,
      satuan: produk.satuan,
      gambar: produk.gambar,
      stokAwal: itemOpname.stokAwal,
      jumlahLaku: itemOpname.jumlahLaku,
      jumlahRetur: itemOpname.jumlahRetur,
      hilang: itemOpname.hilang,
      penanggungHilang: itemOpname.penanggungHilang,
      stokFisik: itemOpname.stokFisik,
      kondisiRetur: itemOpname.kondisiRetur,
      apakahAnomali: itemOpname.apakahAnomali,
    })
    .from(itemOpname)
    .leftJoin(produk, eq(itemOpname.idProduk, produk.id))
    .where(eq(itemOpname.idOpname, id))

  return { data: { ...header[0], items } }
})
