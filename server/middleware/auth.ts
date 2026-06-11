import { verifyToken, type JwtPayload } from '../utils/auth';

declare module 'h3' {
  interface H3EventContext {
    user?: JwtPayload;
  }
}

export default defineEventHandler((event) => {
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

    // Pasang data user di context agar bisa dipakai di route handler (misal event.context.user)
    event.context.user = decoded;
  }
});
