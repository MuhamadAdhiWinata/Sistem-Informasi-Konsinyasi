import { desc, eq, sql } from 'drizzle-orm';
import { pengguna } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';
import { requireRole } from '~~/server/utils/rbac';

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur', 'sales']);
  const user = event.context.user!
  const query = getQuery(event)
  const db = await useDB();
  const peranQuery = typeof query.peran === 'string' && ['penyalur', 'sales', 'mitra', 'pemasok'].includes(query.peran)
    ? query.peran as 'penyalur' | 'sales' | 'mitra' | 'pemasok'
    : undefined

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
    .where(
      user.peran === 'sales'
        ? eq(pengguna.peran, 'sales')
        : peranQuery ? eq(pengguna.peran, peranQuery) : undefined,
    )
    .orderBy(desc(pengguna.id));
  return { data: items };
});
