<template>
  <the-canvas
    :is-running="isCanvasRunning"
  />
  <button @click="onToggleCanvasRunning">
    Toggle Canvas
  </button>
  <button @click="onGenerateRandomAttractors">
    Generate random Attractors
  </button>
</template>

<script lang="ts" setup>

import { ref } from '@vue/reactivity'
import TheCanvas from './components/TheCanvas.vue'
import { generateRandomAttractors } from './utils/FractalFlameAlgorithm'

const isCanvasRunning = ref(false)

function onToggleCanvasRunning () {
  isCanvasRunning.value = !isCanvasRunning.value
}

function onGenerateRandomAttractors () {
  const attractors = generateRandomAttractors(1, 5)
  console.log(attractors)
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
