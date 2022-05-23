<template>
  <div class="bottom">
    <div class="progress-wrapper">
      <span class="time time-l">{{ formatTime(currentTime) }}</span>
      <div class="progress-bar-wrapper">
        <progress-bar :progress="progress" @progress-changing="onProgressChanging"></progress-bar>
      </div>
      <span class="time time-r">{{ formatTime(currentSong.duration) }}</span>
    </div>
    <div class="operators">
      <div class="icon i-left">
        <i @click="changeMode" :class="modeIcon"></i>
      </div>
      <div class="icon i-left" :class="{disable:!songReady}">
        <i class="icon-prev" @click="prev"></i>
      </div>
      <div class="icon i-center" :class="{disable:!songReady}">
        <i :class="playIcon" @click="togglePlay"></i>
      </div>
      <div class="icon i-right" :class="{disable:!songReady}">
        <i class="icon-next" @click="next"></i>
      </div>
      <div class="icon i-right">
        <i :class="getFavoriteCls" @click="toggleFavorite(currentSong)"></i>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, inject } from "vue";
import { storeToRefs } from "pinia";
import { usePlayerStore } from "@/stores/player";
import { useFavoriteStore } from '@/stores/use-favorite'
import { playerSymbolKey } from "@/components/player/utils";
import { PLAY_MODE } from "@/assets/common/constant";
import ProgressBar from "@/components/player/components/progress-bar.vue";
import { formatTime } from '@/assets/common/utils'

const usePlayerContext = inject(playerSymbolKey)!
const { prev, next, songReady, currentTime } = usePlayerContext
const playStore = usePlayerStore()
const { playing, playMode, currentSong } = storeToRefs(playStore)
const { setPlayingState, changeMode } = playStore
const { toggleFavorite, isFavorite } = useFavoriteStore()
const playIcon = computed(() => {
  return playing.value ? 'icon-pause' : 'icon-play'
})
const getFavoriteCls = computed(() => {
  return isFavorite(currentSong.value) ? 'icon-favorite' : 'icon-not-favorite'
})
const progress = computed(() => {
  return currentTime.value / currentSong.value.duration
})

function togglePlay() {
  if (!songReady.value) {
    return
  }
  setPlayingState(!playing.value)
}

const modeIcon = computed(() => {
  const map: Record<PLAY_MODE, string> = {
    [PLAY_MODE.sequences]: 'icon-sequence',
    [PLAY_MODE.random]: 'icon-random',
    [PLAY_MODE.loop]: 'icon-loop'
  }
  return map[playMode.value]
})

function onProgressChanging(progress: number) {
  // currentTime.value
}
</script>
<script lang="ts">
export default {
  name: "player-control"
}
</script>
<style scoped lang="scss">
.bottom {
  position: absolute;
  bottom: 50px;
  width: 100%;

  .dot-wrapper {
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      vertical-align: middle;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }

  .progress-wrapper {
    display: flex;
    align-items: center;
    width: 80%;
    margin: 0px auto;
    padding: 10px 0;

    .time {
      color: $color-text;
      font-size: $font-size-small;
      flex: 0 0 40px;
      line-height: 30px;
      width: 40px;

      &.time-l {
        text-align: left;
      }

      &.time-r {
        text-align: right;
      }
    }

    .progress-bar-wrapper {
      flex: 1;
    }
  }

  .operators {
    display: flex;
    align-items: center;

    .icon {
      flex: 1;
      color: $color-theme;

      &.disable {
        color: $color-theme-d;
      }

      i {
        font-size: 30px;
      }
    }

    .i-left {
      text-align: right;
    }

    .i-center {
      padding: 0 20px;
      text-align: center;

      i {
        font-size: 40px;
      }
    }

    .i-right {
      text-align: left
    }

    .icon-favorite {
      color: $color-sub-theme;
    }
  }
}
</style>
