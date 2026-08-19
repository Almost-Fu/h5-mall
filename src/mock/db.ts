import type { CartItem, Order, Address } from '@/types'

// 当前登录用户 id（从 user store 写入的 localStorage 读取）
export function currentUserId(): number {
  const u = JSON.parse(localStorage.getItem('user') || 'null')
  return u?.id ?? 0
}

function read<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key)
  return raw ? (JSON.parse(raw) as T) : fallback
}
function write(key: string, val: unknown) {
  localStorage.setItem(key, JSON.stringify(val))
}

// 下一个自增 id
export function nextId(list: { id: number }[]): number {
  return list.reduce((m, x) => Math.max(m, x.id), 0) + 1
}

// ── 用户表 ──────────────────────────────────────────────
export interface MockUser {
  id: number
  username: string
  password: string
  nickname: string
  avatar: string
  phone: string
  created_at: string
}
const USERS_KEY = 'h5mall_users'
export function getUsers(): MockUser[] {
  return read<MockUser[]>(USERS_KEY, [])
}
export function saveUsers(users: MockUser[]) {
  write(USERS_KEY, users)
}

// ── 购物车 ──────────────────────────────────────────────
export function getCartOf(userId: number): CartItem[] {
  return read<CartItem[]>(`h5mall_cart_${userId}`, [])
}
export function saveCartOf(userId: number, cart: CartItem[]) {
  write(`h5mall_cart_${userId}`, cart)
}

// ── 订单 ────────────────────────────────────────────────
export function getOrdersOf(userId: number): Order[] {
  return read<Order[]>(`h5mall_orders_${userId}`, [])
}
export function saveOrdersOf(userId: number, orders: Order[]) {
  write(`h5mall_orders_${userId}`, orders)
}

// ── 地址 ────────────────────────────────────────────────
export function getAddressesOf(userId: number): Address[] {
  return read<Address[]>(`h5mall_addresses_${userId}`, [])
}
export function saveAddressesOf(userId: number, addrs: Address[]) {
  write(`h5mall_addresses_${userId}`, addrs)
}
