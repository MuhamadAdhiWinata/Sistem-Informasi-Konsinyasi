<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Prediksi Stok</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Estimasi kebutuhan stok berdasarkan Moving Average</p>
      </div>
      <UButton icon="i-heroicons-arrow-path" size="sm" color="primary" :loading="isGenerating" @click="generatePredictions">
        Generate Prediksi
      </UButton>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-muted-foreground" />
    </div>

    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Total Prediksi</p>
          <p class="text-2xl font-bold text-zinc-900 dark:text-white">{{ items.length }}</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Mitra Terprediksi</p>
          <p class="text-2xl font-bold text-zinc-900 dark:text-white">{{ uniqueMitraCount }}</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Produk Terprediksi</p>
          <p class="text-2xl font-bold text-zinc-900 dark:text-white">{{ uniqueProdukCount }}</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Rata-rata per Mitra</p>
          <p class="text-2xl font-bold text-zinc-900 dark:text-white">{{ avgPerMitra }}</p>
        </UCard>
      </div>

      <div v-if="!items.length" class="text-center py-20">
        <p class="text-muted-foreground mb-4">Belum ada data prediksi. Generate prediksi terlebih dahulu.</p>
        <UButton icon="i-heroicons-arrow-path" size="sm" color="primary" @click="generatePredictions">
          Generate Sekarang
        </UButton>
      </div>

      <template v-else>
        <UCard v-for="mitra in mitraGroups" :key="mitra.idMitra" class="mb-4" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
          <template #header>
            <div class="flex items-center justify-between px-4 sm:px-6 py-3">
              <h3 class="text-sm font-semibold text-zinc-900 dark:text-white">{{ mitra.mitra }}</h3>
              <UButton size="xs" color="orange" variant="ghost" @click="viewMitraDetail(mitra.idMitra)">
                Lihat Detail
              </UButton>
            </div>
          </template>
          <UTable :rows="mitra.items" :columns="prediksiColumns" class="w-full">
            <template #rataRataLaku-data="{ row }">
              <span class="font-mono">{{ Number(row.rataRataLaku).toFixed(1) }}</span>
            </template>
            <template #jumlahPrediksi-data="{ row }">
              <span class="font-mono font-semibold text-primary">{{ row.jumlahPrediksi }}</span>
            </template>
          </UTable>
        </UCard>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const api = useApi()
const router = useRouter()
const toast = useToast()

const isLoading = ref(false)
const isGenerating = ref(false)
const items = ref<any[]>([])

const prediksiColumns = [
  { key: 'sku', label: 'SKU' },
  { key: 'produk', label: 'Produk' },
  { key: 'satuan', label: 'Satuan' },
  { key: 'rataRataLaku', label: 'Rata-rata Laku' },
  { key: 'berdasarkanKunjungan', label: 'Basis (N)' },
  { key: 'jumlahPrediksi', label: 'Prediksi Kirim' },
]

const mitraGroups = computed(() => {
  const groups = new Map<number, { idMitra: number; mitra: string; items: any[] }>()
  for (const item of items.value) {
    if (!groups.has(item.idMitra)) {
      groups.set(item.idMitra, { idMitra: item.idMitra, mitra: item.mitra, items: [] })
    }
    groups.get(item.idMitra)!.items.push(item)
  }
  return Array.from(groups.values())
})

const uniqueMitraCount = computed(() => mitraGroups.value.length)
const uniqueProdukCount = computed(() => new Set(items.value.map((i: any) => i.idProduk)).size)
const avgPerMitra = computed(() => {
  const count = mitraGroups.value.length
  if (!count) return 0
  return (items.value.length / count).toFixed(1)
})

async function generatePredictions() {
  isGenerating.value = true
  try {
    const res: any = await api('/api/prediksi-stok/generate', { method: 'POST' })
    toast.add({ title: 'Berhasil', description: res.message, color: 'green' })
    await fetchData()
  } catch (err: any) {
    toast.add({ title: 'Gagal', description: err.data?.statusMessage || err.message, color: 'red' })
  } finally {
    isGenerating.value = false
  }
}

async function fetchData() {
  isLoading.value = true
  try {
    const res: any = await api('/api/prediksi-stok')
    items.value = res.data || []
  } catch (err: any) { console.error(err) }
  finally { isLoading.value = false }
}

function viewMitraDetail(idMitra: number) {
  router.push(`/rekonsiliasi/${idMitra}`)
}

onMounted(() => fetchData())
</script>
