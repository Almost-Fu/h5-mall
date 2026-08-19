<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

onMounted(() => {
  if (userStore.token) {
    cartStore.fetchCart()
  }
})

const allChecked = computed(() =>
  cartStore.items.length > 0 && cartStore.checkedIds.length === cartStore.items.length
)

function onToggleAll(checked: boolean) {
  cartStore.toggleAll(checked)
}

async function onRemove(id: number) {
  await showConfirmDialog({ title: '提示', message: '确定删除该商品吗？' })
  await cartStore.removeItem(id)
  showToast('已删除')
}

function goCheckout() {
  if (cartStore.checkedItems.length === 0) {
    showToast('请先选择商品')
    return
  }
  router.push('/order/confirm')
}
</script>

<template>
  <div class="cart-page">
    <van-nav-bar title="购物车" fixed placeholder />

    <template v-if="userStore.token">
      <!-- 购物车列表 -->
      <van-swipe-cell v-for="item in cartStore.items" :key="item.id">
        <div class="cart-item">
          <van-checkbox
            :model-value="cartStore.checkedIds.includes(item.id)"
            @update:model-value="cartStore.toggleCheck(item.id)"
          />
          <img :src="item.product.cover_image" class="item-img" @click="router.push(`/product/${item.product_id}`)" />
          <div class="item-info">
            <div class="item-name">{{ item.product.name }}</div>
            <div class="item-spec" v-if="item.spec">{{ item.spec }}</div>
            <div class="item-bottom">
              <span class="item-price">¥{{ item.product.price }}</span>
              <van-stepper
                :model-value="item.quantity"
                min="1"
                @change="(v: number) => cartStore.updateQuantity(item.id, v)"
              />
            </div>
          </div>
        </div>
        <template #right>
          <van-button square type="danger" text="删除" class="delete-btn" @click="onRemove(item.id)" />
        </template>
      </van-swipe-cell>

      <van-empty v-if="cartStore.items.length === 0" description="购物车空空如也" />

      <!-- 结算栏 -->
      <van-submit-bar
        v-if="cartStore.items.length > 0"
        :price="cartStore.checkedTotal * 100"
        button-text="去结算"
        @submit="goCheckout"
      >
        <van-checkbox :model-value="allChecked" @update:model-value="onToggleAll">全选</van-checkbox>
        <span class="count">共{{ cartStore.checkedItems.length }}件</span>
      </van-submit-bar>
    </template>

    <!-- 未登录提示 -->
    <template v-else>
      <van-empty description="登录后查看购物车">
        <van-button round type="primary" class="login-btn" @click="router.push('/login')">
          去登录
        </van-button>
      </van-empty>
    </template>
  </div>
</template>

<style scoped>
.cart-page { min-height: 100vh; padding-bottom: 60px; }
.cart-item { display: flex; align-items: center; padding: 12px; background: #fff; margin-bottom: 1px; }
.item-img { width: 80px; height: 80px; border-radius: 6px; margin: 0 10px; object-fit: cover; }
.item-info { flex: 1; }
.item-name { font-size: 14px; color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.item-spec { font-size: 12px; color: #999; margin: 4px 0; }
.item-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
.item-price { color: #ee0a24; font-weight: bold; }
.delete-btn { height: 100%; }
.count { margin-left: 8px; color: #666; font-size: 13px; }
.login-btn { width: 120px; }
</style>
