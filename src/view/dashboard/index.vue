<template>
  <div>123</div>

  <div class="card">
    <button type="button" @click="increment">count is {{ count }}</button>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'

  const count = ref(0)

  function increment() {
      count.value++
    }

</script>
<style scoped>
  .read-the-docs {
    color: #888;
  }
</style>