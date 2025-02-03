<script setup lang="ts">
import type {IMarker} from "~/markers/Markers";

const isHighlighted = ref(false)
const props = defineProps<{
  marker: IMarker
}>()

function onMarkerClick() {
  console.log('Marker clicked:', props.marker.title, props.marker.subtitle);
}

const tooltipVisible = ref(false);
const tooltipStyle = ref({top: '0px', left: '0px'});

function showTooltip() {
  tooltipVisible.value = true;
}

function hideTooltip() {
  tooltipVisible.value = false;
}

function updateTooltipPosition(event: MouseEvent) {
  tooltipStyle.value = {
    top: `calc(${event.offsetY}px - 50%)`,
    left: `${event.offsetX + 18}px`
  };
}
</script>

<template>
  <div class="MapMarker absolute cursor-pointer pointer-events-auto"

       @contextmenu.prevent>
    <div class="MapImage relative outline-2 outline-green-100 w-full h-full bg-cover "
         :style="{backgroundImage: `url('/icons/${props.marker.icon_path}')`}"
         @mouseover="showTooltip" @mouseleave="hideTooltip" @mousemove="updateTooltipPosition"
         @click="onMarkerClick">

  </div>
  <div class="MapHighlight absolute top-0 w-full h-full " :data-highlighted="isHighlighted">></div>


  <div v-if="tooltipVisible" class="MapMarkerTooltip absolute flex flex-col fixed, text-primary bg-primary-200"
       :style="tooltipStyle">
    <span class="text-center">{{ props.marker.title }}</span>
    <span class="text-accent-yellow">{{ props.marker.subtitle }}</span>
    <span class="text-text-secondary" v-if="props.marker.description">{{ props.marker.description }}</span>
  </div>
  </div>
</template>

<style scoped>
.MapMarker {
  width: 32px;
  height: 32px;

  position: absolute;
  z-index: 1;
  /* Ensure the marker is above the pseudo-element */
}

.MapImage {
  filter: drop-shadow(0 0 4px var(--a-cyan));
  z-index: 1;
}

.MapHighlight {
  z-index: -1;
}

.MapHighlight::after {
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

.MapMarkerTooltip {
  padding: 5px;
  border-radius: 3px;
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
}
</style>