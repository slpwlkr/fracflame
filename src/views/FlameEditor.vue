<template>
  <n-layout
    position="absolute"
    has-sider
  >
    <n-layout-sider
      bordered
      content-style="padding: 24px"
    >
      <n-icon>
        <fire />
      </n-icon>
      <span>分形焰火</span>
      <n-divider />
      <n-space vertical>
        <n-button
          color="#FFFFFF"
          text-color="#000000"
          bordered
          @click="onToggleCanvasRunning"
        >
          {{ isRunning ? '暂停计算' : '开始计算' }}
        </n-button>
        <n-button
          color="#FFFFFF"
          text-color="#000000"
          bordered
          @click="onRerollParameters"
        >
          随机生成参数
        </n-button>
        <n-button
          color="#FFFFFF"
          text-color="#000000"
          bordered
          @click="onRenderCanvas"
        >
          渲染图像
        </n-button>
        <n-button
          color="#FFFFFF"
          text-color="#000000"
          bordered
          @click="onDownloadImage"
        >
          下载图像
        </n-button>
      </n-space>
    </n-layout-sider>
    <n-layout-content content-style="padding: 24px">
      <canvas
        id="flame-canvas"
        ref="canvasRef"
        :width="canvasWidth"
        :height="canvasHeight"
      />
      <a ref="downloadLinkRef" />
      <div id="render-stats">
        <ul>
          <li>points calculated: {{ pointsCalculated }}</li>
          <li>points in canvas: {{ pointsRendered }}</li>
        </ul>
      </div>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts" setup>

import { NLayout, NLayoutContent, NLayoutSider, NIcon, NDivider, NSpace, NButton } from 'naive-ui'
import { Fire } from '@vicons/fa'
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { cloneDeep } from 'lodash'
import { key } from '@/store'
import { Attractor, Point, generateRandomChosenVariations, generateRandomAttractors, VariationFunctions } from '@/utils/FractalFlameAlgorithm'
import { normalizeArray, randomWeightedPick } from '@/utils/Helper'

const store = useStore(key)
const flameInEditor = computed(() => store.state.flameInEditor)
// DOM对象
const canvasRef = ref<HTMLCanvasElement>()
const downloadLinkRef = ref<HTMLAnchorElement>()
let canvasContext: CanvasRenderingContext2D | null | undefined
// 作品参数
const title = ref('')
const canvasWidth = ref(512)
const canvasHeight = ref(512)
const attractors = ref<Attractor[]>([])
let currentWeights: number[] // 缓存吸引子权重
// 渲染统计
const maxFrequency = ref(0)
const pointsCalculated = ref(0)
const pointsRendered = ref(0)
// 内部数据存储
let imageData : ImageData
let histogramData : Uint32Array
let drawPoint : Point
// 渲染器参数
const drawCallsPerFrame = 1000
const isRunning = ref(false)
let currentAnimationFrameHandle: number
// 随机化设置
let chosenVariations : number[]
// 监听isRunning，控制计算过程
watch(isRunning, (newValue) => {
  if (newValue) {
    currentAnimationFrameHandle = requestAnimationFrame(step)
  } else {
    window.cancelAnimationFrame(currentAnimationFrameHandle)
  }
})

onMounted(() => {
  // 将store中的数据克隆到本地
  if (flameInEditor.value) {
    title.value = flameInEditor.value.title
    canvasWidth.value = flameInEditor.value.canvasWidth
    canvasHeight.value = flameInEditor.value.canvasHeight
    attractors.value = cloneDeep(flameInEditor.value.attractors)
    maxFrequency.value = flameInEditor.value.maxFrequency
    pointsCalculated.value = flameInEditor.value.pointsCalculated
    pointsRendered.value = flameInEditor.value.pointsRendered

    imageData = new ImageData(flameInEditor.value.imageData.data, canvasWidth.value, canvasHeight.value)
    histogramData = new Uint32Array(flameInEditor.value.histogramData)
    drawPoint = Object.create(flameInEditor.value.drawPoint)
    // 计算权重缓存
    currentWeights = normalizeArray(attractors.value.map(val => val.weight), 1, true, -4)
  }

  if (canvasRef.value) {
    canvasContext = canvasRef.value?.getContext('2d')
  }
})

function onToggleCanvasRunning () {
  isRunning.value = !isRunning.value
}

function onRerollParameters () {
  isRunning.value = false
  reset()
  chosenVariations = generateRandomChosenVariations(2, 6, VariationFunctions)
  attractors.value = generateRandomAttractors(3, 5, chosenVariations, VariationFunctions)
  currentWeights = normalizeArray(attractors.value.map(val => val.weight), 1, true, -4)
  isRunning.value = true
}

function step () {
  if (isRunning.value) {
    drawFlame()
    currentAnimationFrameHandle = window.requestAnimationFrame(step)
  }
}

// 每帧调用一次，计算drawCallsPerFrame次，将imageData绘制在canvas上
function drawFlame () {
  for (let i = 0; i < drawCallsPerFrame; i++) {
    const index = randomWeightedPick(currentWeights) // 随机选择一个attractor
    attractors.value[index].apply(drawPoint)
    writeCurrentPoint()
  }
  if (canvasContext) {
    canvasContext.putImageData(imageData, 0, 0)
  }
}

// 将currentPoint写到imageData以及histogramData上
function writeCurrentPoint () {
  // 坐标转化到canvas标系
  const { x, y, color } = drawPoint
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
    if (freq > maxFrequency.value) {
      maxFrequency.value = freq // 更新最大采样频率
    }

    pointsRendered.value++
  }
  pointsCalculated.value++
}

function reset () {
  if (canvasRef.value && canvasContext) {
    const { width, height } = canvasRef.value
    canvasContext.clearRect(0, 0, width, height)
    canvasContext.fillRect(0, 0, width, height)
    imageData = canvasContext.getImageData(0, 0, width, height)
    histogramData = new Uint32Array(width * height * 4)
    drawPoint = new Point(true)
    maxFrequency.value = 0
    pointsCalculated.value = 0
    pointsRendered.value = 0
  }
}

// 将HistogramData渲染到canvas上（基于对数着色，gamma，更新imageData的值）
function onRenderCanvas () {
  isRunning.value = false
  const { width, height, data } = imageData
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const index = row * width * 4 + column * 4
      const freq = histogramData[index + 3]

      if (freq > 0) {
        const alpha = Math.log(freq) / Math.log(maxFrequency.value)

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

// 保存canvas图片到本地
function onDownloadImage () {
  isRunning.value = false
  if (canvasRef.value && downloadLinkRef.value) {
    downloadLinkRef.value.setAttribute('download', `FracFlame_${Date.now()}.png`)
    downloadLinkRef.value.setAttribute('href', canvasRef.value.toDataURL('image/png').replace('image/png', 'image/octet-stream'))
    downloadLinkRef.value.click()
  }
}

</script>

<style scoped>
#flame-canvas {
  border: 1px dashed white;
  background-color: black;
}
</style>
