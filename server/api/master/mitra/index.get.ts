import { desc, eq } from 'drizzle-orm';
import { mitra } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';

export default defineEventHandler(async (event) => {
  const user = event.context.user!
  const db = await useDB();
  const items = user.peran === 'mitra'
    ? await db.select().from(mitra).where(eq(mitra.id, user.idMitra!))
    : await db.select().from(mitra).orderBy(desc(mitra.id));

  let result = items
  if (user?.peran === 'pemasok') {
    result = items.map(m => ({
      ...m,
      telepon: '',
      lat: null,
      lng: null,
    }))
  }

  return { data: result };
});
