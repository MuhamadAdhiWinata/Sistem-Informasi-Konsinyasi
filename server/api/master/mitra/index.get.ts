import { eq } from 'drizzle-orm';
import { mitra } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';

export default defineEventHandler(async (event) => {
  const db = await useDB();
  const items = await db.select().from(mitra).orderBy(mitra.nama);
  return { data: items };
});
