import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', name: 'home', component: () => import('@/views/Home.vue'), meta: { tab: true } },
    { path: '/category', name: 'category', component: () => import('@/views/Category.vue'), meta: { tab: true } },
    { path: '/cart', name: 'cart', component: () => import('@/views/Cart.vue'), meta: { tab: true, auth: true } },
    { path: '/mine', name: 'mine', component: () => import('@/views/Mine.vue'), meta: { tab: true } },
    { path: '/login', name: 'login', component: () => import('@/views/Login.vue') },
    { path: '/register', name: 'register', component: () => import('@/views/Register.vue') },
    { path: '/products', name: 'products', component: () => import('@/views/ProductList.vue') },
    { path: '/product/:id', name: 'productDetail', component: () => import('@/views/ProductDetail.vue') },
    { path: '/order/confirm', name: 'orderConfirm', component: () => import('@/views/Order.vue'), meta: { auth: true } },
    { path: '/orders', name: 'orders', component: () => import('@/views/OrderList.vue'), meta: { auth: true } },
    { path: '/address', name: 'address', component: () => import('@/views/Address.vue'), meta: { auth: true } },
    { path: '/address/edit', name: 'addressEdit', component: () => import('@/views/AddressEdit.vue'), meta: { auth: true } }
  ]
})

// 路由守卫：需要登录的页面
router.beforeEach((to) => {
  if (to.meta.auth) {
    const userStore = useUserStore()
    if (!userStore.token) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }
  }
  return true
})

export default router
