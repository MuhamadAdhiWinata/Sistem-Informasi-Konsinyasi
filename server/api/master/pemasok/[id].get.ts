import { eq } from 'drizzle-orm';
import { pemasok } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  const db = await useDB();
  const item = await db.select().from(pemasok).where(eq(pemasok.id, id)).limit(1);
  if (!item.length) {
    throw createError({ statusCode: 404, statusMessage: 'Pemasok not found' });
  }
  return { data: item[0] };
});
