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
  if (url.pathname.startsWith('/api/') && !url.pathname.startsWith('/api/auth')) {
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

    // Verifikasi user masih ada di database
    const db = await useDB();
    const userExists = await db
      .select({ id: pengguna.id })
      .from(pengguna)
      .where(eq(pengguna.id, decoded.id))
      .limit(1)
      .then(rows => rows.length > 0);

    if (!userExists) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: User tidak ditemukan, silakan login ulang',
      });
    }

    // Pasang data user di context agar bisa dipakai di route handler (misal event.context.user)
    event.context.user = decoded;
  }
});
