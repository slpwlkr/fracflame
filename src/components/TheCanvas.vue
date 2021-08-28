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
    default: 1000
  },
  resetSignal: {
    type: Boolean,
    default: false
  },
  renderSignal: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits([
  'reset-complete',
  'render-complete'
])

const canvasRef = ref<HTMLCanvasElement>()
let canvasContext: CanvasRenderingContext2D | null | undefined
let imageData: ImageData
let histogramData: Uint32Array
const { isRunning, resetSignal, renderSignal } = toRefs(props)
let currentAnimationFrameHandle: number
const currentPoint = new Point(true)
let currentWeights = normalizeArray(props.attractors.map(val => val.weight), 1, true, -4)
const currentMaxFrequency = ref(0)

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
    emits('reset-complete')
  }
})

watch(renderSignal, (newValue) => {
  if (newValue) {
    renderHistogram()
    emits('render-complete')
  }
})

onMounted(() => {
  if (canvasRef.value) {
    canvasContext = canvasRef.value?.getContext('2d')
    if (canvasContext) {
      const { width, height } = canvasRef.value
      imageData = canvasContext.getImageData(0, 0, width, height)
      histogramData = new Uint32Array(imageData.data)
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

// 将currentPoint写到imageData以及histogramData上，在画布范围内返回true，否则false
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

    histogramData[index] += color.r
    histogramData[index + 1] += color.g
    histogramData[index + 2] += color.b
    const freq = ++histogramData[index + 3]
    if (freq > currentMaxFrequency.value) {
      currentMaxFrequency.value = freq // 更新最大采样频率
    }
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
    histogramData = new Uint32Array(imageData.data)
    Object.assign(currentPoint, new Point(true))
    currentWeights = [...normalizeArray(props.attractors.map(val => val.weight), 1, true, -4)]
    currentMaxFrequency.value = 0
  }
}

// 将HistogramData渲染到canvas上（基于对数着色，gamma，更新imageData的值）
function renderHistogram () {
  const { width, height, data } = imageData
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const index = row * width * 4 + column * 4
      const freq = histogramData[index + 3]

      if (freq > 0) {
        const alpha = Math.log(freq) / Math.log(currentMaxFrequency.value)

        for (let i = 0; i < 3; i++) {
          data[index + i] = Math.round(alpha * histogramData[index + i] / freq)
        }
      }
    }
  }

  if (canvasContext) {
    canvasContext.putImageData(imageData, 0, 0)
  }
}

</script>

<style scoped>
#canvas {
  border: 2px solid red;
  background-color: black;
}
</style>
