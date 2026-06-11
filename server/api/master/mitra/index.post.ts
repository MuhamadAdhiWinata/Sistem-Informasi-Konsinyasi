import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { mitra } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';
import { requireRole } from '~~/server/utils/rbac';

const bodySchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi').max(100),
  namaPemilik: z.string().min(1, 'Nama pemilik wajib diisi').max(100),
  telepon: z.string().max(20).optional().nullable(),
  lat: z.string().max(20).optional().nullable(),
  lng: z.string().max(20).optional().nullable(),
  idSalesDitugaskan: z.number().optional().nullable(),
  apakahAktif: z.number().int().min(0).max(1).default(1),
});

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur']);
  const body = await readValidatedBody(event, bodySchema.parse);
  const db = await useDB();
  const result = await db.insert(mitra).values(body);
  return { data: { id: result[0].insertId }, message: 'Mitra berhasil dibuat' };
});
