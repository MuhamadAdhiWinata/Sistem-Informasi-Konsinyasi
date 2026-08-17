import { desc, eq } from 'drizzle-orm';
import { gudang } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';
import { requireRole } from '~~/server/utils/rbac';

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur', 'sales']);
  const db = await useDB();
  const items = await db.select().from(gudang).orderBy(desc(gudang.id));
  return { data: items };
});
