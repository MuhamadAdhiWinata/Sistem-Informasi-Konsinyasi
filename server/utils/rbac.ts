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
