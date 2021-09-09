<template>
  <n-config-provider
    :theme="darkTheme"
    :theme-overrides="themeOverrides"
  >
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import {
  NConfigProvider, darkTheme, NMessageProvider
} from 'naive-ui'
import { themeOverrides } from './utils/Constants'

</script>

<style>
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: auto;
}
</style>
