import type { Ref } from "vue";

export interface PlayerContext {
  audioRef: Ref<HTMLAudioElement>

  prev(): void

  next(): void
  songReady:Ref<boolean>
  currentTime:Ref<number>
  setCurrentTime(time:number):void
}
