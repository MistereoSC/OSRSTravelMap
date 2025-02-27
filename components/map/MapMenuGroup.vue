<script setup lang="ts">
import type {IMarkerGroup} from "~/markers/Markers";

const store = useMapStateStore()
interface IProps {
  markerGroup: IMarkerGroup
  inset?: number
}
const props = withDefaults(defineProps<IProps>(), {
  inset: 0
})

onMounted(()=> {
  isChecked.value = store.groupsToggled.includes(props.markerGroup.group_id)
})

function handleMouseEnter(group_id: number) {
  store.highlightGroup(group_id)
}

function handleMouseLeave() {
  store.highlightGroup(null)
}

const isChecked = ref(false)
watch(() => store.groupsToggled, (newVal) => {
  isChecked.value = newVal.includes(props.markerGroup.group_id)
}, {deep: true})

function getHighlightColorString() {
  if(!props.markerGroup.highlight_color) return 'none'
  return `drop-shadow(0 0 1px ${props.markerGroup.highlight_color})
          drop-shadow(0 0 1px ${props.markerGroup.highlight_color})
          drop-shadow(0 0 1px ${props.markerGroup.highlight_color})
          drop-shadow(0 0 1px ${props.markerGroup.highlight_color})`
}
</script>


<template>
  <div class="MenuItem py-1 flex flex-row items-center gap-2 cursor-pointer hover:bg-primary-100 pl-4"
       @click.stop.prevent="() => store.toggleGroup(props.markerGroup.group_id)"
       @mouseenter="handleMouseEnter(props.markerGroup.group_id)"
       @mouseleave="handleMouseLeave"
       :style="{paddingLeft: `${16 + props.inset*16}px`}"
  >

    <div class="CustomCheckbox w-4 h-4 rounded-md overflow-hidden cursor-pointer"
         :class="{ 'checked': isChecked }"></div>
    <div class="MenuItemImage bg-cover w-6 h-6 @contextmenu.prevent"
         :style="{backgroundImage: `url('/icons/${props.markerGroup.icon_path}')`,filter: getHighlightColorString()}">
    </div>
    <span class="font-bold">{{ props.markerGroup.name }}</span>
  </div>
</template>

<style scoped>
.CustomCheckbox {
  border: 2px solid var(--a-cyan);
}

.CustomCheckbox.checked {
  background-color: var(--a-cyan);
}

.MenuItemImage {
  filter: drop-shadow(0 0 1px var(--a-pink)) drop-shadow(0 0 1px var(--a-pink)) drop-shadow(0 0 1px var(--a-pink)) drop-shadow(0 0 1px var(--a-pink));
}
</style>