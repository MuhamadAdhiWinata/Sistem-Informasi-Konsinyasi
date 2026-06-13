<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" to="/permintaan-stok" />
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Buat Permintaan Restok</h1>
        <p class="text-sm text-muted-foreground mt-0.5">Ajukan permintaan tambahan stok untuk mitra</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <UCard class="lg:col-span-3">
        <UForm :state="formState" :schema="formSchema" @submit="saveRequest" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="Mitra" name="idMitra" required>
              <USelect v-model="formState.idMitra" :options="mitraOptions" placeholder="Pilih mitra" />
            </UFormGroup>
          </div>

          <div class="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-zinc-900 dark:text-white">Item Diminta</h3>
              <UButton icon="i-heroicons-plus-circle" size="2xs" color="gray" variant="soft" @click="addItem">
                Tambah Item
              </UButton>
            </div>

            <table v-if="formState.items.length" class="w-full text-sm">
              <thead>
                <tr class="border-b border-zinc-200 dark:border-zinc-800">
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Produk</th>
                  <th class="text-left px-3 py-2 font-medium text-muted-foreground">Jumlah Diminta</th>
                  <th class="w-10 px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in formState.items" :key="idx" class="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td class="px-3 py-2">
                    <USelect v-model="item.idProduk" :options="produkOptions" placeholder="Pilih produk" />
                  </td>
                  <td class="px-3 py-2">
                    <UInput v-model="item.jumlahDiminta" type="number" min="1" />
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
            <UButton color="gray" variant="soft" to="/permintaan-stok">Batal</UButton>
            <UButton type="submit" :loading="isSaving" :disabled="!formState.items.length">Kirim</UButton>
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
  items: z.array(z.object({
    idProduk: z.preprocess(toNum, z.number().positive()),
    jumlahDiminta: z.preprocess(toNum, z.number().int().positive('Jumlah harus > 0')),
  })).min(1, 'Minimal 1 item'),
})

interface ItemForm {
  idProduk: number | undefined
  jumlahDiminta: number | undefined
}

interface FormData {
  idMitra: number | undefined
  items: ItemForm[]
}

const defaultItem = (): ItemForm => ({
  idProduk: undefined,
  jumlahDiminta: undefined,
})

const formState = ref<FormData>({
  idMitra: undefined,
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
  } catch (err: any) { console.error(err) }
}

async function saveRequest() {
  isSaving.value = true
  try {
    const body = {
      idMitra: Number(formState.value.idMitra),
      items: formState.value.items.map((item) => ({
        idProduk: Number(item.idProduk),
        jumlahDiminta: Number(item.jumlahDiminta),
      })),
    }
    const res: any = await api('/api/permintaan-stok', { method: 'POST', body })
    toast.add({ title: 'Berhasil', description: res.message, color: 'green' })
    router.push(`/permintaan-stok/${res.data.id}`)
  } catch (err: any) {
    toast.add({ title: 'Gagal', description: err.data?.statusMessage || err.message, color: 'red' })
  } finally {
    isSaving.value = false
  }
}

onMounted(() => loadReferences())
</script>
