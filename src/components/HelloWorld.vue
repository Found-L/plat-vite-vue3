<script setup lang="ts">
import { ref,onMounted } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)

import { useMouse } from '@/utils/mouse'
      const list = ref([
    /* ... */
  ])
  const show = ref(true)

  const url = ref(window.location.origin+'/canvas.html')

  const { x, y } = useMouse()
  const mouse = reactive(useMouse())
  console.log(mouse.x)
  
  // const input = ref(null)
  // const itemRefs = ref([])

  const input = ref<HTMLInputElement | null>(null);
  const itemRefs = ref<any[]>([]); // 假设 itemRefs 是一个 ref
  onMounted(() => {
    input.value?.focus()
    console.log(itemRefs.value)
  })
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>

  <input ref="input" />
  
    <ul>
     <li v-for="item in list" :key="item.id" ref="itemRefs">
       {{ item }}
     </li>
   </ul>
  
   <h3>Mouse position is at: {{ x }}, {{ y }}</h3>
   <h3>Mouse position is at: {{ mouse.x }}, {{ mouse.y }}</h3>
  
   <button @click="show = !show">Toggle</button>
   <Transition name="slide-fade">
     <p v-if="show">hello</p>
   </Transition>
  
   <Transition name="nested" :duration="{ enter: 500, leave: 800 }">
   <div v-if="show" class="outer">
     <div class="inner">
       Hello
     </div>
   </div>
  </Transition>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}



.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}
/* 延迟嵌套元素的进入以获得交错效果 */
.nested-enter-active .inner {
  transition-delay: 0.25s;
}
.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0;
}
</style>
