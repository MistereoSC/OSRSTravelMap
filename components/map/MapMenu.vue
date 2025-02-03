<script setup lang="ts">
const store = useMapStateStore()
onMounted(()=>{
  store.setupMenu()
})

</script>
<template>
  <div class="bg-primary-50 h-full w-20 absolute left-0 top-0" :hidden="!store.menuExpanded" id="map_l_menu">
    MENU
    <button @click="() => store.toggleMenu(false)">X</button>
  </div>
  <div class="absolute left-1 top-1" :hidden="store.menuExpanded">
    <button class="rounded-md bg-primary-50/50 w-8 h-8 hover:bg-primary-50/80" @click="() => store.toggleMenu(true)">M</button>
  </div>
</template>
<style scoped></style>