<template>
  <div class="min-h-screen bg-background text-foreground antialiased">
    <AppSidebar
      :open="isSidebarOpen"
      @close="isSidebarOpen = false"
    />

    <div
      :class="[
        'min-h-screen flex flex-col transition-all duration-300 ease-in-out',
        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16',
      ]"
    >
      <AppTopbar @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const isSidebarOpen = ref(false)

onMounted(() => {
  if (window.innerWidth >= 1024) {
    isSidebarOpen.value = true
  }
})
</script>
