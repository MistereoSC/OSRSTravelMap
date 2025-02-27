<script setup lang="ts">
import MapMenuGroup from "~/components/map/MapMenuGroup.vue";
import MapMenuCategory from "~/components/map/MapMenuCategory.vue";

const store = useMapStateStore()
const MarkerGroups = ref(store.getMarkerGroups())

onMounted(() => {
  store.loadStorage()
})

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
            <MapMenuCategory title="Transportation">
              <MapMenuGroup :marker-group="MarkerGroups[0]" :inset="1"></MapMenuGroup>
              <MapMenuGroup :marker-group="MarkerGroups[1]" :inset="1"></MapMenuGroup>

            </MapMenuCategory>
            <MapMenuCategory title="Spellbooks">
              <MapMenuGroup :marker-group="MarkerGroups[2]" :inset="1"></MapMenuGroup>
              <MapMenuGroup :marker-group="MarkerGroups[3]" :inset="1"></MapMenuGroup>
              <MapMenuGroup :marker-group="MarkerGroups[4]" :inset="1"></MapMenuGroup>
              <MapMenuGroup :marker-group="MarkerGroups[5]" :inset="1"></MapMenuGroup>
            </MapMenuCategory>
            <MapMenuCategory title="Others">
              <MapMenuGroup :marker-group="MarkerGroups[6]" :inset="1"></MapMenuGroup>
              <MapMenuGroup :marker-group="MarkerGroups[7]" :inset="1"></MapMenuGroup>
              <MapMenuGroup :marker-group="MarkerGroups[8]" :inset="1"></MapMenuGroup>
            </MapMenuCategory>
            <MapMenuCategory title="Accessories">
              <MapMenuGroup :marker-group="MarkerGroups[9]" :inset="1"></MapMenuGroup>
              <MapMenuGroup :marker-group="MarkerGroups[10]" :inset="1"></MapMenuGroup>
              <MapMenuGroup :marker-group="MarkerGroups[11]" :inset="1"></MapMenuGroup>
              <MapMenuGroup :marker-group="MarkerGroups[12]" :inset="1"></MapMenuGroup>
              <MapMenuGroup :marker-group="MarkerGroups[13]" :inset="1"></MapMenuGroup>
              <MapMenuGroup :marker-group="MarkerGroups[14]" :inset="1"></MapMenuGroup>
              <MapMenuGroup :marker-group="MarkerGroups[15]" :inset="1"></MapMenuGroup>
              <MapMenuGroup :marker-group="MarkerGroups[16]" :inset="1"></MapMenuGroup>
              <MapMenuGroup :marker-group="MarkerGroups[17]" :inset="1"></MapMenuGroup>
              <MapMenuGroup :marker-group="MarkerGroups[18]" :inset="1"></MapMenuGroup>
            </MapMenuCategory>
          </div>

<!--          <div class="mt-32 mb-2 w-full h-[1px] bg-primary-200"></div>-->
          <MapMenuCategory title="Settings">
            <div class="MenuItem py-1 flex flex-row items-center gap-2 cursor-pointer hover:bg-primary-100 pl-4"
                 @click.stop.prevent="() => store.toggleGrid()"
            >
              <div class="CustomCheckbox w-4 h-4 rounded-md overflow-hidden cursor-pointer"
                   :class="{ 'checked': store.gridIsDrawn }"></div>
              <span class="font-bold">Toggle Chunk Grid</span>
            </div>

            <div class="MenuItem py-1 flex flex-row items-center gap-2 cursor-pointer hover:bg-primary-100 pl-4"
                 @click.stop.prevent="() => store.toggleControls()"
            >
              <div class="CustomCheckbox w-4 h-4 rounded-md overflow-hidden cursor-pointer"
                   :class="{ 'checked': store.showControls }"></div>
              <span class="font-bold">Show Controls</span>
            </div>

            <div class="MenuItem py-1 flex flex-row items-center gap-2 cursor-pointer hover:bg-primary-100 pl-4"
                 @click.stop.prevent="() => store.toggleCoordinates()"
            >
              <div class="CustomCheckbox w-4 h-4 rounded-md overflow-hidden cursor-pointer"
                   :class="{ 'checked': store.showCoordinates }"></div>
              <span class="font-bold">Show Coordinates</span>
            </div>
          </MapMenuCategory>

        </div>
      </div>
    </div>

    <div class="MenuFooter mt-auto bg-primary-100 flex justify-center gap-2 text-2xl py-1">
      <a class="--purple" target="_blank" href="https://github.com/MistereoSC/OSRSTravelMap" title="GitHub"><Icon name="tabler:brand-github" /></a>
      <a class="--orange" target="_blank" href="https://www.reddit.com/user/Mistereo_SC/" title="Reddit"><Icon name="tabler:brand-reddit" /></a>
      <a class="--cyan" target="_blank" href="https://ko-fi.com/mistereosc" title="Ko-fi"><Icon name="tabler:coffee" /></a>
    </div>
    <button @click="() => store.toggleMenu()"
            class="absolute top-1 left-[101%] rounded-md bg-primary-50/50 w-8 h-8 hover:bg-primary-50/80">
      <span class="text-2xl size-full grid place-items-center">
        <Icon name="tabler:arrow-bar-left" v-if="store.menuExpanded"/>
        <Icon name="tabler:arrow-bar-right" v-else/>
      </span>
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
.MenuFooter a span {
    transition: color 0.2s ease-in-out;
}
.MenuFooter a.--purple:hover span {
    color: var(--a-purple);
}
.MenuFooter a.--orange:hover span {
  color: var(--a-orange);
}
.MenuFooter a.--cyan:hover span {
  color: var(--a-cyan);
}
</style>