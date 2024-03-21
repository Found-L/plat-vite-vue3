<template>
  <div ref="statsContainer"></div>
</template>

<script lang="ts">
import Stats from 'stats.js';

export default {
  name: 'Stats',
  setup() {
    const statsContainer = ref<HTMLDivElement | null>(null);
    let stats: Stats | null = null;

    onMounted(() => {
      if (statsContainer.value) {
        stats = new Stats();
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        statsContainer.value.appendChild(stats.dom);
      }
      animate();
    });

    function animate() {
      requestAnimationFrame(animate);
      if (stats) {
        stats.update();
      }
    }
    return {
      statsContainer
    };
  }
};
</script>