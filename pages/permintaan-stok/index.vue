<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Request Restok</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Permintaan tambahan stok dari mitra / sales</p>
      </div>
      <UButton icon="i-heroicons-plus" size="sm" to="/permintaan-stok/create">Buat Permintaan</UButton>
    </div>

    <div class="mb-4 flex items-center gap-3">
      <UInput v-model="searchQuery" placeholder="Cari permintaan..." icon="i-heroicons-magnifying-glass-20-solid" class="w-72" size="sm" />
    </div>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <UTable :rows="filteredItems" :columns="columns" :loading="isLoading"
        :empty-state="{ icon: 'i-heroicons-shopping-cart', label: 'Belum ada permintaan' }" sort-mode="manual" class="w-full">
        <template #status-data="{ row }">
          <UBadge :color="statusColor(row.status)" variant="soft" size="xs">{{ statusLabel(row.status) }}</UBadge>
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
  { key: 'nomorPermintaan', label: 'Nomor' },
  { key: 'mitra', label: 'Mitra' },
  { key: 'pemohon', label: 'Pemohon' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
]

function statusColor(status: string) {
  const map: Record<string, string> = { pending: 'amber', approved: 'blue', rejected: 'red', fulfilled: 'emerald' }
  return (map[status] || 'gray') as any
}

function statusLabel(status: string) {
  const map: Record<string, string> = { pending: 'Pending', approved: 'Disetujui', rejected: 'Ditolak', fulfilled: 'Terealisasi' }
  return map[status] || status
}

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value
  const q = searchQuery.value.toLowerCase()
  return items.value.filter((i: any) =>
    i.nomorPermintaan?.toLowerCase().includes(q) ||
    i.mitra?.toLowerCase().includes(q),
  )
})

async function fetchItems() {
  isLoading.value = true
  try {
    const res: any = await api('/api/permintaan-stok')
    items.value = res.data || []
  } catch (err: any) { console.error(err) }
  finally { isLoading.value = false }
}

function viewDetail(row: any) {
  router.push(`/permintaan-stok/${row.id}`)
}

onMounted(() => fetchItems())
</script>
