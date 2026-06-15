import { desc, eq } from 'drizzle-orm';
import { produk, pemasok } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';

export default defineEventHandler(async (event) => {
  const db = await useDB();
  const items = await db.select({
    id: produk.id,
    sku: produk.sku,
    nama: produk.nama,
    idPemasok: produk.idPemasok,
    namaPemasok: pemasok.nama,
    satuan: produk.satuan,
    hargaPabrik: produk.hargaPabrik,
    hargaGrosir: produk.hargaGrosir,
    hargaRetail: produk.hargaRetail,
    gambar: produk.gambar,
    apakahAktif: produk.apakahAktif,
  })
    .from(produk)
    .leftJoin(pemasok, eq(produk.idPemasok, pemasok.id))
    .orderBy(desc(produk.id));
  return { data: items };
});
