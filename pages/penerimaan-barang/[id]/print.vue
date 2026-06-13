<template>
  <div class="min-h-screen bg-zinc-50 print:bg-white">
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
    </div>

    <template v-else-if="data">
      <div class="no-print max-w-4xl mx-auto mb-6 pt-6 px-4 flex items-center justify-between">
        <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" :to="`/penerimaan-barang/${data.id}`">
          Kembali
        </UButton>
        <div class="flex gap-2">
          <UButton icon="i-heroicons-printer" size="sm" color="gray" @click="printPage">
            Cetak
          </UButton>
          <UButton icon="i-heroicons-arrow-down-tray" size="sm" color="primary" :loading="isDownloading" @click="downloadPdf">
            Download PDF
          </UButton>
        </div>
      </div>

      <div id="print-area" class="max-w-4xl mx-auto bg-white p-8 print:p-6 print:shadow-none shadow-lg" style="font-family: 'Times New Roman', Times, serif;">
        <!-- KOP SURAT -->
        <div class="flex items-start gap-4 mb-3">
          <div class="w-14 h-14 bg-gray-800 rounded flex items-center justify-center text-white text-xl font-bold shrink-0">
            DLN
          </div>
          <div>
            <div style="font-size:14pt; font-weight:bold;">PT DRIVER LOGISTIK NUSANTARA</div>
            <div style="font-size:9pt; color:#444; line-height:1.4;">
              Jl. Industri Raya No. 45, Blok C, Kawasan MM2100, Cikarang, Bekasi<br>
              Telp: (021) 8901234 | Email: warehouse@driverlogistik.co.id | Website: www.driverlogistik.co.id
            </div>
          </div>
        </div>

        <div style="border-top:2px solid #222; margin-bottom: 16px;"></div>

        <!-- JUDUL DOKUMEN -->
        <div style="text-align:center; margin-bottom: 4px;">
          <div style="font-size:14pt; font-weight:bold; text-transform:uppercase;">SURAT PENERIMAAN BARANG</div>
          <div style="font-size:11pt;">Nomor Dokumen: {{ data.nomorPenerimaan }}</div>
        </div>

        <div style="margin: 16px 0;"></div>

        <!-- DATA REFERENSI -->
        <table style="width:100%; font-size:11pt; border-collapse:collapse;">
          <tr>
            <td style="width:50%; vertical-align:top;">
              <div style="font-weight:bold; margin-bottom:4px;">Diterima Dari (Supplier):</div>
              <div>Nama Vendor : {{ data.pemasok }}</div>
            </td>
            <td style="width:50%; vertical-align:top;">
              <div style="font-weight:bold; margin-bottom:4px;">Referensi Dokumen:</div>
              <div>No. Penerimaan : {{ data.nomorPenerimaan }}</div>
              <div>Tanggal Diterima : {{ data.tanggalPenerimaan }}</div>
              <div>Gudang Tujuan    : {{ data.gudang }}</div>
              <div>Diterima Oleh    : {{ data.penerima }}</div>
            </td>
          </tr>
        </table>

        <div style="margin: 16px 0;"></div>

        <!-- TABEL DAFTAR BARANG -->
      <table style="width:100%; border-collapse:collapse; font-size:10pt;">
        <thead>
          <tr style="border-top:2px solid #222; border-bottom:2px solid #222;">
            <th style="text-align:center; padding:6px 4px; font-weight:bold; width:40px;">No</th>
            <th style="text-align:center; padding:6px 4px; font-weight:bold; width:100px;">Kode / SKU</th>
            <th style="text-align:left; padding:6px 4px; font-weight:bold;">Deskripsi Nama Barang</th>
            <th style="text-align:center; padding:6px 4px; font-weight:bold; width:70px;">Qty Diterima</th>
            <th style="text-align:center; padding:6px 4px; font-weight:bold; width:60px;">Satuan</th>
            <th style="text-align:right; padding:6px 4px; font-weight:bold; width:100px;">Harga Pabrik</th>
            <th style="text-align:right; padding:6px 4px; font-weight:bold; width:110px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in data.items" :key="item.id" style="border-bottom:1px solid #999;">
            <td style="text-align:center; padding:5px 4px;">{{ i + 1 }}</td>
            <td style="text-align:center; padding:5px 4px;">{{ item.sku }}</td>
            <td style="text-align:left; padding:5px 4px;">{{ item.produk }}</td>
            <td style="text-align:center; padding:5px 4px;">{{ item.jumlah }}</td>
            <td style="text-align:center; padding:5px 4px;">{{ item.satuan }}</td>
            <td style="text-align:right; padding:5px 4px; font-family:monospace;">Rp {{ Number(item.hargaTebusAktual).toLocaleString('id-ID') }}</td>
            <td style="text-align:right; padding:5px 4px; font-family:monospace;">Rp {{ (Number(item.jumlah) * Number(item.hargaTebusAktual)).toLocaleString('id-ID') }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr style="border-top:2px solid #222;">
            <td colspan="6" style="text-align:right; padding:6px 4px; font-weight:bold; font-size:11pt;">Jumlah Item</td>
            <td style="text-align:right; padding:6px 4px; font-weight:bold; font-size:11pt;">{{ data.items.length }}</td>
          </tr>
        </tfoot>
      </table>

        <div style="margin: 16px 0;"></div>

        <!-- KETERANGAN -->
        <div style="font-size:11pt;">
          <div style="font-weight:bold; margin-bottom:4px;">Catatan Tambahan Penerimaan:</div>
          <div style="font-size:10pt; color:#444;">
            Barang telah diperiksa secara fisik dan dihitung secara manual oleh tim gudang. Seluruh item dinyatakan lolos verifikasi jumlah dan mutu fisik.
          </div>
        </div>

        <div style="margin: 32px 0 24px 0;"></div>

        <!-- AREA TANDA TANGAN -->
        <table style="width:100%; border-collapse:collapse; font-size:11pt;">
          <tr>
            <td style="width:50%; text-align:center; vertical-align:top;">
              <div>Diserahkan Oleh</div>
              <div style="font-weight:bold; margin-top:4px;">(Pihak Pengirim),</div>
              <div style="height:60px;"></div>
              <div style="display:inline-block; padding-top:4px;">
                <b style="text-decoration:underline;">{{ data.pemasok }}</b>
              </div>
            </td>
            <td style="width:50%; text-align:center; vertical-align:top;">
              <div>Diterima & Diverifikasi Oleh</div>
              <div style="font-weight:bold; margin-top:4px;">(Pihak Gudang),</div>
              <div style="height:60px;"></div>
              <div style="display:inline-block; padding-top:4px;">
                <b style="text-decoration:underline;">{{ data.penerima }}</b>
              </div>
            </td>
          </tr>
        </table>

        <div style="margin-top:24px; border-top:1px solid #ccc; padding-top:8px; text-align:center; font-size:8pt; color:#888;">
          Dicetak: {{ new Date().toLocaleString('id-ID') }} &mdash; Dokumen ini sah dan diterbitkan secara elektronik
        </div>
      </div>
    </template>

    <div v-else class="text-center py-20 text-muted-foreground">
      Data tidak ditemukan
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const api = useApi()
const route = useRoute()
const toast = useToast()

const isLoading = ref(true)
const isDownloading = ref(false)
const data = ref<any>(null)

function printPage() {
  window.print()
}

async function downloadPdf() {
  isDownloading.value = true
  try {
    const html2pdf = (await import('html2pdf.js')).default
    const element = document.getElementById('print-area')
    if (!element) return
    html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: `surat-jalan-${data.value?.nomorPenerimaan || 'unknown'}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save()
  } catch (err) {
    console.error(err)
    toast.add({ title: 'Gagal', description: 'Gagal mengunduh PDF', color: 'red' })
  } finally {
    isDownloading.value = false
  }
}

async function fetchData() {
  isLoading.value = true
  try {
    const res: any = await api(`/api/penerimaan-barang/${route.params.id}`)
    data.value = res.data
  } catch (err: any) { console.error(err) }
  finally { isLoading.value = false }
}

onMounted(() => fetchData())
</script>

<style scoped>
@media print {
  .no-print { display: none !important; }
  #print-area { box-shadow: none !important; margin: 0 auto; padding: 1in 0.75in; }
}
</style>
