<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCategories, getProducts } from '@/api/product'
import type { Category, Product } from '@/types'

const router = useRouter()
const categories = ref<Category[]>([])
const active = ref(0)
const products = ref<Product[]>([])
const loading = ref(false)

// 加载当前选中分类下的商品
async function loadProducts() {
  const c = categories.value[active.value]
  if (!c) return
  loading.value = true
  try {
    const res = await getProducts({ category_id: c.id, page: 1, page_size: 100 })
    products.value = res.data.list
  } finally {
    loading.value = false
  }
}

function goDetail(id: number) {
  router.push(`/product/${id}`)
}

onMounted(async () => {
  const res = await getCategories()
  categories.value = res.data
  await loadProducts()
})

// 切换分类时重新加载商品
watch(active, () => {
  loadProducts()
})
</script>

<template>
  <div class="category-page">
    <van-nav-bar title="分类" fixed placeholder />
    <div class="category-body">
      <!-- 左侧分类 -->
      <van-sidebar v-model="active" class="sidebar">
        <van-sidebar-item
          v-for="c in categories"
          :key="c.id"
          :title="c.name"
        />
      </van-sidebar>

      <!-- 右侧商品 -->
      <div class="content">
        <van-loading v-if="loading" class="loading" color="#ee0a24" />
        <template v-else>
          <div
            v-for="p in products"
            :key="p.id"
            class="product-cell"
            @click="goDetail(p.id)"
          >
            <img class="thumb" :src="p.cover_image" alt="" />
            <div class="info">
              <div class="name">{{ p.name }}</div>
              <div class="price-row">
                <span class="price">¥{{ p.price }}</span>
                <span class="sales">已售{{ p.sales }}</span>
              </div>
            </div>
          </div>
          <van-empty
            v-if="products.length === 0"
            description="该分类暂无商品"
            image-size="80"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-body {
  display: flex;
  height: calc(100vh - 46px);
  padding-bottom: 50px;
}
.sidebar {
  width: 90px;
  flex-shrink: 0;
}
.content {
  flex: 1;
  background: #fff;
  overflow-y: auto;
  padding: 8px;
}
.loading {
  display: flex;
  justify-content: center;
  padding-top: 60px;
}
.product-cell {
  display: flex;
  padding: 10px;
  border-radius: 8px;
  background: #fff;
}
.product-cell:active {
  background: #f7f8fa;
}
.thumb {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}
.info {
  flex: 1;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.name {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.price-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.price {
  color: #ee0a24;
  font-size: 16px;
  font-weight: bold;
}
.sales {
  font-size: 12px;
  color: #999;
}
</style>
