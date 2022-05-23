<template>
  <div class="singer-detail">
    <music-list :songs="songsList" :pic="singer.pic" :title="singer.name"></music-list>
  </div>
</template>
<script lang="ts" setup>
import axios from 'axios'
import { defineProps, onBeforeMount, onMounted, ref } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { processSongs } from '@/api/base'
import MusicList from "@/components/music-list/music-list.vue";
import type { SingerType } from "@/types";
import type { PropType } from 'vue'

const props = defineProps({
  singer: {
    type: Object as PropType<SingerType>,
    default:()=>({})
  }
})
const route = useRoute()
const router = useRouter()
const { mid } = useRoute().params
const songsList = ref<any[]>()
onBeforeMount(()=>{
  if (!props.singer.mid || props.singer.mid !== mid) {
    const path = route.matched[0].path
    router.push(path)
    return
  }
})
onMounted(async () => {
  const res = await axios.get('/api/music/getSingerDetail', { params: { mid } })
  const songs = await processSongs(res.data.result.songs)
  songsList.value = songs
})
</script>
<script lang="ts">
export default {
  name: "singer-detail"
}
</script>
<style scoped lang="scss">
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
