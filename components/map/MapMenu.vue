<script setup lang="ts">
const store = useMapStateStore()
</script>

<template>
  <div class="MapMenu bg-primary-50 h-full z-10 absolute top-0 py-4 px-2 flex flex-col transition-transform duration-300"
       :class="{ 'translate-x-0': store.menuExpanded, '-translate-x-full': !store.menuExpanded }"
       id="map_l_menu"
       :style="{ width: store.MENU_WIDTH + 'px' }"
  >
    <div class="MenuContent flex-grow overflow-y-auto">
      <div class="flex flex-col items-center w-full">
        <img src="/images/logo.png" alt="Logo" class="w-3/4 object-contain pointer-events-none"/>
        <h1 class="font-bold text-xl text-center m-0">OSRS Travel Map</h1>
      </div>
    </div>

    <div class="MenuFooter mt-auto">link to stuff</div>

    <button @click="() => store.toggleMenu()"
            class="absolute top-1 left-[101%] rounded-md bg-primary-50/50 w-8 h-8 hover:bg-primary-50/80">
      <span v-if="store.menuExpanded">X</span>
      <span v-else>M</span>
    </button>
  </div>

</template>

<style scoped>

</style>