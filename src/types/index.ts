// 全局类型定义
export interface User {
  id: number
  username: string
  nickname: string
  avatar: string
  phone: string
  created_at: string
}

export interface Category {
  id: number
  name: string
  icon: string
  sort: number
}

export interface Product {
  id: number
  name: string
  cover_image: string
  price: number
  original_price: number
  sales: number
  is_hot: number
  category_id: number
}

export interface ProductDetail extends Product {
  description: string
  stock: number
  images: { id: number; image_url: string; sort: number }[]
}

export interface CartItem {
  id: number
  product_id: number
  quantity: number
  spec: string
  product: Product
  checked?: boolean
}

export interface Address {
  id: number
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  is_default: number
}

export interface OrderItem {
  id: number
  product_id: number
  product_name: string
  cover_image: string
  price: number
  spec: string
  quantity: number
}

export interface Order {
  id: number
  order_no: string
  total_amount: number
  status: string
  address_snapshot: string
  created_at: string
  paid_at: string | null
  items: OrderItem[]
}

export interface ApiResp<T = any> {
  code: number
  message: string
  data: T
}
