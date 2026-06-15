<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" to="/penyaluran" />
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Tambah Penyaluran</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Salurkan barang ke mitra dan terbitkan faktur</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <UCard class="lg:col-span-3">
        <UForm :state="formState" :schema="formSchema" @submit="savePenyaluran" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UFormGroup label="Gudang Asal" name="idGudangAsal" required>
              <USelect v-model="formState.idGudangAsal" :options="gudangOptions" placeholder="Pilih gudang" />
            </UFormGroup>
            <UFormGroup label="Mitra Tujuan" name="idMitra" required>
              <USelect v-model="formState.idMitra" :options="mitraOptions" placeholder="Pilih mitra" />
            </UFormGroup>
            <UFormGroup label="Tanggal Penyaluran" name="tanggalPenyaluran" required>
              <UInput v-model="formState.tanggalPenyaluran" type="date" />
            </UFormGroup>
          </div>

          <div class="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-zinc-900 dark:text-white">Item Barang</h3>
              <UButton icon="i-heroicons-plus-circle" size="2xs" color="gray" variant="soft" @click="addItem">
                Tambah Item
              </UButton>
            </div>

            <table v-if="formState.items.length" class="w-full text-sm">
              <thead>
                <tr class="border-b border-zinc-200 dark:border-zinc-800">
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Produk</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Jumlah Kirim</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Harga Pabrik (acuan)</th>
                    <th class="text-left px-3 py-2 font-medium text-muted-foreground">Harga Grosir</th>
                    <th class="text-left px-3 py-2 font-medium text-muted-foreground">Harga Retail</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Subtotal Grosir</th>
                    <th class="text-left px-3 py-2 font-medium text-muted-foreground">Subtotal Retail</th>
                  <th class="w-10 px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                  <tr v-for="(item, idx) in formState.items" :key="idx" class="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td class="px-3 py-2 align-top">
                    <USelect v-model="item.idProduk" :options="produkOptions" placeholder="Pilih produk" />
                  </td>
                  <td class="px-3 py-2 align-top">
                    <UInput v-model="item.jumlahDikirim" type="number" min="1" />
                    <p v-if="item.idProduk" class="text-xs mt-0.5" :class="stokClass(item.idProduk, item.jumlahDikirim)">
                      Stok: {{ stokByProduk[item.idProduk] ?? '—' }}
                    </p>
                  </td>
                  <td class="px-3 py-2 align-top">
                    <span v-if="item.idProduk" class="font-mono text-xs text-zinc-500">Rp {{ hargaPabrikAcuan(item.idProduk) }}</span>
                    <span v-else class="text-xs text-muted-foreground">—</span>
                  </td>
                  <td class="px-3 py-2 align-top">
                    <UInput v-model="item.snapshotHargaGrosir" type="number" min="0" />
                  </td>
                  <td class="px-3 py-2 align-top">
                    <UInput v-model="item.snapshotHargaRetail" type="number" min="0" />
                  </td>
                  <td class="px-3 py-2 align-top font-mono text-sm">
                    <template v-if="item.jumlahDikirim && item.snapshotHargaGrosir">
                      Rp {{ (Number(item.jumlahDikirim) * Number(item.snapshotHargaGrosir)).toLocaleString('id-ID') }}
                    </template>
                    <span v-else class="text-muted-foreground">-</span>
                  </td>
                  <td class="px-3 py-2 align-top font-mono text-sm">
                    <template v-if="item.jumlahDikirim && item.snapshotHargaRetail">
                      Rp {{ (Number(item.jumlahDikirim) * Number(item.snapshotHargaRetail)).toLocaleString('id-ID') }}
                    </template>
                    <span v-else class="text-muted-foreground">-</span>
                  </td>
                  <td class="px-3 py-2 align-top">
                    <UButton icon="i-heroicons-trash" size="2xs" color="red" variant="ghost" @click="removeItem(idx)" />
                  </td>
                </tr>
              </tbody>
            </table>

            <p v-else class="text-sm text-muted-foreground text-center py-6">
              Belum ada item. Klik "Tambah Item" untuk menambahkan produk.
            </p>
          </div>

          <div class="flex justify-end gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <UButton color="gray" variant="soft" to="/penyaluran">Batal</UButton>
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
const gudangList = ref<any[]>([])
const mitraList = ref<any[]>([])
const produkList = ref<any[]>([])
const stokList = ref<any[]>([])

function toNum(val: unknown) {
  if (val === null || val === '' || val === undefined) return undefined
  return Number(val)
}

const formSchema = z.object({
  idGudangAsal: z.preprocess(toNum, z.number({ required_error: 'Pilih gudang' }).positive('Pilih gudang')),
  idMitra: z.preprocess(toNum, z.number({ required_error: 'Pilih mitra' }).positive('Pilih mitra')),
  tanggalPenyaluran: z.string().min(1, 'Pilih tanggal'),
  items: z.array(z.object({
    idProduk: z.preprocess(toNum, z.number().positive()),
    jumlahDikirim: z.preprocess(toNum, z.number().int().positive('Jumlah harus > 0')),
    snapshotHargaRetail: z.preprocess(toNum, z.number().positive('Harga harus > 0')),
    snapshotHargaGrosir: z.preprocess(toNum, z.number().positive('Harga harus > 0')),
  })).min(1, 'Minimal 1 item'),
})

