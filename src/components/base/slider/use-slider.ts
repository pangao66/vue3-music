import BScroll from "@better-scroll/core";
import Slider from "@better-scroll/slide";
import { onMounted, onUnmounted, ref } from "vue";
import type { Ref } from 'vue'

BScroll.use(Slider)
export default function useSlider(wrapperRef: Ref<HTMLDivElement>) {
  const slider = ref<BScroll>()
  const currentPageIndex = ref(0)
  onMounted(() => {
    slider.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: true
    })
    slider.value.on('slidePageChanged', (page:any) => {
      currentPageIndex.value = page.pageX
    })
  })
  onUnmounted(() => {
    slider.value?.destroy()
  })
  return {
    currentPageIndex
  }
}
