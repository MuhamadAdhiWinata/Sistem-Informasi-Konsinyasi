import { z } from 'zod';
import { pemasok } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';
import { requireRole } from '~~/server/utils/rbac';

const bodySchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi').max(100),
  kategoriMerek: z.string().max(100).optional().nullable(),
  narahubung: z.string().max(100).optional().nullable(),
  apakahAktif: z.number().int().min(0).max(1).default(1),
});

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur']);
  const body = await readValidatedBody(event, bodySchema.parse);
  const db = await useDB();
  const result = await db.insert(pemasok).values(body);
  return { data: { id: result[0].insertId }, message: 'Pemasok berhasil dibuat' };
});
