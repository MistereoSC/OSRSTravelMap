<script setup lang="ts">
const props = defineProps<{
  title: string
}>()

const isExpanded = ref(true)
function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

</script>


<template>
  <div>
    <div class="border-b border-b-primary-300 text-xl pb-1 pl-4 flex items-center gap-2 cursor-pointer hover:bg-primary-100" @click="toggleExpand">
      <Icon name="tabler:minus" v-if="isExpanded"/>
      <Icon name="tabler:plus" v-else/>
      <h3 class="">{{title}}</h3>
    </div>

    <div class="py-2" v-if="isExpanded">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

</style>