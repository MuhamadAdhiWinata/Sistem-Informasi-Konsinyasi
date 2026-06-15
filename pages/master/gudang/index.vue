<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Gudang</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Kelola data gudang / warehouse</p>
      </div>
      <UButton icon="i-heroicons-plus" size="sm" @click="openCreateModal">
        Tambah Gudang
      </UButton>
    </div>

    <div class="mb-4 flex items-center gap-3">
      <UInput v-model="searchQuery" placeholder="Cari gudang..." icon="i-heroicons-magnifying-glass-20-solid" class="w-72" size="sm" />
    </div>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <UTable :rows="filteredItems" :columns="columns" :loading="isLoading"
        :empty-state="{ icon: 'i-heroicons-building-office-2', label: 'Belum ada gudang' }" sort-mode="manual" class="w-full">
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
            <h3 class="text-base font-semibold leading-6">{{ isEditing ? 'Edit Gudang' : 'Tambah Gudang' }}</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="closeModal" />
          </div>
        </template>
        <UForm :state="formState" :schema="formSchema" @submit="saveItem" class="space-y-4">
          <UFormGroup label="Kode Gudang" name="kode" required>
            <UInput v-model="formState.kode" placeholder="e.g. GDG-001" />
          </UFormGroup>
          <UFormGroup label="Nama Gudang" name="nama" required>
            <UInput v-model="formState.nama" placeholder="e.g. Gudang Pusat Jakarta" />
          </UFormGroup>
          <UFormGroup label="Alamat" name="alamat">
            <UTextarea v-model="formState.alamat" placeholder="Jl. Sudirman No. 1, Jakarta" />
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
const toast = useToast();

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
  { key: 'kode', label: 'Kode' },
  { key: 'nama', label: 'Nama' },
  { key: 'alamat', label: 'Alamat' },
  { key: 'apakahAktif', label: 'Status' },
  { key: 'actions', label: '' },
];

function toNum(val: unknown) {
  if (val === null || val === '' || val === undefined) return undefined
  return Number(val)
}

const formSchema = z.object({
  kode: z.string().min(1, 'Kode wajib diisi'),
  nama: z.string().min(1, 'Nama wajib diisi'),
  alamat: z.string().optional().default(''),
  apakahAktif: z.preprocess(toNum, z.number().min(0).max(1)),
});

interface GudangForm { id?: number; kode: string; nama: string; alamat: string; apakahAktif: number }
const defaultForm = (): GudangForm => ({ kode: '', nama: '', alamat: '', apakahAktif: 1 });
const formState = ref<GudangForm>(defaultForm());
const statusOptions = [{ label: 'Aktif', value: 1 }, { label: 'Nonaktif', value: 0 }];

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  const q = searchQuery.value.toLowerCase();
  return items.value.filter((i: any) => i.nama?.toLowerCase().includes(q) || i.kode?.toLowerCase().includes(q) || i.alamat?.toLowerCase().includes(q));
});

async function fetchItems() {
  isLoading.value = true;
  try {
    const res: any = await api('/api/master/gudang');
    items.value = res.data || [];
  } catch (err: any) {
    console.error(err);
  } finally { isLoading.value = false; }
}

function openCreateModal() { isEditing.value = false; formState.value = defaultForm(); isModalOpen.value = true; }
function openEditModal(row: any) { isEditing.value = true; formState.value = { ...row }; isModalOpen.value = true; }
function closeModal() { isModalOpen.value = false; formState.value = defaultForm(); }

async function saveItem() {
  isSaving.value = true;
  try {
    if (isEditing.value && formState.value.id) {
      await api(`/api/master/gudang/${formState.value.id}`, { method: 'PUT', body: formState.value });
    } else {
      await api('/api/master/gudang', { method: 'POST', body: formState.value });
    }
    closeModal();
    await fetchItems();
    toast.add({ title: 'Berhasil', description: isEditing.value ? 'Data gudang berhasil diubah' : 'Data gudang berhasil ditambahkan', color: 'green' });
  } catch (err: any) {
    toast.add({ title: 'Gagal', description: err.data?.statusMessage || err.message, color: 'red' });
  } finally { isSaving.value = false; }
}

function confirmDelete(row: any) { deleteTarget.value = row; isDeleteModalOpen.value = true; }

async function deleteItem() {
  if (!deleteTarget.value) return;
  isDeleting.value = true;
  try {
    await api(`/api/master/gudang/${deleteTarget.value.id}`, { method: 'DELETE' });
    isDeleteModalOpen.value = false;
    deleteTarget.value = null;
    await fetchItems();
    toast.add({ title: 'Berhasil', description: 'Data gudang berhasil dihapus', color: 'green' });
  } catch (err: any) {
    toast.add({ title: 'Gagal', description: err.data?.statusMessage || err.message, color: 'red' });
  } finally { isDeleting.value = false; }
}

onMounted(() => fetchItems());
</script>
