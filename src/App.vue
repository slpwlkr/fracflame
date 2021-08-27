<template>
  <the-canvas
    :is-running="isCanvasRunning"
    :attractors="currentAttractors"
    :reset-signal="canvasResetSignal"
    @reset-complete="onCanvasResetComplete"
  />
  <button @click="onToggleCanvasRunning">
    Toggle Canvas
  </button>
  <button @click="onRerollParameters">
    Reroll Params
  </button>
</template>

<script lang="ts" setup>

import { ref } from '@vue/reactivity'
import TheCanvas from './components/TheCanvas.vue'
import { generateRandomAttractors, Attractor } from './utils/FractalFlameAlgorithm'

const isCanvasRunning = ref(false)
const canvasResetSignal = ref(false)
const currentAttractors = ref<Attractor[]>([])

currentAttractors.value = generateRandomAttractors(3, 6)

function onToggleCanvasRunning () {
  isCanvasRunning.value = !isCanvasRunning.value
}

function onRerollParameters () {
  isCanvasRunning.value = false
  currentAttractors.value = generateRandomAttractors(3, 6)
  canvasResetSignal.value = true
}

function onCanvasResetComplete () {
  canvasResetSignal.value = false
  isCanvasRunning.value = true
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
