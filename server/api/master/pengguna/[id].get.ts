import { eq } from 'drizzle-orm';
import { pengguna } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  const db = await useDB();
  const item = await db.select().from(pengguna).where(eq(pengguna.id, id)).limit(1);
  if (!item.length) {
    throw createError({ statusCode: 404, statusMessage: 'Pengguna not found' });
  }
  // Never return password hash
  const { passwordHash, ...safe } = item[0];
  return { data: safe };
});
