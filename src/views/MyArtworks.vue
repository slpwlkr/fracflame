<template>
  <n-h1>
    我的作品
  </n-h1>
  <n-grid
    :cols="24"
    :x-gap="24"
  >
    <n-gi
      v-for="(item, index) in artworks"
      :key="index"
      :span="8"
    >
      <artwork-card
        :artwork="artworks ? artworks[index] : undefined"
        :is-my-artwork="true"
      />
    </n-gi>
  </n-grid>
</template>

<script lang="ts" setup>

import { computed } from 'vue'
import { useStore } from 'vuex'
import { NH1, NGrid, NGi } from 'naive-ui'
import { key } from '@/store'
import ArtworkCard from '@/components/ArtworkCard.vue'

// TODO:获取数据

const store = useStore(key)
store.commit('setIsInEditor', false)

const artworks = computed(() => {
  return store.state.artworks
})

</script>

<style scoped>

</style>
