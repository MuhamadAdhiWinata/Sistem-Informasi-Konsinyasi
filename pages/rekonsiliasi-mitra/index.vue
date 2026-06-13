<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Rekonsiliasi Mitra</h1>
      <p class="text-sm text-muted-foreground mt-0.5">Ringkasan pendapatan dan penjualan Anda</p>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-muted-foreground" />
    </div>

    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Total Opname</p>
          <p class="text-2xl font-bold text-zinc-900 dark:text-white">{{ totalOpname }}x</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Total Laku</p>
          <p class="text-2xl font-bold text-primary font-mono">{{ totalLaku.toLocaleString('id-ID') }} pcs</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Total Pendapatan</p>
          <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">Rp {{ totalPendapatan.toLocaleString('id-ID') }}</p>
        </UCard>
      </div>

      <UCard v-for="row in items" :key="row.idMitra" class="mb-4">
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
            <p class="text-xs text-muted-foreground">Total Laku</p>
            <p class="text-sm font-medium">{{ Number(row.totalLaku).toLocaleString('id-ID') }} pcs</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Total Retur</p>
            <p class="text-sm font-medium">{{ Number(row.totalRetur).toLocaleString('id-ID') }} pcs</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Pendapatan</p>
            <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-400 font-mono">Rp {{ Number(row.totalPendapatan).toLocaleString('id-ID') }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Retur Baik</p>
            <p class="text-sm font-medium">{{ row.returBaik }} pcs</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Retur Rusak</p>
            <p class="text-sm font-medium">{{ row.returRusak }} pcs</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Retur Expired</p>
            <p class="text-sm font-medium">{{ row.returExpired }} pcs</p>
          </div>
        </div>
      </UCard>

      <p v-if="!items.length" class="text-center py-20 text-muted-foreground">
        Belum ada data rekonsiliasi untuk mitra Anda
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const api = useApi()
const router = useRouter()

const isLoading = ref(true)
const items = ref<any[]>([])

const totalOpname = computed(() =>
  items.value.reduce((sum: number, i: any) => sum + Number(i.totalOpname), 0),
)
const totalLaku = computed(() =>
  items.value.reduce((sum: number, i: any) => sum + Number(i.totalLaku), 0),
)
const totalPendapatan = computed(() =>
  items.value.reduce((sum: number, i: any) => sum + Number(i.totalPendapatan), 0),
)

async function fetchData() {
  isLoading.value = true
  try {
    const res: any = await api('/api/rekonsiliasi-mitra')
    items.value = res.data || []
  } catch (err: any) { console.error(err) }
  finally { isLoading.value = false }
}

function viewDetail(idMitra: number) {
  router.push(`/rekonsiliasi-mitra/${idMitra}`)
}

onMounted(() => fetchData())
</script>
