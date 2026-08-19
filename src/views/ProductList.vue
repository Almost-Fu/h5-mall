<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProducts, getCategories } from '@/api/product'
import type { Product, Category } from '@/types'

const route = useRoute()
const router = useRouter()

const keyword = ref((route.query.keyword as string) || '')
const categoryId = ref(route.query.category_id ? Number(route.query.category_id) : undefined)
const sort = ref('default')
const page = ref(1)
const pageSize = 10
const total = ref(0)
const list = ref<Product[]>([])
const loading = ref(false)
const finished = ref(false)
const categories = ref<Category[]>([])

const sortOptions = [
  { label: '综合', value: 'default' },
  { label: '销量', value: 'sales' },
  { label: '价格↑', value: 'price_asc' },
  { label: '价格↓', value: 'price_desc' }
]

async function loadData(reset = false) {
  if (reset) {
    page.value = 1
    list.value = []
    finished.value = false
  }
  loading.value = true
  try {
    const res = await getProducts({
      keyword: keyword.value || undefined,
      category_id: categoryId.value,
      sort: sort.value === 'default' ? undefined : sort.value,
      page: page.value,
      page_size: pageSize
    })
    total.value = res.data.total
    list.value = reset ? res.data.list : [...list.value, ...res.data.list]
    if (list.value.length >= total.value) finished.value = true
  } finally {
    loading.value = false
  }
}

function onSearch() {
  loadData(true)
}

function onSortChange() {
  loadData(true)
}

function onLoad() {
  page.value += 1
  loadData()
}

function goDetail(id: number) {
  router.push(`/product/${id}`)
}

onMounted(async () => {
  const catRes = await getCategories()
  categories.value = catRes.data
  loadData(true)
})
</script>

<template>
  <div class="list-page">
    <van-nav-bar title="商品列表" left-arrow @click-left="router.back()" fixed placeholder />

    <!-- 搜索栏 -->
    <van-search v-model="keyword" placeholder="搜索商品" shape="round" @search="onSearch" />

    <!-- 分类筛选 -->
    <div class="filter-row">
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="categoryId"
          :options="categories.map(c => ({ text: c.name, value: c.id }))"
          title="分类"
          @change="onSortChange"
        />
      </van-dropdown-menu>
      <div class="sort-tabs">
        <span
          v-for="s in sortOptions"
          :key="s.value"
          :class="['sort-item', { active: sort === s.value }]"
          @click="sort = s.value; onSortChange()"
        >{{ s.label }}</span>
      </div>
    </div>

    <!-- 商品列表 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-card
        v-for="p in list"
        :key="p.id"
        :price="p.price"
        :title="p.name"
        :thumb="p.cover_image"
        :origin-price="p.original_price"
        @click="goDetail(p.id)"
      >
        <template #tags>
          <van-tag plain type="danger" v-if="p.is_hot === 1">热销</van-tag>
        </template>
        <template #footer>
          <span class="sales">已售{{ p.sales }}</span>
        </template>
      </van-card>
    </van-list>

    <!-- 空状态 -->
    <van-empty v-if="!loading && list.length === 0" description="暂无商品" />
  </div>
</template>

<style scoped>
.list-page { min-height: 100vh; }
.filter-row { display: flex; align-items: center; background: #fff; border-bottom: 1px solid #f0f0f0; }
.sort-tabs { display: flex; flex: 1; justify-content: space-around; padding: 10px 0; }
.sort-item { font-size: 13px; color: #666; }
.sort-item.active { color: #ee0a24; font-weight: bold; }
.sales { color: #999; font-size: 12px; }
</style>
