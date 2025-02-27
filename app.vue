<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const pageStateStore = usePageStateStore()
onBeforeMount(() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    pageStateStore.getTheme()
  }
})
</script>