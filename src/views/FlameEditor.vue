<template>
  <n-layout
    position="absolute"
    has-sider
  >
    <n-layout-sider
      id="sider"
      bordered
      content-style="padding: 24px"
      width="360px"
      :native-scrollbar="false"
    >
      <sider-title />
      <n-divider />
      <n-thing>
        <template #header>
          {{ title }}
        </template>
        <template #action>
          <n-space justify="space-around">
            <n-button
              :focusable="false"
              @click="onDownloadImage"
            >
              保存并上传
            </n-button>
            <n-button
              :focusable="false"
              @click="onDownloadImage"
            >
              下载图像
            </n-button>
          </n-space>
        </template>
      </n-thing>
      <n-divider />
      <n-collapse>
        <n-collapse-item title="基础信息">
          <n-descriptions
            :column="1"
            bordered
            label-placement="left"
            label-align="right"
            size="small"
          >
            <n-descriptions-item label="创建于">
              {{ toCNDatetimeString(createdAt) }}
            </n-descriptions-item>
            <n-descriptions-item label="上次更新于">
              {{ toCNDatetimeString(lastUpdatedAt) }}
            </n-descriptions-item>
            <n-descriptions-item label="画布大小">
              {{ canvasWidth }} * {{ canvasHeight }} px
            </n-descriptions-item>
          </n-descriptions>
        </n-collapse-item>
        <n-collapse-item title="计算控制">
          <n-space vertical>
            <n-descriptions
              :column="1"
              bordered
              label-placement="left"
              label-align="right"
              size="small"
            >
              <n-descriptions-item label="已计算点">
                {{ pointsCalculated.toExponential(3) }} 个
              </n-descriptions-item>
              <n-descriptions-item label="已绘制点">
                {{ pointsRendered.toExponential(3) }} 个
              </n-descriptions-item>
              <n-descriptions-item label="绘制率">
                {{ pointsRenderPercentage }} %
              </n-descriptions-item>
              <n-descriptions-item label="最大采样频次">
                {{ maxFrequency }} 次
              </n-descriptions-item>
              <n-descriptions-item label="运行帧率">
                {{ isRunning ? frameRate.toFixed(0) : '-' }} 帧/每秒
              </n-descriptions-item>
              <n-descriptions-item label="每帧计算">
                {{ isRunning ? drawCallsPerFrame : '-' }} 次
              </n-descriptions-item>
            </n-descriptions>
            <n-button
              :focusable="false"
              @click="onToggleCanvasRunning"
            >
              {{ isRunning ? '暂停计算' : '开始计算' }}
            </n-button>
          </n-space>
        </n-collapse-item>
        <n-collapse-item title="渲染控制">
          <n-form>
            <n-form-item label="伽马校正值">
              <n-slider
                v-model:value="gamma"
                :max="4"
                :min="0.1"
                :step="0.1"
                :marks="{ 1:'1.0', 2.2:'2.2' }"
              />
            </n-form-item>
          </n-form>
          <n-button
            :focusable="false"
            @click="onRenderCanvas"
          >
            渲染图像
          </n-button>
        </n-collapse-item>
        <n-collapse-item title="画布设置">
          <n-form
            label-placement="left"
            label-align="right"
          >
            <n-form-item
              label="画布大小"
            >
              <n-cascader
                v-model:value="inputCanvasResolution"
                leaf-only
                expand-trigger="hover"
                :show-path="false"
                :options="canvasResolutionOptions"
              />
            </n-form-item>
            <n-form-item
              label="反转长/高"
            >
              <n-checkbox
                v-model:checked="inputShouldInvertCanvasResolution"
              />
            </n-form-item>
          </n-form>
          <n-button
            :focusable="false"
            @click="onApplyCanvasSettings"
          >
            应用设置
          </n-button>
        </n-collapse-item>
      </n-collapse>
      <n-divider />
      <n-space vertical>
        <n-button
          color="#FFFFFF"
          text-color="#000000"
          bordered
          @click="onRerollParameters"
        >
          随机生成参数
        </n-button>
      </n-space>
    </n-layout-sider>
    <n-layout-content
      id="canvas-container"
      content-style="padding: 24px"
    >
      <canvas
        id="flame-canvas"
        ref="canvasRef"
        :width="canvasWidth"
        :height="canvasHeight"
      />
      <a
        ref="downloadLinkRef"
        hidden
      />
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts" setup>

