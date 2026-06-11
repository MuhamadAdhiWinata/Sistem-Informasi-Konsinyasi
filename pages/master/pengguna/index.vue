<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Pengguna</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Kelola data pengguna sistem</p>
      </div>
      <UButton icon="i-heroicons-plus" size="sm" @click="openCreateModal">Tambah Pengguna</UButton>
    </div>

    <div class="mb-4 flex items-center gap-3">
      <UInput v-model="searchQuery" placeholder="Cari pengguna..." icon="i-heroicons-magnifying-glass-20-solid" class="w-72" size="sm" />
    </div>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <UTable :rows="filteredItems" :columns="columns" :loading="isLoading"
        :empty-state="{ icon: 'i-heroicons-users', label: 'Belum ada pengguna' }" sort-mode="manual" class="w-full">
        <template #peran-data="{ row }">
          <UBadge :color="badgeColor(row.peran)" variant="soft" size="xs">{{ row.peran }}</UBadge>
        </template>
        <template #apakahAktif-data="{ row }">
          <UBadge :color="(row.apakahAktif ? 'emerald' : 'gray') as any" variant="soft" size="xs">
            {{ row.apakahAktif ? 'Aktif' : 'Nonaktif' }}
          </UBadge>
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-1">
            <UTooltip text="Edit" :popper="{ placement: 'top' }">
              <UButton icon="i-heroicons-pencil-square" size="2xs" color="orange" variant="ghost" @click="openEditModal(row)" />
            </UTooltip>
            <UTooltip text="Hapus" :popper="{ placement: 'top' }">
              <UButton icon="i-heroicons-trash" size="2xs" color="red" variant="ghost" @click="confirmDelete(row)" />
            </UTooltip>
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="isModalOpen" :ui="{ width: 'sm:max-w-lg' }">
      <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6">{{ isEditing ? 'Edit Pengguna' : 'Tambah Pengguna' }}</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="closeModal" />
          </div>
        </template>
        <UForm :state="formState" :schema="formSchema" @submit="saveItem" class="space-y-4">
          <UFormGroup label="Nama" name="nama" required>
            <UInput v-model="formState.nama" placeholder="e.g. Admin Pusat" />
          </UFormGroup>
          <UFormGroup label="Email" name="email" required>
            <UInput v-model="formState.email" type="email" placeholder="email@example.com" />
          </UFormGroup>
          <UFormGroup v-if="!isEditing" label="Password" name="password" required>
            <UInput v-model="formState.password" type="password" placeholder="Min. 6 karakter" />
          </UFormGroup>
          <UFormGroup v-if="isEditing" label="Password Baru (kosongkan jika tidak diubah)" name="password">
            <UInput v-model="formState.password" type="password" placeholder="Kosongkan jika tidak diubah" />
          </UFormGroup>
          <UFormGroup label="Peran" name="peran" required>
            <USelect v-model="formState.peran" :options="roleOptions" placeholder="Pilih peran" />
          </UFormGroup>
          <UFormGroup label="Status" name="apakahAktif">
            <USelect v-model="formState.apakahAktif" :options="statusOptions" />
          </UFormGroup>
          <div class="flex justify-end gap-3 pt-2">
            <UButton color="gray" variant="soft" @click="closeModal">Batal</UButton>
            <UButton type="submit" :loading="isSaving">{{ isEditing ? 'Simpan Perubahan' : 'Tambah' }}</UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>

    <UModal v-model="isDeleteModalOpen">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold">Konfirmasi Hapus</h3>
        </template>
        <p class="text-sm text-muted-foreground">
          Apakah Anda yakin ingin menghapus <strong>{{ deleteTarget?.nama }}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="soft" @click="isDeleteModalOpen = false">Batal</UButton>
            <UButton color="red" :loading="isDeleting" @click="deleteItem">Hapus</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';

definePageMeta({ layout: 'default' });

const api = useApi();

const searchQuery = ref('');
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isEditing = ref(false);
const isLoading = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const items = ref<any[]>([]);
const deleteTarget = ref<any>(null);

const columns = [
  { key: 'nama', label: 'Nama' },
  { key: 'email', label: 'Email' },
  { key: 'peran', label: 'Peran' },
  { key: 'apakahAktif', label: 'Status' },
  { key: 'actions', label: '' },
];

const formSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Email tidak valid'),
  password: z.string().optional().default(''),
  peran: z.string().min(1, 'Peran wajib dipilih'),
  apakahAktif: z.number().min(0).max(1),
});

interface FormData { id?: number; nama: string; email: string; password: string; peran: string; apakahAktif: number }
const defaultForm = (): FormData => ({ nama: '', email: '', password: '', peran: '', apakahAktif: 1 });
const formState = ref<FormData>(defaultForm());
const statusOptions = [{ label: 'Aktif', value: 1 }, { label: 'Nonaktif', value: 0 }];
const roleOptions = [
  { label: 'Penyalur', value: 'penyalur' },
  { label: 'Sales', value: 'sales' },
  { label: 'Mitra', value: 'mitra' },
  { label: 'Pemasok', value: 'pemasok' },
];

function badgeColor(peran: string): string {
  const map: Record<string, string> = { penyalur: 'purple', sales: 'blue', mitra: 'orange', pemasok: 'emerald' };
  return map[peran] || 'gray';
}

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  const q = searchQuery.value.toLowerCase();
  return items.value.filter((i: any) => i.nama?.toLowerCase().includes(q) || i.email?.toLowerCase().includes(q) || i.peran?.toLowerCase().includes(q));
});

async function fetchItems() {
  isLoading.value = true;
  try {
    const res: any = await api('/api/master/pengguna');
    items.value = res.data || [];
  } catch (err: any) { console.error(err); } finally { isLoading.value = false; }
}

function openCreateModal() { isEditing.value = false; formState.value = defaultForm(); isModalOpen.value = true; }
function openEditModal(row: any) { isEditing.value = true; formState.value = { ...row, password: '' }; isModalOpen.value = true; }
function closeModal() { isModalOpen.value = false; formState.value = defaultForm(); }

async function saveItem() {
  isSaving.value = true;
  try {
    const body = { ...formState.value };
    if (isEditing.value && !body.password) {
      delete (body as any).password;
    }
    if (isEditing.value && formState.value.id) {
      await api(`/api/master/pengguna/${formState.value.id}`, { method: 'PUT', body });
    } else {
      await api('/api/master/pengguna', { method: 'POST', body });
    }
    closeModal();
    await fetchItems();
  } catch (err: any) { console.error(err); } finally { isSaving.value = false; }
}

function confirmDelete(row: any) { deleteTarget.value = row; isDeleteModalOpen.value = true; }

async function deleteItem() {
  if (!deleteTarget.value) return;
  isDeleting.value = true;
  try {
    await api(`/api/master/pengguna/${deleteTarget.value.id}`, { method: 'DELETE' });
    isDeleteModalOpen.value = false;
    deleteTarget.value = null;
    await fetchItems();
  } catch (err: any) { console.error(err); } finally { isDeleting.value = false; }
}

onMounted(() => fetchItems());
</script>
