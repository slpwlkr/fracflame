<script lang="ts" setup>

import { onMounted, ref, toRefs, watch } from 'vue'
import { RandomInRange } from '@/helper'

const props = defineProps({
  isRunning: {
    type: Boolean,
    default: false
  }
})

const canvasRef = ref<HTMLCanvasElement>()
let canvasContext: CanvasRenderingContext2D | null | undefined

const { isRunning } = toRefs(props)
watch(isRunning, (newValue) => {
  if (newValue) {
    requestAnimationFrame(step)
  }
})

onMounted(() => {
  canvasContext = canvasRef.value?.getContext('2d')
  if (canvasContext) {
    canvasContext.fillStyle = 'black'
    window.requestAnimationFrame(step)
  }
})

function step () {
  if (canvasContext) {
    const x = RandomInRange(true, 0, 512)
    const y = RandomInRange(true, 0, 512)
    canvasContext.fillRect(x, y, 1, 1)
  }
  if (isRunning.value) {
    window.requestAnimationFrame(step)
  }
}

</script>

<template>
  <div id="canvas-container">
    <canvas
      id="canvas"
      ref="canvasRef"
      height="512"
      width="512"
    />
  </div>
</template>

<style scoped>
#canvas {
  border: 2px solid black;
}
</style>
