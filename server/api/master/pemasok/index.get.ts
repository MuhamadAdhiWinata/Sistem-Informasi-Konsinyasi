import { desc, eq, sql } from 'drizzle-orm';
import { pemasok } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';

export default defineEventHandler(async (event) => {
  const db = await useDB();
  const items = await db.select().from(pemasok).orderBy(desc(pemasok.id));
  return { data: items };
});
