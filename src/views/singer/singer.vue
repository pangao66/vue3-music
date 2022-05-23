<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers" @select="selectSinger"></index-list>
    <router-view v-slot="{Component}">
      <transition appear name="slide">
        <component :singer="singer"  :is="Component"></component>
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts" setup async>
import axios from 'axios'
import { onMounted, ref } from "vue";
import IndexList from "@/components/base/index-list/index-list.vue";
import type { SingerGroup, SingerType } from "@/types";
import { useRouter } from 'vue-router'
import { useSessionStorage } from '@vueuse/core'

const singers = ref<SingerGroup[]>([])
const singer = useSessionStorage<SingerType>('__singer__', {} as SingerType )
const router = useRouter()
onMounted(async () => {
  const { data: { result } } = await axios.get('/api/music/getSingerList')
  singers.value = result.singers
})
const selectSinger = (item: SingerType) => {
  singer.value = item
  router.push({
    path: `/singer/${item.mid}`
  })
}
</script>
<script lang="ts">
export default {
  name: "t-singer"
}
</script>
<style scoped lang="scss">
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
