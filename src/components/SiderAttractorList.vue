<template>
  <n-space
    vertical
    :size="24"
  >
    <n-collapse>
      <n-collapse-item
        v-for="(item, index) in localAttractors"
        :id="`attractor-list-item-${index}`"
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
    <n-grid
      :col="24"
      :x-gap="9"
      :y-gap="24"
    >
      <n-gi :span="12">
        <n-button
          :focusable="false"
          :disabled="localAttractors.length >= sizeLimits.attractorSizeMax"
          class="form-button"
          @click="addAttractor"
        >
          新增吸引子
        </n-button>
      </n-gi>
      <n-gi :span="12">
        <n-button
          :focusable="false"
          class="form-button"
          @click="onApplyChange"
        >
          应用更改
        </n-button>
      </n-gi>
    </n-grid>
  </n-space>
</template>

<script lang="ts" setup>

import { ref, PropType, watch } from 'vue'
import { cloneDeep } from 'lodash'
import { NSpace, NCollapse, NCollapseItem, NGrid, NGi, NButton, NIcon } from 'naive-ui'
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
.form-button {
  height: 48px;
  width: 100%;
}
.n-collapse-item[id^="attractor-list-item-"]{
  margin-left: 12px;
}
</style>
