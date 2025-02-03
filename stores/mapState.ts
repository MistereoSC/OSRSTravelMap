import { defineStore } from 'pinia'
import type {IMarkerGroup, IMarker} from "~/markers/Markers";
import {createMarkerList} from "~/markers/Markers";

export const useMapStateStore = defineStore('mapState', () => {
    const MENU_WIDTH = 312
    const menuExpanded = ref(true)

    function toggleMenu(to?: boolean) {
        if(to != undefined) menuExpanded.value = to
        else menuExpanded.value = !menuExpanded.value
    }

    let MARKER_LIST = null as null | IMarker[]
    let GROUP_LIST = null as null | IMarkerGroup[]
    function getMarkerGroups() {
        if(!GROUP_LIST) fillArrs()
        return GROUP_LIST as IMarkerGroup[]
    }
    function getMarkerList() {
        if(!MARKER_LIST) fillArrs()
        return MARKER_LIST as IMarker[]
    }
    function fillArrs() {
        const t = createMarkerList()
        GROUP_LIST = t.groups
        MARKER_LIST = t.markers
    }

    return {
        MENU_WIDTH,
        toggleMenu,
        menuExpanded,
        getMarkerGroups,
        getMarkerList,
    }
})