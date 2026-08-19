<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCategories } from '@/api/product'
import type { Category } from '@/types'

const router = useRouter()
const categories = ref<Category[]>([])
const active = ref(0)

onMounted(async () => {
  const res = await getCategories()
  categories.value = res.data
})

function goProducts(id: number) {
  router.push({ path: '/products', query: { category_id: id } })
}
</script>

<template>
  <div class="category-page">
    <van-nav-bar title="分类" fixed placeholder />
    <div class="category-body">
      <van-sidebar v-model="active" class="sidebar">
        <van-sidebar-item
          v-for="c in categories"
          :key="c.id"
          :title="c.name"
          @click="goProducts(c.id)"
        />
      </van-sidebar>
      <div class="content" @click="goProducts(categories[active]?.id || 1)">
        <div class="big-icon">{{ categories[active]?.icon || '🛍️' }}</div>
        <p class="tip">{{ categories[active]?.name || '' }}，点击查看全部商品 →</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-body { display: flex; height: calc(100vh - 96px); }
.sidebar { width: 90px; }
.content { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fff; }
.big-icon { width: 96px; height: 96px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; font-size: 48px; }
.tip { margin-top: 16px; color: #999; font-size: 13px; }
</style>
