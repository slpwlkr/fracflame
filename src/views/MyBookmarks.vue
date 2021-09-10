<template>
  <n-h1>
    我的收藏
  </n-h1>
</template>

<script lang="ts" setup>

import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { NH1, NGrid, NGi } from 'naive-ui'
import { key } from '@/store'
import ArtworkCard from '@/components/ArtworkCard.vue'

const store = useStore(key)
const artworks = computed(() => {
  return store.state.artworks
})

</script>

<style scoped>

</style>