interface ItemForm {
  idProduk: number | undefined
  jumlahDikirim: number | undefined
  snapshotHargaRetail: number | undefined
  snapshotHargaGrosir: number | undefined
}

interface FormData {
  idGudangAsal: number | undefined
  idMitra: number | undefined
  tanggalPenyaluran: string
  items: ItemForm[]
}

const defaultItem = (): ItemForm => ({
  idProduk: undefined,
  jumlahDikirim: undefined,
  snapshotHargaRetail: undefined,
  snapshotHargaGrosir: undefined,
})

const formState = ref<FormData>({
  idGudangAsal: undefined,
  idMitra: undefined,
  tanggalPenyaluran: new Date().toISOString().split('T')[0],
  items: [],
})

const gudangOptions = computed(() =>
  gudangList.value.map((g: any) => ({ label: g.nama, value: g.id })),
)

const mitraOptions = computed(() =>
  mitraList.value.filter((m: any) => m.apakahAktif).map((m: any) =>
    ({ label: `${m.nama} - ${m.namaPemilik}`, value: m.id })),
)

const produkOptions = computed(() => {
  const idsInGudang = new Set(stokList.value.map(s => s.idProduk))
  return produkList.value
    .filter((p: any) => p.apakahAktif && idsInGudang.has(p.id))
    .map((p: any) => ({
      label: `${p.nama} (${p.sku})`,
      value: p.id,
    }))
})

const stokByProduk = computed(() => {
  const map: Record<number, number> = {}
  for (const s of stokList.value) {
    map[s.idProduk] = s.jumlah
  }
  return map
})

function stokClass(idProduk: number, jumlahDikirim: number | undefined) {
  const stok = stokByProduk.value[idProduk]
  if (stok === undefined) return 'text-muted-foreground'
  if (stok === 0) return 'text-red-500 font-medium'
  if (jumlahDikirim && jumlahDikirim > stok) return 'text-orange-500 font-medium'
  return 'text-emerald-600 dark:text-emerald-400'
}

function hargaPabrikAcuan(idProduk: number) {
  const stok = stokList.value.find((s: any) => Number(s.idProduk) === Number(idProduk))
  return stok?.hargaPabrikAcuan ? Number(stok.hargaPabrikAcuan).toLocaleString('id-ID') : '—'
}

watch(() => formState.value.idGudangAsal, async (gudangId) => {
  if (!gudangId) { stokList.value = []; return }
  try {
    const res: any = await api(`/api/stok-gudang?idGudang=${gudangId}`)
    stokList.value = res.data || []
  } catch { stokList.value = [] }
})

// Auto-fill harga from produk when product is selected
watch(() => formState.value.items.map(i => i.idProduk), (newIds, oldIds) => {
  formState.value.items.forEach((item, idx) => {
    if (!item.idProduk) return
    if (oldIds && oldIds[idx] === newIds[idx]) return
    const prod = produkList.value.find((p: any) => Number(p.id) === Number(item.idProduk))
    if (!prod) return
    item.snapshotHargaRetail = Number(prod.hargaRetail)
    item.snapshotHargaGrosir = Number(prod.hargaGrosir)
  })
}, { deep: true })

function addItem() {
  formState.value.items.push(defaultItem())
}

function removeItem(idx: number) {
  formState.value.items.splice(idx, 1)
}

async function loadReferences() {
  try {
    const [gudangRes, mitraRes, produkRes] = await Promise.all([
      api('/api/master/gudang'),
      api('/api/master/mitra'),
      api('/api/master/produk'),
    ])
    gudangList.value = (gudangRes as any).data || []
    mitraList.value = (mitraRes as any).data || []
    produkList.value = (produkRes as any).data || []
  } catch (err: any) {
    console.error(err)
  }
}

async function savePenyaluran() {
  isSaving.value = true
  try {
    const body = {
      idGudangAsal: Number(formState.value.idGudangAsal),
      idMitra: Number(formState.value.idMitra),
      tanggalPenyaluran: formState.value.tanggalPenyaluran,
      items: formState.value.items.map((item) => ({
        idProduk: Number(item.idProduk),
        jumlahDikirim: Number(item.jumlahDikirim),
        snapshotHargaRetail: Number(item.snapshotHargaRetail),
        snapshotHargaGrosir: Number(item.snapshotHargaGrosir),
      })),
    }

    const res: any = await api('/api/penyaluran', {
      method: 'POST',
      body,
    })

    toast.add({ title: 'Berhasil', description: res.message, color: 'green' })
    router.push(`/penyaluran/${res.data.id}`)
  } catch (err: any) {
    toast.add({ title: 'Gagal', description: err.data?.statusMessage || err.message, color: 'red' })
  } finally {
    isSaving.value = false
  }
}

onMounted(() => loadReferences())
</script>
