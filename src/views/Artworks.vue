<template>
  <n-h1>
    浏览
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
        :artwork="artworks ? item : undefined"
        :is-my-artwork="false"
        :is-login="isLogin"
      />
    </n-gi>
  </n-grid>
</template>

<script lang="ts" setup>

import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { NH1, NGrid, NGi } from 'naive-ui'
import { key } from '@/store'
import ArtworkCard from '@/components/ArtworkCard.vue'

const store = useStore(key)
const artworks = computed(() => {
  return store.state.artworks
})
const isLogin = computed(() => {
  return store.state.isLogin
})
store.commit('setIsInEditor', false)

onMounted(() => {
  store.dispatch('fetchArtworks')
})

</script>

<style scoped>

</style>
