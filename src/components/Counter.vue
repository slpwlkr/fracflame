<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  initialValue: {
    type: Number,
    default: 0
  }
})

const count = ref(props.initialValue)

</script>

<template>
  <div>
    <button @click="count++">
      count: {{ count }}
    </button>
  </div>
</template>

<style scoped>

</style>
