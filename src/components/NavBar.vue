<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{ title: string; leftText?: string }>()
const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <van-nav-bar :title="title" left-arrow @click-left="goBack" fixed placeholder>
    <template #left>
      <span v-if="leftText">{{ leftText }}</span>
    </template>
  </van-nav-bar>
</template>
