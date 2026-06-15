<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Rekonsiliasi Penyalur</h1>
      <p class="text-sm text-muted-foreground mt-0.5">Ringkasan pendapatan per mitra — distributor</p>
    </div>

    <div class="mb-4 flex items-center gap-3">
      <UInput v-model="searchQuery" placeholder="Cari mitra..." icon="i-heroicons-magnifying-glass-20-solid" class="w-72" size="sm" />
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-muted-foreground" />
    </div>

    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Total Mitra Aktif</p>
          <p class="text-2xl font-bold text-zinc-900 dark:text-white">{{ items.length }}</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Total Pendapatan Mitra</p>
          <p class="text-2xl font-bold text-primary font-mono">Rp {{ totalPendapatanMitra.toLocaleString('id-ID') }}</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Total Pendapatan Penyalur</p>
          <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">Rp {{ totalPendapatanPenyalur.toLocaleString('id-ID') }}</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Total Laba Gabungan</p>
          <p class="text-2xl font-bold text-violet-600 dark:text-violet-400 font-mono">Rp {{ totalGabungan.toLocaleString('id-ID') }}</p>
        </UCard>
      </div>

      <UCard v-for="row in filteredItems" :key="row.idMitra" class="mb-4">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-base font-semibold text-zinc-900 dark:text-white">{{ row.mitra }}</h3>
            <p v-if="row.telepon" class="text-xs text-muted-foreground">{{ row.telepon }}</p>
          </div>
          <UButton size="xs" color="orange" variant="ghost" @click="viewDetail(row.idMitra)">
            <template #trailing>
              <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
            </template>
            Detail
          </UButton>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p class="text-xs text-muted-foreground">Opname</p>
            <p class="text-sm font-medium">{{ row.totalOpname }}x</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Penyaluran</p>
            <p class="text-sm font-medium">{{ row.totalPenyaluran }}x</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Total Laku</p>
            <p class="text-sm font-medium">{{ Number(row.totalLaku).toLocaleString('id-ID') }} pcs</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Total Retur</p>
            <p class="text-sm font-medium">{{ Number(row.totalRetur).toLocaleString('id-ID') }} pcs</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Total Hilang</p>
            <p class="text-sm font-medium">{{ Number(row.totalHilang || 0).toLocaleString('id-ID') }} pcs</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Laba Mitra</p>
            <p class="text-sm font-semibold text-primary font-mono">Rp {{ Number(row.totalPendapatanMitra).toLocaleString('id-ID') }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Laba Penyalur</p>
            <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-400 font-mono">Rp {{ Number(row.totalPendapatanPenyalur).toLocaleString('id-ID') }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Retur (B/R/E)</p>
            <p class="text-sm font-medium">{{ row.returBaik }}/{{ row.returRusak }}/{{ row.returExpired }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Rasio Laba (Penyalur/Mitra)</p>
            <p class="text-sm font-medium">{{ marginPercent(row) }}%</p>
          </div>
        </div>
      </UCard>

      <p v-if="!filteredItems.length" class="text-center py-20 text-muted-foreground">
        Belum ada data rekonsiliasi
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const api = useApi()
const router = useRouter()

const searchQuery = ref('')
const isLoading = ref(true)
const items = ref<any[]>([])

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value
  const q = searchQuery.value.toLowerCase()
  return items.value.filter((i: any) =>
    i.mitra?.toLowerCase().includes(q),
  )
})

const totalPendapatanMitra = computed(() =>
  items.value.reduce((sum: number, i: any) => sum + Number(i.totalPendapatanMitra), 0),
)

const totalPendapatanPenyalur = computed(() =>
  items.value.reduce((sum: number, i: any) => sum + Number(i.totalPendapatanPenyalur), 0),
)

const totalGabungan = computed(() =>
  totalPendapatanMitra.value + totalPendapatanPenyalur.value,
)

function marginPercent(row: any) {
  const total = Number(row.totalPendapatanMitra)
  if (!total) return 0
  return ((Number(row.totalPendapatanPenyalur) / total) * 100).toFixed(1)
}

async function fetchData() {
  isLoading.value = true
  try {
    const res: any = await api('/api/rekonsiliasi-penyalur')
    items.value = res.data || []
  } catch (err: any) { console.error(err) }
  finally { isLoading.value = false }
}

function viewDetail(idMitra: number) {
  router.push(`/rekonsiliasi-penyalur/${idMitra}`)
}

onMounted(() => fetchData())
</script>
