<template>
  <n-grid
    :cols="24"
  >
    <n-gi :span="24"> <div class="space"></div> </n-gi>
    <n-gi :span="12">
      <n-icon
        color="white"
        :size="60"
      >
        <gripfire />
      </n-icon>
      <n-text
        id="logo-text"
        strong
      >
        分形焰火
      </n-text>
      <p id="banner-text">
        使用参数，
        <br>
        创造绚丽多彩的火焰分形，
        <br>
        与他人分享。
      </p>
    </n-gi>
    <n-gi :span="12">
      <n-h1 prefix="bar">
        <n-text>
          编辑精选
        </n-text>
      </n-h1>
      <n-carousel
        autoplay
        show-arrow
      >
        <img
          v-for="(item, index) in carouselImages"
          :key="index"
          :src="getImageURL(item)"
          class="carousel-img"
        >
      </n-carousel>
    </n-gi>
  </n-grid>
</template>

<script lang="ts" setup>

import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import {
  NGrid, NGi, NSpace,
  NText, NGradientText, NIcon, NDivider, NCarousel, NH1
} from 'naive-ui'
import { Gripfire } from '@vicons/fa'
import { key } from '@/store'
import { getImageURL } from '@/utils/Helper'

const store = useStore(key)
store.commit('setIsInEditor', false)

const carouselImages = computed(() => {
  return store.state.homeCarouselImages
})

</script>

<style scoped>
#logo-text {
  font-size: 3.5em;
}
#banner-text {
  font-size: 3em;
}
.carousel-img {
  width: 100%;
  height: 480px;
  object-fit: contain;
}
.space {
  height: 220px;
}
</style>
