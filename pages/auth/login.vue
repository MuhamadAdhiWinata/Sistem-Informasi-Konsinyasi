<template>
  <div class="p-8">
    <div class="text-center mb-8">
      <div class="mx-auto w-14 h-14 bg-gradient-to-br from-primary to-primary/60 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
        <Icon name="i-heroicons-cube-transparent" class="w-7 h-7" />
      </div>
      <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Selamat Datang</h1>
      <p class="text-sm text-muted-foreground mt-1">Masuk ke SIKONS untuk melanjutkan</p>
    </div>

    <UForm :state="{ email, password }" @submit="handleLogin" class="space-y-5">
      <UFormGroup label="Email" name="email" required>
        <template #default="{ error }">
          <UInput
            v-model="email"
            type="email"
            placeholder="admin@sikons.com"
            icon="i-heroicons-envelope"
            size="lg"
            :ui="{ icon: { leading: { wrapper: 'text-muted-foreground' } } }"
            :trailing="false"
          />
        </template>
      </UFormGroup>

      <UFormGroup label="Password" name="password" required>
        <template #default="{ error }">
          <UInput
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="password123"
            icon="i-heroicons-lock-closed"
            size="lg"
            :ui="{ icon: { leading: { wrapper: 'text-muted-foreground' } } }"
          >
            <template #trailing>
              <button
                type="button"
                class="text-muted-foreground hover:text-foreground transition-colors"
                @click="showPassword = !showPassword"
                tabindex="-1"
              >
                <template v-if="showPassword">
                  <Icon name="i-heroicons-eye-off" class="w-4 h-4" />
                </template>
                <template v-else>
                  <Icon name="i-heroicons-eye" class="w-4 h-4" />
                </template>
              </button>
            </template>
          </UInput>
        </template>
      </UFormGroup>

      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
          <UCheckbox v-model="rememberMe" size="sm" />
          <span>Ingat saya</span>
        </label>
        <a href="#" class="text-sm text-primary hover:underline font-medium">Lupa password?</a>
      </div>

      <UButton
        type="submit"
        :loading="isLoading"
        block
        size="lg"
        class="mt-2 shadow-md shadow-primary/20"
      >
        Masuk Sekarang
      </UButton>
    </UForm>

    <!-- Demo Credentials -->
    <div class="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
      <p class="text-xs text-center text-muted-foreground mb-3 font-medium uppercase tracking-wider">Akses Demo</p>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:border-primary/40 transition-colors" @click="fillCredentials('admin@sikons.com', 'password123')">
          <p class="font-semibold text-foreground">Penyalur</p>
          <p class="text-muted-foreground mt-0.5">admin@sikons.com</p>
        </div>
        <div class="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:border-primary/40 transition-colors" @click="fillCredentials('rudi@sikons.com', 'password123')">
          <p class="font-semibold text-foreground">Sales</p>
          <p class="text-muted-foreground mt-0.5">rudi@sikons.com</p>
        </div>
        <div class="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:border-primary/40 transition-colors" @click="fillCredentials('wings@sikons.com', 'password123')">
          <p class="font-semibold text-foreground">Pemasok</p>
          <p class="text-muted-foreground mt-0.5">wings@sikons.com</p>
        </div>
        <div class="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:border-primary/40 transition-colors" @click="fillCredentials('budi@sikons.com', 'password123')">
          <p class="font-semibold text-foreground">Mitra</p>
          <p class="text-muted-foreground mt-0.5">budi@sikons.com</p>
        </div>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="errorMsg" class="mt-4">
      <UAlert
        color="red"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        :title="errorMsg"
        @close="errorMsg = ''"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  layout: 'auth'
});

const router = useRouter();
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(true);
const isLoading = ref(false);
const errorMsg = ref('');

function fillCredentials(e: string, p: string) {
  email.value = e;
  password.value = p;
}

const handleLogin = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    const auth = useAuth();
    await auth.login(email.value, password.value);
    router.push('/');
  } catch (err: any) {
    errorMsg.value = err?.data?.statusMessage || 'Login gagal. Silakan coba lagi.';
  } finally {
    isLoading.value = false;
  }
};
</script>
