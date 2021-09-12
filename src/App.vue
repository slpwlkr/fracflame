<template>
  <n-config-provider
    :theme="darkTheme"
    :theme-overrides="themeOverrides"
  >
    <n-message-provider>
      <n-layout
        v-if="!isInEditor"
        position="absolute"
        has-sider
      >
        <n-layout-sider
          id="sider"
          bordered
          content-style="padding: 24px"
          width="280px"
          collapse-mode="transform"
          :collapsed-width="0"
          show-trigger="bar"
          :native-scrollbar="false"
        >
          <sider-global-menu />
        </n-layout-sider>
        <n-layout-content
          id="content"
          content-style="padding: 24px"
        >
          <router-view />
        </n-layout-content>
      </n-layout>
      <router-view v-if="isInEditor" />
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>

import {
  NConfigProvider, darkTheme, NMessageProvider,
  NLayout, NLayoutContent, NLayoutSider
} from 'naive-ui'
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { themeOverrides } from './utils/Constants'
import SiderGlobalMenu from './components/SiderGlobalMenu.vue'
import axios from 'axios'

const store = useStore(key)
const isInEditor = computed(() => {
  return store.state.isInEditor
})
const token = computed(() => store.state.token)
onMounted(() => {
  if (!store.state.isLogin && token.value) {
    axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
    store.dispatch('fetchCurrentUser')
    // 这里需要后端配合了
  }
})

</script>

<style>
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: auto;
}
#content {
  background-color: black;
  overflow: auto;
  position: relative;
}
#sider {
  background-color: black;
}
</style>
