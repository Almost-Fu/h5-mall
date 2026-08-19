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
.app-container {
  padding-bottom: calc(50px + env(safe-area-inset-bottom));
}
</style>
