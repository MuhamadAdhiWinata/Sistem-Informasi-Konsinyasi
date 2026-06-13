<template>
  <div>
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-muted-foreground" />
    </div>

    <template v-else-if="data">
      <div class="flex items-center gap-3 mb-6">
        <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" to="/penerimaan-barang" />
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{{ data.nomorPenerimaan }}</h1>
            <UBadge :color="data.status === 'completed' ? 'emerald' : 'gray'" variant="soft" size="sm">
              {{ data.status === 'completed' ? 'Selesai' : 'Draft' }}
            </UBadge>
          </div>
          <p class="text-sm text-muted-foreground mt-0.5">Detail penerimaan barang</p>
        </div>
        <div class="flex items-center gap-2">
          <UButton v-if="canEdit" icon="i-heroicons-pencil-square" size="sm" color="orange" variant="soft" :to="`/penerimaan-barang/edit/${data.id}`">
            Edit
          </UButton>
          <UButton v-if="canConfirm" icon="i-heroicons-check-circle" size="sm" color="primary" variant="solid" @click="confirmReceipt">
            Konfirmasi Penerimaan
          </UButton>
          <UButton v-if="canDelete" icon="i-heroicons-trash" size="sm" color="red" variant="soft" @click="showConfirmDelete = true">
            Hapus
          </UButton>
          <UButton icon="i-heroicons-printer" size="sm" color="gray" variant="soft" :to="`/penerimaan-barang/${data.id}/print`">
            Cetak Surat Jalan
          </UButton>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Pemasok</p>
          <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ data.pemasok }}</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Gudang</p>
          <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ data.gudang }}</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Tanggal</p>
          <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ data.tanggalPenerimaan }}</p>
        </UCard>
      </div>

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
          <template #hargaTebusAktual-data="{ row }">
            <span class="font-mono">Rp {{ Number(row.hargaTebusAktual).toLocaleString('id-ID') }}</span>
          </template>
          <template #subtotal-data="{ row }">
            <span class="font-mono">Rp {{ (Number(row.jumlah) * Number(row.hargaTebusAktual)).toLocaleString('id-ID') }}</span>
          </template>
        </UTable>
      </UCard>
    </template>

    <div v-else class="text-center py-20 text-muted-foreground">
      Data tidak ditemukan
    </div>

    <UModal v-model="showConfirmDelete">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold">Konfirmasi Hapus</h3>
        </template>
        <p class="text-sm text-muted-foreground">
          Hapus penerimaan <strong>{{ data?.nomorPenerimaan }}</strong>? Stok akan dikembalikan. Tindakan ini tidak dapat dibatalkan.
        </p>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="soft" @click="showConfirmDelete = false">Batal</UButton>
            <UButton color="red" :loading="isDeleting" @click="handleDelete">Ya, Hapus</UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <UModal v-model="showConfirmReceipt">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold">Konfirmasi Penerimaan</h3>
        </template>
        <p class="text-sm text-muted-foreground">
          Konfirmasi penerimaan <strong>{{ data?.nomorPenerimaan }}</strong>? Setelah dikonfirmasi, data tidak bisa diubah atau dihapus.
        </p>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="soft" @click="showConfirmReceipt = false">Batal</UButton>
            <UButton color="primary" :loading="isConfirming" @click="handleConfirmReceipt">Ya, Konfirmasi</UButton>
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
const isDeleting = ref(false)
const isConfirming = ref(false)
const showConfirmDelete = ref(false)
const showConfirmReceipt = ref(false)
const data = ref<any>(null)

const role = computed(() => user.value?.peran)
const isPenyalur = computed(() => role.value === 'penyalur')
const canEdit = computed(() => isPenyalur.value && data.value?.status === 'draft')
const canDelete = computed(() => isPenyalur.value && data.value?.status === 'draft')
const canConfirm = computed(() => isPenyalur.value && data.value?.status === 'draft')

const itemColumns = [
  { key: 'gambar', label: 'Foto' },
  { key: 'sku', label: 'SKU' },
  { key: 'produk', label: 'Produk' },
  { key: 'satuan', label: 'Satuan' },
  { key: 'jumlah', label: 'Jumlah' },
  { key: 'hargaTebusAktual', label: 'Harga Pabrik' },
  { key: 'subtotal', label: 'Subtotal' },
]

async function fetchDetail() {
  isLoading.value = true
  try {
    const res: any = await api(`/api/penerimaan-barang/${route.params.id}`)
    data.value = res.data
  } catch (err: any) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

async function handleDelete() {
  showConfirmDelete.value = false
  isDeleting.value = true
  try {
    await api(`/api/penerimaan-barang/${route.params.id}`, { method: 'DELETE' })
    toast.add({ title: 'Berhasil', description: 'Penerimaan berhasil dihapus', color: 'green' })
    navigateTo('/penerimaan-barang')
  } catch (err: any) {
    toast.add({ title: 'Gagal', description: err.data?.statusMessage || err.message, color: 'red' })
  } finally {
    isDeleting.value = false
  }
}

function confirmReceipt() {
  showConfirmReceipt.value = true
}

async function handleConfirmReceipt() {
  showConfirmReceipt.value = false
  isConfirming.value = true
  try {
    await api(`/api/penerimaan-barang/${route.params.id}`, { method: 'PATCH', body: { status: 'completed' } })
    toast.add({ title: 'Berhasil', description: 'Penerimaan telah dikonfirmasi', color: 'green' })
    await fetchDetail()
  } catch (err: any) {
    toast.add({ title: 'Gagal', description: err.data?.statusMessage || err.message, color: 'red' })
  } finally {
    isConfirming.value = false
  }
}

onMounted(() => fetchDetail())
</script>
