<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { getProductDetail } from '@/api/product'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import type { ProductDetail } from '@/types'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const product = ref<ProductDetail | null>(null)
const images = computed(() => product.value?.images.map((i) => i.image_url) || [product.value?.cover_image || ''])

const specOptions = ['默认', '经典款', '升级款']
const spec = ref('默认')
const quantity = ref(1)
const showPopup = ref(false)

onMounted(async () => {
  const id = Number(route.params.id)
  const res = await getProductDetail(id)
  product.value = res.data
})

function openBuy() {
  if (!userStore.token) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  showPopup.value = true
}

async function confirmAdd() {
  await cartStore.addToCart(product.value!.id, quantity.value, spec.value)
  showPopup.value = false
  showSuccessToast('已加入购物车')
}
</script>

<template>
  <div v-if="product" class="detail-page">
    <van-nav-bar title="商品详情" left-arrow @click-left="router.back()" fixed placeholder />

    <!-- 图片轮播 -->
    <van-swipe class="swipe" :autoplay="3000">
      <van-swipe-item v-for="(img, i) in images" :key="i">
        <img :src="img" class="swipe-img" />
      </van-swipe-item>
    </van-swipe>

    <!-- 价格信息 -->
    <div class="info">
      <div class="price-row">
        <span class="price">¥{{ product.price }}</span>
        <span class="original" v-if="product.original_price">¥{{ product.original_price }}</span>
      </div>
      <h2 class="name">{{ product.name }}</h2>
      <p class="desc">{{ product.description }}</p>
      <div class="meta">
        <span>库存 {{ product.stock }}</span>
        <span>已售 {{ product.sales }}</span>
      </div>
    </div>

    <!-- 规格选择 -->
    <van-cell title="规格" :value="spec" is-link @click="showPopup = true" />
    <van-cell title="数量" :value="String(quantity)" is-link @click="showPopup = true" />

    <!-- 底部操作栏 -->
    <van-goods-action>
      <van-goods-action-icon icon="chat-o" text="客服" />
      <van-goods-action-icon icon="cart-o" text="购物车" @click="router.push('/cart')" />
      <van-goods-action-button type="warning" text="加入购物车" @click="openBuy" />
      <van-goods-action-button type="danger" text="立即购买" @click="openBuy" />
    </van-goods-action>

    <!-- 加购弹窗 -->
    <van-popup v-model:show="showPopup" position="bottom" round>
      <div class="popup">
        <h3>选择规格</h3>
        <div class="spec-list">
          <span
            v-for="s in specOptions"
            :key="s"
            :class="['spec-item', { active: spec === s }]"
            @click="spec = s"
          >{{ s }}</span>
        </div>
        <div class="qty-row">
          <span>数量</span>
          <van-stepper v-model="quantity" min="1" :max="product.stock" />
        </div>
        <van-button type="danger" block round class="confirm-btn" @click="confirmAdd">
          确认加入购物车
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<style scoped>
.detail-page { padding-top: 46px; }
.swipe-img { width: 100%; height: 300px; object-fit: cover; }
.info { background: #fff; padding: 14px; }
.price-row { display: flex; align-items: baseline; }
.price { color: #ee0a24; font-size: 26px; font-weight: bold; }
.original { color: #999; text-decoration: line-through; font-size: 13px; margin-left: 8px; }
.name { font-size: 16px; color: #333; margin: 8px 0; }
.desc { font-size: 13px; color: #999; line-height: 1.6; }
.meta { display: flex; justify-content: space-between; color: #999; font-size: 12px; margin-top: 10px; }
.popup { padding: 20px 16px 30px; }
.spec-list { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
.spec-item { padding: 6px 16px; border: 1px solid #ebedf0; border-radius: 4px; font-size: 13px; }
.spec-item.active { border-color: #ee0a24; color: #ee0a24; }
.qty-row { display: flex; justify-content: space-between; align-items: center; margin: 16px 0; }
.confirm-btn { margin-top: 16px; }
</style>
