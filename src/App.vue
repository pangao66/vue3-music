<script setup lang="ts">
import MHeader from './components/header/header.vue'
import Tab from './components/tab/tab.vue'
import Player from "@/components/player/player.vue";
</script>
<template>
  <m-header></m-header>
  <tab></tab>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"/>
    </keep-alive>
  </router-view>
  <player></player>
</template>
<style lang="scss">
//@import url('./assets/scss/index.scss');
</style>
