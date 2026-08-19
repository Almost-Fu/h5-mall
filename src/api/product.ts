import type { Category, Product, ProductDetail, ApiResp } from '@/types'
import { mockCategories, mockProducts, getProductImages } from '@/mock/data'

export function getCategories() {
  return Promise.resolve<ApiResp<Category[]>>({ code: 200, message: 'success', data: mockCategories })
}

export function getProducts(params: {
  category_id?: number
  keyword?: string
  sort?: string
  page?: number
  page_size?: number
}) {
  let list = [...mockProducts]
  if (params.category_id) list = list.filter((p) => p.category_id === params.category_id)
  if (params.keyword) {
    const kw = params.keyword
    list = list.filter((p) => p.name.includes(kw))
  }
  if (params.sort === 'price_asc') list.sort((a, b) => a.price - b.price)
  else if (params.sort === 'price_desc') list.sort((a, b) => b.price - a.price)
  else list.sort((a, b) => b.sales - a.sales)

  const total = list.length
  const page = params.page || 1
  const page_size = params.page_size || 10
  const start = (page - 1) * page_size
  const pageList: Product[] = list.slice(start, start + page_size).map(({ description, stock, ...rest }) => rest)

  return Promise.resolve<ApiResp<{ total: number; page: number; page_size: number; list: Product[] }>>({
    code: 200, message: 'success',
    data: { total, page, page_size, list: pageList }
  })
}

export function getProductDetail(id: number) {
  const p = mockProducts.find((x) => x.id === id)
  if (!p) {
    return Promise.reject(new Error('商品不存在'))
  }
  const detail: ProductDetail = { ...p, images: getProductImages(id) }
  return Promise.resolve<ApiResp<ProductDetail>>({ code: 200, message: 'success', data: detail })
}
