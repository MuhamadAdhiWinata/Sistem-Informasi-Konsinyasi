<template>
  <div>
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-muted-foreground" />
    </div>

    <template v-else-if="data">
      <div class="flex items-center gap-3 mb-6">
        <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" to="/permintaan-stok" />
        <div class="flex-1">
          <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{{ data.nomorPermintaan }}</h1>
          <p class="text-sm text-muted-foreground mt-0.5">Detail permintaan restok</p>
        </div>
        <div class="flex items-center gap-2">
          <UBadge :color="statusColor(data.status)" variant="soft" size="md">{{ statusLabel(data.status) }}</UBadge>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Mitra</p>
          <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ data.mitra }}</p>
        </UCard>
        <UCard>
          <p class="text-xs text-muted-foreground mb-1">Pemohon</p>
          <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ data.pemohon }}</p>
        </UCard>
      </div>

      <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }" class="mb-6">
        <template #header>
          <div class="flex items-center justify-between px-4 sm:px-6 py-3">
            <h3 class="text-sm font-semibold text-zinc-900 dark:text-white">Item Diminta</h3>
          </div>
        </template>
        <UTable :rows="data.items" :columns="itemColumns" class="w-full">
          <template #jumlahDisetujui-data="{ row }">
            <span v-if="row.jumlahDisetujui" class="font-mono">{{ row.jumlahDisetujui }}</span>
            <span v-else class="text-xs text-muted-foreground">-</span>
          </template>
        </UTable>
      </UCard>

      <div v-if="data.status === 'pending'" class="flex justify-end gap-3">
        <UCard class="w-full max-w-lg">
          <h3 class="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Approval Penyalur</h3>
          <UForm :state="approvalState" :schema="approvalSchema" @submit="approveRequest" class="space-y-4">
            <UFormGroup label="Gudang Asal" name="idGudangAsal" required>
              <USelect v-model="approvalState.idGudangAsal" :options="gudangOptions" placeholder="Pilih gudang" />
            </UFormGroup>
            <p class="text-xs text-muted-foreground">
              Setelah disetujui, sistem akan otomatis membuat draft penyaluran dan faktur.
            </p>
            <div class="flex justify-end gap-3">
              <UButton color="red" variant="soft" :loading="isRejecting" @click="rejectRequest">Tolak</UButton>
              <UButton type="submit" color="emerald" :loading="isApproving">Setujui & Buat Penyaluran</UButton>
            </div>
          </UForm>
        </UCard>
      </div>

      <UCard v-if="data.idPenyaluran" class="mt-4">
        <p class="text-xs text-muted-foreground mb-1">Penyaluran Terkait</p>
        <NuxtLink :to="`/penyaluran/${data.idPenyaluran}`" class="text-sm font-medium text-primary hover:underline">
          {{ data.nomorPenyaluran || `#${data.idPenyaluran}` }}
        </NuxtLink>
      </UCard>
    </template>

    <div v-else class="text-center py-20 text-muted-foreground">
      Data tidak ditemukan
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: 'default' })

const api = useApi()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const isLoading = ref(true)
const isApproving = ref(false)
const isRejecting = ref(false)
const data = ref<any>(null)
const gudangList = ref<any[]>([])

const { user } = useAuth()

const itemColumns = [
  { key: 'sku', label: 'SKU' },
  { key: 'produk', label: 'Produk' },
  { key: 'satuan', label: 'Satuan' },
  { key: 'jumlahDiminta', label: 'Diminta' },
  { key: 'jumlahDisetujui', label: 'Disetujui' },
]

function toNum(val: unknown) {
  if (val === null || val === '' || val === undefined) return undefined
  return Number(val)
}

const approvalSchema = z.object({
  idGudangAsal: z.preprocess(toNum, z.number({ required_error: 'Pilih gudang' }).positive('Pilih gudang')),
})

const approvalState = ref({ idGudangAsal: undefined as number | undefined })

const gudangOptions = computed(() =>
  gudangList.value.map((g: any) => ({ label: g.nama, value: g.id })),
)

function statusColor(status: string) {
  const map: Record<string, string> = { pending: 'amber', approved: 'blue', rejected: 'red', fulfilled: 'emerald' }
  return (map[status] || 'gray') as any
}

function statusLabel(status: string) {
  const map: Record<string, string> = { pending: 'Pending', approved: 'Disetujui', rejected: 'Ditolak', fulfilled: 'Terealisasi' }
  return map[status] || status
}

async function approveRequest() {
  isApproving.value = true
  try {
    const res: any = await api(`/api/permintaan-stok/${route.params.id}`, {
      method: 'PATCH',
      body: { action: 'approved', idGudangAsal: Number(approvalState.value.idGudangAsal) },
    })
    toast.add({ title: 'Berhasil', description: res.message, color: 'green' })
    router.push(`/penyaluran/${res.data.idPenyaluran}`)
  } catch (err: any) {
    toast.add({ title: 'Gagal', description: err.data?.statusMessage || err.message, color: 'red' })
  } finally {
    isApproving.value = false
  }
}

async function rejectRequest() {
  isRejecting.value = true
  try {
    await api(`/api/permintaan-stok/${route.params.id}`, {
      method: 'PATCH',
      body: { action: 'rejected' },
    })
    toast.add({ title: 'Ditolak', description: 'Permintaan restok ditolak', color: 'yellow' })
    await fetchDetail()
  } catch (err: any) {
    toast.add({ title: 'Gagal', description: err.data?.statusMessage || err.message, color: 'red' })
  } finally {
    isRejecting.value = false
  }
}

async function fetchDetail() {
  isLoading.value = true
  try {
    const [detailRes, gudangRes] = await Promise.all([
      api(`/api/permintaan-stok/${route.params.id}`),
      api('/api/master/gudang'),
    ])
    data.value = detailRes.data
    gudangList.value = (gudangRes as any).data || []
  } catch (err: any) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchDetail())
</script>
