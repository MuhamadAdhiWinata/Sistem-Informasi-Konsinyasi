<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Penerimaan Barang</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Catat penerimaan barang dari pemasok ke gudang</p>
      </div>
      <UButton icon="i-heroicons-plus" size="sm" to="/penerimaan-barang/create">Tambah Penerimaan</UButton>
    </div>

    <div class="mb-4 flex items-center gap-3">
      <UInput v-model="searchQuery" placeholder="Cari nomor penerimaan..." icon="i-heroicons-magnifying-glass-20-solid" class="w-72" size="sm" />
    </div>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <UTable :rows="filteredItems" :columns="columns" :loading="isLoading"
        :empty-state="{ icon: 'i-heroicons-document-arrow-down', label: 'Belum ada penerimaan' }" sort-mode="manual" class="w-full">
        <template #status-data="{ row }">
          <UBadge :color="row.status === 'completed' ? 'emerald' : 'gray'" variant="soft" size="xs">
            {{ row.status === 'completed' ? 'Selesai' : 'Draft' }}
          </UBadge>
        </template>
        <template #tanggalPenerimaan-data="{ row }">
          <span class="text-sm">{{ formatTanggal(row.tanggalPenerimaan) }}</span>
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-1">
            <UTooltip text="Detail" :popper="{ placement: 'top' }">
              <UButton icon="i-heroicons-eye" size="2xs" color="orange" variant="ghost" @click="viewDetail(row)" />
            </UTooltip>
            <UTooltip v-if="canEdit(row)" text="Edit" :popper="{ placement: 'top' }">
              <UButton icon="i-heroicons-pencil-square" size="2xs" color="blue" variant="ghost" @click="editItem(row)" />
            </UTooltip>
            <UTooltip v-if="canDelete(row)" text="Hapus" :popper="{ placement: 'top' }">
              <UButton icon="i-heroicons-trash" size="2xs" color="red" variant="ghost" @click="confirmDelete(row)" />
            </UTooltip>
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold">Konfirmasi Hapus</h3>
        </template>
        <p class="text-sm text-muted-foreground">
          Hapus penerimaan <strong>{{ deleteTarget?.nomorPenerimaan }}</strong>?
        </p>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="soft" @click="showDeleteModal = false">Batal</UButton>
            <UButton color="red" :loading="isDeleting" @click="handleDelete">Ya, Hapus</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const api = useApi()
const router = useRouter()
const toast = useToast()
const { user } = useAuth()

const searchQuery = ref('')
const isLoading = ref(false)
const isDeleting = ref(false)
const showDeleteModal = ref(false)
const deleteTarget = ref<any>(null)
const items = ref<any[]>([])

const role = computed(() => user.value?.peran)

function canEdit(row: any) {
  return row.status === 'draft' && role.value === 'penyalur'
}

function canDelete(row: any) {
  return row.status === 'draft' && role.value === 'penyalur'
}

const columns = [
  { key: 'nomorPenerimaan', label: 'Nomor' },
  { key: 'pemasok', label: 'Pemasok' },
  { key: 'gudang', label: 'Gudang' },
  { key: 'tanggalPenerimaan', label: 'Tanggal' },
  { key: 'status', label: 'Status' },
  { key: 'penerima', label: 'Diterima Oleh' },
  { key: 'actions', label: '' },
]

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value
  const q = searchQuery.value.toLowerCase()
  return items.value.filter((i: any) =>
    i.nomorPenerimaan?.toLowerCase().includes(q) ||
    i.pemasok?.toLowerCase().includes(q) ||
    i.gudang?.toLowerCase().includes(q),
  )
})

async function fetchItems() {
  isLoading.value = true
  try {
    const res: any = await api('/api/penerimaan-barang')
    items.value = res.data || []
  } catch (err: any) { console.error(err) }
  finally { isLoading.value = false }
}

function viewDetail(row: any) {
  router.push(`/penerimaan-barang/${row.id}`)
}

function editItem(row: any) {
  router.push(`/penerimaan-barang/edit/${row.id}`)
}

function confirmDelete(row: any) {
  deleteTarget.value = row
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!deleteTarget.value) return
  showDeleteModal.value = false
  isDeleting.value = true
  try {
    await api(`/api/penerimaan-barang/${deleteTarget.value.id}`, { method: 'DELETE' })
    toast.add({ title: 'Berhasil', description: 'Penerimaan berhasil dihapus', color: 'green' })
    await fetchItems()
  } catch (err: any) {
    toast.add({ title: 'Gagal', description: err.data?.statusMessage || err.message, color: 'red' })
  } finally {
    isDeleting.value = false
    deleteTarget.value = null
  }
}

onMounted(() => fetchItems())
</script>
