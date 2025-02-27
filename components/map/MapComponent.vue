<script setup lang="ts">
import type {IMarker} from "~/markers/Markers";
import {start} from "node:repl";

const PIXEL_PER_COORD = 3
const DRAW_GRID = true
const GRID_CHUNK_SIZE_PX = 64 * PIXEL_PER_COORD;
const GRID_OFFSET_PX_X = 37 * PIXEL_PER_COORD;
const GRID_OFFSET_PX_Y = 37 * PIXEL_PER_COORD - GRID_CHUNK_SIZE_PX + 1;
const GRID_COLOR = 'rgba(0, 0, 0, 0.5)';
const GRID_LINE_WIDTH = 1;
const LEADER_LINE_COLOR = 'rgba(208, 193, 0, 255)';
const LEADER_LINE_WIDTH = 4;

let CMapImage = null as null | HTMLImageElement
onMounted(() => {
  setControlsToMenuExpanded(mapState.menuExpanded)
  _CANVAS = document.getElementById('worldmap') as HTMLCanvasElement;
  _CONTEXT = _CANVAS.getContext('2d') as CanvasRenderingContext2D;
  if (!_CANVAS || !_CONTEXT) {
    console.error("C-ERR::: Could not find worldmap");
    return;
  }
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
let _CANVAS = {} as HTMLCanvasElement
let _CONTEXT = {} as CanvasRenderingContext2D

function drawCanvasImage(setup?: boolean) {
  if (!CMapImage) return

  _CANVAS.width = _CANVAS.clientWidth;
  _CANVAS.height = _CANVAS.clientHeight;

  const drawWidth = CMapImage.width * imageScale.value;
  const drawHeight = CMapImage.height * imageScale.value;

  if (setup == true) {
    ImageX.value = (_CANVAS.width - drawWidth) / 2;
    ImageY.value = (_CANVAS.height - drawHeight) / 2;
  }

  _CONTEXT.drawImage(CMapImage, ImageX.value, ImageY.value, drawWidth, drawHeight);
  drawGrid()
  updateMarkerPositions();
  // drawLeaderLines(activeMapMarkerLineData.value)
}

// #endregion
// ---------------------------------------------
// #region Zoom
// ---------------------------------------------
const AbsZoomLevels = [0.2, 0.285, 0.33, 0.4, 0.5, 0.66, 1, 1.5, 2, 2.5]
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
  if (!CMapImage) return;
  const rect = _CANVAS.getBoundingClientRect();

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

  const CMaxPanX = (_CANVAS.width - CMapImage.width * imageScale.value) - _CANVAS.width / 4
  const CMaxPanY = (_CANVAS.height - CMapImage.height * imageScale.value) - _CANVAS.height / 4
  const CMinPanX = _CANVAS.width / 4
  const CMinPanY = _CANVAS.height / 4
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

const targetFPS = 30;
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
  if (!CMapImage) return

  const CMaxPanX = (_CANVAS.width - CMapImage.width * imageScale.value) - _CANVAS.width / 4
  const CMaxPanY = (_CANVAS.height - CMapImage.height * imageScale.value) - _CANVAS.height / 4
  const CMinPanX = _CANVAS.width / 4
  const CMinPanY = _CANVAS.height / 4
  ImageX.value = Math.min(Math.max(ImageX.value + x, CMaxPanX), CMinPanX);
  ImageY.value = Math.min(Math.max(ImageY.value + y, CMaxPanY), CMinPanY);

  drawCanvasImage();
}

function getMapCoordinates(mouseX: number, mouseY: number) {
  if (!CMapImage) return {x: 0, y: 0};

  const rect = _CANVAS.getBoundingClientRect();
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

function panButton(direction: "u" | "d" | "l" | "r") {
  const panSpeed = 128;
  switch (direction) {
    case "d":
      panImg(0, -panSpeed);
      break;
    case "u":
      panImg(0, panSpeed);
      break;
    case "r":
      panImg(-panSpeed, 0);
      break;
    case "l":
      panImg(panSpeed, 0);
      break;
  }
}

// #endregion
// ---------------------------------------------
// #region Misc
// ---------------------------------------------
const mapState = useMapStateStore()

watch(() => mapState.menuExpanded, (val) => {
  setControlsToMenuExpanded(val)
});

function setControlsToMenuExpanded(isExpanded?: boolean) {
  const elZoom = document.getElementById('zoomControls')
  const elPan = document.getElementById('panControls')
  if (elZoom) {
    if (isExpanded == true) {
      elZoom.style.left = `${mapState.MENU_WIDTH}px`
    } else {
      elZoom.style.left = `0px`
    }
  }
  if (elPan) {
    if (isExpanded == true) {
      elPan.style.left = `${mapState.MENU_WIDTH}px`
    } else {
      elPan.style.left = `0px`
    }
  }
}

// #endregion
// ---------------------------------------------
// #region Markers
// ---------------------------------------------

const markers = ref(mapState.getMarkerList())

function updateMarkerPositions() {
  markers.value.forEach(marker => {
    const markerElement = document.getElementById(`marker-${marker.marker_id}`);
    if (markerElement) {
      const {x, y} = getMarkerPosition(marker);
      markerElement.style.transform = `translate(${x - 16}px, ${y - 16}px)`; // Adjust by half the marker size
    }
  });
}

function getMarkerPosition(marker: IMarker) {
  const x = (marker.pos.x * PIXEL_PER_COORD * imageScale.value) + ImageX.value;
  const y = (marker.pos.y * PIXEL_PER_COORD * imageScale.value) + ImageY.value;
  return {x, y};
}

// #endregion
// ---------------------------------------------
// #region Grid
// ---------------------------------------------

watch(() => mapState.gridIsDrawn, (newVal) => {
  if (newVal == true) drawGrid()
  else drawCanvasImage()
});

function drawGrid() {
  if (!mapState.gridIsDrawn) return;
  if (!CMapImage) return;

  const gridSizePixels = GRID_CHUNK_SIZE_PX * imageScale.value;

  _CONTEXT.strokeStyle = GRID_COLOR;
  _CONTEXT.lineWidth = GRID_LINE_WIDTH;

  const drawWidth = CMapImage.width * imageScale.value;
  const drawHeight = CMapImage.height * imageScale.value;

  // Calculate the starting positions with scaled offsets
  const startX = (ImageX.value + GRID_OFFSET_PX_X * imageScale.value) % gridSizePixels;
  const endX = 1 + drawWidth + ImageX.value + gridSizePixels - ((drawWidth + ImageX.value - startX) % gridSizePixels);

  const startY = (ImageY.value + GRID_OFFSET_PX_Y * imageScale.value) % gridSizePixels;
  // const endY = 1 + drawHeight + ImageY.value + gridSizePixels - ((drawHeight + ImageY.value - startY) % gridSizePixels);
  const endY = 1 + drawHeight + ImageY.value

  // Draw vertical grid lines within the image bounds, including overlapping squares at the edges
  for (let x = startX; x <= endX; x += gridSizePixels) {
    if (x >= ImageX.value) {
      _CONTEXT.beginPath();
      _CONTEXT.moveTo(x, ImageY.value + GRID_OFFSET_PX_Y * imageScale.value);
      _CONTEXT.lineTo(x, endY);
      _CONTEXT.stroke();
    }
  }

  // Draw horizontal grid lines within the image bounds, including overlapping squares at the edges
  for (let y = startY; y <= endY; y += gridSizePixels) {
    if (y >= ImageY.value + GRID_OFFSET_PX_Y * imageScale.value) {
      _CONTEXT.beginPath();
      _CONTEXT.moveTo(ImageX.value + GRID_OFFSET_PX_X * imageScale.value, y);
      _CONTEXT.lineTo(endX, y);
      _CONTEXT.stroke();
    }
  }
}

// #endregion
// ---------------------------------------------
// #region Leader Lines
// ---------------------------------------------
interface IMakerLineData {
  from_id: number,
  to_ids: number[],
  start_element: HTMLElement,
  target_elements: HTMLElement[]
}

const activeMapMarkerLineData = ref(null as null | IMakerLineData)

function toggleLeaderLine(marker: IMarker) {
  const from_id = marker.marker_id
  const to_ids = marker.linked_markers

  if (!to_ids || to_ids.length == 0) {
    if (activeMapMarkerLineData.value !== null) clearLeaderLine()
    return
  }

  if (activeMapMarkerLineData.value?.from_id == from_id) {
    clearLeaderLine()
    return
  }

  const start_element = document.getElementById(`marker-${from_id}`);
  const target_elements = to_ids.map(id => document.getElementById(`marker-${id}`) as HTMLElement)
  if (start_element == null || target_elements.some(el => el == null)) return
  activeMapMarkerLineData.value = {
    from_id,
    to_ids,
    start_element,
    target_elements,
  }
  drawLeaderLines(activeMapMarkerLineData.value)
}

function drawLeaderLines(data: IMakerLineData | null) {
  if(!data) return
  const startRect = data.start_element.getBoundingClientRect();
  const startX = startRect.left + startRect.width / 2;
  const startY = startRect.top + startRect.height / 2;

  for (const target of data.target_elements) {
    const targetRect = target.getBoundingClientRect();
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    _CONTEXT.beginPath();
    _CONTEXT.moveTo(startX, startY);

    // Calculate control points for the bezier curve
    const controlX1 = startX + (targetX - startX) / 2;
    const controlY1 = startY;
    const controlX2 = startX + (targetX - startX) / 2;
    const controlY2 = targetY;

    _CONTEXT.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, targetX, targetY);
    _CONTEXT.strokeStyle = LEADER_LINE_COLOR;
    _CONTEXT.lineWidth = LEADER_LINE_WIDTH;
    _CONTEXT.stroke();
  }
}

function clearLeaderLine() {
  activeMapMarkerLineData.value = null
  drawCanvasImage()
}

// #endregion
// ---------------------------------------------
</script>

<template>
  <div class="w-full h-full bg-accent-sea relative overflow-hidden"
       @wheel.stop.prevent="(ev) => onZoom(ev)"
       @scroll.stop.prevent
       @mousedown="(ev) => lMouseButton(ev)"
       @mouseup="(ev) => lMouseButton(ev)"
  >
    <canvas class="w-full h-full" id="worldmap"
            @drag.stop.prevent
            @mousemove="(ev) => updateMousePosition(ev)"
            @contextmenu.prevent
    ></canvas>

    <div id="markerContainer" class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <MapMarker v-for="marker in markers" :key="`marker-${marker.marker_id}`" :marker="marker"
                 :id="`marker-${marker.marker_id}`"
                 @hover="() => toggleLeaderLine(marker)"
                 @leave="() => clearLeaderLine()"
      />
    </div>

    <div
        id="zoomControls"
        class="h-auto absolute overflow-hidden bottom-2 left-2 ml-2 font-bold bg-primary-50/50 grid grid-cols-3 rounded-md items-center">
      <button class="p-2 hover:bg-primary-50/25 w-6" @click="() => zoomIn()">+</button>
      <span class="text-center select-none w-6"> {{ zoomLevel }}</span>
      <button class="p-2 hover:bg-primary-50/25 w-6" @click="() => zoomOut()">-</button>
    </div>

    <div
        id="panControls"
        class="ml-2 h-auto absolute overflow-hidden bottom-14 left-2  font-bold grid grid-cols-3 items-center">
      <div>
        <button @click="panButton('l')"
                class="w-6 p-1 rounded-tl-md rounded-bl-md bg-primary-50/50 hover:bg-primary-50/75"><
        </button>
      </div>
      <div class="grid grid-rows-2 w-6">
        <button @click="panButton('u')" class="p-1 rounded-tl-md rounded-tr-md bg-primary-50/50 hover:bg-primary-50/75">
          ^
        </button>
        <button @click="panButton('d')" class="p-1 rounded-bl-md rounded-br-md bg-primary-50/50 hover:bg-primary-50/75">
          v
        </button>
      </div>
      <div>
        <button @click="panButton('r')"
                class="w-6 p-1 rounded-tr-md rounded-br-md bg-primary-50/50 hover:bg-primary-50/75">>
        </button>
      </div>
    </div>


    <div
        class="debugControls absolute bottom-2 right-2 bg-primary-50/50 grid grid-cols-[1fr,auto,1fr] items-center rounded-md px-2">
      <span class="text-center w-9 py-2">{{ posX }}</span>
      <div class="h-full w-1 bg-primary-100 mx-2"></div>
      <span class="text-center w-9 py-2">{{ posY }}</span>
    </div>
  </div>
</template>

<style scoped>

</style>