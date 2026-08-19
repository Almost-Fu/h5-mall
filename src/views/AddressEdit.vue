<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { addAddress, updateAddress, getAddresses } from '@/api/address'

const route = useRoute()
const router = useRouter()

const form = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  is_default: 0
})
const editId = ref<number | null>(route.query.id ? Number(route.query.id) : null)

onMounted(async () => {
  if (editId.value) {
    const res = await getAddresses()
    const addr = res.data.find((a) => a.id === editId.value)
    if (addr) {
      form.value = { ...addr }
    }
  }
})

async function onSave() {
  if (!form.value.name) return showToast('请输入收货人姓名')
  if (!/^1\d{10}$/.test(form.value.phone)) return showToast('请输入正确的手机号')
  if (!form.value.detail) return showToast('请输入详细地址')
  if (editId.value) {
    await updateAddress(editId.value, form.value)
    showToast('修改成功')
  } else {
    await addAddress(form.value)
    showToast('添加成功')
  }
  router.back()
}
</script>

<template>
  <div class="addr-edit-page">
    <van-nav-bar :title="editId ? '编辑地址' : '新增地址'" left-arrow @click-left="router.back()" fixed placeholder />

    <van-form @submit="onSave">
      <van-cell-group inset>
        <van-field v-model="form.name" label="收货人" placeholder="请输入姓名" />
        <van-field v-model="form.phone" label="手机号" placeholder="请输入11位手机号" maxlength="11" />
        <van-field v-model="form.province" label="省份" placeholder="如：广东省" />
        <van-field v-model="form.city" label="城市" placeholder="如：深圳市" />
        <van-field v-model="form.district" label="区县" placeholder="如：南山区" />
        <van-field v-model="form.detail" label="详细地址" type="textarea" rows="2" placeholder="街道、门牌号等" />
      </van-cell-group>
      <van-cell-group inset class="default-group">
        <van-cell title="设为默认地址">
          <template #right-icon>
            <van-switch :model-value="form.is_default === 1" @update:model-value="(v: any) => form.is_default = v ? 1 : 0" />
          </template>
        </van-cell>
      </van-cell-group>
      <div class="save-btn">
        <van-button round block type="primary" native-type="submit">保存</van-button>
      </div>
    </van-form>
  </div>
</template>

<style scoped>
.addr-edit-page { padding-top: 46px; }
.default-group { margin-top: 10px; }
.save-btn { margin: 30px 16px; }
</style>
