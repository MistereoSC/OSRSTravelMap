import {defineStore} from 'pinia'

const DEFAULT_THEME = 'dark'
export const usePageStateStore = defineStore('pageState', () => {
    const siteTheme = ref(null as null | TTheme)

    function getTheme() {
        if (siteTheme.value == null) {
            let t = window.localStorage.getItem('theme') as null | TTheme
            if (t == null || !CThemes.includes(t)) return setTheme()
            else return setTheme(t)
        } else return siteTheme.value
    }

    function setTheme(to?: TTheme) {
        if (to) {
            applyTheme(to)
            return to
        }
        if(siteTheme.value != null) {
            const idx = CThemes.findIndex(el => el == siteTheme.value)
            const newTheme = CThemes[(idx +1)%3]
            applyTheme(newTheme)
            return newTheme
        } else {
            applyTheme(DEFAULT_THEME)
            return DEFAULT_THEME
        }
    }

    function applyTheme(theme: TTheme) {
        siteTheme.value = theme
        const classes = document.body.classList
        CThemes.forEach(el => {
            classes.remove(`theme-${el}`)
        })
        classes.add(`theme-${theme}`)
        window.localStorage.setItem('theme', theme)
    }

    return {getTheme, setTheme}
})

const CThemes = ['dark-blue', 'light', 'dark'] as const
export type TTheme = typeof CThemes[number]