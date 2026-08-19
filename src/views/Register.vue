<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { register } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = ref({ username: '', password: '', confirm: '', nickname: '' })
const loading = ref(false)

async function onSubmit() {
  if (!form.value.username || !form.value.password) {
    showToast('请输入用户名和密码')
    return
  }
  if (form.value.password.length < 6) {
    showToast('密码至少6位')
    return
  }
  if (form.value.password !== form.value.confirm) {
    showToast('两次密码不一致')
    return
  }
  loading.value = true
  try {
    const res = await register({
      username: form.value.username,
      password: form.value.password,
      nickname: form.value.nickname || form.value.username
    })
    userStore.setLogin(res.data)
    showToast('注册成功')
    router.replace('/home')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <van-nav-bar title="注册" left-arrow @click-left="router.back()" fixed placeholder />
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field v-model="form.username" label="用户名" placeholder="请输入用户名" />
        <van-field v-model="form.nickname" label="昵称" placeholder="请输入昵称（可选）" />
        <van-field v-model="form.password" type="password" label="密码" placeholder="至少6位" />
        <van-field v-model="form.confirm" type="password" label="确认密码" placeholder="再次输入密码" />
      </van-cell-group>
      <div class="submit-btn">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          注 册
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style scoped>
.auth-page { padding-top: 46px; }
.submit-btn { margin: 30px 16px; }
</style>
