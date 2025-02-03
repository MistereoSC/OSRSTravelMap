<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const store = usePageStateStore()
onBeforeMount(() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    store.getTheme()
  }
})
</script>