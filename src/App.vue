<template>
  <n-config-provider
    :theme="darkTheme"
    :theme-overrides="themeOverrides"
  >
    <n-message-provider>
      <n-layout
        position="absolute"
        has-sider
      >
        <n-layout-sider
          id="sider"
          bordered
          content-style="padding: 24px"
          width="240px"
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
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import {
  NConfigProvider, darkTheme, NMessageProvider,
  NLayout, NLayoutContent, NLayoutSider
} from 'naive-ui'
import { themeOverrides } from './utils/Constants'
import SiderGlobalMenu from './components/SiderGlobalMenu.vue'

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
