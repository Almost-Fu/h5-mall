<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCategories, getProducts } from '@/api/product'
import { makeBanner } from '@/mock/data'
import type { Category, Product } from '@/types'

const router = useRouter()
const categories = ref<Category[]>([])
const hotProducts = ref<Product[]>([])
const banners = [
  makeBanner('新品首发', 'iPhone 15 Pro Max 钛金属', '#667eea', '#764ba2'),
  makeBanner('限时特惠', '全场爆款低至 5 折起', '#f83600', '#f9d423'),
  makeBanner('品质家居', '提升你的生活质感', '#43e97b', '#38f9d7')
]

onMounted(async () => {
  const [catRes, prodRes] = await Promise.all([
    getCategories(),
    getProducts({ page: 1, page_size: 10, sort: 'sales' })
  ])
  categories.value = catRes.data
  hotProducts.value = prodRes.data.list.filter((p) => p.is_hot === 1).slice(0, 6)
})

function goCategory(id: number) {
  router.push({ path: '/products', query: { category_id: id } })
}

function goDetail(id: number) {
  router.push(`/product/${id}`)
}
</script>

<template>
  <div class="home">
    <!-- 搜索栏 -->
    <van-search
      placeholder="搜索商品"
      shape="round"
      @click="$router.push({ path: '/products', query: { focus: 1 } })"
    />

    <!-- 轮播图 -->
    <van-swipe class="banner" :autoplay="3000" lazy-render>
      <van-swipe-item v-for="(b, i) in banners" :key="i">
        <img :src="b" class="banner-img" />
      </van-swipe-item>
    </van-swipe>

    <!-- 分类宫格 -->
    <van-grid :column-num="4" :border="false" class="grid">
      <van-grid-item v-for="c in categories" :key="c.id" @click="goCategory(c.id)">
        <span class="cat-icon">{{ c.icon }}</span>
        <span class="cat-name">{{ c.name }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 热销商品 -->
    <div class="section-title">
      <span class="line"></span>
      <span>🔥 热销推荐</span>
    </div>
    <div class="product-grid">
      <div class="product-card" v-for="p in hotProducts" :key="p.id" @click="goDetail(p.id)">
        <img :src="p.cover_image" class="product-img" />
        <div class="product-name">{{ p.name }}</div>
        <div class="product-bottom">
          <span class="price">¥{{ p.price }}</span>
          <span class="sales">已售{{ p.sales }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner { margin: 0 10px; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); }
.banner-img { width: 100%; height: 150px; display: block; object-fit: cover; }
.grid { margin: 10px 0 0; background: #fff; padding: 8px 0; }
.cat-icon { font-size: 26px; line-height: 1; }
.cat-name { font-size: 12px; color: #323233; margin-top: 6px; }
.section-title { display: flex; align-items: center; justify-content: center; margin: 20px 0 10px; font-size: 16px; font-weight: bold; color: #333; }
.line { width: 24px; height: 2px; background: #ee0a24; margin: 0 8px; }
.product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 10px; }
.product-card { background: #fff; border-radius: 8px; overflow: hidden; padding-bottom: 10px; }
.product-img { width: 100%; height: 160px; object-fit: cover; }
.product-name { font-size: 13px; color: #333; padding: 6px 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.product-bottom { display: flex; justify-content: space-between; align-items: center; padding: 0 8px; }
.price { color: #ee0a24; font-weight: bold; font-size: 15px; }
.sales { color: #999; font-size: 11px; }
</style>
