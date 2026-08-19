<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { getAddresses } from '@/api/address'
import { createOrder } from '@/api/order'
import { useCartStore } from '@/stores/cart'
import type { Address } from '@/types'

const router = useRouter()
const cartStore = useCartStore()

const addresses = ref<Address[]>([])
const selectedAddress = ref<Address | null>(null)

const items = computed(() => cartStore.checkedItems)
const total = computed(() => cartStore.checkedTotal)

onMounted(async () => {
  await cartStore.fetchCart()
  const res = await getAddresses()
  addresses.value = res.data
  selectedAddress.value = res.data.find((a) => a.is_default === 1) || res.data[0] || null
})

async function onSubmit() {
  if (!selectedAddress.value) {
    showToast('请先选择收货地址')
    return
  }
  const res = await createOrder({
    address_id: selectedAddress.value.id,
    cart_item_ids: cartStore.checkedItems.map((i) => i.id)
  })
  await cartStore.fetchCart()
  showToast('下单成功，请尽快支付')
  router.replace(`/orders`)
}
</script>

<template>
  <div class="order-page">
    <van-nav-bar title="确认订单" left-arrow @click-left="router.back()" fixed placeholder />

    <!-- 收货地址 -->
    <div class="address-card" @click="router.push('/address')">
      <template v-if="selectedAddress">
        <div class="addr-name">
          <span class="name">{{ selectedAddress.name }}</span>
          <span class="phone">{{ selectedAddress.phone }}</span>
          <van-tag v-if="selectedAddress.is_default === 1" type="danger">默认</van-tag>
        </div>
        <div class="addr-detail">
          {{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}
        </div>
      </template>
      <div v-else class="no-addr">请添加收货地址 →</div>
    </div>

    <!-- 商品清单 -->
    <div class="goods-list">
      <div class="goods-item" v-for="item in items" :key="item.id">
        <img :src="item.product.cover_image" class="goods-img" />
        <div class="goods-info">
          <div class="goods-name">{{ item.product.name }}</div>
          <div class="goods-price">¥{{ item.product.price }} × {{ item.quantity }}</div>
        </div>
      </div>
    </div>

    <!-- 提交栏 -->
    <van-submit-bar :price="total * 100" button-text="提交订单" @submit="onSubmit">
      <span>合计：</span>
    </van-submit-bar>
  </div>
</template>

<style scoped>
.order-page { padding-bottom: 60px; }
.address-card { background: #fff; padding: 14px; margin: 10px; border-radius: 8px; }
.addr-name { display: flex; align-items: center; gap: 8px; }
.name { font-size: 16px; font-weight: bold; }
.phone { color: #666; }
.addr-detail { color: #999; font-size: 13px; margin-top: 8px; }
.no-addr { color: #ee0a24; }
.goods-list { background: #fff; margin: 10px; border-radius: 8px; padding: 10px; }
.goods-item { display: flex; padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
.goods-item:last-child { border-bottom: none; }
.goods-img { width: 60px; height: 60px; border-radius: 6px; object-fit: cover; margin-right: 10px; }
.goods-info { flex: 1; }
.goods-name { font-size: 14px; color: #333; }
.goods-price { color: #ee0a24; font-size: 13px; margin-top: 8px; }
</style>
