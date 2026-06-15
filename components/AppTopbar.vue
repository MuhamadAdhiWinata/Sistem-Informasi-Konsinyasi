<template>
  <header class="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
    <div class="flex items-center gap-3">
      <UButton
        color="gray"
        variant="ghost"
        icon="i-heroicons-bars-3"
        size="sm"
        @click="$emit('toggle-sidebar')"
      />
      <span class="text-sm font-semibold text-foreground">{{ pageTitle }}</span>
    </div>

    <div class="flex items-center gap-1">
      <UTooltip text="Search (Ctrl+K)" :popper="{ placement: 'bottom' }">
        <UButton
color="gray"
          variant="ghost"
          icon="i-heroicons-magnifying-glass-20-solid"
          size="sm"
          class="hidden sm:flex"
        />
      </UTooltip>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits<{ 'toggle-sidebar': [] }>()

const route = useRoute()

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/') return 'Dashboard'
  const segments = path.split('/').filter(Boolean)
  return segments.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ')
})
</script>
