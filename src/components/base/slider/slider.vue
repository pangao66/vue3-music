<template>
  <div class="slider" ref="rootRef">
    <div class="slider-group">
      <div
        class="slider-page"
        v-for="item in sliders"
        :key="item.id"
      >
        <a :href="item.link">
          <img :src="item.pic"/>
        </a>
      </div>
    </div>
    <div class="dots-wrapper">
      <span
        class="dot"
        v-for="(item, index) in sliders"
        :key="item.id"
        :class="{'active': currentPageIndex === index}"
      >
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BScroll from "@better-scroll/core";
import Slider from "@better-scroll/slide";
import { onMounted, onUnmounted, ref } from "vue";
// import useSlider from "@/components/base/slider/use-slider";
BScroll.use(Slider)
import type { BScrollInstance } from '@better-scroll/core'

defineProps<{
  sliders: any[]
}>()
const rootRef = ref<HTMLElement>()
const slider = ref<BScrollInstance>()
const currentPageIndex = ref(0)
onMounted(() => {
  slider.value = new BScroll(rootRef.value!, {
    click: true,
    scrollX: true,
    scrollY: false,
    momentum: false,
    bounce: false,
    probeType: 2,
    slide: true
  })
  slider.value.on('slidePageChanged', (page: any) => {
    currentPageIndex.value = page.pageX
  })
})
onUnmounted(() => {
  slider.value?.destroy()
})
// const {currentPageIndex}=useSlider(rootRef)
</script>
<script lang="ts">
export default {
  name: 'slider'
}
</script>
<style lang="scss" scoped>
.slider {
  position: relative;
  min-height: 1px;
  font-size: 0;
  touch-action: pan-y;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-page {
      display: inline-block;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;

      a {
        display: block;
        width: 100%;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots-wrapper {
    position: absolute;
    left: 50%;
    bottom: 12px;
    line-height: 12px;
    transform: translateX(-50%);

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      transform: translateZ(1px);
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>