import {
  NLayout, NLayoutContent, NLayoutSider, NSpace,
  NCollapse, NCollapseItem, NThing, NDescriptions, NDescriptionsItem, NForm, NFormItem,
  NCascader, NCheckbox, NDivider, NButton, NSlider
} from 'naive-ui'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { cloneDeep } from 'lodash'
import { key } from '@/store'
import { Attractor, Point, generateRandomChosenVariations, generateRandomAttractors, VariationFunctions } from '@/utils/FractalFlameAlgorithm'
import { normalizeArray, randomWeightedPick, toCNDatetimeString } from '@/utils/Helper'
import { canvasResolutionOptions } from '@/utils/Constants'
import SiderTitle from '@/components/SiderTitle.vue'

const store = useStore(key)
const flameInEditor = computed(() => store.state.flameInEditor)
// DOM对象
const canvasRef = ref<HTMLCanvasElement>()
const downloadLinkRef = ref<HTMLAnchorElement>()
let canvasContext: CanvasRenderingContext2D | null | undefined
// 作品信息
const title = ref('')
const createdAt = ref(0)
const lastUpdatedAt = ref(0)
// 画布设置
const canvasWidth = ref(512)
const canvasHeight = ref(512)
const canvasWidthRatio = computed(() => {
  return canvasWidth.value > canvasHeight.value ? canvasWidth.value / canvasHeight.value : 1
})
const canvasHeightRatio = computed(() => {
  return canvasHeight.value > canvasWidth.value ? canvasHeight.value / canvasWidth.value : 1
})
// 吸引子设置
const attractors = ref<Attractor[]>([])
let currentWeights: number[] // 缓存吸引子权重，由于吸引子结构复杂，故手动更新
// 计算统计
const maxFrequency = ref(0)
const pointsCalculated = ref(0)
const pointsRendered = ref(0)
const frameRate = ref(60)
let lastFrameTimeStamp: number
// 渲染参数
const gamma = ref(1)
// 内部数据存储
let imageData : ImageData
let histogramData : Uint32Array
let drawPoint : Point
// 渲染器状态
const drawCallsPerFrame = ref(1000)
const isRunning = ref(false)
let currentAnimationFrameHandle: number
// 随机化设置
let chosenVariations : number[]
// 表单输入信息（性能原因，需要点击按钮应用更改才能改动真实的参数，因此管理多一份参数对应表单）
const inputCanvasResolution = ref('')
const inputShouldInvertCanvasResolution = ref(false)
// 动态调整帧率参数
const dynamicDrawCallsFrameRateThresholdHigh = 60
const dynamicDrawCallsFrameRateThresholdLow = 50
const dynamicDrawCallsAdjustRate = 0.05

const pointsRenderPercentage = computed(() => {
  return (pointsRendered.value / pointsCalculated.value * 100).toFixed(2)
})
// 监听isRunning，控制计算过程
watch(isRunning, (newValue) => {
  if (newValue) {
    lastFrameTimeStamp = performance.now() // 初始化帧率计算
    currentAnimationFrameHandle = requestAnimationFrame(step)
  } else {
    window.cancelAnimationFrame(currentAnimationFrameHandle)
  }
})

