<template>
  <the-canvas
    :is-running="isCanvasRunning"
    :attractors="currentAttractors"
    :reset-signal="canvasResetSignal"
    :render-signal="canvasRenderSignal"
    :download-signal="canvasDownloadSignal"
    @reset-complete="onCanvasResetComplete"
    @render-complete="onCanvasRenderComplete"
    @download-complete="onCanvasDownloadComplete"
  />
  <button @click="onToggleCanvasRunning">
    Toggle Canvas
  </button>
  <button @click="onRerollParameters">
    Reroll Params
  </button>
  <button @click="onRenderCanvas">
    Render Canvas
  </button>
  <button @click="onDownloadCanvasImage">
    Download Image
  </button>
</template>

<script lang="ts" setup>

import { ref } from '@vue/reactivity'
import TheCanvas from './components/TheCanvas.vue'
import { generateRandomChosenVariations, generateRandomAttractors, Attractor, VariationFunctions } from './utils/FractalFlameAlgorithm'

const isCanvasRunning = ref(false)
const canvasResetSignal = ref(false)
const canvasRenderSignal = ref(false)
const canvasDownloadSignal = ref(false)
const currentAttractors = ref<Attractor[]>([])
let currentChosenVariations = generateRandomChosenVariations(1, 6, VariationFunctions)

currentAttractors.value = generateRandomAttractors(3, 6, currentChosenVariations, VariationFunctions)

function onToggleCanvasRunning () {
  isCanvasRunning.value = !isCanvasRunning.value
}

function onRerollParameters () {
  isCanvasRunning.value = false
  currentChosenVariations = generateRandomChosenVariations(1, 6, VariationFunctions)
  currentAttractors.value = generateRandomAttractors(3, 6, currentChosenVariations, VariationFunctions)
  canvasResetSignal.value = true
}

function onCanvasResetComplete () {
  canvasResetSignal.value = false
  isCanvasRunning.value = true
}

function onRenderCanvas () {
  isCanvasRunning.value = false
  canvasRenderSignal.value = true
}

function onCanvasRenderComplete () {
  canvasRenderSignal.value = false
}

function onDownloadCanvasImage () {
  isCanvasRunning.value = false
  canvasDownloadSignal.value = true
}

function onCanvasDownloadComplete () {
  canvasDownloadSignal.value = false
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
