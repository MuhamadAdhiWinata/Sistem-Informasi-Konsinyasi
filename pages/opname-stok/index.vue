<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Opname Stok</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Laporan kunjungan dan opname stok di mitra</p>
      </div>
      <UButton icon="i-heroicons-plus" size="sm" to="/opname-stok/create">Tambah Opname</UButton>
    </div>

    <div class="mb-4 flex items-center gap-3">
      <UInput v-model="searchQuery" placeholder="Cari nomor opname..." icon="i-heroicons-magnifying-glass-20-solid" class="w-72" size="sm" />
    </div>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <UTable :rows="filteredItems" :columns="columns" :loading="isLoading"
        :empty-state="{ icon: 'i-heroicons-clipboard-document-check', label: 'Belum ada opname' }" sort-mode="manual" class="w-full">
        <template #status-data="{ row }">
          <UBadge :color="statusColor(row.status)" variant="soft" size="xs">{{ statusLabel(row.status) }}</UBadge>
        </template>
        <template #memilikiAnomali-data="{ row }">
          <UBadge v-if="row.memilikiAnomali" color="red" variant="soft" size="xs">Anomali</UBadge>
          <span v-else class="text-xs text-muted-foreground">Normal</span>
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-1">
            <UTooltip text="Detail" :popper="{ placement: 'top' }">
              <UButton icon="i-heroicons-eye" size="2xs" color="orange" variant="ghost" @click="viewDetail(row)" />
            </UTooltip>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const api = useApi()
const router = useRouter()

const searchQuery = ref('')
const isLoading = ref(false)
const items = ref<any[]>([])

const columns = [
  { key: 'nomorOpname', label: 'Nomor' },
  { key: 'mitra', label: 'Mitra' },
  { key: 'sales', label: 'Sales' },
  { key: 'tanggalKunjungan', label: 'Tanggal' },
  { key: 'status', label: 'Status' },
  { key: 'memilikiAnomali', label: 'Anomali' },
  { key: 'actions', label: '' },
]

function statusColor(status: string) {
  const map: Record<string, string> = { draft: 'gray', submitted: 'blue', verified: 'emerald' }
  return (map[status] || 'gray') as any
}

function statusLabel(status: string) {
  const map: Record<string, string> = { draft: 'Draft', submitted: 'Submitted', verified: 'Terverifikasi' }
  return map[status] || status
}

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value
  const q = searchQuery.value.toLowerCase()
  return items.value.filter((i: any) =>
    i.nomorOpname?.toLowerCase().includes(q) ||
    i.mitra?.toLowerCase().includes(q) ||
    i.sales?.toLowerCase().includes(q),
  )
})

async function fetchItems() {
  isLoading.value = true
  try {
    const res: any = await api('/api/opname-stok')
    items.value = res.data || []
  } catch (err: any) { console.error(err) }
  finally { isLoading.value = false }
}

function viewDetail(row: any) {
  router.push(`/opname-stok/${row.id}`)
}

onMounted(() => fetchItems())
</script>
