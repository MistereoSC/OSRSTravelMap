import { defineStore } from 'pinia'

export const useMapStateStore = defineStore('mapState', () => {
    const menuExpanded = ref(true)
    const menuWidth = ref(0)

    function toggleMenu(to?: boolean) {
        if(to != undefined) menuExpanded.value = to
        else menuExpanded.value = !menuExpanded.value

        nextTick(()=>{
            const menu = document.getElementById('map_l_menu');
            if (!menu) return -1;
            menuWidth.value = menu.clientWidth
        })
    }

    function getMaxMenuWidth() {
        const menu = document.getElementById('map_l_menu');
        if (!menu) return -1;
        if(menuExpanded.value == true) return menu.clientWidth
        menu.hidden = false
        const v = menu.clientWidth
        menu.hidden = true
        return v
    }

    function setupMenu() {
        const menu = document.getElementById('map_l_menu');
        if (!menu) return
        menuWidth.value = menu.clientWidth
    }

    return {
        toggleMenu,
        menuExpanded,
        menuWidth,
        setupMenu
    }
})