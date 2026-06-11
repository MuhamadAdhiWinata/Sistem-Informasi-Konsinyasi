<template>
  <div>
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Halo, {{ auth.user.value?.nama || 'User' }}!
      </h1>
      <p class="text-sm text-muted-foreground mt-1">
        Selamat datang di SIKONS — Sistem Informasi Konsinyasi Terintegrasi
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <UCard v-for="stat in stats" :key="stat.label" class="relative overflow-hidden">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">{{ stat.label }}</p>
            <p class="text-2xl font-bold mt-1">{{ stat.value }}</p>
            <p class="text-xs text-muted-foreground mt-1">{{ stat.desc }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl flex items-center justify-center"
            :class="stat.bgClass">
            <component :is="stat.icon" class="w-6 h-6" :class="stat.iconClass" />
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 rounded-full">
          <div class="h-full w-full rounded-full opacity-20"
            :class="stat.barClass"></div>
        </div>
      </UCard>
    </div>

    <!-- Master Data Quick Links -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Master Data</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <NuxtLink v-for="link in masterDataLinks" :key="link.label" :to="link.to"
          class="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-md hover:border-primary/30 transition-all duration-200">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center"
            :class="link.bgClass">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  Building2, Package, Store, Warehouse, Users,
} from 'lucide-vue-next';

definePageMeta({ layout: 'default' });

const auth = useAuth();
const api = useApi();

type StatItem = {
  label: string; value: string; desc: string; icon: any; color: string;
  bgClass: string; iconClass: string; barClass: string;
};
type LinkItem = {
  to: string; label: string; icon: any; color: string; count: string;
  bgClass: string; iconClass: string;
};

const stats = ref<StatItem[]>([]);
const masterDataLinks = ref<LinkItem[]>([]);

function buildStat(label: string, value: string, desc: string, icon: any, color: string): StatItem {
  const bgMap: Record<string, string> = { blue: 'bg-blue-50 dark:bg-blue-900/20', emerald: 'bg-emerald-50 dark:bg-emerald-900/20', orange: 'bg-orange-50 dark:bg-orange-900/20', purple: 'bg-purple-50 dark:bg-purple-900/20', pink: 'bg-pink-50 dark:bg-pink-900/20' };
  const iconMap: Record<string, string> = { blue: 'text-blue-600 dark:text-blue-400', emerald: 'text-emerald-600 dark:text-emerald-400', orange: 'text-orange-600 dark:text-orange-400', purple: 'text-purple-600 dark:text-purple-400', pink: 'text-pink-600 dark:text-pink-400' };
  const barMap: Record<string, string> = { blue: 'bg-blue-500', emerald: 'bg-emerald-500', orange: 'bg-orange-500', purple: 'bg-purple-500', pink: 'bg-pink-500' };
  return { label, value, desc, icon, color, bgClass: bgMap[color] || '', iconClass: iconMap[color] || '', barClass: barMap[color] || '' };
}

function buildLink(to: string, label: string, icon: any, color: string, count: string): LinkItem {
  const bgMap: Record<string, string> = { blue: 'bg-blue-50 dark:bg-blue-900/20', emerald: 'bg-emerald-50 dark:bg-emerald-900/20', orange: 'bg-orange-50 dark:bg-orange-900/20', purple: 'bg-purple-50 dark:bg-purple-900/20', pink: 'bg-pink-50 dark:bg-pink-900/20' };
  const iconMap: Record<string, string> = { blue: 'text-blue-600 dark:text-blue-400', emerald: 'text-emerald-600 dark:text-emerald-400', orange: 'text-orange-600 dark:text-orange-400', purple: 'text-purple-600 dark:text-purple-400', pink: 'text-pink-600 dark:text-pink-400' };
  return { to, label, icon, color, count, bgClass: bgMap[color] || '', iconClass: iconMap[color] || '' };
}

async function fetchStats() {
  try {
    const responses = await Promise.all([
      api('/api/master/pemasok'),
      api('/api/master/produk'),
      api('/api/master/mitra'),
      api('/api/master/gudang'),
      api('/api/master/pengguna'),
    ]);
    const [pemasok, produk, mitra, gudang, pengguna] = responses.map(r => String((r as { data?: unknown[] }).data?.length || 0));

    stats.value = [
      buildStat('Total Pemasok', pemasok, 'Supplier aktif', Building2, 'blue'),
      buildStat('Total Produk', produk, 'SKU terdaftar', Package, 'emerald'),
      buildStat('Total Mitra', mitra, 'Toko partner', Store, 'orange'),
      buildStat('Total Gudang', gudang, 'Lokasi penyimpanan', Warehouse, 'purple'),
    ];

    masterDataLinks.value = [
      buildLink('/master/pemasok', 'Pemasok', Building2, 'blue', pemasok),
      buildLink('/master/produk', 'Produk', Package, 'emerald', produk),
      buildLink('/master/mitra', 'Mitra', Store, 'orange', mitra),
      buildLink('/master/gudang', 'Gudang', Warehouse, 'purple', gudang),
      buildLink('/master/pengguna', 'Pengguna', Users, 'pink', pengguna),
    ];
  } catch (err) {
    console.error('Failed to fetch stats', err);
  }
}

onMounted(() => fetchStats());
</script>
