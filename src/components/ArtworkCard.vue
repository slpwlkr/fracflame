<template>
  <n-card
    id="artwork-card"
    :title="artwork.title"
  >
    <template #cover>
      <img :src="getImageURL(artwork.imageURL)">
    </template>
    <n-space v-if="!isMyArtwork">
      <n-icon>
        <user />
      </n-icon>
      <span>
        {{ artwork.username }}
      </span>
    </n-space>
  </n-card>
</template>

<script lang="ts" setup>

import { PropType, ref } from 'vue'
import { NCard, NIcon, NSpace } from 'naive-ui'
import { User } from '@vicons/fa'
import { IArtwork } from '@/store'
import { getImageURL } from '@/utils/Helper'

const props = defineProps({
  artwork: {
    type: Object as PropType<IArtwork>,
    default: () => { return {} }
  },
  isMyArtwork: {
    type: Boolean,
    default: false
  }
})

</script>

<style scoped>
#artwork-card {
  width: 360px;
  height: 320px;
}
</style>
