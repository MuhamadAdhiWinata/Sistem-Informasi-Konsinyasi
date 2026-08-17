import { eq } from 'drizzle-orm';
import { gudang } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';
import { requireRole } from '~~/server/utils/rbac';

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur', 'sales']);
  const id = Number(getRouterParam(event, 'id'));
  const db = await useDB();
  const item = await db.select().from(gudang).where(eq(gudang.id, id)).limit(1);
  if (!item.length) {
    throw createError({ statusCode: 404, statusMessage: 'Gudang not found' });
  }
  return { data: item[0] };
});
