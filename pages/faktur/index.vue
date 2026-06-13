<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Faktur Titip Jual</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Daftar faktur penyaluran barang</p>
      </div>
    </div>

    <div class="mb-4 flex items-center gap-3">
      <UInput v-model="searchQuery" placeholder="Cari nomor faktur atau mitra..." icon="i-heroicons-magnifying-glass-20-solid" class="w-72" size="sm" />
    </div>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <UTable :rows="filteredItems" :columns="columns" :loading="isLoading"
        :empty-state="{ icon: 'i-heroicons-document-text', label: 'Belum ada faktur' }" sort-mode="manual" class="w-full">
        <template #totalNilai-data="{ row }">
          <span class="font-mono text-sm">Rp {{ Number(row.totalNilai).toLocaleString('id-ID') }}</span>
        </template>
        <template #diterbitkanPada-data="{ row }">
          <span class="text-sm">{{ new Date(row.diterbitkanPada).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) }}</span>
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-1">
            <UTooltip text="Lihat Faktur" :popper="{ placement: 'top' }">
              <UButton icon="i-heroicons-eye" size="2xs" color="orange" variant="ghost" @click="viewFaktur(row)" />
            </UTooltip>
            <UTooltip text="Cetak Faktur" :popper="{ placement: 'top' }">
              <UButton icon="i-heroicons-printer" size="2xs" color="gray" variant="ghost" @click="printFaktur(row)" />
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
  { key: 'nomorFaktur', label: 'Nomor Faktur' },
  { key: 'nomorPenyaluran', label: 'No. Penyaluran' },
  { key: 'mitra', label: 'Mitra' },
  { key: 'gudang', label: 'Gudang' },
  { key: 'tanggalPenyaluran', label: 'Tanggal' },
  { key: 'diterbitkanPada', label: 'Diterbitkan' },
  { key: 'totalNilai', label: 'Total Nilai', class: 'text-right' },
  { key: 'actions', label: '', class: 'text-right' },
]

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value
  const q = searchQuery.value.toLowerCase()
  return items.value.filter((i: any) =>
    i.nomorFaktur?.toLowerCase().includes(q) ||
    i.mitra?.toLowerCase().includes(q) ||
    i.nomorPenyaluran?.toLowerCase().includes(q),
  )
})

async function fetchItems() {
  isLoading.value = true
  try {
    const res: any = await api('/api/faktur')
    items.value = res.data || []
  } catch (err: any) { console.error(err) }
  finally { isLoading.value = false }
}

function viewFaktur(row: any) {
  router.push(`/penyaluran/${row.idPenyaluran}`)
}

function printFaktur(row: any) {
  router.push(`/penyaluran/${row.idPenyaluran}/print`)
}

onMounted(() => fetchItems())
</script>
