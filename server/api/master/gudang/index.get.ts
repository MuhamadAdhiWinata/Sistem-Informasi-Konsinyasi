import { desc, eq } from 'drizzle-orm';
import { gudang } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';

export default defineEventHandler(async (event) => {
  const db = await useDB();
  const items = await db.select().from(gudang).orderBy(desc(gudang.id));
  return { data: items };
});
