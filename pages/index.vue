<template>
  <div>
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Halo, {{ auth.user.value?.nama || 'User' }}!
      </h1>
      <p class="text-sm text-muted-foreground mt-1">
        Selamat datang di SITJ — Sistem Informasi Titip Jual
      </p>
    </div>

    <!-- Stats Row 1 -->
    <template v-if="isLoading">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <UCard v-for="i in 4" :key="'s1-'+i">
          <div class="flex items-start justify-between">
            <div class="space-y-3">
              <USkeleton class="h-4 w-24" />
              <USkeleton class="h-8 w-16" />
              <USkeleton class="h-3 w-32" />
            </div>
            <USkeleton class="w-12 h-12 rounded-xl shrink-0" />
          </div>
        </UCard>
      </div>
    </template>
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <UCard v-for="stat in statsRow1" :key="stat.label" class="relative overflow-hidden">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">{{ stat.label }}</p>
              <p class="text-2xl font-bold mt-1">{{ stat.value }}</p>
              <p class="text-xs text-muted-foreground mt-1">{{ stat.desc }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="stat.bgClass">
              <component :is="stat.icon" class="w-6 h-6" :class="stat.iconClass" />
            </div>
          </div>
          <div class="absolute bottom-0 left-0 right-0 h-1 rounded-full">
            <div class="h-full w-full rounded-full opacity-20" :class="stat.barClass"></div>
          </div>
        </UCard>
      </div>
    </template>

    <!-- Stats Row 2 -->
    <template v-if="isLoading">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <UCard v-for="i in 4" :key="'s2-'+i">
          <div class="flex items-start justify-between">
            <div class="space-y-3">
              <USkeleton class="h-4 w-24" />
              <USkeleton class="h-8 w-16" />
              <USkeleton class="h-3 w-32" />
            </div>
            <USkeleton class="w-12 h-12 rounded-xl shrink-0" />
          </div>
        </UCard>
      </div>
    </template>
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <UCard v-for="stat in statsRow2" :key="stat.label" class="relative overflow-hidden">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">{{ stat.label }}</p>
              <p class="text-2xl font-bold mt-1">{{ stat.value }}</p>
              <p class="text-xs text-muted-foreground mt-1">{{ stat.desc }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="stat.bgClass">
              <component :is="stat.icon" class="w-6 h-6" :class="stat.iconClass" />
            </div>
          </div>
          <div class="absolute bottom-0 left-0 right-0 h-1 rounded-full">
            <div class="h-full w-full rounded-full opacity-20" :class="stat.barClass"></div>
          </div>
        </UCard>
      </div>
    </template>

    <!-- Quick Links -->
    <template v-if="isLoading">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <USkeleton class="h-6 w-28 mb-4" />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="i in 5" :key="'ml-'+i" class="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <USkeleton class="w-10 h-10 rounded-lg shrink-0" />
              <div class="flex-1 space-y-2">
                <USkeleton class="h-4 w-28" />
                <USkeleton class="h-3 w-16" />
              </div>
              <USkeleton class="w-4 h-4 shrink-0" />
            </div>
          </div>
        </div>
        <div>
          <USkeleton class="h-6 w-28 mb-4" />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="i in 6" :key="'tl-'+i" class="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <USkeleton class="w-10 h-10 rounded-lg shrink-0" />
              <div class="flex-1 space-y-2">
                <USkeleton class="h-4 w-28" />
                <USkeleton class="h-3 w-16" />
              </div>
              <USkeleton class="w-4 h-4 shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 class="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Master Data</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NuxtLink v-for="link in masterDataLinks" :key="link.label" :to="link.to"
              class="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-md hover:border-primary/30 transition-all duration-200">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="link.bgClass">
                <component :is="link.icon" class="w-5 h-5" :class="link.iconClass" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-foreground">{{ link.label }}</p>
                <p class="text-xs text-muted-foreground">{{ link.count }} item</p>
              </div>
              <Icon name="i-heroicons-chevron-right" class="w-4 h-4 text-muted-foreground" />
            </NuxtLink>
          </div>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Transaksi</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NuxtLink v-for="link in transaksiLinks" :key="link.label" :to="link.to"
              class="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-md hover:border-primary/30 transition-all duration-200">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="link.bgClass">
                <component :is="link.icon" class="w-5 h-5" :class="link.iconClass" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-foreground">{{ link.label }}</p>
                <p class="text-xs text-muted-foreground">{{ link.count }}</p>
              </div>
              <Icon name="i-heroicons-chevron-right" class="w-4 h-4 text-muted-foreground" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>

    <!-- Recent Penyaluran -->
    <template v-if="isLoading">
      <UCard class="mb-8" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
        <template #header>
          <div class="flex items-center justify-between px-4 sm:px-6 py-3">
            <USkeleton class="h-5 w-40" />
            <USkeleton class="h-7 w-20 rounded" />
          </div>
        </template>
        <div class="p-4 space-y-4">
          <div v-for="i in 5" :key="'pr-'+i" class="flex items-center gap-4">
            <USkeleton class="h-4 w-28" />
            <USkeleton class="h-4 w-24" />
            <USkeleton class="h-4 w-20" />
            <USkeleton class="h-4 w-16" />
            <USkeleton class="h-4 w-24 ml-auto" />
            <USkeleton class="h-7 w-7 rounded shrink-0" />
          </div>
        </div>
      </UCard>
    </template>
    <template v-else>
      <UCard class="mb-8" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
        <template #header>
          <div class="flex items-center justify-between px-4 sm:px-6 py-3">
            <h3 class="text-sm font-semibold text-zinc-900 dark:text-white">Penyaluran Terbaru</h3>
            <UButton size="2xs" color="gray" variant="ghost" to="/penyaluran">Lihat Semua</UButton>
          </div>
        </template>
        <UTable :rows="recentPenyaluran" :columns="penyaluranColumns"
          :empty-state="{ icon: 'i-heroicons-truck', label: 'Belum ada penyaluran' }" class="w-full">
          <template #tanggalPenyaluran-data="{ row }">
            <span class="text-sm">{{ formatTanggal(row.tanggalPenyaluran) }}</span>
          </template>
          <template #status-data="{ row }">
            <UBadge :color="statusColor(row.status)" variant="soft" size="xs">{{ statusLabel(row.status) }}</UBadge>
          </template>
          <template #totalNilai-data="{ row }">
            <span class="font-mono text-sm">Rp {{ Number(row.totalNilai).toLocaleString('id-ID') }}</span>
          </template>
          <template #actions-data="{ row }">
            <UButton icon="i-heroicons-eye" size="2xs" color="orange" variant="ghost" :to="`/penyaluran/${row.id}`" />
          </template>
        </UTable>
      </UCard>
    </template>

    <!-- Alerts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Low Stock -->
      <template v-if="isLoading">
        <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
          <template #header>
            <div class="flex items-center gap-2 px-4 sm:px-6 py-3">
              <USkeleton class="w-4 h-4 rounded" />
              <USkeleton class="h-5 w-28" />
            </div>
          </template>
          <div class="p-4 space-y-4">
            <div v-for="i in 4" :key="'ls-'+i" class="flex items-center gap-4">
              <USkeleton class="h-4 w-24" />
              <USkeleton class="h-4 w-16" />
              <USkeleton class="h-4 w-20" />
              <USkeleton class="h-4 w-10 ml-auto" />
            </div>
          </div>
        </UCard>
      </template>
      <template v-else>
        <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
          <template #header>
            <div class="flex items-center gap-2 px-4 sm:px-6 py-3">
              <Icon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-amber-500" />
              <h3 class="text-sm font-semibold text-zinc-900 dark:text-white">Stok Menipis</h3>
            </div>
          </template>
          <UTable :rows="lowStockItems" :columns="lowStockColumns"
            :empty-state="{ icon: 'i-heroicons-check-circle', label: 'Semua stok aman' }" class="w-full">
            <template #jumlah-data="{ row }">
              <span :class="['font-mono font-medium', Number(row.jumlah) <= 2 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400']">
                {{ row.jumlah }}
              </span>
            </template>
          </UTable>
        </UCard>
      </template>

      <!-- Opname Anomalies -->
      <template v-if="isLoading">
        <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
          <template #header>
            <div class="flex items-center gap-2 px-4 sm:px-6 py-3">
              <USkeleton class="w-4 h-4 rounded" />
              <USkeleton class="h-5 w-28" />
            </div>
          </template>
          <div class="p-4 space-y-4">
            <div v-for="i in 3" :key="'oa-'+i" class="flex items-center gap-4">
              <USkeleton class="h-4 w-24" />
              <USkeleton class="h-4 w-20" />
              <USkeleton class="h-4 w-20" />
              <USkeleton class="h-4 w-16" />
              <USkeleton class="h-7 w-7 rounded shrink-0 ml-auto" />
            </div>
          </div>
        </UCard>
      </template>
      <template v-else>
        <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
          <template #header>
            <div class="flex items-center gap-2 px-4 sm:px-6 py-3">
              <Icon name="i-heroicons-exclamation-circle" class="w-4 h-4 text-red-500" />
              <h3 class="text-sm font-semibold text-zinc-900 dark:text-white">Anomali Opname</h3>
            </div>
          </template>
          <UTable :rows="opnameAnomalies" :columns="opnameAnomaliColumns"
            :empty-state="{ icon: 'i-heroicons-check-circle', label: 'Tidak ada anomali' }" class="w-full">
            <template #tanggalKunjungan-data="{ row }">
              <span class="text-sm">{{ formatTanggal(row.tanggalKunjungan) }}</span>
            </template>
            <template #status-data="{ row }">
              <UBadge :color="opnameStatusColor(row.status)" variant="soft" size="xs">{{ opnameStatusLabel(row.status) }}</UBadge>
            </template>
            <template #actions-data="{ row }">
              <UButton icon="i-heroicons-eye" size="2xs" color="orange" variant="ghost" :to="`/opname-stok/${row.id}`" />
            </template>
          </UTable>
        </UCard>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Building2, Package, Store, Warehouse, Users,
  ArrowDownToLine, Truck, ClipboardCheck, FileText, AlertTriangle,
} from 'lucide-vue-next';

definePageMeta({ layout: 'default' });

const auth = useAuth();
const api = useApi();

const isLoading = ref(true);

type StatItem = {
  label: string; value: string; desc: string; icon: any;
  bgClass: string; iconClass: string; barClass: string;
};
type LinkItem = {
  to: string; label: string; icon: any; count: string;
  bgClass: string; iconClass: string;
};

const statsRow1 = ref<StatItem[]>([]);
const statsRow2 = ref<StatItem[]>([]);
const masterDataLinks = ref<LinkItem[]>([]);
const transaksiLinks = ref<LinkItem[]>([]);
const recentPenyaluran = ref<any[]>([]);
const lowStockItems = ref<any[]>([]);
const opnameAnomalies = ref<any[]>([]);

function buildStat(label: string, value: string, desc: string, icon: any, color: string): StatItem {
  const bgMap: Record<string, string> = { blue: 'bg-blue-50 dark:bg-blue-900/20', emerald: 'bg-emerald-50 dark:bg-emerald-900/20', orange: 'bg-orange-50 dark:bg-orange-900/20', purple: 'bg-purple-50 dark:bg-purple-900/20', pink: 'bg-pink-50 dark:bg-pink-900/20', cyan: 'bg-cyan-50 dark:bg-cyan-900/20', red: 'bg-red-50 dark:bg-red-900/20', amber: 'bg-amber-50 dark:bg-amber-900/20' };
  const iconMap: Record<string, string> = { blue: 'text-blue-600 dark:text-blue-400', emerald: 'text-emerald-600 dark:text-emerald-400', orange: 'text-orange-600 dark:text-orange-400', purple: 'text-purple-600 dark:text-purple-400', pink: 'text-pink-600 dark:text-pink-400', cyan: 'text-cyan-600 dark:text-cyan-400', red: 'text-red-600 dark:text-red-400', amber: 'text-amber-600 dark:text-amber-400' };
  const barMap: Record<string, string> = { blue: 'bg-blue-500', emerald: 'bg-emerald-500', orange: 'bg-orange-500', purple: 'bg-purple-500', pink: 'bg-pink-500', cyan: 'bg-cyan-500', red: 'bg-red-500', amber: 'bg-amber-500' };
  return { label, value, desc, icon, bgClass: bgMap[color] || '', iconClass: iconMap[color] || '', barClass: barMap[color] || '' };
}

function buildLink(to: string, label: string, icon: any, color: string, count: string): LinkItem {
  const bgMap: Record<string, string> = { blue: 'bg-blue-50 dark:bg-blue-900/20', emerald: 'bg-emerald-50 dark:bg-emerald-900/20', orange: 'bg-orange-50 dark:bg-orange-900/20', purple: 'bg-purple-50 dark:bg-purple-900/20', pink: 'bg-pink-50 dark:bg-pink-900/20', cyan: 'bg-cyan-50 dark:bg-cyan-900/20', red: 'bg-red-50 dark:bg-red-900/20', amber: 'bg-amber-50 dark:bg-amber-900/20' };
  const iconMap: Record<string, string> = { blue: 'text-blue-600 dark:text-blue-400', emerald: 'text-emerald-600 dark:text-emerald-400', orange: 'text-orange-600 dark:text-orange-400', purple: 'text-purple-600 dark:text-purple-400', pink: 'text-pink-600 dark:text-pink-400', cyan: 'text-cyan-600 dark:text-cyan-400', red: 'text-red-600 dark:text-red-400', amber: 'text-amber-600 dark:text-amber-400' };
  return { to, label, icon, count, bgClass: bgMap[color] || '', iconClass: iconMap[color] || '' };
}

const penyaluranColumns = [
  { key: 'nomorPenyaluran', label: 'Nomor' },
  { key: 'mitra', label: 'Mitra' },
  { key: 'tanggalPenyaluran', label: 'Tanggal' },
  { key: 'status', label: 'Status' },
  { key: 'totalNilai', label: 'Total', class: 'text-left' },
  { key: 'actions', label: '', class: 'text-right' },
];

const lowStockColumns = [
  { key: 'produk', label: 'Produk' },
  { key: 'sku', label: 'SKU' },
  { key: 'gudang', label: 'Gudang' },
  { key: 'jumlah', label: 'Stok', class: 'text-right' },
  { key: 'satuan', label: 'Satuan' },
];

const opnameAnomaliColumns = [
  { key: 'nomorOpname', label: 'Nomor' },
  { key: 'mitra', label: 'Mitra' },
  { key: 'tanggalKunjungan', label: 'Tanggal' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '', class: 'text-right' },
];

function statusColor(status: string) {
  const map: Record<string, string> = { draft: 'gray', sent: 'blue', received: 'emerald' }
  return (map[status] || 'gray') as any
}

function statusLabel(status: string) {
  const map: Record<string, string> = { draft: 'Draft', sent: 'Dikirim', received: 'Diterima' }
  return map[status] || status
}

function opnameStatusColor(status: string) {
  const map: Record<string, string> = { draft: 'gray', submitted: 'blue', verified: 'emerald' }
  return (map[status] || 'gray') as any
}

function opnameStatusLabel(status: string) {
  const map: Record<string, string> = { draft: 'Draft', submitted: 'Submitted', verified: 'Terverifikasi' }
  return map[status] || status
}

async function fetchData() {
  isLoading.value = true
  try {
    const role = auth.user.value?.peran
    const toCount = (res: any) => String((res.data as any[])?.length || 0)

    if (role === 'mitra') {
      const [produkRes, mitraRes, penyaluranRes, opnameRes, fakturRes] = await Promise.all([
        api('/api/master/produk'),
        api('/api/master/mitra'),
        api('/api/penyaluran'),
        api('/api/opname-stok'),
        api('/api/faktur'),
      ])

      statsRow1.value = [
        buildStat('Produk', toCount(produkRes), 'Katalog produk', Package, 'emerald'),
        buildStat('Mitra', toCount(mitraRes), 'Mitra Anda', Store, 'orange'),
        buildStat('Penyaluran', toCount(penyaluranRes), 'Barang diterima', Truck, 'amber'),
        buildStat('Opname Stok', toCount(opnameRes), 'Siklus opname', ClipboardCheck, 'red'),
      ]
      statsRow2.value = []
      masterDataLinks.value = [
        buildLink('/master/produk', 'Produk', Package, 'emerald', toCount(produkRes)),
      ]
      transaksiLinks.value = [
        buildLink('/penyaluran', 'Penyaluran', Truck, 'amber', `${toCount(penyaluranRes)} transaksi`),
        buildLink('/faktur', 'Faktur', FileText, 'blue', `${toCount(fakturRes)} dokumen`),
        buildLink('/opname-stok', 'Opname Stok', ClipboardCheck, 'red', `${toCount(opnameRes)} siklus`),
      ]

      recentPenyaluran.value = ((penyaluranRes as any).data || []).slice(0, 5)
      lowStockItems.value = []
      opnameAnomalies.value = ((opnameRes as any).data || []).filter((o: any) => o.memilikiAnomali).slice(0, 10)
      isLoading.value = false
      return
    }

    if (role === 'pemasok') {
      const [pemasokRes, produkRes, penyaluranRes, penerimaanRes, stokRes] = await Promise.all([
        api('/api/master/pemasok'),
        api('/api/master/produk'),
        api('/api/penyaluran'),
        api('/api/penerimaan-barang'),
        api('/api/stok-gudang'),
      ])

      statsRow1.value = [
        buildStat('Pemasok', toCount(pemasokRes), 'Profil Anda', Building2, 'blue'),
        buildStat('Produk', toCount(produkRes), 'Produk milik Anda', Package, 'emerald'),
        buildStat('Penyaluran', toCount(penyaluranRes), 'Mengandung produk Anda', Truck, 'amber'),
        buildStat('Penerimaan', toCount(penerimaanRes), 'Barang Anda masuk', ArrowDownToLine, 'cyan'),
      ]
      statsRow2.value = [
        buildStat('Stok Gudang', toCount(stokRes), 'Item produk Anda', Warehouse, 'purple'),
      ]
      masterDataLinks.value = [
        buildLink('/master/pemasok', 'Pemasok', Building2, 'blue', toCount(pemasokRes)),
        buildLink('/master/produk', 'Produk', Package, 'emerald', toCount(produkRes)),
      ]
      transaksiLinks.value = [
        buildLink('/penerimaan-barang', 'Penerimaan Barang', ArrowDownToLine, 'cyan', `${toCount(penerimaanRes)} transaksi`),
        buildLink('/penyaluran', 'Penyaluran', Truck, 'amber', `${toCount(penyaluranRes)} transaksi`),
      ]

      recentPenyaluran.value = ((penyaluranRes as any).data || []).slice(0, 5)
      lowStockItems.value = ((stokRes as any).data || [])
        .filter((s: any) => Number(s.jumlah) <= 5)
        .slice(0, 10)
      opnameAnomalies.value = []
      isLoading.value = false
      return
    }

    const [pemasokRes, produkRes, mitraRes, gudangRes, penggunaRes, penyaluranRes, penerimaanRes, opnameRes, stokRes] = await Promise.all([
      api('/api/master/pemasok'),
      api('/api/master/produk'),
      api('/api/master/mitra'),
      api('/api/master/gudang'),
      api('/api/master/pengguna'),
      api('/api/penyaluran'),
      api('/api/penerimaan-barang'),
      api('/api/opname-stok'),
      api('/api/stok-gudang'),
    ])

    const pemasok = toCount(pemasokRes)
    const produk = toCount(produkRes)
    const mitra = toCount(mitraRes)
    const gudang = toCount(gudangRes)
    const pengguna = toCount(penggunaRes)
    const penyaluranCount = toCount(penyaluranRes)
    const penerimaanCount = toCount(penerimaanRes)
    const opnameCount = toCount(opnameRes)

    statsRow1.value = [
      buildStat('Total Pemasok', pemasok, 'Supplier aktif', Building2, 'blue'),
      buildStat('Total Produk', produk, 'SKU terdaftar', Package, 'emerald'),
      buildStat('Total Mitra', mitra, 'Toko partner', Store, 'orange'),
      buildStat('Total Gudang', gudang, 'Lokasi penyimpanan', Warehouse, 'purple'),
    ]

    statsRow2.value = [
      buildStat('Total Pengguna', pengguna, 'Akun sistem', Users, 'pink'),
      buildStat('Penerimaan Barang', penerimaanCount, 'Barang masuk', ArrowDownToLine, 'cyan'),
      buildStat('Penyaluran', penyaluranCount, 'Barang keluar', Truck, 'amber'),
      buildStat('Opname Stok', opnameCount, 'Siklus opname', ClipboardCheck, 'red'),
    ]

    masterDataLinks.value = [
      buildLink('/master/pemasok', 'Pemasok', Building2, 'blue', pemasok),
      buildLink('/master/produk', 'Produk', Package, 'emerald', produk),
      buildLink('/master/mitra', 'Mitra', Store, 'orange', mitra),
      buildLink('/master/gudang', 'Gudang', Warehouse, 'purple', gudang),
      buildLink('/master/pengguna', 'Pengguna', Users, 'pink', pengguna),
    ]

    const fakturCount = role === 'sales'
      ? null
      : `${toCount(await api('/api/faktur'))} dokumen`

    transaksiLinks.value = [
      buildLink('/penerimaan-barang', 'Penerimaan Barang', ArrowDownToLine, 'cyan', `${penerimaanCount} transaksi`),
      buildLink('/penyaluran', 'Penyaluran', Truck, 'amber', `${penyaluranCount} transaksi`),
      ...(fakturCount ? [buildLink('/faktur', 'Faktur', FileText, 'blue', fakturCount)] : []),
      buildLink('/opname-stok', 'Opname Stok', ClipboardCheck, 'red', `${opnameCount} siklus`),
      buildLink('/stok-gudang', 'Stok Gudang', Warehouse, 'purple', `${toCount(stokRes)} item`),
      buildLink('/rekonsiliasi-penyalur', 'Rekonsiliasi', FileText, 'orange', 'Laporan'),
    ]

    const penyaluranData = (penyaluranRes as any).data || []
    recentPenyaluran.value = penyaluranData.slice(0, 5)

    const stokData = (stokRes as any).data || []
    lowStockItems.value = stokData
      .filter((s: any) => Number(s.jumlah) <= 5)
      .slice(0, 10)

    const opnameData = (opnameRes as any).data || []
    opnameAnomalies.value = opnameData
      .filter((o: any) => o.memilikiAnomali)
      .slice(0, 10)
  } catch (err) {
    console.error('Failed to fetch dashboard data', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchData())
</script>