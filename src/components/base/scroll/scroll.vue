<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import BScroll from "@better-scroll/core";
import ObserveDOM from "@better-scroll/observe-dom";
import MouseWheel from '@better-scroll/mouse-wheel'
import type { BScroll as BScrollType } from '@better-scroll/core/dist/types/BScroll'

BScroll.use(MouseWheel)
BScroll.use(ObserveDOM)
import { onMounted, onUnmounted, ref } from "vue";

const rootRef = ref<HTMLDivElement>()
const scroll = ref<BScrollType>()
const props = defineProps({
  click: {
    type: Boolean,
    default: true
  },
  probeType: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits<{
  (e: 'scroll'): void
}>()
onMounted(() => {
  scroll.value = new BScroll(rootRef.value!, {
    observeDOM: true, // 开启 observe-dom 插件
    ...props,
    mouseWheel: {
      dampingFactor: 0
    },
  })
  if (props.probeType > 0) {
    scroll.value.on('scroll', (pos) => {
      emit('scroll', pos)
    })
  }
})
const scrollTo = (x: number, y: number) => {
  scroll.value!.scrollTo(x, y)
}
onUnmounted(() => {
  scroll.value!.destroy()
})
defineExpose({
  scroll,
  scrollTo
})
</script>
<script lang="ts">
export default {
  name: "scroll"
}
</script>
<style>
</style>
