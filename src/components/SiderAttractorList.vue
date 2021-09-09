<template>
  <n-space vertical>
    <n-collapse>
      <n-collapse-item
        v-for="(item, index) in localAttractors"
        :key="index"
        :title="`吸引子 ${index + 1}`"
      >
        <sider-attractor-list-item v-model:attractor="localAttractors[index]" />
        <template #header-extra>
          <n-button
            :focusable="false"
            :disabled="localAttractors.length <= sizeLimits.attractorSizeMin"
            circle
            text
            @click="removeAttractor(index)"
          >
            <template #icon>
              <n-icon>
                <times />
              </n-icon>
            </template>
          </n-button>
        </template>
      </n-collapse-item>
    </n-collapse>
    <n-button
      :focusable="false"
      :disabled="localAttractors.length >= sizeLimits.attractorSizeMax"
      @click="addAttractor"
    >
      新增吸引子
    </n-button>
    <n-button
      :focusable="false"
      @click="onApplyChange"
    >
      应用更改
    </n-button>
  </n-space>
</template>

<script lang="ts" setup>

import { ref, PropType, watch } from 'vue'
import { cloneDeep } from 'lodash'
import { NSpace, NCollapse, NCollapseItem, NButton, NIcon } from 'naive-ui'
import { Times } from '@vicons/fa'
import { Attractor } from '@/utils/FractalFlameAlgorithm'
import { sizeLimits } from '@/utils/Constants'
import SiderAttractorListItem from './SiderAttractorListItem.vue'

const props = defineProps({
  attractors: {
    type: Object as PropType<Attractor[]>,
    default: () => {
      return [new Attractor()]
    }
  }
})

const emits = defineEmits([
  'update:attractors'
])

const localAttractors = ref<Attractor[]>(cloneDeep(props.attractors))

watch(() => props.attractors, (value) => {
  localAttractors.value = cloneDeep(value)
})

function addAttractor () {
  localAttractors.value.push(new Attractor())
}

function removeAttractor (index: number) {
  // 在表单上验证，这里不再验证
  localAttractors.value.splice(index, 1)
}

function onApplyChange () {
  // TODO 归一化权重
  emits('update:attractors', localAttractors.value)
}

</script>

<style scoped>

</style>
