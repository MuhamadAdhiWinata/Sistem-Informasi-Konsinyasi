import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { produk } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';
import { requireRole } from '~~/server/utils/rbac';

const bodySchema = z.object({
  sku: z.string().min(1).max(50).optional(),
  nama: z.string().min(1).max(150).optional(),
  idPemasok: z.number().optional(),
  satuan: z.string().min(1).max(20).optional(),
  hargaTebus: z.string().optional(),
  hargaJualPenyalur: z.string().optional(),
  hargaJual: z.string().optional(),
  gambar: z.string().optional(),
  apakahAktif: z.number().int().min(0).max(1).optional(),
});

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur']);
  const id = Number(getRouterParam(event, 'id'));
  const body = await readValidatedBody(event, bodySchema.parse);
  const db = await useDB();
  await db.update(produk).set(body).where(eq(produk.id, id));
  return { message: 'Produk berhasil diperbarui' };
});
