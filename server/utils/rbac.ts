import { H3Event } from 'h3';

export const requireRole = (event: H3Event, allowedRoles: string[]) => {
  const user = event.context.user;
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: No user context found',
    });
  }

  // Admin / Penyalur has access to everything
  if (user.peran === 'penyalur') {
    return;
  }

  if (!allowedRoles.includes(user.peran)) {
    throw createError({
      statusCode: 403,
      statusMessage: `Forbidden: Requires one of these roles: ${allowedRoles.join(', ')}`,
    });
  }
};

// 403 jika user mitra/pemasok mencoba akses data milik tenant lain
export const requireOwnership = (
  event: H3Event,
  scope: { idMitra?: number | null; idPemasok?: number | null },
) => {
  const user = event.context.user;

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: No user context found' });
  }

  if (user.peran === 'mitra' && scope.idMitra !== undefined && user.idMitra !== scope.idMitra) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Bukan data milik Anda' });
  }

  if (user.peran === 'pemasok' && scope.idPemasok !== undefined && user.idPemasok !== scope.idPemasok) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Bukan data milik Anda' });
  }
};

// Id tenant user yang login (403 jika perannya memerlukan tapi tidak punya link)
export const tenantMitraId = (event: H3Event): number => {
  const user = event.context.user!;
  if (!user.idMitra) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Akun mitra tidak terhubung ke data mitra' });
  }
  return user.idMitra;
};

export const tenantPemasokId = (event: H3Event): number => {
  const user = event.context.user!;
  if (!user.idPemasok) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Akun pemasok tidak terhubung ke data pemasok' });
  }
  return user.idPemasok;
};
