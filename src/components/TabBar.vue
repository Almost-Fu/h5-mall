<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const tabs = [
  { name: '首页', path: '/home', icon: 'home-o' },
  { name: '分类', path: '/category', icon: 'apps-o' },
  { name: '购物车', path: '/cart', icon: 'shopping-cart-o' },
  { name: '我的', path: '/mine', icon: 'user-o' }
]

const active = computed(() => route.path)
</script>

<template>
  <van-tabbar :model-value="active" @change="(v: string | number) => router.push(v as string)" fixed>
    <van-tabbar-item v-for="t in tabs" :key="t.path" :name="t.path" :icon="t.icon">
      {{ t.name }}
    </van-tabbar-item>
  </van-tabbar>
</template>
