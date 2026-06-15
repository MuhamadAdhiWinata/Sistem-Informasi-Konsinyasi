import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { mitra } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';
import { requireRole } from '~~/server/utils/rbac';

function toNum(val: unknown) {
  if (val === null || val === '' || val === undefined) return undefined
  return Number(val)
}

function toStr(val: unknown) {
  if (val === null || val === '' || val === undefined) return undefined
  if (typeof val === 'number') return String(val)
  return val
}

const bodySchema = z.object({
  nama: z.string().min(1).max(100).optional(),
  namaPemilik: z.string().min(1).max(100).optional(),
  telepon: z.string().max(20).optional().nullable(),
  lat: z.preprocess(toStr, z.string().optional().nullable()),
  lng: z.preprocess(toStr, z.string().optional().nullable()),
  idSalesDitugaskan: z.preprocess(toNum, z.number().optional().nullable()),
  apakahAktif: z.preprocess(toNum, z.number().int().min(0).max(1).optional()),
});

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur']);
  const id = Number(getRouterParam(event, 'id'));
  const body = await readValidatedBody(event, bodySchema.parse);
  const db = await useDB();
  await db.update(mitra).set(body).where(eq(mitra.id, id));
  return { message: 'Mitra berhasil diperbarui' };
});
