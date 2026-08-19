<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { login } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = ref({ username: '', password: '' })
const loading = ref(false)

async function onSubmit() {
  if (!form.value.username || !form.value.password) {
    showToast('请输入用户名和密码')
    return
  }
  loading.value = true
  try {
    const res = await login(form.value)
    userStore.setLogin(res.data)
    showToast('登录成功')
    const redirect = (route.query.redirect as string) || '/home'
    router.replace(redirect)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-header">
      <h1>H5商城</h1>
      <p>欢迎回来，请登录</p>
    </div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field v-model="form.username" label="用户名" placeholder="请输入用户名" />
        <van-field v-model="form.password" type="password" label="密码" placeholder="请输入密码" />
      </van-cell-group>
      <div class="submit-btn">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          登 录
        </van-button>
      </div>
    </van-form>
    <div class="link" @click="router.push('/register')">没有账号？去注册</div>
  </div>
</template>

<style scoped>
.auth-page { padding-top: 60px; }
.auth-header { text-align: center; margin-bottom: 40px; }
.auth-header h1 { font-size: 28px; color: #333; }
.auth-header p { color: #999; margin-top: 8px; font-size: 14px; }
.submit-btn { margin: 30px 16px; }
.link { text-align: center; color: #1989fa; font-size: 14px; margin-top: 20px; }
</style>
