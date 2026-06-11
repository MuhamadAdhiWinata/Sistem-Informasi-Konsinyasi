import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { pengguna } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';
import { requireRole } from '~~/server/utils/rbac';
import { hashPassword } from '~~/server/utils/auth';

const bodySchema = z.object({
  nama: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  peran: z.enum(['penyalur', 'sales', 'mitra', 'pemasok']).optional(),
  idMitra: z.number().optional().nullable(),
  idPemasok: z.number().optional().nullable(),
  apakahAktif: z.number().int().min(0).max(1).optional(),
});

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur']);
  const id = Number(getRouterParam(event, 'id'));
  const body = await readValidatedBody(event, bodySchema.parse);
  const db = await useDB();

  const updateData: Record<string, unknown> = { ...body };
  if (body.password) {
    updateData.passwordHash = await hashPassword(body.password);
  }
  delete updateData.password;

  await db.update(pengguna).set(updateData).where(eq(pengguna.id, id));
  return { message: 'Pengguna berhasil diperbarui' };
});
