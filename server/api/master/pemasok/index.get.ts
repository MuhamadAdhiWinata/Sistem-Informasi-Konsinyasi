import { desc, eq, sql } from 'drizzle-orm';
import { pemasok } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';
import { requireRole } from '~~/server/utils/rbac';

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur', 'sales', 'pemasok'])
  const user = event.context.user!
  const db = await useDB();
  const items = user.peran === 'pemasok'
    ? await db.select().from(pemasok).where(eq(pemasok.id, user.idPemasok!))
    : await db.select().from(pemasok).orderBy(desc(pemasok.id));
  return { data: items };
});
