import { z } from 'zod';
import { pengguna } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';
import { requireRole } from '~~/server/utils/rbac';
import { hashPassword } from '~~/server/utils/auth';

const bodySchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi').max(100),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  peran: z.enum(['penyalur', 'sales', 'mitra', 'pemasok']),
  idMitra: z.number().optional().nullable(),
  idPemasok: z.number().optional().nullable(),
  apakahAktif: z.number().int().min(0).max(1).default(1),
});

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur']);
  const body = await readValidatedBody(event, bodySchema.parse);
  const db = await useDB();

  const passwordHash = await hashPassword(body.password);
  const { password, ...rest } = body;

  const result = await db.insert(pengguna).values({ ...rest, passwordHash });
  return { data: { id: result[0].insertId }, message: 'Pengguna berhasil dibuat' };
});
