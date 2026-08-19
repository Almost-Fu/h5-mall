<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import TabBar from '@/components/TabBar.vue'

const route = useRoute()
const showTabBar = computed(() => !!route.meta.tab)
</script>

<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <TabBar v-if="showTabBar" />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background-color: #f7f8fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
.app-container {
  padding-bottom: 50px;
}
</style>
