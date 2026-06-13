<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Stok Gudang</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Pantau ketersediaan stok di setiap gudang</p>
      </div>
    </div>

    <div class="mb-4 flex items-center gap-3 flex-wrap">
      <UInput v-model="searchQuery" placeholder="Cari produk..." icon="i-heroicons-magnifying-glass-20-solid" class="w-64" size="sm" />
      <USelect v-model="filterGudang" :options="gudangOptions" placeholder="Semua Gudang" class="w-56" size="sm" clearable />
    </div>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <UTable :rows="filteredItems" :columns="columns" :loading="isLoading"
        :empty-state="{ icon: 'i-heroicons-cube', label: 'Belum ada data stok' }" class="w-full">
        <template #jumlah-data="{ row }">
          <span class="font-semibold" :class="row.jumlah > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'">
            {{ row.jumlah }}
          </span>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const api = useApi()

const searchQuery = ref('')
const filterGudang = ref<number | undefined>(undefined)
const isLoading = ref(false)
const items = ref<any[]>([])
const gudangList = ref<any[]>([])

const columns = [
  { key: 'sku', label: 'SKU' },
  { key: 'produk', label: 'Produk', sortable: true },
  { key: 'gudang', label: 'Gudang', sortable: true },
  { key: 'kodeGudang', label: 'Kode Gudang' },
  { key: 'satuan', label: 'Satuan' },
  { key: 'jumlah', label: 'Stok Tersedia', sortable: true },
]

const gudangOptions = computed(() =>
  gudangList.value.map((g: any) => ({ label: g.nama, value: g.id })),
)

const filteredItems = computed(() => {
  let result = items.value
  const gd = filterGudang.value
  if (gd !== undefined && gd !== null) {
    result = result.filter((i: any) => i.idGudang === gd)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((i: any) =>
      i.produk?.toLowerCase().includes(q) ||
      i.sku?.toLowerCase().includes(q) ||
      i.gudang?.toLowerCase().includes(q),
    )
  }
  return result
})

async function fetchData() {
  isLoading.value = true
  try {
    const [stokRes, gudangRes] = await Promise.all([
      api('/api/stok-gudang'),
      api('/api/master/gudang'),
    ])
    items.value = (stokRes as any).data || []
    gudangList.value = (gudangRes as any).data || []
  } catch (err: any) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchData())
</script>
