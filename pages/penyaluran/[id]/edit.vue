<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" to="/penyaluran" />
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Edit Penyaluran</h1>
        <p class="text-sm text-muted-foreground mt-0.5">{{ editData?.nomorPenyaluran }}</p>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-muted-foreground" />
    </div>

    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UCard class="lg:col-span-3">
          <UForm :state="formState" :schema="formSchema" @submit="saveEdit" class="space-y-4">
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
                    <th class="text-left px-3 py-2 font-medium text-muted-foreground">Harga Jual (/unit)</th>
                    <th class="text-left px-3 py-2 font-medium text-muted-foreground">Harga Tebus (/unit)</th>
                    <th class="text-left px-3 py-2 font-medium text-muted-foreground">Subtotal</th>
                    <th class="w-10 px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in formState.items" :key="idx" class="border-b border-zinc-100 dark:border-zinc-800/50">
                    <td class="px-3 py-2">
                      <USelect v-model="item.idProduk" :options="produkOptions" placeholder="Pilih produk" />
                    </td>
                    <td class="px-3 py-2">
                      <UInput v-model="item.jumlahDikirim" type="number" min="1" />
                    </td>
                    <td class="px-3 py-2">
                      <UInput v-model="item.snapshotHargaJual" type="number" min="0" step="500" />
                    </td>
                    <td class="px-3 py-2">
                      <UInput v-model="item.snapshotHargaTebus" type="number" min="0" step="500" />
                    </td>
                    <td class="px-3 py-2 font-mono text-sm">
                      <template v-if="item.jumlahDikirim && item.snapshotHargaJual">
                        Rp {{ (Number(item.jumlahDikirim) * Number(item.snapshotHargaJual)).toLocaleString('id-ID') }}
                      </template>
                      <span v-else class="text-muted-foreground">-</span>
                    </td>
                    <td class="px-3 py-2">
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: 'default' })

const api = useApi()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const isSaving = ref(false)
const isLoading = ref(true)
const editData = ref<any>(null)
const gudangList = ref<any[]>([])
const mitraList = ref<any[]>([])
const produkList = ref<any[]>([])

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
    snapshotHargaJual: z.preprocess(toNum, z.number().positive('Harga harus > 0')),
    snapshotHargaTebus: z.preprocess(toNum, z.number().positive('Harga harus > 0')),
  })).min(1, 'Minimal 1 item'),
})

interface ItemForm {
  idProduk: number | undefined
  jumlahDikirim: number | undefined
  snapshotHargaJual: number | undefined
  snapshotHargaTebus: number | undefined
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
  snapshotHargaJual: undefined,
  snapshotHargaTebus: undefined,
})

const formState = ref<FormData>({
  idGudangAsal: undefined,
  idMitra: undefined,
  tanggalPenyaluran: '',
  items: [],
})

const gudangOptions = computed(() =>
  gudangList.value.map((g: any) => ({ label: g.nama, value: g.id })),
)

const mitraOptions = computed(() =>
  mitraList.value.filter((m: any) => m.apakahAktif).map((m: any) =>
    ({ label: `${m.nama} - ${m.namaPemilik}`, value: m.id })),
)

const produkOptions = computed(() =>
  produkList.value
    .filter((p: any) => p.apakahAktif)
    .map((p: any) => ({
      label: `${p.nama} (${p.sku})`,
      value: p.id,
    })),
)

function addItem() {
  formState.value.items.push(defaultItem())
}

function removeItem(idx: number) {
  formState.value.items.splice(idx, 1)
}

async function loadData() {
  isLoading.value = true
  try {
    const [detailRes, gudangRes, mitraRes, produkRes] = await Promise.all([
      api(`/api/penyaluran/${route.params.id}`),
      api('/api/master/gudang'),
      api('/api/master/mitra'),
      api('/api/master/produk'),
    ])
    gudangList.value = (gudangRes as any).data || []
    mitraList.value = (mitraRes as any).data || []
    produkList.value = (produkRes as any).data || []

    editData.value = (detailRes as any).data
    const d = editData.value
    formState.value = {
      idGudangAsal: d.idGudangAsal,
      idMitra: d.idMitra,
      tanggalPenyaluran: d.tanggalPenyaluran,
      items: d.items.map((item: any) => ({
        idProduk: item.idProduk,
        jumlahDikirim: Number(item.jumlahDikirim),
        snapshotHargaJual: Number(item.snapshotHargaJual),
        snapshotHargaTebus: Number(item.snapshotHargaTebus),
      })),
    }
  } catch (err: any) {
    toast.add({ title: 'Gagal', description: err.data?.statusMessage || err.message, color: 'red' })
    router.push('/penyaluran')
  } finally {
    isLoading.value = false
  }
}

async function saveEdit() {
  isSaving.value = true
  try {
    const body = {
      idGudangAsal: Number(formState.value.idGudangAsal),
      idMitra: Number(formState.value.idMitra),
      tanggalPenyaluran: formState.value.tanggalPenyaluran,
      items: formState.value.items.map((item) => ({
        idProduk: Number(item.idProduk),
        jumlahDikirim: Number(item.jumlahDikirim),
        snapshotHargaJual: Number(item.snapshotHargaJual),
        snapshotHargaTebus: Number(item.snapshotHargaTebus),
      })),
    }

    const res: any = await api(`/api/penyaluran/${route.params.id}`, {
      method: 'PUT',
      body,
    })

    toast.add({ title: 'Berhasil', description: res.message, color: 'green' })
    router.push(`/penyaluran/${route.params.id}`)
  } catch (err: any) {
    toast.add({ title: 'Gagal', description: err.data?.statusMessage || err.message, color: 'red' })
  } finally {
    isSaving.value = false
  }
}

onMounted(() => loadData())
</script>
