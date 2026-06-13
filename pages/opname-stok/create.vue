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
              <USelect v-model="formState.idMitra" :options="mitraOptions" placeholder="Pilih mitra" />
            </UFormGroup>
            <UFormGroup label="Tanggal Kunjungan" name="tanggalKunjungan" required>
              <UInput v-model="formState.tanggalKunjungan" type="date" />
            </UFormGroup>
          </div>

          <div class="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-zinc-900 dark:text-white">Item Opname</h3>
              <UButton icon="i-heroicons-plus-circle" size="2xs" color="gray" variant="soft" @click="addItem">
                Tambah Item
              </UButton>
            </div>

            <table v-if="formState.items.length" class="w-full text-sm">
              <thead>
                <tr class="border-b border-zinc-200 dark:border-zinc-800">
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Produk</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Stok Awal</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Laku</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Retur</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Stok Fisik</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Kondisi Retur</th>
                  <th class="w-10 px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in formState.items" :key="idx"
                  :class="['border-b border-zinc-100 dark:border-zinc-800/50', item._stokFisik < 0 ? 'bg-red-50 dark:bg-red-900/10' : '']">
                  <td class="px-3 py-2">
                    <USelect v-model="item.idProduk" :options="produkOptions" placeholder="Pilih produk" />
                  </td>
                  <td class="px-3 py-2">
                    <UInput v-model="item.stokAwal" type="number" min="0" @update:model-value="recalc(idx)" />
                  </td>
                  <td class="px-3 py-2">
                    <UInput v-model="item.jumlahLaku" type="number" min="0" @update:model-value="recalc(idx)" />
                  </td>
                  <td class="px-3 py-2">
                    <UInput v-model="item.jumlahRetur" type="number" min="0" @update:model-value="recalc(idx)" />
                  </td>
                  <td class="px-3 py-2">
                    <span :class="['font-mono font-medium', item._stokFisik < 0 ? 'text-red-600 dark:text-red-400' : 'text-zinc-900 dark:text-white']">
                      {{ item._stokFisik }}
                    </span>
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
              Belum ada item. Klik "Tambah Item" untuk menambahkan produk.
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
    kondisiRetur: z.string().optional(),
  })).min(1, 'Minimal 1 item'),
})

interface ItemForm {
  idProduk: number | undefined
  stokAwal: number | undefined
  jumlahLaku: number | undefined
  jumlahRetur: number | undefined
  kondisiRetur: string | undefined
  _stokFisik: number
}

interface FormData {
  idMitra: number | undefined
  tanggalKunjungan: string
  items: ItemForm[]
}

const defaultItem = (): ItemForm => ({
  idProduk: undefined,
  stokAwal: undefined,
  jumlahLaku: undefined,
  jumlahRetur: undefined,
  kondisiRetur: undefined,
  _stokFisik: 0,
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
  item._stokFisik = awal - laku - retur
}

function addItem() {
  formState.value.items.push(defaultItem())
}

function removeItem(idx: number) {
  formState.value.items.splice(idx, 1)
}

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
