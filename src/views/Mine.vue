<script setup lang="ts">
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

async function onLogout() {
  await showConfirmDialog({ title: '提示', message: '确定退出登录吗？' })
  userStore.logout()
  showToast('已退出登录')
  router.replace('/home')
}
</script>

<template>
  <div class="mine-page">
    <!-- 用户信息 -->
    <div class="user-card" @click="userStore.token ? null : router.push('/login')">
      <van-image round width="60" height="60" :src="userStore.user?.avatar || 'https://picsum.photos/seed/avatar/60/60'" />
      <div class="user-info">
        <template v-if="userStore.token && userStore.user">
          <div class="nickname">{{ userStore.user.nickname || userStore.user.username }}</div>
          <div class="username">@{{ userStore.user.username }}</div>
        </template>
        <template v-else>
          <div class="nickname">未登录</div>
          <div class="username">点击登录</div>
        </template>
      </div>
    </div>

    <!-- 我的订单 -->
    <van-cell-group inset class="group">
      <van-cell title="我的订单" is-link @click="router.push('/orders')" />
    </van-cell-group>

    <!-- 收货地址 -->
    <van-cell-group inset class="group">
      <van-cell title="收货地址管理" is-link @click="router.push('/address')" />
    </van-cell-group>

    <!-- 退出登录 -->
    <div v-if="userStore.token" class="logout-btn">
      <van-button block round type="danger" @click="onLogout">退出登录</van-button>
    </div>
  </div>
</template>

<style scoped>
.mine-page { min-height: 100vh; background: #f7f8fa; padding-top: 10px; }
.user-card { display: flex; align-items: center; padding: 24px 16px; background: linear-gradient(135deg, #1989fa, #07c160); margin: 10px; border-radius: 12px; }
.user-info { margin-left: 14px; }
.nickname { font-size: 18px; color: #fff; font-weight: bold; }
.username { font-size: 13px; color: rgba(255,255,255,0.8); margin-top: 4px; }
.group { margin-top: 10px; }
.logout-btn { margin: 30px 16px; }
</style>
