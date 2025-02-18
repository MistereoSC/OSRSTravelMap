<script setup lang="ts">
import MapMenuGroup from "~/components/map/MapMenuGroup.vue";

const store = useMapStateStore()
const MarkerGroups = ref(store.getMarkerGroups())

function handleMouseEnter(group_id: number) {
  store.highlightGroup(group_id)
}

function handleMouseLeave() {
  store.highlightGroup(null)
}

const checkedGroups = ref([] as number[])
watch(() => store.groupsToggled, (newVal) => {
  checkedGroups.value = newVal
}, {deep: true})

function toggleAll() {
  store.toggleAlLGroups()
}

</script>

<template>
  <div
      class="MapMenu bg-primary-50 h-full z-10 absolute top-0 flex flex-col transition-transform duration-300"
      :class="{ 'translate-x-0': store.menuExpanded, '-translate-x-full': !store.menuExpanded }"
      id="map_l_menu"
      :style="{ width: store.MENU_WIDTH + 'px' }"
  >
    <div class="MenuContent flex-grow overflow-y-auto">
      <div class="flex flex-col items-center w-full">
        <img src="/images/logo.png" alt="Logo" class="w-3/5 object-contain pointer-events-none"/>
        <h1 class="font-bold text-xl text-center m-0 pb-2">OSRS Travel Map</h1>

        <div class="w-full flex justify-evenly">
          <button @click="toggleAll" class="px-2 py-1 bg-primary-100 rounded-md hover:bg-primary-200">Toggle All
          </button>
        </div>

        <div class="w-full pt-2">
          <div class="w-full">
            <MapMenuGroup v-for="group in MarkerGroups" :key="group.group_id" :markerGroup="group"/>
          </div>
          <div class="w-full mt-8">
            <h3 class="pl-4">Settings</h3>
            <div class="MenuItem py-1 flex flex-row items-center gap-2 cursor-pointer hover:bg-primary-100 pl-4"
                 @click.stop.prevent="() => store.toggleGrid()"
            >

              <div class="CustomCheckbox w-4 h-4 rounded-md overflow-hidden cursor-pointer"
                   :class="{ 'checked': store.gridIsDrawn }"></div>
<!--              <div class="MenuItemImage bg-cover w-6 h-6 @contextmenu.prevent"-->
<!--                   :style="{backgroundImage: `url('/icons/grid.webp')`}">-->
<!--              </div>-->
              <span class="font-bold">Toggle Chunk Grid</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="MenuFooter mt-auto bg-primary-100 p-2">link to stuff</div>
    <button @click="() => store.toggleMenu()"
            class="absolute top-1 left-[101%] rounded-md bg-primary-50/50 w-8 h-8 hover:bg-primary-50/80">
      <span v-if="store.menuExpanded">X</span>
      <span v-else>M</span>
    </button>
  </div>

</template>

<style scoped>
.CustomCheckbox {
  border: 2px solid var(--a-cyan);
}
.CustomCheckbox.checked {
  background-color: var(--a-cyan);
}
</style>