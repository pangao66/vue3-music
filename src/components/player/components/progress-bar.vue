<template>
  <div class="progress-bar" ref="progressBarRef">
    <div class="bar-inner">
      <div class="progress" ref="progressRef" :style="progressStyle"></div>
      <div class="progress-btn-wrapper">
        <div
          class="progress-btn"
          @touchstart.prevent="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend.prevent="onTouchEnd" :style="btnStyle"
        ></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, defineEmits, ref, watch } from "vue";
import type { CSSProperties } from 'vue'

interface Props {
  progress: number
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0
})
const emit = defineEmits<{
  (e: 'progress-changing', progress: number): void
  (e: 'progress-changed', progress: number): void
}>()
const progressBtnWidth = 16
const progressBarRef = ref<HTMLDivElement>()
const progressRef = ref<HTMLDivElement>()
const offset = ref(0)
const touch = {
  x1: 0,
  x2: 0,
  beginWidth: 0
}
watch(() => props.progress, (newVal) => {
  const barWidth = progressBarRef.value!.clientWidth - progressBtnWidth
  offset.value = barWidth * props.progress
})
const progressStyle = computed<CSSProperties>(() => {
  return {
    width: `${offset.value}px`
  }
})
const btnStyle = computed<CSSProperties>(() => {
  return {
    transform: `translate3d(${offset.value}px,0,0)`
  }
})

// 处理手动调整进度条
function onTouchStart(e: TouchEvent) {
  touch.x1 = e.touches[0].pageX
  touch.beginWidth = progressRef.value!.clientWidth
}

function onTouchMove(e: TouchEvent) {
  const delta = e.touches[0].pageX - touch.x1
  const tempWidth = touch.beginWidth + delta
  const barWidth = progressBarRef.value!.clientWidth - progressBtnWidth
  const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
  offset.value = barWidth * progress
  emit('progress-changing', progress)
}

function onTouchEnd(e: TouchEvent) {
  const barWidth = progressBarRef.value!.clientWidth - progressBtnWidth
  const progress = progressRef.value!.clientWidth / barWidth
  emit('progress-changed', progress)
}
</script>
<script lang="ts">
export default {
  name: "progress-bar"
}
</script>
<style scoped lang="scss">
.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
