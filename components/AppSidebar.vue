<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out',
      open ? 'w-64 translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0',
    ]"
  >
    <!-- Header / Logo -->
    <div class="h-14 flex items-center gap-2.5 px-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
      <NuxtLink to="/" class="flex items-center gap-2.5 min-w-0">
        <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
          S
        </div>
        <span v-if="open" class="text-base font-semibold text-foreground truncate">SIKONS</span>
      </NuxtLink>
      <button
        v-if="open"
        class="ml-auto lg:hidden p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        @click="$emit('close')"
      >
        <Icon name="i-heroicons-x-mark-20-solid" class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-2 space-y-2">
      <template v-for="group in navGroups" :key="group.label">
        <p v-if="open && group.items.length" class="px-3 pt-1 pb-0.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          {{ group.label }}
        </p>
        <NuxtLink
          v-for="item in group.items"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
            'hover:bg-zinc-100 dark:hover:bg-zinc-800',
            isActive(item.path)
              ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
              : 'text-zinc-600 dark:text-zinc-400',
            !open && 'justify-center px-0',
          ]"
        >
          <Icon :name="item.icon" class="w-5 h-5 shrink-0" />
          <span v-if="open" class="truncate">{{ item.name }}</span>
        </NuxtLink>
      </template>
    </nav>

    <!-- User Footer -->
    <div class="border-t border-zinc-200 dark:border-zinc-800 shrink-0">
      <UDropdown :items="userMenuItems" :popper="{ placement: 'top' }" class="w-full">
        <UButton
          color="gray"
          variant="ghost"
          block
          :square="!open"
          class="h-14"
          :class="open ? 'flex items-center gap-3 px-3' : 'flex justify-center'"
        >
          <div class="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
            {{ userInitial }}
          </div>
          <div v-if="open" class="flex-1 min-w-0 text-left">
            <p class="text-sm font-medium text-foreground truncate leading-tight">{{ userName }}</p>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 truncate capitalize leading-tight">{{ userRole }}</p>
          </div>
          <Icon v-if="open" name="i-heroicons-chevron-up-20-solid" class="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0 ml-auto" />
        </UButton>
      </UDropdown>
    </div>
  </aside>

  <!-- Mobile Overlay -->
  <div
    v-if="open"
    class="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-40 lg:hidden"
    @click="$emit('close')"
  ></div>
</template>

<script setup lang="ts">
defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()

const route = useRoute()
const { user, logout } = useAuth()

const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

const navGroups = computed(() => {
  const role = user.value?.peran

  const groups = [
    {
      label: 'Umum',
      items: [
        { name: 'Dashboard', path: '/', icon: 'i-heroicons-home' },
      ],
    },
    {
      label: 'Data Master',
      items: [
        { name: 'Pemasok', path: '/master/pemasok', icon: 'i-heroicons-building-library' },
        { name: 'Produk', path: '/master/produk', icon: 'i-heroicons-cube' },
        { name: 'Mitra', path: '/master/mitra', icon: 'i-heroicons-building-storefront' },
        { name: 'Gudang', path: '/master/gudang', icon: 'i-heroicons-building-office-2' },
        { name: 'Pengguna', path: '/master/pengguna', icon: 'i-heroicons-users' },
        { name: 'Stok Gudang', path: '/stok-gudang', icon: 'i-heroicons-cube' },
      ],
    },
    {
      label: 'Transaksi',
      items: [
        { name: 'Penerimaan', path: '/penerimaan-barang', icon: 'i-heroicons-document-arrow-down' },
        { name: 'Penyaluran', path: '/penyaluran', icon: 'i-heroicons-truck' },
        { name: 'Faktur', path: '/faktur', icon: 'i-heroicons-document-text' },
        { name: 'Opname', path: '/opname-stok', icon: 'i-heroicons-clipboard-document-check' },
        { name: 'Rekonsiliasi Penyalur', path: '/rekonsiliasi-penyalur', icon: 'i-heroicons-receipt-percent' },
        // { name: 'Restok', path: '/permintaan-stok', icon: 'i-heroicons-shopping-cart' },
      ],
    },
  ]

  // Role-based filtering
  if (role === 'mitra') {
    return [
      { label: 'Umum', items: [{ name: 'Dashboard', path: '/', icon: 'i-heroicons-home' }] },
      { label: 'Transaksi', items: [
        { name: 'Penyaluran', path: '/penyaluran', icon: 'i-heroicons-truck' },
        { name: 'Opname', path: '/opname-stok', icon: 'i-heroicons-clipboard-document-check' },
        // { name: 'Restok', path: '/permintaan-stok', icon: 'i-heroicons-shopping-cart' },
        { name: 'Rekonsiliasi Mitra', path: '/rekonsiliasi-mitra', icon: 'i-heroicons-receipt-percent' },
      ]},
    ]
  }

  if (role === 'pemasok') {
    return [
      { label: 'Umum', items: [{ name: 'Dashboard', path: '/', icon: 'i-heroicons-home' }] },
      { label: 'Data Master', items: [
        { name: 'Produk', path: '/master/produk', icon: 'i-heroicons-cube' },
      ]},
      { label: 'Transaksi', items: [
        { name: 'Penerimaan', path: '/penerimaan-barang', icon: 'i-heroicons-document-arrow-down' },
        { name: 'Penyaluran', path: '/penyaluran', icon: 'i-heroicons-truck' },
      ]},
    ]
  }

  if (role === 'sales') {
    return [
      { label: 'Umum', items: [{ name: 'Dashboard', path: '/', icon: 'i-heroicons-home' }] },
      { label: 'Data Master', items: [
        { name: 'Mitra', path: '/master/mitra', icon: 'i-heroicons-building-storefront' },
        { name: 'Produk', path: '/master/produk', icon: 'i-heroicons-cube' },
        { name: 'Stok Gudang', path: '/stok-gudang', icon: 'i-heroicons-cube' },
      ]},
      { label: 'Transaksi', items: [
        { name: 'Penyaluran', path: '/penyaluran', icon: 'i-heroicons-truck' },
        { name: 'Opname', path: '/opname-stok', icon: 'i-heroicons-clipboard-document-check' },
        // { name: 'Restok', path: '/permintaan-stok', icon: 'i-heroicons-shopping-cart' },
      ]},
    ]
  }

  // Penyalur (admin) — full access
  return groups
})

const userName = computed(() => user.value?.nama || 'User')
const userRole = computed(() => user.value?.peran || '-')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

const userMenuItems = computed(() => [
  [{
    label: userName.value,
    slot: 'account',
    disabled: true,
  }],
  [{
    label: 'Profile',
    icon: 'i-heroicons-user',
    click: () => navigateTo('/auth/profile'),
  }],
  [{
    label: isDark.value ? 'Light mode' : 'Dark mode',
    icon: isDark.value ? 'i-heroicons-sun' : 'i-heroicons-moon',
    click: () => {
      colorMode.preference = isDark.value ? 'light' : 'dark'
    },
  }],
  [{
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: () => {
      logout()
      navigateTo('/auth/login')
    },
  }],
])

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
