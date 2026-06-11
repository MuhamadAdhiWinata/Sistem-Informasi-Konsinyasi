import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { gudang } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';
import { requireRole } from '~~/server/utils/rbac';

const bodySchema = z.object({
  kode: z.string().min(1).max(20).optional(),
  nama: z.string().min(1).max(100).optional(),
  alamat: z.string().optional().nullable(),
  apakahAktif: z.number().int().min(0).max(1).optional(),
});

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur']);
  const id = Number(getRouterParam(event, 'id'));
  const body = await readValidatedBody(event, bodySchema.parse);
  const db = await useDB();
  await db.update(gudang).set(body).where(eq(gudang.id, id));
  return { message: 'Gudang berhasil diperbarui' };
});
