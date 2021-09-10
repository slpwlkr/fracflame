<template>
  <n-space :size="24">
    <n-button
      id="return-button"
      :focusable="false"
      size="large"
      round
      text
      @click="router.push(routerLink)"
    >
      <template #icon>
        <n-icon
          color="white"
          :size="35"
        >
          <gripfire />
        </n-icon>
      </template>
    </n-button>
    <n-h2 id="logo-text">
      分形焰火
    </n-h2>
  </n-space>
</template>

<script lang="ts" setup>

import { NIcon, NButton, NSpace, NH2 } from 'naive-ui'
import { Gripfire } from '@vicons/fa'
import { useRouter } from 'vue-router'

const props = defineProps({
  routerLink: {
    type: String,
    default: '/'
  }
})

const router = useRouter()

</script>

<style scoped>
#logo-text {
  margin-bottom: 0px;
}
</style>
