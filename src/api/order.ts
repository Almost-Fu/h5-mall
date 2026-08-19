import type { Order, OrderItem, ApiResp } from '@/types'
import { currentUserId, getCartOf, saveCartOf, getOrdersOf, saveOrdersOf, getAddressesOf, nextId } from '@/mock/db'

function uid() {
  return currentUserId()
}

export function createOrder(data: { address_id: number; cart_item_ids: number[] }) {
  const userId = uid()
  const cart = getCartOf(userId)
  const selected = cart.filter((c) => data.cart_item_ids.includes(c.id))
  if (selected.length === 0) return Promise.reject(new Error('购物车商品不存在'))

  const addr = getAddressesOf(userId).find((a) => a.id === data.address_id)
  const total = selected.reduce((s, i) => s + i.product.price * i.quantity, 0)

  const items: OrderItem[] = selected.map((i) => ({
    id: nextId([]),
    product_id: i.product_id,
    product_name: i.product.name,
    cover_image: i.product.cover_image,
    price: i.product.price,
    spec: i.spec,
    quantity: i.quantity
  }))

  const order: Order = {
    id: nextId(getOrdersOf(userId)),
    order_no: 'ORD' + Date.now(),
    total_amount: Math.round(total * 100) / 100,
    status: 'pending',
    address_snapshot: JSON.stringify(addr || {}),
    created_at: new Date().toLocaleString(),
    paid_at: null,
    items
  }

  const orders = getOrdersOf(userId)
  orders.unshift(order)
  saveOrdersOf(userId, orders)
  // 清除已下单的购物车项
  saveCartOf(userId, cart.filter((c) => !data.cart_item_ids.includes(c.id)))

  return Promise.resolve<ApiResp<Order>>({ code: 200, message: 'success', data: order })
}

export function getOrders(status?: string) {
  const orders = getOrdersOf(uid())
  const list = status ? orders.filter((o) => o.status === status) : orders
  return Promise.resolve<ApiResp<Order[]>>({ code: 200, message: 'success', data: list })
}

export function getOrderDetail(id: number) {
  const order = getOrdersOf(uid()).find((o) => o.id === id)
  return Promise.resolve<ApiResp<Order>>({ code: 200, message: 'success', data: order! })
}

export function payOrder(id: number) {
  const orders = getOrdersOf(uid())
  const o = orders.find((x) => x.id === id)
  if (o) {
    o.status = 'paid'
    o.paid_at = new Date().toLocaleString()
  }
  saveOrdersOf(uid(), orders)
  return Promise.resolve<ApiResp>({ code: 200, message: '支付成功', data: { status: 'paid' } })
}

export function cancelOrder(id: number) {
  const orders = getOrdersOf(uid())
  const o = orders.find((x) => x.id === id)
  if (o) o.status = 'cancelled'
  saveOrdersOf(uid(), orders)
  return Promise.resolve<ApiResp>({ code: 200, message: '订单已取消', data: null })
}
