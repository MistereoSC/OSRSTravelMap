<script setup lang="ts">
import {map} from "@volar/typescript/lib/typescript/core";

let CMapImage = null as null | HTMLImageElement

onMounted(() => {
  CMapImage = new Image();
  CMapImage.src = '/images/worldmap.png';
  CMapImage.onload = () => {
    drawCanvasImage(true)
  };
  window.addEventListener("resize", () => drawCanvasImage())
});
onUnmounted(() => {
  window.removeEventListener("resize", () => drawCanvasImage())
})

// ---------------------------------------------
// #region Drawing
// ---------------------------------------------
const ImageX = ref(0)
const ImageY = ref(0)

function drawCanvasImage(setup?: boolean) {
  if (!CMapImage) return
  const canvas = document.getElementById('worldmap') as HTMLCanvasElement;
  const context = canvas.getContext('2d');
  if (!context || !canvas) {
    console.error("C-ERR::: Could not find worldmap");
    return;
  }

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const drawWidth = CMapImage.width * imageScale.value;
  const drawHeight = CMapImage.height * imageScale.value;

  if (setup == true) {
    ImageX.value = (canvas.width - drawWidth) / 2;
    ImageY.value = (canvas.height - drawHeight) / 2;
  }

  context.drawImage(CMapImage, ImageX.value, ImageY.value, drawWidth, drawHeight);
}

// #endregion
// ---------------------------------------------
// #region Zoom
// ---------------------------------------------
const AbsZoomLevels = [0.285, 0.33, 0.4, 0.5, 0.66, 1, 1.5, 2, 2.5, 3]
const zoomLevel = ref(4)
const imageScale = ref(AbsZoomLevels[4])

function onZoom(ev: WheelEvent) {
  if (ev.deltaY < 0) zoomIn(ev)
  else if (ev.deltaY > 0) zoomOut(ev)
}

function zoomIn(ev?: MouseEvent) {
  if (zoomLevel.value == AbsZoomLevels.length) return;
  const oldScale = imageScale.value;
  zoomLevel.value += 1;
  imageScale.value = AbsZoomLevels[zoomLevel.value - 1];
  adjustImagePositionRelativeToMouse(oldScale, imageScale.value, ev);
  drawCanvasImage();
}

function zoomOut(ev?: MouseEvent) {
  if (zoomLevel.value == 1) return;
  const oldScale = imageScale.value;
  zoomLevel.value -= 1;
  imageScale.value = AbsZoomLevels[zoomLevel.value - 1];
  adjustImagePositionRelativeToMouse(oldScale, imageScale.value, ev);
  drawCanvasImage();
}

function adjustImagePositionRelativeToMouse(oldScale: number, newScale: number, ev: MouseEvent | undefined,) {
  const canvas = document.getElementById('worldmap') as HTMLCanvasElement;
  if (!canvas || !CMapImage) return;
  const rect = canvas.getBoundingClientRect();

  let panX = ev ? ev.clientX - rect.left : rect.width / 2;
  let panY = ev ? ev.clientY - rect.top : rect.height / 2;

  const drawWidth = CMapImage.width * newScale;
  const drawHeight = CMapImage.height * newScale;

  panX = Math.max(0, Math.min(panX, drawWidth));
  panY = Math.max(0, Math.min(panY, drawHeight));
  const offsetX = (panX - ImageX.value) * (newScale / oldScale - 1);
  const offsetY = (panY - ImageY.value) * (newScale / oldScale - 1);

  ImageX.value -= offsetX;
  ImageY.value -= offsetY;

  const CMaxPanX = (canvas.width - CMapImage.width * imageScale.value) - canvas.width / 4
  const CMaxPanY = (canvas.height - CMapImage.height * imageScale.value) - canvas.height / 4
  const CMinPanX = canvas.width / 4
  const CMinPanY = canvas.height / 4
  ImageX.value = Math.max(Math.min(ImageX.value, CMinPanX), CMaxPanX);
  ImageY.value = Math.max(Math.min(ImageY.value, CMinPanY), CMaxPanY);
}



// #endregion
// ---------------------------------------------
// #region Mouse
// ---------------------------------------------
const MouseHeld = ref(false)

const posX = ref(0)
const posY = ref(0)
const lastMouseX = ref(0)
const lastMouseY = ref(0)

