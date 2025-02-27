<script lang="ts" setup>
import {type TTheme} from '@/stores/pageState'
const pageStateStore = usePageStateStore()
const theme = ref('dark' as TTheme)
onMounted(() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    theme.value = pageStateStore.getTheme()
  }
})

function toggleTheme() {
  if(theme.value === 'dark-blue') {
    theme.value = 'dark'
  } else if(theme.value === 'dark') {
    theme.value = 'light'
  } else {
    theme.value = 'dark-blue'
  }
  pageStateStore.setTheme(theme.value)
}
</script>

<template>
  <div>
    <button class="ThemeSwitcher text-3xl" @click="toggleTheme">
      <Icon name="tabler:moon" v-if="theme=='dark-blue'"/>
      <Icon name="tabler:moon-2" v-else-if="theme=='dark'"/>
      <Icon name="tabler:sun" v-else/>
    </button>
  </div>
</template>

<style scoped>
.ThemeSwitcher{
  line-height: 1;
}
.ThemeSwitcher span {
  transition: color 0.2s ease-in-out;

}
.ThemeSwitcher:hover span {
  color: var(--a-cyan);
}
</style>