import { eq } from 'drizzle-orm';
import { produk } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';
import { requireRole } from '~~/server/utils/rbac';

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur']);
  const id = Number(getRouterParam(event, 'id'));
  const db = await useDB();
  await db.delete(produk).where(eq(produk.id, id));
  return { message: 'Produk berhasil dihapus' };
});
