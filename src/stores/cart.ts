import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem } from '@/types'
import * as cartApi from '@/api/cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const loading = ref(false)

  // 勾选状态（存在内存中，选中结算用）
  const checkedIds = ref<number[]>([])

  const totalCount = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  const checkedItems = computed(() =>
    items.value.filter((i) => checkedIds.value.includes(i.id))
  )

  const checkedTotal = computed(() =>
    checkedItems.value.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  )

  async function fetchCart() {
    loading.value = true
    try {
      const res = await cartApi.getCart()
      items.value = res.data
      // 默认全选
      checkedIds.value = items.value.map((i) => i.id)
    } finally {
      loading.value = false
    }
  }

  async function addToCart(productId: number, quantity = 1, spec = '') {
    await cartApi.addToCart({ product_id: productId, quantity, spec })
    await fetchCart()
  }

  async function updateQuantity(id: number, quantity: number) {
    await cartApi.updateCartQuantity(id, quantity)
    const item = items.value.find((i) => i.id === id)
    if (item) item.quantity = quantity
  }

  async function removeItem(id: number) {
    await cartApi.deleteCartItem(id)
    items.value = items.value.filter((i) => i.id !== id)
    checkedIds.value = checkedIds.value.filter((cid) => cid !== id)
  }

  function toggleCheck(id: number) {
    const idx = checkedIds.value.indexOf(id)
    if (idx >= 0) checkedIds.value.splice(idx, 1)
    else checkedIds.value.push(id)
  }

  function toggleAll(checked: boolean) {
    checkedIds.value = checked ? items.value.map((i) => i.id) : []
  }

  return {
    items, loading, checkedIds, totalCount, checkedItems, checkedTotal,
    fetchCart, addToCart, updateQuantity, removeItem, toggleCheck, toggleAll
  }
})
