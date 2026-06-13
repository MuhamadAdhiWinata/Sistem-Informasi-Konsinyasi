<template>
  <div>
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-muted-foreground" />
    </div>

    <template v-else-if="data">
      <div class="flex items-center gap-3 mb-6">
        <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" to="/penerimaan-barang" />
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{{ data.nomorPenerimaan }}</h1>
          <p class="text-sm text-muted-foreground mt-0.5">Detail penerimaan barang</p>
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const api = useApi()
const route = useRoute()

const isLoading = ref(true)
const data = ref<any>(null)

const itemColumns = [
  { key: 'gambar', label: 'Foto' },
  { key: 'sku', label: 'SKU' },
  { key: 'produk', label: 'Produk' },
  { key: 'satuan', label: 'Satuan' },
  { key: 'jumlah', label: 'Jumlah' },
  { key: 'hargaTebusAktual', label: 'Harga Tebus (/unit)' },
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

onMounted(() => fetchDetail())
</script>
