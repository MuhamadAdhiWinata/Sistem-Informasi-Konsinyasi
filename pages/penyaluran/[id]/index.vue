<template>
  <div>
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-muted-foreground" />
    </div>

    <template v-else-if="data">
      <div class="flex items-center gap-3 mb-6">
        <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" to="/penyaluran" />
        <div class="flex-1">
          <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{{ data.nomorPenyaluran }}</h1>
          <p class="text-sm text-muted-foreground mt-0.5">Detail penyaluran barang</p>
        </div>
        <div class="flex items-center gap-2">
          <UBadge :color="statusColor(data.status)" variant="soft" size="md">{{ statusLabel(data.status) }}</UBadge>
          <UDropdown v-if="data.status === 'draft'" :items="statusActions" :popper="{ placement: 'bottom-end' }">
            <UButton size="sm" color="blue" variant="soft">Ubah Status</UButton>
          </UDropdown>
          <UButton v-if="data.status === 'sent'" size="sm" color="emerald" variant="soft" @click="confirmReceived">
            Tandai Diterima
          </UButton>
          <UButton v-if="canEdit" icon="i-heroicons-pencil-square" size="sm" color="orange" variant="soft" :to="`/penyaluran/${data.id}/edit`">
            Edit
          </UButton>
          <UButton v-if="canDelete" icon="i-heroicons-trash" size="sm" color="red" variant="soft" @click="confirmDelete">
            Hapus
          </UButton>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Mitra</p>
          <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ data.mitra }}</p>
          <p v-if="data.telepon" class="text-xs text-muted-foreground mt-0.5">{{ data.telepon }}</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Gudang Asal</p>
          <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ data.gudangAsal }}</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Sales</p>
          <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ data.sales }}</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Tanggal</p>
          <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ formatTanggal(data.tanggalPenyaluran) }}</p>
        </UCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="lg:col-span-2">
          <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
            <template #header>
              <div class="flex items-center justify-between px-4 sm:px-6 py-3">
                <h3 class="text-sm font-semibold text-zinc-900 dark:text-white">Item Barang</h3>
              </div>
            </template>
            <UTable :rows="data.items" :columns="itemColumns" class="w-full">
              <template #gambar-data="{ row }">
                <img v-if="row.gambar" :src="row.gambar" class="w-10 h-10 rounded object-cover border border-zinc-200 dark:border-zinc-800" />
                <div v-else class="w-10 h-10 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground">
                  <UIcon name="i-heroicons-photo" class="w-5 h-5" />
                </div>
              </template>
              <template #snapshotHargaRetail-data="{ row }">
                <span class="font-mono">Rp {{ Number(row.snapshotHargaRetail).toLocaleString('id-ID') }}</span>
              </template>
              <template #snapshotHargaGrosir-data="{ row }">
                <span class="font-mono">Rp {{ Number(row.snapshotHargaGrosir).toLocaleString('id-ID') }}</span>
              </template>
              <template #subtotal-grosir-data="{ row }">
                <span class="font-mono">Rp {{ (Number(row.jumlahDikirim) * Number(row.snapshotHargaGrosir)).toLocaleString('id-ID') }}</span>
              </template>
              <template #subtotal-retail-data="{ row }">
                <span class="font-mono">Rp {{ (Number(row.jumlahDikirim) * Number(row.snapshotHargaRetail)).toLocaleString('id-ID') }}</span>
              </template>
            </UTable>
          </UCard>
        </div>

        <div>
          <UCard v-if="data.faktur">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-zinc-900 dark:text-white">Faktur Titip Jual</h3>
                <div class="flex gap-1">
                  <UTooltip text="Cetak Faktur" :popper="{ placement: 'top' }">
                    <UButton icon="i-heroicons-printer" size="2xs" color="gray" variant="ghost" :to="`/penyaluran/${data.id}/print`" />
                  </UTooltip>
                </div>
              </div>
            </template>
            <div class="space-y-3">
              <div>
                <p class="text-xs text-muted-foreground">Nomor Faktur</p>
                <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ data.faktur.nomorFaktur }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Total Nilai</p>
                <p class="text-lg font-bold text-primary font-mono">Rp {{ Number(data.faktur.totalNilai).toLocaleString('id-ID') }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Diterbitkan</p>
                <p class="text-sm text-zinc-900 dark:text-white">{{ formatTanggalWaktu(data.faktur.diterbitkanPada) }}</p>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-20 text-muted-foreground">
      Data tidak ditemukan
    </div>

    <UModal v-model="showConfirmReceived">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold">Konfirmasi Penerimaan</h3>
        </template>
        <p class="text-sm text-muted-foreground">
          Tandai penyaluran <strong>{{ data?.nomorPenyaluran }}</strong> sebagai telah diterima oleh mitra?
        </p>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="soft" @click="showConfirmReceived = false">Batal</UButton>
            <UButton color="emerald" :loading="isUpdating" @click="markReceived">Ya, Terima</UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <UModal v-model="showConfirmDelete">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold">Konfirmasi Hapus</h3>
        </template>
        <p class="text-sm text-muted-foreground">
          Hapus penyaluran <strong>{{ data?.nomorPenyaluran }}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="soft" @click="showConfirmDelete = false">Batal</UButton>
            <UButton color="red" :loading="isUpdating" @click="handleDelete">Ya, Hapus</UButton>
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
const { user } = useAuth()

const isLoading = ref(true)
const isUpdating = ref(false)
const showConfirmReceived = ref(false)
const showConfirmDelete = ref(false)
const data = ref<any>(null)

const role = computed(() => user.value?.peran)
const canEdit = computed(() =>
  data.value?.status === 'draft' && (role.value === 'penyalur' || role.value === 'sales'),
)
const canDelete = computed(() =>
  data.value?.status === 'draft' && role.value === 'penyalur',
)

const itemColumns = [
  { key: 'gambar', label: 'Foto' },
  { key: 'sku', label: 'SKU' },
  { key: 'produk', label: 'Produk' },
  { key: 'satuan', label: 'Satuan' },
  { key: 'jumlahDikirim', label: 'Jumlah Kirim' },
  { key: 'snapshotHargaGrosir', label: 'Harga Grosir' },
  { key: 'snapshotHargaRetail', label: 'Harga Retail' },
  { key: 'subtotal-grosir', label: 'Subtotal Grosir' },
  { key: 'subtotal-retail', label: 'Subtotal Retail' },
]

function statusColor(status: string) {
  const map: Record<string, string> = { draft: 'gray', sent: 'blue', received: 'emerald' }
  return (map[status] || 'gray') as any
}

function statusLabel(status: string) {
  const map: Record<string, string> = { draft: 'Draft', sent: 'Dikirim', received: 'Diterima' }
  return map[status] || status
}

const statusActions = computed(() => [
  [{
    label: 'Tandai Dikirim',
    icon: 'i-heroicons-paper-airplane',
    click: () => updateStatus('sent'),
  }],
])

async function updateStatus(status: string) {
  isUpdating.value = true
  try {
    await api(`/api/penyaluran/${route.params.id}`, {
      method: 'PATCH',
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

function confirmReceived() {
  showConfirmReceived.value = true
}

function confirmDelete() {
  showConfirmDelete.value = true
}

async function markReceived() {
  showConfirmReceived.value = false
  await updateStatus('received')
}

async function handleDelete() {
  showConfirmDelete.value = false
  isUpdating.value = true
  try {
    await api(`/api/penyaluran/${route.params.id}`, { method: 'DELETE' })
    toast.add({ title: 'Berhasil', description: 'Penyaluran berhasil dihapus', color: 'green' })
    navigateTo('/penyaluran')
  } catch (err: any) {
    toast.add({ title: 'Gagal', description: err.data?.statusMessage || err.message, color: 'red' })
  } finally {
    isUpdating.value = false
  }
}

async function fetchDetail() {
  isLoading.value = true
  try {
    const res: any = await api(`/api/penyaluran/${route.params.id}`)
    data.value = res.data
  } catch (err: any) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchDetail())
</script>
