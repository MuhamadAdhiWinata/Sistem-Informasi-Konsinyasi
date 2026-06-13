import { z } from 'zod';
import { produk } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';
import { requireRole } from '~~/server/utils/rbac';

const bodySchema = z.object({
  sku: z.string().min(1, 'SKU wajib diisi').max(50),
  nama: z.string().min(1, 'Nama wajib diisi').max(150),
  idPemasok: z.number({ required_error: 'Pemasok wajib dipilih' }),
  satuan: z.string().min(1, 'Satuan wajib diisi').max(20),
  hargaTebus: z.string({ required_error: 'Harga tebus wajib diisi' }),
  hargaJualPenyalur: z.string({ required_error: 'Harga jual penyalur wajib diisi' }),
  hargaJual: z.string({ required_error: 'Harga jual retail wajib diisi' }),
  gambar: z.string().optional(),
  apakahAktif: z.number().int().min(0).max(1).default(1),
});

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur']);
  const body = await readValidatedBody(event, bodySchema.parse);
  const db = await useDB();
  const result = await db.insert(produk).values(body);
  return { data: { id: result[0].insertId }, message: 'Produk berhasil dibuat' };
});
