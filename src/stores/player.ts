import { defineStore } from 'pinia'
import { PLAY_MODE } from "@/assets/common/constant";
import type { SongType } from "@/types";
import { shuffle } from 'lodash-es'
interface PlayerStore {
  sequenceList: SongType[]
  playList: SongType[]
  playing: boolean
  playMode: PLAY_MODE
  currentIndex: number
  fullscreen: boolean
}

export const usePlayerStore = defineStore({
  id: 'player',
  state: (): PlayerStore => ({
    // 播放列表
    sequenceList: [],
    // 真正的播放列表 (随着播放模式切换的)
    playList: [],
    playing: false,
    playMode: PLAY_MODE.sequences,
    currentIndex: 0,
    fullscreen: false,
  }),
  getters: {
    currentSong: (state): SongType => state.playList[state.currentIndex] || {}
  },
  actions: {
    setPlayingState(playing: boolean) {
      this.playing = playing
    },
    setSequenceList(list: SongType[]) {
      this.sequenceList = list
    },
    setPlayList(list: SongType[]) {
      this.playList = list
    },
    setPlayMode(mode: PLAY_MODE) {
      this.playMode = mode
    },
    setCurrentIndex(index: number) {
      this.currentIndex = index
    },
    setFullScreen(fullscreen: boolean) {
      this.fullscreen = fullscreen
    },
    selectPlay({ list, index }: { index: number, list: SongType[] }) {
      this.playMode = PLAY_MODE.sequences
      this.sequenceList = list
      this.playList = list
      this.playing = true
      this.fullscreen = true
      this.currentIndex = index
    },
    randomPlay(list: SongType[]) {
      this.playMode = PLAY_MODE.random
      this.sequenceList = list
      this.playList = shuffle(list)
      this.playing = true
      this.fullscreen = true
      this.currentIndex = 0
    },
    changeMode() {
      const mode = (this.playMode + 1) % 3
      const currentId = this.currentSong.id
      if (mode === PLAY_MODE.random) {
        this.setPlayList(shuffle(this.sequenceList))
      } else {
        this.setPlayList(this.sequenceList)
      }
      const index = this.playList.findIndex(item => item.id === currentId)
      this.setCurrentIndex(index)
      this.setPlayMode(mode)
    },
    // toggleFavorite(song:SongType){
    // }
  }
})
