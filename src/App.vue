<template>
  <n-config-provider
    :theme="darkTheme"
    :theme-overrides="themeOverrides"
  >
    <router-view />
  </n-config-provider>
</template>

<script lang="ts" setup>
import { NConfigProvider, darkTheme, GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    baseColor: 'black',
    textColorBase: 'white'
  },
  Layout: {
    siderBorderColor: 'white'
  },
  Divider: {
    color: 'white'
  },
  Button: {
    borderRadiusMedium: '0px',
    border: '1px solid rgb(255, 255, 255)'
  }
}

</script>

<style>
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: auto;
}
</style>
