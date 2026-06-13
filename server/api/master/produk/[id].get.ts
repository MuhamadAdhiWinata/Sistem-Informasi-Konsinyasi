import { eq } from 'drizzle-orm';
import { produk, pemasok } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
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
    apakahAktif: produk.apakahAktif,
  })
    .from(produk)
    .leftJoin(pemasok, eq(produk.idPemasok, pemasok.id))
    .where(eq(produk.id, id))
    .limit(1);
  if (!items.length) {
    throw createError({ statusCode: 404, statusMessage: 'Produk not found' });
  }
  return { data: items[0] };
});
