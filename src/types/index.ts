export interface SingerType {
  id: number
  mid: string
  name: string
  pic: string
}

export interface SingerGroup {
  title: string
  group: SingerType[]
}

export interface SongType {
  id: number
  mid: string
  name: string
  singer: string
  url: string
  duration: number
  pic: string
  album: string
}
