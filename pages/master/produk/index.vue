<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Produk</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Kelola data produk / SKU</p>
      </div>
      <UButton icon="i-heroicons-plus" size="sm" @click="openCreateModal">Tambah Produk</UButton>
    </div>

    <div class="mb-4 flex items-center gap-3">
      <UInput v-model="searchQuery" placeholder="Cari produk..." icon="i-heroicons-magnifying-glass-20-solid" class="w-72" size="sm" />
    </div>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <UTable :rows="filteredItems" :columns="columns" :loading="isLoading"
        :empty-state="{ icon: 'i-heroicons-cube', label: 'Belum ada produk' }" sort-mode="manual" class="w-full">
        <template #gambar-data="{ row }">
          <img v-if="row.gambar" :src="row.gambar" class="w-10 h-10 rounded object-cover border border-zinc-200 dark:border-zinc-800" />
          <div v-else class="w-10 h-10 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground">
            <UIcon name="i-heroicons-photo" class="w-5 h-5" />
          </div>
        </template>
        <template #hargaTebus-data="{ row }">
          <span class="font-mono">Rp {{ Number(row.hargaTebus).toLocaleString('id-ID') }}</span>
        </template>
        <template #hargaJualPenyalur-data="{ row }">
          <span class="font-mono">Rp {{ Number(row.hargaJualPenyalur).toLocaleString('id-ID') }}</span>
        </template>
        <template #hargaJual-data="{ row }">
          <span class="font-mono">Rp {{ Number(row.hargaJual).toLocaleString('id-ID') }}</span>
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
            <h3 class="text-base font-semibold leading-6">{{ isEditing ? 'Edit Produk' : 'Tambah Produk' }}</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="closeModal" />
          </div>
        </template>
        <UForm :state="formState" :schema="formSchema" @submit="saveItem" class="space-y-4">
          <div class="flex gap-4">
            <div class="flex-1 space-y-4">
              <UFormGroup label="SKU" name="sku" required>
                <UInput v-model="formState.sku" placeholder="e.g. IND-M-001" />
              </UFormGroup>
              <UFormGroup label="Nama Produk" name="nama" required>
                <UInput v-model="formState.nama" placeholder="e.g. Indomie Goreng" />
              </UFormGroup>
              <UFormGroup label="Pemasok" name="idPemasok" required>
                <USelect v-model="formState.idPemasok" :options="pemasokOptions" placeholder="Pilih pemasok" />
              </UFormGroup>
            </div>
            <div class="flex flex-col items-center gap-2">
              <label class="text-xs font-medium text-muted-foreground">Foto Produk</label>
              <label class="cursor-pointer group">
                <div class="w-24 h-24 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors">
                  <img v-if="formState.gambar" :src="formState.gambar" class="w-full h-full object-cover" />
                  <UIcon v-else name="i-heroicons-camera" class="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                </div>
                <input type="file" accept="image/*" class="hidden" @change="onFileSelect" />
              </label>
              <p v-if="formState.gambar" class="text-xs text-muted-foreground cursor-pointer hover:text-red-500" @click="formState.gambar = ''">Hapus</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Satuan" name="satuan" required>
              <UInput v-model="formState.satuan" placeholder="e.g. Kardus" />
            </UFormGroup>
            <UFormGroup label="Harga Tebus (Rp/unit)" name="hargaTebus" required>
              <UInput v-model="formState.hargaTebus" placeholder="Supplier → Penyalur" type="number" />
            </UFormGroup>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Hrg Jual Penyalur (Rp/unit)" name="hargaJualPenyalur" required>
              <UInput v-model="formState.hargaJualPenyalur" placeholder="Penyalur → Mitra" type="number" />
            </UFormGroup>
            <UFormGroup label="Hrg Jual Retail (Rp/unit)" name="hargaJual" required>
              <UInput v-model="formState.hargaJual" placeholder="Mitra → Konsumen" type="number" />
            </UFormGroup>
          </div>
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
const pemasokList = ref<any[]>([]);
const deleteTarget = ref<any>(null);

