import { eq } from 'drizzle-orm';
import { mitra } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  const db = await useDB();
  const item = await db.select().from(mitra).where(eq(mitra.id, id)).limit(1);
  if (!item.length) {
    throw createError({ statusCode: 404, statusMessage: 'Mitra not found' });
  }
  return { data: item[0] };
});
