import { verifyToken, type JwtPayload } from '../utils/auth';
import { eq } from 'drizzle-orm';
import { pengguna } from '../database/schema';
import { useDB } from '../utils/database';

declare module 'h3' {
  interface H3EventContext {
    user?: JwtPayload;
  }
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  
  // Hanya proses route API, skip untuk auth/login
  if (url.pathname.startsWith('/api/') && url.pathname !== '/api/auth/login') {
    const authHeader = getHeader(event, 'authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Missing or invalid token',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid or expired token',
      });
    }

    // Verifikasi user masih ada di database + ambil idMitra/idPemasok fresh (sumber kebenaran, bukan JWT)
    const db = await useDB();
    const userRows = await db
      .select({ id: pengguna.id, idMitra: pengguna.idMitra, idPemasok: pengguna.idPemasok })
      .from(pengguna)
      .where(eq(pengguna.id, decoded.id))
      .limit(1);

    if (!userRows.length) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: User tidak ditemukan, silakan login ulang',
      });
    }

    // Pasang data user di context agar bisa dipakai di route handler (misal event.context.user)
    event.context.user = { ...decoded, idMitra: userRows[0].idMitra, idPemasok: userRows[0].idPemasok };
  }
});
