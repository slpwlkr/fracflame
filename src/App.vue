<template>
  <the-canvas
    :is-running="isCanvasRunning"
  />
  <button @click="onToggleCanvasRunning">
    Toggle Canvas
  </button>
</template>

<script lang="ts" setup>

import { ref } from '@vue/reactivity'
import TheCanvas from './components/TheCanvas.vue'

const isCanvasRunning = ref(false)

function onToggleCanvasRunning () {
  isCanvasRunning.value = !isCanvasRunning.value
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
