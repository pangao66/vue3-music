<template>
  <div class="player">
    <div class="normal-player" v-show="fullscreen">
      <div class="background">
        <img :src="currentSong.pic" alt="">
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
      <player-control></player-control>
    </div>
    <!--非用户主动触发pause,电脑待机等系统触发-->
    <audio ref="audioRef" @pause="pause" @canplay="canPlay" @error="onError" @timeupdate="updateTime"></audio>
  </div>
</template>
<script lang="ts" setup>
import { usePlayerStore } from '@/stores/player'
import { storeToRefs } from "pinia";
import { ref, watch, provide } from "vue";
import PlayerControl from "@/components/player/components/player-control.vue";
import { playerSymbolKey } from "@/components/player/utils";


const audioRef = ref<HTMLAudioElement>(undefined as unknown as HTMLAudioElement)
const songReady = ref(false)
const { fullscreen, currentSong, playing, currentIndex, playList } = storeToRefs(usePlayerStore())
const { setFullScreen, setPlayingState, setCurrentIndex, } = usePlayerStore()
watch(currentSong, (newSong) => {
  if (!newSong.id || !newSong.url) {
    return
  }
  songReady.value = false
  const audioEL = audioRef.value!;
  audioEL.src = newSong.url
  setPlayingState(true)
})
watch(playing, (newPlaying) => {
  const audioEL = audioRef.value!;
  if (newPlaying) {
    play()
  } else {
    audioEL.pause()
  }
},)

function prev() {
  // 如果当前是第一首歌,索引为0 则上一曲为playlist最后一首歌,如果列表只有一首歌则单曲循环
  if (playList.value.length === 1) {
    loop()
    return
  }
  if (currentIndex.value === 0) {
    setCurrentIndex(playList.value.length - 1)
  } else {
    setCurrentIndex(currentIndex.value - 1)
  }
  setPlayingState(true)
}

function next() {
  // 如果当前是最后一首歌,则下一曲为第一首歌
  if (playList.value.length === 1) {
    loop()
    return
  }
  if (currentIndex.value === playList.value.length) {
    setCurrentIndex(0)
  } else {
    setCurrentIndex(currentIndex.value + 1)
  }
  setPlayingState(true)
}

function loop() {
  const audioEl = audioRef.value!
  audioEl.currentTime = 0
  audioEl.play()
}

function canPlay() {
  if (songReady.value) {
    return
  }
  songReady.value = true
  play()
}

function onError() {
  songReady.value = true
}

function play() {
  if (!songReady.value) {
    return
  }
  const audioEl = audioRef.value!
  audioEl.play()
}


function goBack() {
  setFullScreen(false)
}

function pause() {
  setPlayingState(false)
}

//  播放时间控制
const currentTime = ref(0)

// 更新时间
function updateTime(e: Event) {
  currentTime.value = (e.target as HTMLAudioElement).currentTime
}

function setCurrentTime(time: number) {
  currentTime.value = time
}

provide(playerSymbolKey, {
  audioRef,
  prev,
  next,
  songReady,
  currentTime,
  setCurrentTime
})
</script>
<script lang="ts">
export default {
  name: "player"
}
</script>
<style scoped lang="scss">
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }

      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }

            .playing {
              animation: rotate 20s linear infinite
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }

          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }


    &.normal-enter-active, &.normal-leave-active {
      transition: all .6s;

      .top, .bottom {
        transition: all .6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }

    &.normal-enter-from, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0)
      }
    }
  }
}
</style>
