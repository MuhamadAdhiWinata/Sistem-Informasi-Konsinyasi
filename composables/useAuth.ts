import { computed } from 'vue';

export interface AuthUser {
  id: number
  nama: string
  email: string
  peran: string
  idMitra?: number | null
  idPemasok?: number | null
}

interface AuthState {
  token: string
  user: AuthUser
}

const AUTH_COOKIE_NAME = 'sikons_auth';
// Sesuai JWT_EXPIRES_IN di server/utils/auth.ts (24 jam)
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24;

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return false;
  return payload.exp * 1000 <= Date.now();
}

function parseAuth(state: AuthState | null | undefined): AuthState | null {
  if (!state || typeof state.token !== 'string' || !state.user) return null;
  if (isTokenExpired(state.token)) return null;
  return state;
}

export function useAuth() {
  // useCookie Nuxt auto JSON-parse/serialize nilai cookie
  const cookie = useCookie<AuthState | null>(AUTH_COOKIE_NAME, {
    maxAge: AUTH_COOKIE_MAX_AGE,
    sameSite: 'lax',
    path: '/',
  });

  const authState = computed(() => parseAuth(cookie.value));

  const token = computed(() => authState.value?.token ?? null);
  const user = computed<AuthUser | null>(() => authState.value?.user ?? null);
  const isLoggedIn = computed(() => !!token.value);
  const isPenyalur = computed(() => user.value?.peran === 'penyalur');
  const isSales = computed(() => user.value?.peran === 'sales');
  const isMitra = computed(() => user.value?.peran === 'mitra');
  const isPemasok = computed(() => user.value?.peran === 'pemasok');

  async function login(email: string, password: string) {
    const res: any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    const { token: t, user: u } = res.data || res;
    cookie.value = { token: t, user: u } satisfies AuthState;
    return { token: t, user: u };
  }

  function logout() {
    cookie.value = null;
  }

  function getHeaders() {
    if (token.value) {
      return { Authorization: `Bearer ${token.value}` };
    }
    return {};
  }

  return { token, user, isLoggedIn, isPenyalur, isSales, isMitra, isPemasok, login, logout, getHeaders };
}
