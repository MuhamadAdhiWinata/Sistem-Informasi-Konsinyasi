<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" to="/opname-stok" />
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Tambah Opname Stok</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Catat hasil kunjungan dan opname stok di mitra</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <UCard class="lg:col-span-3">
        <UForm :state="formState" :schema="formSchema" @submit="saveOpname" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="Mitra" name="idMitra" required>
              <USelect v-model="formState.idMitra" :options="mitraOptions" placeholder="Pilih mitra" :loading="isLoadingItems" />
            </UFormGroup>
            <UFormGroup label="Tanggal Kunjungan" name="tanggalKunjungan" required>
              <UInput v-model="formState.tanggalKunjungan" type="date" />
            </UFormGroup>
          </div>

          <div class="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-zinc-900 dark:text-white">
                Item Opname
                <span v-if="isLoadingItems" class="ml-2 text-xs text-muted-foreground">Memuat data penyaluran...</span>
                <span v-else-if="formState.items.length" class="ml-2 text-xs text-muted-foreground">{{ formState.items.length }} item</span>
              </h3>
              <div class="flex gap-2">
                <UButton v-if="formState.idMitra" icon="i-heroicons-arrow-path" size="2xs" color="gray" variant="soft" :loading="isLoadingItems" @click="fetchExpectedItems(Number(formState.idMitra))">
                  Muat Ulang
                </UButton>
                <UButton icon="i-heroicons-plus-circle" size="2xs" color="gray" variant="soft" @click="addItem">
                  Tambah Item
                </UButton>
              </div>
            </div>

            <table v-if="formState.items.length" class="w-full text-sm">
              <thead>
                <tr class="border-b border-zinc-200 dark:border-zinc-800">
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Produk</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Total Dikirim</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Terakhir Kirim</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Stok Awal</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Laku *</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Retur *</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Hilang</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Ditanggung</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Kondisi Retur</th>
                  <th class="w-10 px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in formState.items" :key="idx"
                  class="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td class="px-3 py-2">
                    <USelect v-model="item.idProduk" :options="produkOptions" placeholder="Pilih produk" />
                  </td>
                  <td class="px-3 py-2 text-muted-foreground">{{ item._totalDikirim ?? '-' }}</td>
                  <td class="px-3 py-2 text-muted-foreground text-xs">{{ item._lastKirim || '-' }}</td>
                  <td class="px-3 py-2">
                    <span class="font-mono text-sm text-zinc-900 dark:text-white">{{ item.stokAwal ?? 0 }}</span>
                  </td>
                  <td class="px-3 py-2">
                    <UInput v-model="item.jumlahLaku" type="number" min="0" @update:model-value="recalc(idx)" />
                  </td>
                  <td class="px-3 py-2">
                    <UInput v-model="item.jumlahRetur" type="number" min="0" @update:model-value="recalc(idx)" />
                  </td>
                  <td class="px-3 py-2">
                    <UInput v-model="item.hilang" type="number" min="0" @update:model-value="recalc(idx)" />
                  </td>
                  <td class="px-3 py-2">
                    <USelect v-model="item.penanggungHilang" :options="penanggungOptions" />
                  </td>
                  <td class="px-3 py-2">
                    <USelect v-model="item.kondisiRetur" :options="kondisiOptions" placeholder="(opsional)" />
                  </td>
                  <td class="px-3 py-2">
                    <UButton icon="i-heroicons-trash" size="2xs" color="red" variant="ghost" @click="removeItem(idx)" />
                  </td>
                </tr>
              </tbody>
            </table>

            <p v-else class="text-sm text-muted-foreground text-center py-6">
              <template v-if="isLoadingItems">
                <UIcon name="i-heroicons-arrow-path" class="animate-spin inline-block mr-1" />
                Memuat data produk dari penyaluran...
              </template>
              <template v-else-if="formState.idMitra">
                Belum ada data penyaluran untuk mitra ini. Klik "Tambah Item" untuk menambahkan produk secara manual.
              </template>
              <template v-else>
                Pilih mitra terlebih dahulu untuk memuat produk yang pernah dikirim.
              </template>
            </p>
          </div>

          <div class="flex justify-end gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <UButton color="gray" variant="soft" to="/opname-stok">Batal</UButton>
            <UButton type="submit" :loading="isSaving" :disabled="!formState.items.length">Simpan</UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: 'default' })

const api = useApi()
const router = useRouter()
const toast = useToast()

const isSaving = ref(false)
const isLoadingItems = ref(false)
const mitraList = ref<any[]>([])
const produkList = ref<any[]>([])

function toNum(val: unknown) {
  if (val === null || val === '' || val === undefined) return undefined
  return Number(val)
}

const formSchema = z.object({
  idMitra: z.preprocess(toNum, z.number({ required_error: 'Pilih mitra' }).positive('Pilih mitra')),
  tanggalKunjungan: z.string().min(1, 'Pilih tanggal'),
  items: z.array(z.object({
    idProduk: z.preprocess(toNum, z.number().positive()),
    stokAwal: z.preprocess(toNum, z.number().int().min(0)),
    jumlahLaku: z.preprocess(toNum, z.number().int().min(0)),
    jumlahRetur: z.preprocess(toNum, z.number().int().min(0)),
    hilang: z.preprocess(toNum, z.number().int().min(0).default(0)),
    penanggungHilang: z.enum(['penyalur', 'mitra']).default('penyalur'),
    kondisiRetur: z.string().optional(),
  })).min(1, 'Minimal 1 item'),
})

