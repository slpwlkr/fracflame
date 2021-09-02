<template>
  <n-space align="center">
    <n-button
      id="return-button"
      size="large"
      circle
      text
    >
      <template #icon>
        <n-icon>
          <arrow-left />
        </n-icon>
      </template>
    </n-button>
    <n-icon
      color="white"
      size="30"
    >
      <gripfire />
    </n-icon>
    <n-text id="logo-text">
      分形焰火
    </n-text>
  </n-space>
</template>

<script lang="ts" setup>

import { NIcon, NButton, NSpace, NH1, NText } from 'naive-ui'
import { Gripfire, ArrowLeft } from '@vicons/fa'

const props = defineProps({
  routerLink: {
    type: String,
    default: '/'
  }
})

</script>

<style scoped>
#logo-text {
  font-size: 150%;
  color: #FFFFFF;
}
</style>
