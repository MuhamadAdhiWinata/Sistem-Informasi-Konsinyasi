import { eq, and, sql, desc } from 'drizzle-orm'
import { stokGudang, gudang, produk, itemPenerimaanBarang, penerimaanBarang } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/database'

export default defineEventHandler(async (event) => {
  const db = await useDB()
  const query = getQuery(event)
  const idGudang = query.idGudang ? Number(query.idGudang) : undefined

  const where = idGudang ? and(eq(stokGudang.idGudang, idGudang)) : undefined

  const items = await db
    .select({
      id: stokGudang.id,
      idGudang: stokGudang.idGudang,
      gudang: gudang.nama,
      kodeGudang: gudang.kode,
      idProduk: stokGudang.idProduk,
      produk: produk.nama,
      sku: produk.sku,
      satuan: produk.satuan,
      jumlah: stokGudang.jumlah,
      diperbaruiPada: stokGudang.diperbaruiPada,
      hargaPabrikAcuan: sql<number>`(
        select ipb.harga_pabrik_aktual
        from ${itemPenerimaanBarang} ipb
        inner join ${penerimaanBarang} pb on pb.id = ipb.id_penerimaan
        where ipb.id_produk = ${stokGudang.idProduk}
          and pb.id_gudang = ${stokGudang.idGudang}
        order by pb.tanggal_penerimaan desc
        limit 1
      )`,
    })
    .from(stokGudang)
    .leftJoin(gudang, eq(stokGudang.idGudang, gudang.id))
    .leftJoin(produk, eq(stokGudang.idProduk, produk.id))
    .where(where)
    .orderBy(gudang.nama, produk.nama)

  return { data: items }
})