const columns = [
  { key: 'gambar', label: 'Foto' },
  { key: 'sku', label: 'SKU' },
  { key: 'nama', label: 'Nama' },
  { key: 'namaPemasok', label: 'Pemasok' },
  { key: 'satuan', label: 'Satuan' },
  { key: 'hargaTebus', label: 'Hrg Tebus (/unit)' },
  { key: 'hargaJualPenyalur', label: 'Hrg Penyalur (/unit)' },
  { key: 'hargaJual', label: 'Hrg Retail (/unit)' },
  { key: 'apakahAktif', label: 'Status' },
  { key: 'actions', label: '' },
];

function toNum(val: unknown) {
  if (val === null || val === '' || val === undefined) return undefined
  return Number(val)
}

const formSchema = z.object({
  sku: z.string().min(1, 'SKU wajib diisi'),
  nama: z.string().min(1, 'Nama wajib diisi'),
  idPemasok: z.preprocess(toNum, z.number({ required_error: 'Pemasok wajib dipilih' })),
  satuan: z.string().min(1, 'Satuan wajib diisi'),
  hargaTebus: z.string().min(1, 'Harga tebus wajib diisi'),
  hargaJualPenyalur: z.string().min(1, 'Harga jual penyalur wajib diisi'),
  hargaJual: z.string().min(1, 'Harga jual retail wajib diisi'),
  gambar: z.string().optional().default(''),
  apakahAktif: z.number().min(0).max(1),
});

interface FormData { id?: number; sku: string; nama: string; idPemasok: number | null; satuan: string; hargaTebus: string; hargaJualPenyalur: string; hargaJual: string; gambar: string; apakahAktif: number }
const defaultForm = (): FormData => ({ sku: '', nama: '', idPemasok: null, satuan: '', hargaTebus: '', hargaJualPenyalur: '', hargaJual: '', gambar: '', apakahAktif: 1 });
const formState = ref<FormData>(defaultForm());
const statusOptions = [{ label: 'Aktif', value: 1 }, { label: 'Nonaktif', value: 0 }];

const pemasokOptions = computed(() => pemasokList.value.map((p: any) => ({ label: p.nama, value: p.id })));

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  const q = searchQuery.value.toLowerCase();
  return items.value.filter((i: any) => i.nama?.toLowerCase().includes(q) || i.sku?.toLowerCase().includes(q) || i.namaPemasok?.toLowerCase().includes(q));
});

function onFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    formState.value.gambar = reader.result as string
  }
  reader.readAsDataURL(file)
}

async function fetchItems() {
  isLoading.value = true;
  try {
    const [prodRes, pemRes] = await Promise.all([
      api('/api/master/produk'),
      api('/api/master/pemasok'),
    ]);
    items.value = (prodRes as any).data || [];
    pemasokList.value = (pemRes as any).data || [];
  } catch (err: any) { console.error(err); } finally { isLoading.value = false; }
}

function openCreateModal() { isEditing.value = false; formState.value = defaultForm(); isModalOpen.value = true; }
function openEditModal(row: any) { isEditing.value = true; formState.value = { ...row }; isModalOpen.value = true; }
function closeModal() { isModalOpen.value = false; formState.value = defaultForm(); }

async function saveItem() {
  isSaving.value = true;
  try {
    if (isEditing.value && formState.value.id) {
      await api(`/api/master/produk/${formState.value.id}`, { method: 'PUT', body: formState.value });
    } else {
      await api('/api/master/produk', { method: 'POST', body: formState.value });
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
    await api(`/api/master/produk/${deleteTarget.value.id}`, { method: 'DELETE' });
    isDeleteModalOpen.value = false;
    deleteTarget.value = null;
    await fetchItems();
  } catch (err: any) { console.error(err); } finally { isDeleting.value = false; }
}

onMounted(() => fetchItems());
</script>
