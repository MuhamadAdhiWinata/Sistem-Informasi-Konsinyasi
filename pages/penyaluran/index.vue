<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Penyaluran</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Daftar penyaluran barang ke mitra</p>
      </div>
      <UButton icon="i-heroicons-plus" size="sm" to="/penyaluran/create">Tambah Penyaluran</UButton>
    </div>

    <div class="mb-4 flex items-center gap-3">
      <UInput v-model="searchQuery" placeholder="Cari nomor penyaluran..." icon="i-heroicons-magnifying-glass-20-solid" class="w-72" size="sm" />
    </div>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <UTable :rows="filteredItems" :columns="columns" :loading="isLoading"
        :empty-state="{ icon: 'i-heroicons-truck', label: 'Belum ada penyaluran' }" sort-mode="manual" class="w-full">
        <template #status-data="{ row }">
          <UBadge :color="statusColor(row.status)" variant="soft" size="xs">{{ statusLabel(row.status) }}</UBadge>
        </template>
        <template #totalNilai-data="{ row }">
          <span class="font-mono text-sm">Rp {{ Number(row.totalNilai).toLocaleString('id-ID') }}</span>
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
  { key: 'nomorPenyaluran', label: 'Nomor' },
  { key: 'mitra', label: 'Mitra' },
  { key: 'gudangAsal', label: 'Gudang Asal' },
  { key: 'sales', label: 'Sales' },
  { key: 'tanggalPenyaluran', label: 'Tanggal' },
  { key: 'status', label: 'Status' },
  { key: 'nomorFaktur', label: 'Faktur' },
  { key: 'totalNilai', label: 'Total', class: 'text-right' },
  { key: 'actions', label: '' },
]

function statusColor(status: string) {
  const map: Record<string, string> = { draft: 'gray', sent: 'blue', received: 'emerald' }
  return (map[status] || 'gray') as any
}

function statusLabel(status: string) {
  const map: Record<string, string> = { draft: 'Draft', sent: 'Dikirim', received: 'Diterima' }
  return map[status] || status
}

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value
  const q = searchQuery.value.toLowerCase()
  return items.value.filter((i: any) =>
    i.nomorPenyaluran?.toLowerCase().includes(q) ||
    i.mitra?.toLowerCase().includes(q) ||
    i.nomorFaktur?.toLowerCase().includes(q),
  )
})

async function fetchItems() {
  isLoading.value = true
  try {
    const res: any = await api('/api/penyaluran')
    items.value = res.data || []
  } catch (err: any) { console.error(err) }
  finally { isLoading.value = false }
}

function viewDetail(row: any) {
  router.push(`/penyaluran/${row.id}`)
}

onMounted(() => fetchItems())
</script>
