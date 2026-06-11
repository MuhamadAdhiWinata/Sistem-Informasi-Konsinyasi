import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { pemasok } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';
import { requireRole } from '~~/server/utils/rbac';

const bodySchema = z.object({
  nama: z.string().min(1).max(100).optional(),
  kategoriMerek: z.string().max(100).optional().nullable(),
  narahubung: z.string().max(100).optional().nullable(),
  apakahAktif: z.number().int().min(0).max(1).optional(),
});

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur']);
  const id = Number(getRouterParam(event, 'id'));
  const body = await readValidatedBody(event, bodySchema.parse);
  const db = await useDB();
  await db.update(pemasok).set(body).where(eq(pemasok.id, id));
  return { message: 'Pemasok berhasil diperbarui' };
});
