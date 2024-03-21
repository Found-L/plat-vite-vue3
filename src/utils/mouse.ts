import { ref, Ref } from 'vue'
import { useEventListener } from './event'
// 按照惯例，组合式函数名以“use”开头
export function useMouse() {
  // 被组合式函数封装和管理的状态
  const x: Ref<number> = ref(0)
  const y: Ref<number> = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = (event as MouseEvent).pageX
    y.value = (event as MouseEvent).pageY
  })

  // 通过返回值暴露所管理的状态
  return { x, y }
}
