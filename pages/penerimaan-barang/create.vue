<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" to="/penerimaan-barang" />
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Tambah Penerimaan Barang</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Isi data penerimaan barang dari pemasok</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Header Form -->
      <UCard class="lg:col-span-3">
        <UForm :state="formState" :schema="formSchema" @submit="savePenerimaan" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UFormGroup label="Pemasok" name="idPemasok" required>
              <USelect v-model="formState.idPemasok" :options="pemasokOptions" placeholder="Pilih pemasok" />
            </UFormGroup>
            <UFormGroup label="Gudang Tujuan" name="idGudang" required>
              <USelect v-model="formState.idGudang" :options="gudangOptions" placeholder="Pilih gudang" />
            </UFormGroup>
            <UFormGroup label="Tanggal Penerimaan" name="tanggalPenerimaan" required>
              <UInput v-model="formState.tanggalPenerimaan" type="date" />
            </UFormGroup>
          </div>

          <!-- Items Section -->
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
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Jumlah</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Harga Pabrik</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Subtotal</th>
                  <th class="w-10 px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in formState.items" :key="idx" class="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td class="px-3 py-2 align-top">
                    <USelect v-model="item.idProduk" :options="produkOptions" placeholder="Pilih produk" />
                  </td>
                  <td class="px-3 py-2 align-top">
                    <UInput v-model="item.jumlah" type="number" min="1" />
                  </td>
                  <td class="px-3 py-2 align-top">
                    <UInput v-model="item.hargaPabrikAktual" type="number" min="0" step="0.01" />
                  </td>
                  <td class="px-3 py-2 align-top font-mono text-sm">
                    <template v-if="item.jumlah && item.hargaPabrikAktual">
                      Rp {{ (Number(item.jumlah) * Number(item.hargaPabrikAktual)).toLocaleString('id-ID') }}
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
            <UButton color="gray" variant="soft" to="/penerimaan-barang">Batal</UButton>
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
const pemasokList = ref<any[]>([])
const gudangList = ref<any[]>([])
const produkList = ref<any[]>([])

function toNum(val: unknown) {
  if (val === null || val === '' || val === undefined) return undefined
  return Number(val)
}

const formSchema = z.object({
  idPemasok: z.preprocess(toNum, z.number({ required_error: 'Pilih pemasok' }).positive('Pilih pemasok')),
  idGudang: z.preprocess(toNum, z.number({ required_error: 'Pilih gudang' }).positive('Pilih gudang')),
  tanggalPenerimaan: z.string().min(1, 'Pilih tanggal'),
  items: z.array(z.object({
    idProduk: z.preprocess(toNum, z.number().positive()),
    jumlah: z.preprocess(toNum, z.number().int().positive('Jumlah harus > 0')),
    hargaPabrikAktual: z.preprocess(toNum, z.number().positive('Harga harus > 0')),
  })).min(1, 'Minimal 1 item'),
})

interface ItemForm {
  idProduk: number | null
  jumlah: number | null
  hargaPabrikAktual: number | null
}

interface FormData {
  idPemasok: number | null
  idGudang: number | null
  tanggalPenerimaan: string
  items: ItemForm[]
}

const defaultItem = (): ItemForm => ({
  idProduk: null,
  jumlah: null,
  hargaPabrikAktual: null,
})

const formState = ref<FormData>({
  idPemasok: null,
  idGudang: null,
  tanggalPenerimaan: new Date().toISOString().split('T')[0],
  items: [],
})

const pemasokOptions = computed(() =>
  pemasokList.value.map((p: any) => ({ label: p.nama, value: p.id })),
)

const gudangOptions = computed(() =>
  gudangList.value.map((g: any) => ({ label: g.nama, value: g.id })),
)

const produkOptions = computed(() => {
  const selectedPemasok = Number(formState.value.idPemasok)
  if (!selectedPemasok) return []
  return produkList.value
    .filter((p: any) => p.apakahAktif && Number(p.idPemasok) === selectedPemasok)
    .map((p: any) => ({ label: `${p.nama} (${p.sku})`, value: p.id }))
})

function addItem() {
  formState.value.items.push(defaultItem())
}

function removeItem(idx: number) {
  formState.value.items.splice(idx, 1)
}

async function loadReferences() {
  try {
    const [pemasokRes, gudangRes, produkRes] = await Promise.all([
      api('/api/master/pemasok'),
      api('/api/master/gudang'),
      api('/api/master/produk'),
    ])
    pemasokList.value = (pemasokRes as any).data || []
    gudangList.value = (gudangRes as any).data || []
    produkList.value = (produkRes as any).data || []
  } catch (err: any) {
    console.error(err)
  }
}

async function savePenerimaan() {
  isSaving.value = true
  try {
    const body = {
      idPemasok: Number(formState.value.idPemasok),
      idGudang: Number(formState.value.idGudang),
      tanggalPenerimaan: formState.value.tanggalPenerimaan,
      items: formState.value.items.map((item) => ({
        idProduk: Number(item.idProduk),
        jumlah: Number(item.jumlah),
        hargaPabrikAktual: Number(item.hargaPabrikAktual),
      })),
    }

    const res: any = await api('/api/penerimaan-barang', {
      method: 'POST',
      body,
    })

    toast.add({ title: 'Berhasil', description: res.message, color: 'green' })
    router.push(`/penerimaan-barang/${res.data.id}`)
  } catch (err: any) {
    toast.add({ title: 'Gagal', description: err.data?.statusMessage || err.message, color: 'red' })
  } finally {
    isSaving.value = false
  }
}

watch(
  () => formState.value.items.map(i => i.idProduk),
  (newIds, oldIds) => {
    formState.value.items.forEach((item, idx) => {
      if (item.idProduk && oldIds && oldIds[idx] !== newIds[idx]) {
        const produk = produkList.value.find((p: any) => Number(p.id) === Number(item.idProduk))
        if (produk) {
          item.hargaPabrikAktual = Number(produk.hargaPabrik)
        }
      }
    })
  },
  { deep: true },
)

onMounted(() => loadReferences())
</script>
