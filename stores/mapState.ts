import {defineStore} from 'pinia'
import type {IMarkerGroup, IMarker} from "~/markers/Markers";
import {createMarkerList} from "~/markers/Markers";

const DEFAULT_TOGGLE_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8]

export const useMapStateStore = defineStore('mapState', () => {
    const MENU_WIDTH = 312

    const menuExpanded = ref(true)
    const groupsToggled = ref(DEFAULT_TOGGLE_ARRAY)
    const groupHighlighted = ref(null as null | number)

    const gridIsDrawn = ref(true)
    const showControls = ref(false)
    const showCoordinates = ref(false)

    function toggleMenu(to?: boolean) {
        if (to != undefined) menuExpanded.value = to
        else menuExpanded.value = !menuExpanded.value
    }

    function toggleGroup(group_id: number) {
        const idx = groupsToggled.value.indexOf(group_id)
        if (idx == -1) groupsToggled.value.push(group_id)
        else groupsToggled.value.splice(idx, 1)
    }
    function toggleAlLGroups() {
        if(groupsToggled.value.length <= 1) {
            groupsToggled.value = DEFAULT_TOGGLE_ARRAY
        } else {
            groupsToggled.value = []
        }
    }

    function highlightGroup(group_id?: number | null) {
        if(group_id == null) groupHighlighted.value = null
        else groupHighlighted.value = group_id
    }

    let MARKER_LIST = null as null | IMarker[]
    let GROUP_LIST = null as null | IMarkerGroup[]
    function getMarkerGroups() {
        if (!GROUP_LIST) fillArrs()
        return GROUP_LIST as IMarkerGroup[]
    }
    function getMarkerList() {
        if (!MARKER_LIST) fillArrs()
        return MARKER_LIST as IMarker[]
    }
    function fillArrs() {
        const t = createMarkerList()
        GROUP_LIST = t.groups
        MARKER_LIST = t.markers
    }
    function toggleGrid() {
        gridIsDrawn.value = !gridIsDrawn.value
        return gridIsDrawn.value
    }
function toggleControls() {
        showControls.value = !showControls.value
        return showControls.value
    }
    function toggleCoordinates() {
        showCoordinates.value = !showCoordinates.value
        return showCoordinates.value
    }

    return {
        MENU_WIDTH,
        toggleMenu,
        menuExpanded,
        getMarkerGroups,
        getMarkerList,
        groupsToggled,
        toggleGroup,
        groupHighlighted,
        highlightGroup,
        toggleAlLGroups,
        gridIsDrawn,
        toggleGrid,
        showControls,
        showCoordinates,
        toggleCoordinates,
        toggleControls
    }
})

// Amulets, Diary Rewards, Ghommals HIlt, Capes, Ectophial, Minigame Teleports, Spells, Homes
// Fairy Rings, Spirit Trees, Minecart, Gnome Gliders, Balloons, Charter Ships, Teleport Crystals,
// Magic Carpets, Quetzal