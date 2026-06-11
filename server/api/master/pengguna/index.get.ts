import { eq, sql } from 'drizzle-orm';
import { pengguna } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';

export default defineEventHandler(async (event) => {
  const db = await useDB();
  const items = await db.select({
    id: pengguna.id,
    nama: pengguna.nama,
    email: pengguna.email,
    peran: pengguna.peran,
    idMitra: pengguna.idMitra,
    idPemasok: pengguna.idPemasok,
    apakahAktif: pengguna.apakahAktif,
  })
    .from(pengguna)
    .orderBy(pengguna.nama);
  return { data: items };
});
