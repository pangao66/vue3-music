<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImgRef">
      <div class="play-btn-wrapper">
        <div v-show="songs.length&&scrollY<maxTranslateY" class="play-btn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <Scroll class="list" v-loading="!songs.length" :probe-type="3" @scroll="handleScroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
    </Scroll>
  </div>
</template>
<script lang="ts" setup>
import { computed, defineProps, onMounted, ref } from "vue";
import type { CSSProperties, PropType } from 'vue'
import Scroll from "@/components/base/scroll/scroll.vue";
import SongList from "@/components/song-list/song-list.vue";
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import type { SongType } from "@/types";
import songList from "@/components/song-list/song-list.vue";

const RESERVED_HEIGHT = 40
const props = defineProps({
  songs: {
    type: Array as PropType<SongType[]>,
    default: () => []
  },
  title: String,
  pic: String
})
const router = useRouter()
const { selectPlay, randomPlay } = usePlayerStore()
const imgHeight = ref(0)
const bgImgRef = ref<HTMLDivElement>()
const scrollY = ref(0)
const maxTranslateY = ref(0)
onMounted(() => {
  imgHeight.value = bgImgRef.value!.clientHeight
  maxTranslateY.value = imgHeight.value - RESERVED_HEIGHT
})
// const bgImageUrl = `url(${props.pic})`
const bgImageStyle = computed<CSSProperties>(() => {
  let zIndex = 0
  let paddingTop = '70%'
  let height = '0px'
  let translateZ = 0
  let scale = 1
  if (scrollY.value > maxTranslateY.value) {
    zIndex = 10
    paddingTop = '0px'
    height = `${RESERVED_HEIGHT}px`
    translateZ = 1
  }
  if (scrollY.value < 0) {
    scale = 1 + Math.abs(scrollY.value / imgHeight.value)
  }
  return {
    backgroundImage: `url(${props.pic})`,
    zIndex,
    paddingTop,
    height,
    transform: `scale(${scale}) translateZ(${translateZ}px)`
  }
})
const goBack = () => {
  router.back()
}
const handleScroll = (pos) => {
  scrollY.value = -pos.y
}
const filterStyle = computed<CSSProperties>(() => {
  let blur = 0
  if (scrollY.value >= 0) {
    blur = Math.min(maxTranslateY.value / imgHeight.value, scrollY.value / imgHeight.value) * 20
  }
  return {
    backdropFilter: `blur(${blur}px)`
  }
})

function selectItem({  index }: { song: SongType, index: number }) {
  selectPlay({ list: props.songs, index })
}
function random(){
  randomPlay(props.songs)
}
</script>
<script lang="ts">
export default {
  name: "music-list"
}
</script>
<style scoped lang="scss">
.music-list {
  position: relative;
  height: 100%;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;

    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;

      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }

      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }

      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    top: calc(v-bind(imgHeight) * 1px);

    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
