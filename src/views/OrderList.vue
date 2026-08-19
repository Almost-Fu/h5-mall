<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { getOrders, payOrder, cancelOrder } from '@/api/order'
import type { Order } from '@/types'

const router = useRouter()
const orders = ref<Order[]>([])
const active = ref('all')

const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '待支付', value: 'pending' },
  { label: '已支付', value: 'paid' },
  { label: '已取消', value: 'cancelled' },
  { label: '已完成', value: 'completed' }
]

const statusText: Record<string, string> = {
  pending: '待支付',
  paid: '已支付',
  cancelled: '已取消',
  completed: '已完成'
}

const statusType: Record<string, string> = {
  pending: 'warning',
  paid: 'success',
  cancelled: 'default',
  completed: 'primary'
}

async function loadOrders() {
  const res = await getOrders(active.value === 'all' ? undefined : active.value)
  orders.value = res.data
}

function onTabChange() {
  loadOrders()
}

async function onPay(order: Order) {
  await payOrder(order.id)
  showToast('支付成功')
  loadOrders()
}

async function onCancel(order: Order) {
  await showConfirmDialog({ title: '提示', message: '确定取消该订单吗？' })
  await cancelOrder(order.id)
  showToast('订单已取消')
  loadOrders()
}

onMounted(loadOrders)
</script>

<template>
  <div class="order-list-page">
    <van-nav-bar title="我的订单" left-arrow @click-left="router.back()" fixed placeholder />

    <van-tabs v-model:active="active" @change="onTabChange">
      <van-tab v-for="t in statusTabs" :key="t.value" :title="t.label" :name="t.value" />
    </van-tabs>

    <div class="order-card" v-for="order in orders" :key="order.id">
      <div class="order-head">
        <span class="order-no">订单号：{{ order.order_no }}</span>
        <van-tag :type="statusType[order.status] as any">{{ statusText[order.status] }}</van-tag>
      </div>
      <div class="order-items">
        <div class="order-item" v-for="item in order.items" :key="item.id">
          <img :src="item.cover_image" class="item-img" />
          <div class="item-info">
            <div class="item-name">{{ item.product_name }}</div>
            <div class="item-sub">¥{{ item.price }} × {{ item.quantity }}</div>
          </div>
        </div>
      </div>
      <div class="order-foot">
        <span class="total">合计：<b>¥{{ order.total_amount }}</b></span>
        <div class="actions">
          <van-button v-if="order.status === 'pending'" size="small" @click="onCancel(order)">取消</van-button>
          <van-button v-if="order.status === 'pending'" size="small" type="danger" @click="onPay(order)">立即支付</van-button>
        </div>
      </div>
    </div>

    <van-empty v-if="orders.length === 0" description="暂无订单" />
  </div>
</template>

<style scoped>
.order-list-page { background: #f7f8fa; min-height: 100vh; }
.order-card { background: #fff; margin: 10px; border-radius: 8px; overflow: hidden; }
.order-head { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #f5f5f5; }
.order-no { font-size: 12px; color: #999; }
.order-items { padding: 0 12px; }
.order-item { display: flex; padding: 10px 0; border-bottom: 1px solid #f5f5f5; }
.item-img { width: 60px; height: 60px; border-radius: 6px; object-fit: cover; margin-right: 10px; }
.item-info { flex: 1; }
.item-name { font-size: 14px; color: #333; }
.item-sub { font-size: 12px; color: #999; margin-top: 6px; }
.order-foot { display: flex; justify-content: space-between; align-items: center; padding: 12px; }
.total { font-size: 13px; color: #333; }
.total b { color: #ee0a24; font-size: 15px; }
.actions { display: flex; gap: 8px; }
</style>
