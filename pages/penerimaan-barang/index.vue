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
  { key: 'nomorPenerimaan', label: 'Nomor' },
  { key: 'pemasok', label: 'Pemasok' },
  { key: 'gudang', label: 'Gudang' },
  { key: 'tanggalPenerimaan', label: 'Tanggal' },
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

onMounted(() => fetchItems())
</script>
