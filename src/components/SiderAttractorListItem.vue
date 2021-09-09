<template>
  <n-form>
    <n-grid
      :cols="24"
      :x-gap="12"
    >
      <n-form-item-gi
        label="a"
        :span="8"
      >
        <n-input-number
          :value="localAttractor.affineParams[0]"
          :max="1"
          :min="-1"
          :show-button="false"
          @update:value="(value)=>{ updateAttractor('affine', value || 0, 0) }"
        />
      </n-form-item-gi>
      <n-form-item-gi
        label="b"
        :span="8"
      >
        <n-input-number
          :value="localAttractor.affineParams[1]"
          :max="1"
          :min="-1"
          :show-button="false"
          @update:value="(value)=>{ updateAttractor('affine', value || 0, 1) }"
        />
      </n-form-item-gi>
      <n-form-item-gi
        label="c"
        :span="8"
      >
        <n-input-number
          :value="localAttractor.affineParams[2]"
          :max="1"
          :min="-1"
          :show-button="false"
          @update:value="(value)=>{ updateAttractor('affine', value || 0, 2) }"
        />
      </n-form-item-gi>
      <n-form-item-gi
        label="d"
        :span="8"
      >
        <n-input-number
          :value="localAttractor.affineParams[3]"
          :max="1"
          :min="-1"
          :show-button="false"
          @update:value="(value)=>{ updateAttractor('affine', value || 0, 3) }"
        />
      </n-form-item-gi>
      <n-form-item-gi
        label="e"
        :span="8"
      >
        <n-input-number
          :value="localAttractor.affineParams[4]"
          :max="1"
          :min="-1"
          :show-button="false"
          @update:value="(value)=>{ updateAttractor('affine', value || 0, 4) }"
        />
      </n-form-item-gi>
      <n-form-item-gi
        label="f"
        :span="8"
      >
        <n-input-number
          :value="localAttractor.affineParams[5]"
          :max="1"
          :min="-1"
          :show-button="false"
          @update:value="(value)=>{ updateAttractor('affine', value || 0, 5) }"
        />
      </n-form-item-gi>
      <n-form-item-gi
        label="权重"
        :span="12"
      >
        <n-slider
          :value="localAttractor.weight"
          :max="1"
          :min="0"
          :step="0.01"
          :marks="{ 0: '0', 1: '1' }"
          @update:value="(value)=>{ updateAttractor('weight', value || 0) }"
        />
      </n-form-item-gi>
      <n-form-item-gi
        label="颜色"
        :span="12"
      >
        <n-color-picker
          :value="color"
          :show-alpha="false"
          @update:value="(value)=>{ updateAttractor('color', value) }"
        />
      </n-form-item-gi>
      <n-form-item-gi
        label="变体子"
        :span="24"
      >
        <n-space vertical>
          <n-form
            v-for="(item, index) in localAttractor.variations"
            :id="`variation-form-${index}`"
            :key="index"
            size="small"
          >
            <n-grid
              :cols="24"
              :x-gap="12"
            >
              <n-form-item-gi :span="2">
                {{ index + 1 }}.
              </n-form-item-gi>
              <n-form-item-gi
                :span="8"
              >
                <n-select
                  :value="item.typeIndex"
                  :options="variationOptions"
                  @update:value="(value)=>{ updateAttractor('variationType', value || 0, index) }"
                />
              </n-form-item-gi>
              <n-form-item-gi
                :span="10"
              >
                <n-slider
                  :value="item.weight"
                  :max="1"
                  :min="0"
                  :step="0.01"
                  :marks="{ 0: '0', 1: '1' }"
                  @update:value="(value)=>{ updateAttractor('variationWeight', value || 0, index) }"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="2">
                <n-button
                  :focusable="false"
                  :disabled="localAttractor.variations.length <= 1"
                  circle
                  text
                  @click="updateAttractor('variationRemove', 0, index)"
                >
                  <template #icon>
                    <n-icon>
                      <times />
                    </n-icon>
                  </template>
                </n-button>
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-space>
      </n-form-item-gi>
      <n-form-item-gi :span="24">
        <n-button
          :focusable="false"
          :disabled="localAttractor.variations.length >= sizeLimits.variationSizeMax"
          @click="updateAttractor('variationAdd', 0, 0)"
        >
          新增变体子
        </n-button>
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts" setup>

import { ref, PropType, watch, computed } from 'vue'
import { cloneDeep } from 'lodash'
import {
  NForm, NFormItemGi, NGrid, NSpace,
  NInputNumber, NSlider, NColorPicker, NSelect, NButton,
  NIcon
} from 'naive-ui'
import { Times } from '@vicons/fa'
import { Attractor, Color, Variation, VariationFunctions } from '@/utils/FractalFlameAlgorithm'
import { variationOptions, sizeLimits } from '@/utils/Constants'
import { toFixedNumber } from '@/utils/Helper'

const props = defineProps({
  attractor: {
    type: Object as PropType<Attractor>,
    default: new Attractor(false)
  }
})

const emits = defineEmits([
  'update:attractor'
])

const localAttractor = ref<Attractor>(cloneDeep(props.attractor))
const color = computed(() => {
  return Color.toString(localAttractor.value.color)
})

// 无需deep watch, 因为假设该组件是改动父级attractor的唯一方式
watch(() => props.attractor, (value) => {
  localAttractor.value = cloneDeep(value)
})

function updateAttractor (key: string, value: number | string = 0, index = 0) {
  switch (key) {
  case 'affine' :
    localAttractor.value.affineParams[index] = toFixedNumber(value as number, 4)
    emits('update:attractor', localAttractor.value)
    break
  case 'weight':
    localAttractor.value.weight = value as number
    emits('update:attractor', localAttractor.value)
    break
  case 'color':
    localAttractor.value.color = Color.parseString(value as string)
    emits('update:attractor', localAttractor.value)
    break
  case 'variationType':
    localAttractor.value.variations[index].typeIndex = value as number
    localAttractor.value.variations[index].functionInfo = VariationFunctions[value as number]
    emits('update:attractor', localAttractor.value)
    console.log('update attractor variation type: ' + value)
    break
  case 'variationWeight':
    localAttractor.value.variations[index].weight = value as number
    emits('update:attractor', localAttractor.value)
    break
  case 'variationRemove':
    localAttractor.value.variations.splice(index, 1)
    emits('update:attractor', localAttractor.value)
    break
  case 'variationAdd':
    localAttractor.value.variations.push(new Variation(0, toFixedNumber(Math.random(), 4), VariationFunctions[0]))
    emits('update:attractor', localAttractor.value)
    break
  default:
    break
  }
}

</script>

<style scoped>
.n-form[id^="variation-form-"] {
  width: 100%;
  height: 90px;
}
</style>
