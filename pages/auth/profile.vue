<template>
  <div class="max-w-2xl mx-auto">
    <div class="flex items-center gap-3 mb-6">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" to="/" />
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Profil Saya</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Informasi akun dan pengaturan password</p>
      </div>
    </div>

    <div class="space-y-6">
      <UCard>
        <template #header>
          <h2 class="text-sm font-semibold text-zinc-900 dark:text-white">Informasi Akun</h2>
        </template>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="Nama">
              <UInput :model-value="user?.nama" disabled />
            </UFormGroup>
            <UFormGroup label="Email">
              <UInput :model-value="user?.email" disabled />
            </UFormGroup>
            <UFormGroup label="Peran">
              <UInput :model-value="user?.peran" disabled />
            </UFormGroup>
            <UFormGroup label="ID Mitra" v-if="user?.idMitra">
              <UInput :model-value="user.idMitra" disabled />
            </UFormGroup>
            <UFormGroup label="ID Pemasok" v-if="user?.idPemasok">
              <UInput :model-value="user.idPemasok" disabled />
            </UFormGroup>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-sm font-semibold text-zinc-900 dark:text-white">Ubah Password</h2>
        </template>
        <UForm :state="passwordState" :schema="passwordSchema" @submit="handleChangePassword" class="space-y-4">
          <UFormGroup label="Password Saat Ini" name="currentPassword" required>
            <UInput v-model="passwordState.currentPassword" type="password" placeholder="Masukkan password saat ini" />
          </UFormGroup>
          <UFormGroup label="Password Baru" name="newPassword" required>
            <UInput v-model="passwordState.newPassword" type="password" placeholder="Minimal 6 karakter" />
          </UFormGroup>
          <UFormGroup label="Konfirmasi Password Baru" name="confirmPassword" required>
            <UInput v-model="passwordState.confirmPassword" type="password" placeholder="Ulangi password baru" />
          </UFormGroup>
          <div class="flex justify-end">
            <UButton type="submit" :loading="isSaving">Simpan Password</UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: 'default' })

const { user } = useAuth()
const api = useApi()
const toast = useToast()
const isSaving = ref(false)

const passwordState = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Password saat ini wajib diisi'),
  newPassword: z.string().min(6, 'Password baru minimal 6 karakter'),
  confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword'],
})

async function handleChangePassword() {
  isSaving.value = true
  try {
    await api('/api/auth/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordState.value.currentPassword,
        newPassword: passwordState.value.newPassword,
      },
    })
    toast.add({ title: 'Berhasil', description: 'Password berhasil diubah', color: 'green' })
    passwordState.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (err: any) {
    toast.add({ title: 'Gagal', description: err.data?.statusMessage || err.message, color: 'red' })
  } finally {
    isSaving.value = false
  }
}
</script>
