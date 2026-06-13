import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { pengguna } from '~~/server/database/schema';
import { useDB } from '~~/server/utils/database';
import { verifyPassword, generateToken } from '~~/server/utils/auth';

const bodySchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);
  const db = await useDB();

  const users = await db.select().from(pengguna).where(eq(pengguna.email, body.email)).limit(1);
  if (!users.length) {
    throw createError({ statusCode: 401, statusMessage: 'Email atau password salah' });
  }

  const user = users[0];
  if (!user.apakahAktif) {
    throw createError({ statusCode: 403, statusMessage: 'Akun Anda tidak aktif' });
  }

  const valid = await verifyPassword(body.password, user.passwordHash);
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Email atau password salah' });
  }

  const tokenPayload = {
    id: user.id,
    email: user.email,
    peran: user.peran,
    idMitra: user.idMitra,
    idPemasok: user.idPemasok,
  };

  const token = generateToken(tokenPayload);

  return {
    data: {
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        peran: user.peran,
        idMitra: user.idMitra,
        idPemasok: user.idPemasok,
      },
    },
    message: 'Login berhasil',
  };
});
