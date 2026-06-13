import { ref, computed } from 'vue';

// Simple singleton auth store (no Pinia dependency needed)
const token = ref<string | null>(null);
export interface AuthUser {
  id: number
  nama: string
  email: string
  peran: string
  idMitra?: number | null
  idPemasok?: number | null
}

const user = ref<AuthUser | null>(null);

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value);
  const isPenyalur = computed(() => user.value?.peran === 'penyalur');
  const isSales = computed(() => user.value?.peran === 'sales');
  const isMitra = computed(() => user.value?.peran === 'mitra');
  const isPemasok = computed(() => user.value?.peran === 'pemasok');

  function init() {
    if (!isClient()) return;
    const stored = localStorage.getItem('sikons_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        token.value = parsed.token;
        user.value = parsed.user;
      } catch {
        localStorage.removeItem('sikons_auth');
      }
    }
  }

  async function login(email: string, password: string) {
    const res: any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    const { token: t, user: u } = res.data || res;
    token.value = t;
    user.value = u;
    if (isClient()) {
      localStorage.setItem('sikons_auth', JSON.stringify({ token: t, user: u }));
    }
    return { token: t, user: u };
  }

  function logout() {
    token.value = null;
    user.value = null;
    if (isClient()) {
      localStorage.removeItem('sikons_auth');
    }
  }

  function getHeaders() {
    if (token.value) {
      return { Authorization: `Bearer ${token.value}` };
    }
    return {};
  }

  return { token, user, isLoggedIn, isPenyalur, isSales, isMitra, isPemasok, init, login, logout, getHeaders };
}
