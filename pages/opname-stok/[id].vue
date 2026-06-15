<template>
  <div>
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-muted-foreground" />
    </div>

    <template v-else-if="data">
      <div class="flex items-center gap-3 mb-6">
        <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" to="/opname-stok" />
        <div class="flex-1">
          <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{{ data.nomorOpname }}</h1>
          <p class="text-sm text-muted-foreground mt-0.5">Detail opname stok</p>
        </div>
        <div class="flex items-center gap-2">
          <UBadge :color="statusColor(data.status)" variant="soft" size="md">{{ statusLabel(data.status) }}</UBadge>
          <UBadge v-if="data.memilikiAnomali" color="red" variant="soft" size="md">Anomali</UBadge>
          <UDropdown v-if="data.status === 'draft'" :items="submitActions" :popper="{ placement: 'bottom-end' }">
            <UButton size="sm" color="blue" variant="soft">Ubah Status</UButton>
          </UDropdown>
          <UButton v-if="data.status === 'submitted'" size="sm" color="emerald" variant="soft" @click="confirmVerify">
            Verifikasi
          </UButton>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Mitra</p>
          <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ data.mitra }}</p>
          <p v-if="data.telepon" class="text-xs text-muted-foreground mt-0.5">{{ data.telepon }}</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Sales</p>
          <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ data.sales }}</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Tanggal Kunjungan</p>
          <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ data.tanggalKunjungan }}</p>
        </UCard>
      </div>

      <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
        <template #header>
          <div class="flex items-center justify-between px-4 sm:px-6 py-3">
            <h3 class="text-sm font-semibold text-zinc-900 dark:text-white">Item Opname</h3>
            <span class="text-xs text-muted-foreground">Stok Fisik = Stok Awal − Laku − Retur − Hilang</span>
          </div>
        </template>
        <UTable :rows="data.items" :columns="itemColumns" class="w-full">
          <template #gambar-data="{ row }">
            <img v-if="row.gambar" :src="row.gambar" class="w-10 h-10 rounded object-cover border border-zinc-200 dark:border-zinc-800" />
            <div v-else class="w-10 h-10 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground">
              <UIcon name="i-heroicons-photo" class="w-5 h-5" />
            </div>
          </template>
          <template #stokFisik-data="{ row }">
            <span :class="['font-mono font-medium', row.apakahAnomali ? 'text-red-600 dark:text-red-400' : '']">
              {{ row.stokFisik }}
            </span>
          </template>
          <template #apakahAnomali-data="{ row }">
            <UBadge v-if="row.apakahAnomali" color="red" variant="soft" size="xs">Anomali</UBadge>
            <span v-else class="text-xs text-muted-foreground">-</span>
          </template>
          <template #penanggungHilang-data="{ row }">
            <span class="text-sm capitalize">{{ row.penanggungHilang || '-' }}</span>
          </template>
          <template #kondisiRetur-data="{ row }">
            <span v-if="row.kondisiRetur" class="text-sm">{{ kondisiLabel(row.kondisiRetur) }}</span>
            <span v-else class="text-xs text-muted-foreground">-</span>
          </template>
        </UTable>
      </UCard>
    </template>

    <div v-else class="text-center py-20 text-muted-foreground">
      Data tidak ditemukan
    </div>

    <UModal v-model="showConfirmVerify">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold">Konfirmasi Verifikasi</h3>
        </template>
        <p class="text-sm text-muted-foreground">
          Verifikasi opname <strong>{{ data?.nomorOpname }}</strong>? Tindakan ini mengunci laporan opname.
        </p>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="soft" @click="showConfirmVerify = false">Batal</UButton>
            <UButton color="emerald" :loading="isUpdating" @click="markVerified">Ya, Verifikasi</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const api = useApi()
const route = useRoute()
const toast = useToast()

const isLoading = ref(true)
const isUpdating = ref(false)
const showConfirmVerify = ref(false)
const data = ref<any>(null)

const itemColumns = [
  { key: 'gambar', label: 'Foto' },
  { key: 'sku', label: 'SKU' },
  { key: 'produk', label: 'Produk' },
  { key: 'satuan', label: 'Satuan' },
  { key: 'stokAwal', label: 'Stok Awal' },
  { key: 'jumlahLaku', label: 'Laku' },
  { key: 'jumlahRetur', label: 'Retur' },
  { key: 'hilang', label: 'Hilang' },
  { key: 'penanggungHilang', label: 'Ditanggung' },
  { key: 'stokFisik', label: 'Stok Fisik' },
  { key: 'kondisiRetur', label: 'Kondisi Retur' },
  { key: 'apakahAnomali', label: 'Anomali' },
]

function statusColor(status: string) {
  const map: Record<string, string> = { draft: 'gray', submitted: 'blue', verified: 'emerald' }
  return (map[status] || 'gray') as any
}

function statusLabel(status: string) {
  const map: Record<string, string> = { draft: 'Draft', submitted: 'Submitted', verified: 'Terverifikasi' }
  return map[status] || status
}

function kondisiLabel(kondisi: string) {
  const map: Record<string, string> = { good: 'Baik', damaged: 'Rusak', expired: 'Kedaluwarsa' }
  return map[kondisi] || kondisi
}

const submitActions = computed(() => [
  [{
    label: 'Submit Laporan',
    icon: 'i-heroicons-paper-airplane',
    click: () => updateStatus('submitted'),
  }],
])

async function updateStatus(status: string) {
  isUpdating.value = true
  try {
    await api(`/api/opname-stok/${route.params.id}`, {
      method: 'PATCH' as any,
      body: { status },
    })
    toast.add({ title: 'Berhasil', description: `Status diubah ke ${statusLabel(status)}`, color: 'green' })
    await fetchDetail()
  } catch (err: any) {
    toast.add({ title: 'Gagal', description: err.data?.statusMessage || err.message, color: 'red' })
  } finally {
    isUpdating.value = false
  }
}

function confirmVerify() {
  showConfirmVerify.value = true
}

async function markVerified() {
  showConfirmVerify.value = false
  await updateStatus('verified')
}

async function fetchDetail() {
  isLoading.value = true
  try {
    const res: any = await api(`/api/opname-stok/${route.params.id}`)
    data.value = res.data
  } catch (err: any) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchDetail())
</script>
