import { defineStore } from 'pinia'
import type { RemovableRef } from "@vueuse/shared";
import type { SongType } from "@/types";
import {  useLocalStorage } from "@vueuse/core";

interface FavoriteStoreState {
  favoriteList: RemovableRef<SongType[]>
}

export const useFavoriteStore = defineStore({
  id: 'favorite',
  state: (): FavoriteStoreState => {
    return {
      favoriteList: useLocalStorage('__favorite__', [])
    }
  },
  actions: {
    setFavoriteList(list: SongType[]) {
      this.favoriteList = list
    },
    isFavorite(song: SongType) {
      return this.favoriteList.findIndex((item) => item.id === song.id) > -1
    },
    toggleFavorite(song: SongType) {
      const index = this.favoriteList.findIndex((item) => item.id === song.id)
      if (index > -1) {
        this.favoriteList.splice(index, 1)
      } else {
        if (this.favoriteList.length >= 100) {
          this.favoriteList.shift()
        }
        this.favoriteList.push(song)
      }
    }
  }
})
