import type { CartItem, ApiResp } from '@/types'
import { mockProducts } from '@/mock/data'
import { currentUserId, getCartOf, saveCartOf, nextId } from '@/mock/db'

function getList(): CartItem[] {
  return getCartOf(currentUserId())
}

export function getCart() {
  return Promise.resolve<ApiResp<CartItem[]>>({ code: 200, message: 'success', data: getList() })
}

export function addToCart(data: { product_id: number; quantity: number; spec: string }) {
  const cart = getList()
  const existing = cart.find((c) => c.product_id === data.product_id && c.spec === data.spec)
  if (existing) {
    existing.quantity += data.quantity
  } else {
    const p = mockProducts.find((x) => x.id === data.product_id)
    if (!p) return Promise.reject(new Error('商品不存在'))
    cart.push({
      id: nextId(cart),
      product_id: data.product_id,
      quantity: data.quantity,
      spec: data.spec,
      product: { id: p.id, name: p.name, cover_image: p.cover_image, price: p.price, original_price: p.original_price, sales: p.sales, is_hot: p.is_hot, category_id: p.category_id }
    })
  }
  saveCartOf(currentUserId(), cart)
  return Promise.resolve<ApiResp<CartItem>>({ code: 200, message: 'success', data: existing! })
}

export function updateCartQuantity(id: number, quantity: number) {
  const cart = getList()
  const item = cart.find((c) => c.id === id)
  if (item) item.quantity = quantity
  saveCartOf(currentUserId(), cart)
  return Promise.resolve<ApiResp>({ code: 200, message: 'success', data: null })
}

export function deleteCartItem(id: number) {
  saveCartOf(currentUserId(), getList().filter((c) => c.id !== id))
  return Promise.resolve<ApiResp>({ code: 200, message: 'success', data: null })
}
