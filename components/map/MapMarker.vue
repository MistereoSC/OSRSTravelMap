<script setup lang="ts">
import type {IMarker} from "~/markers/Markers";

const store = useMapStateStore()
const props = defineProps<{
  marker: IMarker
}>()
const emit = defineEmits<{
  (e: 'click'): void;
  (e: 'hover'): void;
  (e: 'leave'): void;
}>();

function onMarkerClick() {
  emit('click')
}

const isHighlighted = ref(false)
const isVisible = ref(true)
watch(() => store.groupsToggled, (newVal) => {
  (isVisible.value = newVal.includes(props.marker.group_id))
}, {deep: true})
watch(() => store.groupHighlighted, (newVal) => {
  isHighlighted.value = newVal === props.marker.group_id
})

const tooltipVisible = ref(false);
const tooltipStyle = ref({top: '0px', left: '0px'});

function showTooltip() {
  tooltipVisible.value = true;
  emit('hover')
}

function hideTooltip() {
  tooltipVisible.value = false;
  emit('leave')
}

function updateTooltipPosition(event: MouseEvent) {
  const markerRect = (event.target as HTMLElement).getBoundingClientRect();
  tooltipStyle.value = {
    top: `${event.clientY - (markerRect.height/2)}px`,
    left: `${event.clientX + 18}px`,
  };
}

function getHighlightColorString() {
  if(!props.marker.highlight_color) return 'none'
  return `drop-shadow(0 0 1px ${props.marker.highlight_color}) drop-shadow(0 0 1px ${props.marker.highlight_color}) drop-shadow(0 0 1px ${props.marker.highlight_color}) drop-shadow(0 0 1px ${props.marker.highlight_color})`
}
</script>

<template>
  <div class="MapMarker absolute z-10 cursor-pointer pointer-events-auto select-none"
       :class="{ 'hidden': !isVisible }"
       @contextmenu.prevent>
    <div class="MapImage relative w-full h-full bg-cover "
         :style="{backgroundImage: `url('/icons/${props.marker.icon_path}')`, filter: getHighlightColorString()}"
         @mouseover="showTooltip" @mouseleave="hideTooltip" @mousemove="updateTooltipPosition"
         @click="onMarkerClick"

    >
    </div>
    <div class="MapHighlight absolute top-0 w-full h-full " :data-highlighted="isHighlighted"></div>




    <Teleport to="body">
      <div v-if="tooltipVisible" class="MapMarkerTooltip fixed flex flex-col text-primary bg-primary-200 border border-accent-yellow whitespace-nowrap z-50 p-1 pointer-events-none"
           :style="tooltipStyle">
        <span class="">{{ props.marker.title }}</span>
        <span class="text-accent-yellow">{{ props.marker.subtitle }}</span>
        <span class="text-text-secondary" v-if="props.marker.description">{{ props.marker.description }}</span>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.MapMarker {
  width: 32px;
  height: 32px;
}

.MapImage {
  z-index: 1;
  background-position: center;
  width: 32px;
  height: 32px;
  background-size: contain;
  background-repeat: no-repeat;
  object-fit: contain;
}

.MapHighlight {
  z-index: -1;
}

.MapHighlight::after {
  mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0) 100%);
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: conic-gradient(from 0deg,
  var(--a-yellow), transparent,
  var(--a-yellow), transparent,
  var(--a-yellow), transparent,
  var(--a-yellow), transparent,
  var(--a-yellow));
  opacity: 0;
  transition: opacity 0.3s;
  animation: rotateGlow 6s linear infinite;
  display: none;
}

.MapHighlight[data-highlighted="true"]::after {
  display: block;
  opacity: 1;
}

@keyframes rotateGlow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>