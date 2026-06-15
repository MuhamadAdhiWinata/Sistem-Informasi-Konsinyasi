import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { produk } from '~~/server/database/schema';
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
  sku: z.string().min(1).max(50).optional(),
  nama: z.string().min(1).max(150).optional(),
  idPemasok: z.preprocess(toNum, z.number().optional()),
  satuan: z.string().min(1).max(20).optional(),
  hargaPabrik: z.preprocess(toStr, z.string().optional()),
  hargaGrosir: z.preprocess(toStr, z.string().optional()),
  hargaRetail: z.preprocess(toStr, z.string().optional()),
  gambar: z.string().optional(),
  apakahAktif: z.preprocess(toNum, z.number().int().min(0).max(1).optional()),
});

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur']);
  const id = Number(getRouterParam(event, 'id'));
  const body = await readValidatedBody(event, bodySchema.parse);
  const db = await useDB();
  await db.update(produk).set(body).where(eq(produk.id, id));
  return { message: 'Produk berhasil diperbarui' };
});