const targetFPS = 60;
const frameDuration = 1000 / targetFPS;
let lastFrameTime = 0;
let _isOnPanDelay = false

function updateMousePosition(ev: MouseEvent) {
  const currentTime = performance.now();
  if (currentTime - lastFrameTime < frameDuration) return;
  lastFrameTime = currentTime;

  const coords = getMapCoordinates(ev.x, ev.y)
  posX.value = coords.x
  posY.value = coords.y
  if (MouseHeld.value && !_isOnPanDelay) {
    _isOnPanDelay = true
    requestAnimationFrame(() => {
      const dX = ev.x - lastMouseX.value;
      const dY = ev.y - lastMouseY.value;
      panImg(dX, dY);
      lastMouseX.value = ev.x;
      lastMouseY.value = ev.y;
      _isOnPanDelay = false;
    })
  }
}

function lMouseButton(ev: MouseEvent) {
  if (ev.type == "mousedown") {
    MouseHeld.value = true
    lastMouseX.value = ev.x
    lastMouseY.value = ev.y
  } else if (ev.type == "mouseup") {
    MouseHeld.value = false
  }
}

// #endregion
// ---------------------------------------------
// #region Panning
// ---------------------------------------------

function panImg(x: number, y: number) {
  const canvas = document.getElementById('worldmap') as HTMLCanvasElement;
  if (!canvas || !CMapImage) return

  const CMaxPanX = (canvas.width - CMapImage.width * imageScale.value) - canvas.width / 4
  const CMaxPanY = (canvas.height - CMapImage.height * imageScale.value) - canvas.height / 4
  const CMinPanX = canvas.width / 4
  const CMinPanY = canvas.height / 4
  ImageX.value = Math.min(Math.max(ImageX.value + x, CMaxPanX), CMinPanX);
  ImageY.value = Math.min(Math.max(ImageY.value + y, CMaxPanY), CMinPanY);

  drawCanvasImage();
}

const PIXEL_PER_COORD = 3

function getMapCoordinates(mouseX: number, mouseY: number) {
  const canvas = document.getElementById('worldmap') as HTMLCanvasElement;
  if (!canvas || !CMapImage) return {x: 0, y: 0};

  const rect = canvas.getBoundingClientRect();
  const canvasX = mouseX - rect.left;
  const canvasY = mouseY - rect.top;

  const imageX = (canvasX - ImageX.value) / imageScale.value / PIXEL_PER_COORD;
  const imageY = (canvasY - ImageY.value) / imageScale.value / PIXEL_PER_COORD;

  const maxX = Math.floor(CMapImage.width / PIXEL_PER_COORD);
  const maxY = Math.floor(CMapImage.height / PIXEL_PER_COORD);

  return {
    x: Math.max(0, Math.min(Math.floor(imageX), maxX)),
    y: Math.max(0, Math.min(Math.floor(imageY), maxY))
  };
}

// #endregion
// ---------------------------------------------
const mapState = useMapStateStore()

watch(() => mapState.menuWidth, (val) => {
  const elZoom = document.getElementById('zoomControls')
  if (elZoom) {
    const s = `${val}px`
    elZoom.style.left = s
  }
});

</script>

<template>
  <div class="w-full h-full bg-accent-sea relative">
    <canvas class="w-full h-full" id="worldmap"
            @wheel.stop.prevent="(ev) => onZoom(ev)"
            @scroll.stop.prevent
            @drag.stop.prevent
            @mousedown.self="(ev) => lMouseButton(ev)"
            @mouseup.self="(ev) => lMouseButton(ev)"
            @mouseleave="() => MouseHeld = false"
            @mousemove="(ev) => updateMousePosition(ev)"
    ></canvas>

    <div
        id="zoomControls"
        class="h-auto absolute bottom-2 left-2 ml-2 font-bold bg-primary-50/50 grid grid-cols-[1fr,1fr,1fr] rounded-md items-center">
      <button class="p-2" @click="() => zoomIn()">+</button>
      <span class="text-center"> {{ zoomLevel }}</span>
      <button class="p-2" @click="() => zoomOut()">-</button>
    </div>


    <div class="debugControls absolute bottom-2 right-2 bg-primary-50/50">
      <button class="p-2">{{ posX }}|{{ posY }}</button>
    </div>
  </div>
</template>

<style scoped></style>