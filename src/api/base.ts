import axios from 'axios'

export const getHotSingerApi = () => axios.get('/api/music/getHotSingerList')
export const processSongs = (songs: any[]) => {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return axios.get('/api/music/getSongsUrl', {
    params: {
      mid: songs.map((item: any) => item.mid)
    }
  }).then((response) => {
    const map = response.data.result.map
    return songs.map((song) => {
      song.url = map[song.mid]
      return song
    }).filter((song) => {
      return song.url.indexOf('vkey') > -1
    })
  })
}
