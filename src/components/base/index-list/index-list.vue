<template>
  <Scroll class="index-list" :probe-type="3" @scroll="onScroll" ref="scrollRef">
    <ul ref="groupRef">
      <li v-for="group in data" :key="group.title" class="group">
        <h2 class="title">{{ group.title }}</h2>
        <ul>
          <li v-for="item in group.list" :key="item.id" class="item" @click="itemClick(item)">
            <img :src="item.pic" class="avatar" alt="">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="fixed" v-show="fixedTitle" :style="fixedStyle">
      <div class="fixed-title">
        {{ fixedTitle }}
      </div>
    </div>
    <div
      class="shortcut" @touchmove.stop.prevent="onShortTouchMove" @touchstart.stop.prevent="onTouchStart"
      @touched.stop.prevent
    >
      <ul>
        <li
          v-for="(item,index) in shortcutList" :key="item" class="item" :class="{current:currentIndex===index}"
          @click.stop="handleShortClick(index)"
          :data-index="index"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </Scroll>
</template>
<script lang="ts" setup>
import Scroll from "@/components/base/scroll/scroll.vue";
import { ref, watch, nextTick, computed } from "vue";
import type { CSSProperties, PropType } from 'vue'
import type { SingerGroup, SingerType } from "@/types";
import type { BScroll as BScrollType } from '@better-scroll/core/dist/types/BScroll'

const props = defineProps({
  data: {
    type: Array as PropType<SingerGroup[]>,
    default: () => []
  }
})
const emit=defineEmits<{
  (e:'select', item:SingerType):void
}>()
const itemClick = (item: SingerType) => {
  emit('select',item)
}
// fixed-title
const fixedTitle = computed(() => {
  if (scrollY.value < 0) {
    return ''
  }
  const currentGroup = props.data[currentIndex.value]
  return currentGroup ? currentGroup.title : ''
})
const groupRef = ref<HTMLElement>()
const scrollRef = ref<BScrollType>()
let listHeights: number[] = []
const scrollY = ref(0)
const currentIndex = ref(0)
const distance = ref(0)
const calculate = () => {
  const list: Element[] = Array.from(groupRef.value!.children)
  let height = 0
  listHeights.push(height)
  list.forEach((item) => {
    height += item.clientHeight
    listHeights.push(height)
  })
}
const onScroll = (pos) => {
  scrollY.value = -pos.y
}
const FIXED_HEIGHT = 30
const fixedStyle = computed<CSSProperties>(() => {
  const distanceVal = distance.value
  const diff = (distanceVal > 0 && distanceVal < FIXED_HEIGHT ? distanceVal - FIXED_HEIGHT : 0)
  return {
    transform: `translate3d(0,${diff}px,0)`
  }
})
watch(() => props.data, async () => {
  await nextTick()
  calculate()
}, { immediate: true })
watch(() => scrollY.value, (newY) => {
  for (let i = 0; i < listHeights.length - 1; i++) {
    const heightTop = listHeights[i]
    const heightBottom = listHeights[i + 1]
    if (newY >= heightTop && newY < heightBottom) {
      currentIndex.value = i
      distance.value = heightBottom - newY
      break
    }
  }
})
//  shortcut
const shortcutList = computed<string[]>(() => {
  return props.data.map((item) => item.title)
})
const ANCHOR_HEIGHT = 18
const handleShortClick = (index: number) => {
  scrollRef.value!.scrollTo(0, -listHeights[index] - 30)
}
const touch: { y1: number, y2: number, anchorIndex: number } = {
  y1: 0,
  y2: 0,
  anchorIndex: 0
}
const onTouchStart = (e: TouchEvent) => {
  //@ts-ignore
  const anchorIndex = parseInt(e.target.dataset.index)
  touch.y1 = e.touches[0].pageY
  touch.anchorIndex = anchorIndex
  scrollTo(anchorIndex)
}
const onShortTouchMove = (e: TouchEvent) => {
  touch.y2 = e.touches[0].pageY
  const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
  const anchorIndex = touch.anchorIndex + delta

  scrollTo(anchorIndex)
}
const scrollTo = (index: number) => {
  if (isNaN(index)) {
    return
  }
  index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
  scrollRef.value!.scrollTo(0, -listHeights[index])

}
</script>
<script lang="ts">
export default {
  name: "index-list"
}
</script>
<style scoped lang="scss">
.index-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .group {
    padding-bottom: 30px;

    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .shortcut {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme
      }
    }
  }
}
</style>