interface ItemForm {
  idProduk: number | undefined
  stokAwal: number | undefined
  jumlahLaku: number | undefined
  jumlahRetur: number | undefined
  hilang: number | undefined
  penanggungHilang: string
  kondisiRetur: string | undefined
  _stokFisik: number
  _totalDikirim: number | null
  _lastKirim: string
}

interface FormData {
  idMitra: number | undefined
  tanggalKunjungan: string
  items: ItemForm[]
}

const penanggungOptions = [
  { label: 'Penyalur', value: 'penyalur' },
  { label: 'Mitra', value: 'mitra' },
]

const defaultItem = (): ItemForm => ({
  idProduk: undefined,
  stokAwal: 0,
  jumlahLaku: 0,
  jumlahRetur: 0,
  hilang: 0,
  penanggungHilang: 'penyalur',
  kondisiRetur: undefined,
  _stokFisik: 0,
  _totalDikirim: null,
  _lastKirim: '',
})

const formState = ref<FormData>({
  idMitra: undefined,
  tanggalKunjungan: new Date().toISOString().split('T')[0],
  items: [],
})

const mitraOptions = computed(() =>
  mitraList.value.filter((m: any) => m.apakahAktif).map((m: any) =>
    ({ label: `${m.nama} - ${m.namaPemilik}`, value: m.id })),
)

const produkOptions = computed(() =>
  produkList.value
    .filter((p: any) => p.apakahAktif)
    .map((p: any) => ({ label: `${p.nama} (${p.sku})`, value: p.id })),
)

const kondisiOptions = [
  { label: '(Normal)', value: '' },
  { label: 'Baik', value: 'good' },
  { label: 'Rusak', value: 'damaged' },
  { label: 'Kedaluwarsa', value: 'expired' },
]

function recalc(idx: number) {
  const item = formState.value.items[idx]
  const awal = Number(item.stokAwal) || 0
  const laku = Number(item.jumlahLaku) || 0
  const retur = Number(item.jumlahRetur) || 0
  const hilang = Number(item.hilang) || 0
  item._stokFisik = awal - laku - retur - hilang
}

function addItem() {
  formState.value.items.push(defaultItem())
}

function removeItem(idx: number) {
  formState.value.items.splice(idx, 1)
}

async function fetchExpectedItems(idMitra: number) {
  if (!idMitra) {
    formState.value.items = []
    return
  }
  isLoadingItems.value = true
  try {
    const res = await api(`/api/opname-stok/expected-items?idMitra=${idMitra}`)
    const data = (res as any).data || []
    formState.value.items = data.map((d: any) => ({
      idProduk: d.idProduk,
      stokAwal: d.expectedStock ?? 0,
      jumlahLaku: 0,
      jumlahRetur: 0,
      hilang: 0,
      penanggungHilang: 'penyalur',
      kondisiRetur: undefined as string | undefined,
      _stokFisik: d.expectedStock,
      _totalDikirim: d.totalDistributed,
      _lastKirim: d.lastPenyaluranTanggal ? `${d.lastPenyaluranTanggal.replace(/-/g, '/')} (${d.lastPenyaluranNomor})` : '-',
    }))
  } catch (err: any) {
    console.error(err)
    toast.add({ title: 'Gagal memuat data', description: err.data?.statusMessage || err.message, color: 'red' })
  } finally {
    isLoadingItems.value = false
  }
}

watch(() => formState.value.idMitra, (val) => {
  fetchExpectedItems(Number(val))
})

async function loadReferences() {
  try {
    const [mitraRes, produkRes] = await Promise.all([
      api('/api/master/mitra'),
      api('/api/master/produk'),
    ])
    mitraList.value = (mitraRes as any).data || []
    produkList.value = (produkRes as any).data || []
  } catch (err: any) {
    console.error(err)
  }
}

async function saveOpname() {
  isSaving.value = true
  try {
    const body = {
      idMitra: Number(formState.value.idMitra),
      tanggalKunjungan: formState.value.tanggalKunjungan,
      items: formState.value.items.map((item) => ({
        idProduk: Number(item.idProduk),
        stokAwal: Number(item.stokAwal),
        jumlahLaku: Number(item.jumlahLaku),
        jumlahRetur: Number(item.jumlahRetur),
        hilang: Number(item.hilang) || 0,
        penanggungHilang: item.penanggungHilang || 'penyalur',
        kondisiRetur: item.kondisiRetur || undefined,
      })),
    }

    const res: any = await api('/api/opname-stok', {
      method: 'POST',
      body,
    })

    toast.add({ title: 'Berhasil', description: res.message, color: 'green' })
    router.push(`/opname-stok/${res.data.id}`)
  } catch (err: any) {
    toast.add({ title: 'Gagal', description: err.data?.statusMessage || err.message, color: 'red' })
  } finally {
    isSaving.value = false
  }
}

onMounted(() => loadReferences())
</script>
