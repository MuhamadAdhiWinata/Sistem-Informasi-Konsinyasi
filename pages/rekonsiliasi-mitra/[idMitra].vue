<template>
  <div>
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-muted-foreground" />
    </div>

    <template v-else-if="data">
      <div class="flex items-center gap-3 mb-6">
        <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" to="/rekonsiliasi-mitra" />
        <div class="flex-1">
          <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{{ data.mitra.nama }}</h1>
          <p class="text-sm text-muted-foreground mt-0.5">Detail rekonsiliasi — pendapatan mitra</p>
        </div>
        <UButton icon="i-heroicons-printer" size="sm" color="gray" variant="soft" @click="printPage">
          Cetak Laporan
        </UButton>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Total Pendapatan</p>
          <p class="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">Rp {{ Number(data.summary.totalPendapatan).toLocaleString('id-ID') }}</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Total Laku</p>
          <p class="text-xl font-bold">{{ Number(data.summary.totalLaku).toLocaleString('id-ID') }}</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Total Retur</p>
          <p class="text-xl font-bold">{{ Number(data.summary.totalRetur).toLocaleString('id-ID') }}</p>
        </UCard>
      </div>

      <div class="grid grid-cols-4 gap-4 mb-6">
        <UCard class="text-center">
          <p class="text-xs text-muted-foreground mb-1">Retur Baik</p>
          <p class="text-lg font-bold">{{ data.summary.returBaik }}</p>
        </UCard>
        <UCard class="text-center">
          <p class="text-xs text-muted-foreground mb-1">Retur Rusak</p>
          <p class="text-lg font-bold">{{ data.summary.returRusak }}</p>
        </UCard>
        <UCard class="text-center">
          <p class="text-xs text-muted-foreground mb-1">Retur Expired</p>
          <p class="text-lg font-bold">{{ data.summary.returExpired }}</p>
        </UCard>
        <UCard class="text-center">
          <p class="text-xs text-muted-foreground mb-1">Total Opname</p>
          <p class="text-lg font-bold">{{ data.opnameList.length }}x</p>
        </UCard>
      </div>

      <UCard v-for="opname in data.opnameList" :key="opname.id" class="mb-4" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
        <template #header>
          <div class="flex items-center justify-between px-4 sm:px-6 py-3">
            <div>
              <h3 class="text-sm font-semibold text-zinc-900 dark:text-white">{{ opname.nomorOpname }}</h3>
              <p class="text-xs text-muted-foreground">{{ opname.tanggalKunjungan }} · {{ opname.sales }}</p>
            </div>
            <UBadge :color="opnameStatusColor(opname.status)" variant="soft" size="xs">{{ opnameStatusLabel(opname.status) }}</UBadge>
          </div>
        </template>
        <UTable v-if="opname.items.length" :rows="opname.items" :columns="itemColumns" class="w-full">
          <template #kondisiRetur-data="{ row }">
            <span v-if="row.kondisiRetur" class="text-sm">{{ kondisiLabel(row.kondisiRetur) }}</span>
            <span v-else class="text-xs text-muted-foreground">-</span>
          </template>
          <template #hargaJualPenyalur-data="{ row }">
            <span class="font-mono">Rp {{ Number(row.hargaJualPenyalur).toLocaleString('id-ID') }}</span>
          </template>
          <template #hargaJual-data="{ row }">
            <span class="font-mono">Rp {{ Number(row.hargaJual).toLocaleString('id-ID') }}</span>
          </template>
          <template #marginMitra-data="{ row }">
            <span class="font-mono text-primary">Rp {{ Number(row.marginMitra).toLocaleString('id-ID') }}</span>
          </template>
          <template #pendapatan-data="{ row }">
            <span class="font-mono">Rp {{ Number(row.pendapatan).toLocaleString('id-ID') }}</span>
          </template>
        </UTable>
        <div v-else class="px-4 py-6 text-center text-sm text-muted-foreground">
          Belum ada item opname
        </div>
      </UCard>
    </template>

    <div v-else class="text-center py-20 text-muted-foreground">
      Data tidak ditemukan
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const api = useApi()
const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const data = ref<any>(null)

function printPage() {
  window.print()
}

const itemColumns = [
  { key: 'sku', label: 'SKU' },
  { key: 'produk', label: 'Produk' },
  { key: 'satuan', label: 'Satuan' },
  { key: 'stokAwal', label: 'Stok Awal' },
  { key: 'jumlahLaku', label: 'Laku' },
  { key: 'jumlahRetur', label: 'Retur' },
  { key: 'kondisiRetur', label: 'Kondisi Retur' },
  { key: 'hargaJualPenyalur', label: 'Harga Grosir' },
  { key: 'marginMitra', label: 'Margin Mitra' },
  { key: 'hargaJual', label: 'Harga Retail' },
  { key: 'pendapatan', label: 'Pendapatan (×qty)' },
]

function opnameStatusColor(status: string) {
  const map: Record<string, string> = { draft: 'gray', submitted: 'blue', verified: 'emerald' }
  return (map[status] || 'gray') as any
}

function opnameStatusLabel(status: string) {
  const map: Record<string, string> = { draft: 'Draft', submitted: 'Submitted', verified: 'Terverifikasi' }
  return map[status] || status
}

function kondisiLabel(kondisi: string) {
  const map: Record<string, string> = { good: 'Baik', damaged: 'Rusak', expired: 'Kedaluwarsa' }
  return map[kondisi] || kondisi
}

async function fetchData() {
  isLoading.value = true
  try {
    const res: any = await api(`/api/rekonsiliasi-mitra/${route.params.idMitra}`)
    data.value = res.data
  } catch (err: any) {
    if (err.response?.status === 404) {
      data.value = null
    }
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchData())
</script>
