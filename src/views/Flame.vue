<template>
  <n-layout
    position="absolute"
    has-sider
  >
    <n-layout-sider
      bordered
      content-style="padding: 24px"
    >
      <n-button>返回</n-button>
      <span>分形焰火</span>
      <n-divider />
      <n-space vertical>
        <n-button
          color="#FFFFFF"
          text-color="#000000"
          bordered
          @click="onToggleCanvasRunning"
        >
          Toggle Canvas
        </n-button>
        <n-button @click="onRerollParameters">
          Reroll Params
        </n-button>
        <n-button @click="onRenderCanvas">
          Render Canvas
        </n-button>
        <n-button @click="onDownloadCanvasImage">
          Download Image
        </n-button>
      </n-space>
    </n-layout-sider>
    <n-layout-content content-style="padding: 24px">
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
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts" setup>

import { ref } from '@vue/reactivity'
import { NLayout, NLayoutContent, NLayoutSider, NSpace, NButton, NDivider } from 'naive-ui'
import TheCanvas from '@/components/TheCanvas.vue'
import { generateRandomChosenVariations, generateRandomAttractors, Attractor, VariationFunctions } from '@/utils/FractalFlameAlgorithm'

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

<style scoped>

.n-layout-sider {
  background: rgba(128, 128, 128, 0.3);
}

.n-layout-content {
  background: rgba(128, 128, 128, 0.4);
}
</style>
