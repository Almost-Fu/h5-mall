<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'
import { getAddresses, deleteAddress, updateAddress } from '@/api/address'
import type { Address } from '@/types'

const router = useRouter()
const addresses = ref<Address[]>([])

async function load() {
  const res = await getAddresses()
  addresses.value = res.data
}

async function onDelete(addr: Address) {
  await showConfirmDialog({ title: '提示', message: '确定删除该地址吗？' })
  await deleteAddress(addr.id)
  showToast('已删除')
  load()
}

async function onSetDefault(addr: Address) {
  await updateAddress(addr.id, { ...addr, is_default: 1 })
  showToast('已设为默认')
  load()
}

function goEdit(addr?: Address) {
  router.push({ path: '/address/edit', query: addr ? { id: addr.id } : {} })
}

onMounted(load)
</script>

<template>
  <div class="address-page">
    <van-nav-bar title="收货地址" left-arrow @click-left="router.back()" fixed placeholder />

    <van-address-list
      :list="addresses.map(a => ({
        id: String(a.id),
        name: a.name,
        tel: a.phone,
        address: `${a.province}${a.city}${a.district}${a.detail}`,
        isDefault: a.is_default === 1
      }))"
      default-tag-text="默认"
      @add="goEdit()"
      @edit="(item: any) => goEdit(addresses.find(a => String(a.id) === item.id))"
    />

    <van-empty v-if="addresses.length === 0" description="暂无地址，点击右上角添加" />
  </div>
</template>

<style scoped>
.address-page { min-height: 100vh; }
</style>