onMounted(() => {
  // 将store中的数据克隆到本地
  if (flameInEditor.value) {
    title.value = flameInEditor.value.title
    createdAt.value = flameInEditor.value.createdAt
    lastUpdatedAt.value = flameInEditor.value.lastUpdatedAt
    canvasWidth.value = flameInEditor.value.canvasWidth
    canvasHeight.value = flameInEditor.value.canvasHeight
    gamma.value = flameInEditor.value.gamma
    attractors.value = cloneDeep(flameInEditor.value.attractors)
    maxFrequency.value = flameInEditor.value.maxFrequency
    pointsCalculated.value = flameInEditor.value.pointsCalculated
    pointsRendered.value = flameInEditor.value.pointsRendered

    imageData = new ImageData(flameInEditor.value.imageData.data, canvasWidth.value, canvasHeight.value)
    histogramData = new Uint32Array(flameInEditor.value.histogramData)
    drawPoint = Object.create(flameInEditor.value.drawPoint)
    // 计算权重缓存
    currentWeights = normalizeArray(attractors.value.map(val => val.weight), 1, true, -4)
    // 赋值给表单用的变量
    inputShouldInvertCanvasResolution.value = canvasHeight.value > canvasWidth.value
    if (inputShouldInvertCanvasResolution.value) {
      inputCanvasResolution.value = `{"width": ${canvasHeight.value}, "height": ${canvasWidth.value}}`
    } else {
      inputCanvasResolution.value = `{"width": ${canvasWidth.value}, "height": ${canvasHeight.value}}`
    }
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

// 将HistogramData渲染到canvas上（基于对数着色，gamma，更新imageData的值）
function onRenderCanvas () {
  isRunning.value = false
  const { width, height, data } = imageData
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const index = row * width * 4 + column * 4
      const freq = histogramData[index + 3]

      if (freq > 0) {
        const alpha = Math.pow(Math.log(freq) / Math.log(maxFrequency.value), 1 / gamma.value)

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

async function onApplyCanvasSettings () {
  isRunning.value = false
  const canvasResolution = JSON.parse(inputCanvasResolution.value)
  if (inputShouldInvertCanvasResolution.value) {
    canvasWidth.value = canvasResolution.height
    canvasHeight.value = canvasResolution.width
  } else {
    canvasWidth.value = canvasResolution.width
    canvasHeight.value = canvasResolution.height
  }
  await nextTick() // 应用对canvas的修改
  reset()
  isRunning.value = true
}

function step () {
  if (isRunning.value) {
    drawFlame()
    // 计算帧率
    frameRate.value = 1000 / (performance.now() - lastFrameTimeStamp)
    lastFrameTimeStamp = performance.now()
    currentAnimationFrameHandle = window.requestAnimationFrame(step)
    // 动态调整帧率
    if (frameRate.value > dynamicDrawCallsFrameRateThresholdHigh) {
      drawCallsPerFrame.value = Math.round(drawCallsPerFrame.value * (1 + dynamicDrawCallsAdjustRate))
    } else if (frameRate.value < dynamicDrawCallsFrameRateThresholdLow) {
      drawCallsPerFrame.value = Math.round(drawCallsPerFrame.value * (1 - dynamicDrawCallsAdjustRate))
    }
  }
}

// 每帧调用一次，计算drawCallsPerFrame次，将imageData绘制在canvas上
function drawFlame () {
  let pointsRenderedInFrame = 0
  for (let i = 0; i < drawCallsPerFrame.value; i++) {
    const index = randomWeightedPick(currentWeights) // 随机选择一个attractor
    attractors.value[index].apply(drawPoint)
    if (writeCurrentPoint()) {
      pointsRenderedInFrame++
    }
  }
  if (canvasContext) {
    canvasContext.putImageData(imageData, 0, 0)
  }
  pointsRendered.value += pointsRenderedInFrame
  pointsCalculated.value += drawCallsPerFrame.value
}

// 将currentPoint写到imageData以及histogramData上
function writeCurrentPoint () {
  // 坐标转化到canvas标系
  const { x, y, color } = drawPoint
  const { width, height, data } = imageData
  const dx = Math.round((x * 1 / canvasWidthRatio.value + 1) * width / 2)
  const dy = Math.round((y * 1 / canvasHeightRatio.value + 1) * height / 2)

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

    return true
  }
  return false
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
    drawCallsPerFrame.value = 1000
  }
}

</script>

<style scoped>
#flame-canvas {
  border: 1px dashed white;
  background-color: black;
  position: absolute;
  margin: 0;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%)
}
#canvas-container {
  background-color: black;
  overflow: auto;
  position: relative;
}
#sider {
  background-color: black;
}
</style>
