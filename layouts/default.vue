<script setup lang="ts"></script>
<template>
  <div class="h-lvh w-lvw grid grid-rows-[auto,1fr]">
    <div class="h-auto w-full">
      <AppHeader/>
    </div>
    <div class="h-full w-full overflow-x-auto">
      <slot/>
    </div>
  </div>
</template>
<style scoped></style>