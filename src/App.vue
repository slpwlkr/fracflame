<template>
  <img
    alt="Vue logo"
    src="./assets/logo.png"
  >
  <Counter :initial-value="0" />
</template>

<script lang="ts" setup>

import Counter from './components/Counter.vue'

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
