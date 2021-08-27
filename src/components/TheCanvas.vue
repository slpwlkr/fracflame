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

<script lang="ts" setup>

import { onMounted, PropType, ref, toRefs, watch } from 'vue'
import { normalizeArray, randomWeightedPick } from '@/utils/Helper'
import { Point, Attractor } from '@/utils/FractalFlameAlgorithm'

const props = defineProps({
  isRunning: {
    type: Boolean,
    default: false
  },
  attractors: {
    type: Array as PropType<Attractor[]>,
    default: () => {
      return []
    }
  },
  drawCallsPerFrame: {
    type: Number,
    default: 3000
  },
  resetSignal: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits([
  'reset-complete'
])

const canvasRef = ref<HTMLCanvasElement>()
let canvasContext: CanvasRenderingContext2D | null | undefined
let imageData: ImageData
const { isRunning, resetSignal } = toRefs(props)
const currentPoint = new Point(true)
let currentWeights = normalizeArray(props.attractors.map(val => val.weight), 1, true, -4)
let currentAnimationFrameHandle: number

watch(isRunning, (newValue) => {
  if (newValue) {
    currentAnimationFrameHandle = requestAnimationFrame(step)
  } else {
    window.cancelAnimationFrame(currentAnimationFrameHandle)
  }
})

watch(resetSignal, (newValue) => {
  if (newValue) {
    reset()
  }
})

onMounted(() => {
  if (canvasRef.value) {
    canvasContext = canvasRef.value?.getContext('2d')
    if (canvasContext) {
      imageData = canvasContext.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
    }
  }
})

function step () {
  if (isRunning.value) {
    drawFlame()
    currentAnimationFrameHandle = window.requestAnimationFrame(step)
  }
}

// 每帧调用一次，计算drawCallsPerFrame次，将imageData绘制在canvas上
function drawFlame () {
  const { attractors, drawCallsPerFrame } = props
  for (let i = 0; i < drawCallsPerFrame; i++) {
    const index = randomWeightedPick(currentWeights) // 随机选择一个attractor
    attractors[index].apply(currentPoint)
    writeCurrentPoint()
  }
  if (canvasContext) {
    canvasContext.putImageData(imageData, 0, 0)
  }
}

// 将currentPoint写到imageData上，在画布范围内返回true，否则false
function writeCurrentPoint ():boolean {
  // 坐标转化到canvas标系
  const { x, y, color } = currentPoint
  const { width, height, data } = imageData
  const dx = Math.round((x + 1) * width / 2)
  const dy = Math.round((y + 1) * height / 2)

  // 检测坐标是否在画布范围内
  if (dx < width && dx >= 0 && dy < height && dy >= 0) {
    const index = dy * width * 4 + dx * 4
    data[index] = (color.r + data[index]) / 2
    data[index + 1] = (color.g + data[index + 1]) / 2
    data[index + 2] = (color.b + data[index + 2]) / 2
    data[index + 3] = 255
    return true
  } else {
    return false
  }
}

function reset () {
  if (canvasRef.value && canvasContext) {
    const { width, height } = canvasRef.value
    canvasContext.clearRect(0, 0, width, height)
    imageData = canvasContext.getImageData(0, 0, width, height)
    Object.assign(currentPoint, new Point(true))
    currentWeights = [...normalizeArray(props.attractors.map(val => val.weight), 1, true, -4)]
    emits('reset-complete')
  }
}

</script>

<style scoped>
#canvas {
  border: 2px solid red;
  background-color: black;
}
</style>
