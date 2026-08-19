import type { Category, Product } from '@/types'

// 分类
export const mockCategories: Category[] = [
  { id: 1, name: '手机数码', icon: '📱', sort: 1 },
  { id: 2, name: '服装鞋包', icon: '👟', sort: 2 },
  { id: 3, name: '食品饮料', icon: '🍔', sort: 3 },
  { id: 4, name: '家居生活', icon: '🏠', sort: 4 },
  { id: 5, name: '美妆护肤', icon: '💄', sort: 5 },
  { id: 6, name: '运动户外', icon: '⚽', sort: 6 },
  { id: 7, name: '图书文具', icon: '📚', sort: 7 },
  { id: 8, name: '电脑办公', icon: '💻', sort: 8 }
]

// 商品（含描述和库存，用于详情）
export interface MockProduct extends Product {
  description: string
  stock: number
}

// 商品 emoji 图标（按商品 id 映射）
const EMOJI: Record<number, string> = {
  1: '📱', 2: '📱', 3: '📱', 4: '🎧', 5: '⌚',
  6: '👟', 7: '👟', 8: '👕', 9: '👖', 10: '🎒',
  11: '🥜', 12: '🍵', 13: '🍗', 14: '💧', 15: '🍪',
  16: '🤖', 17: '💡', 18: '☕', 19: '🛋️', 20: '📦',
  21: '🧴', 22: '🌹', 23: '✨', 24: '💄', 25: '🧴',
  26: '🧘', 27: '🥽', 28: '🏋️', 29: '🚲', 30: '👕',
  31: '📕', 32: '📗', 33: '🖋️', 34: '📓', 35: '🖍️',
  36: '💻', 37: '⌨️', 38: '🖱️', 39: '🖥️', 40: '🖨️'
}

// 渐变色盘（商品图背景，循环使用）
const PALETTE: [string, string][] = [
  ['#667eea', '#764ba2'],
  ['#f6d365', '#fda085'],
  ['#f83600', '#f9d423'],
  ['#43e97b', '#38f9d7'],
  ['#fbc2eb', '#a6c1ee'],
  ['#30cfd0', '#330867'],
  ['#ff9a9e', '#fecfef'],
  ['#0ba360', '#3cba92']
]

// 生成带 emoji + 渐变的本地 SVG 占位图（不依赖外网，秒加载）
function svg(emoji: string, c1: string, c2: string, w = 400, h = 400): string {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><text x="50%" y="53%" font-size="${Math.round(h * 0.45)}" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(s)}`
}

const img = (id: number) => {
  const [c1, c2] = PALETTE[(id - 1) % PALETTE.length]
  return svg(EMOJI[id] || '🛍️', c1, c2)
}

// 首页轮播 banner 图
export function makeBanner(title: string, sub: string, c1: string, c2: string): string {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" width="750" height="300" viewBox="0 0 750 300"><defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="750" height="300" fill="url(#b)"/><circle cx="620" cy="150" r="110" fill="rgba(255,255,255,0.15)"/><text x="64" y="138" font-size="44" fill="#fff" font-weight="bold" font-family="sans-serif">${title}</text><text x="64" y="194" font-size="24" fill="rgba(255,255,255,0.88)" font-family="sans-serif">${sub}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(s)}`
}

export const mockProducts: MockProduct[] = [
  { id: 1, category_id: 1, name: 'iPhone 15 Pro Max 256G', description: '苹果旗舰A17Pro芯片钛金属边框', cover_image: img(1), price: 9999, original_price: 11999, stock: 50, sales: 328, is_hot: 1 },
  { id: 2, category_id: 1, name: '小米14 Pro 12+256G', description: '徕卡光学第三代骁龙8超声波指纹', cover_image: img(2), price: 4999, original_price: 5499, stock: 80, sales: 512, is_hot: 1 },
  { id: 3, category_id: 1, name: '华为Mate60 Pro 512G', description: '麒麟9000S卫星通话超强夜拍', cover_image: img(3), price: 6999, original_price: 7499, stock: 30, sales: 267, is_hot: 1 },
  { id: 4, category_id: 1, name: 'AirPods Pro 第2代', description: '主动降噪H2芯片USB-C充电盒', cover_image: img(4), price: 1799, original_price: 1999, stock: 200, sales: 1024, is_hot: 0 },
  { id: 5, category_id: 1, name: '小米手环8 Pro', description: '1.74英寸大屏150+运动模式14天续航', cover_image: img(5), price: 299, original_price: 399, stock: 500, sales: 2048, is_hot: 0 },
  { id: 6, category_id: 2, name: 'Nike Air Max 2024', description: '全掌Air气垫缓震透气网面', cover_image: img(6), price: 899, original_price: 1099, stock: 120, sales: 356, is_hot: 1 },
  { id: 7, category_id: 2, name: '阿迪达斯 Ultraboost 22', description: 'Boost中底回弹Primeknit针织鞋面', cover_image: img(7), price: 799, original_price: 999, stock: 100, sales: 289, is_hot: 0 },
  { id: 8, category_id: 2, name: '李宁国潮卫衣连帽款', description: '380g重磅棉质国潮刺绣logo', cover_image: img(8), price: 299, original_price: 399, stock: 300, sales: 678, is_hot: 0 },
  { id: 9, category_id: 2, name: '优衣库修身牛仔裤', description: '弹力面料修身直筒多色可选', cover_image: img(9), price: 199, original_price: 249, stock: 400, sales: 1230, is_hot: 0 },
  { id: 10, category_id: 2, name: '途昂双肩背包30L', description: '防水牛津布USB充电接口减压背带', cover_image: img(10), price: 259, original_price: 329, stock: 200, sales: 445, is_hot: 0 },
  { id: 11, category_id: 3, name: '三只松鼠每日坚果750g', description: '30小包独立装混合坚果无添加', cover_image: img(11), price: 69.9, original_price: 89.9, stock: 1000, sales: 5632, is_hot: 1 },
  { id: 12, category_id: 3, name: '东方树叶茶饮料900ml×12', description: '零糖零脂茉莉花茶绿茶乌龙', cover_image: img(12), price: 45.9, original_price: 55.9, stock: 500, sales: 3211, is_hot: 0 },
  { id: 13, category_id: 3, name: '良品铺子卤味零食大礼包', description: '10种卤味独立包装开袋即食', cover_image: img(13), price: 89.9, original_price: 109.9, stock: 800, sales: 2156, is_hot: 0 },
  { id: 14, category_id: 3, name: '农夫山泉矿泉水550ml×24', description: '天然矿泉水弱碱性整箱更划算', cover_image: img(14), price: 29.9, original_price: 35.9, stock: 2000, sales: 8932, is_hot: 0 },
  { id: 15, category_id: 3, name: '奥利奥双层夹心饼干388g', description: '经典黑白配双倍奶油家庭装', cover_image: img(15), price: 19.9, original_price: 25.9, stock: 1500, sales: 6723, is_hot: 0 },
  { id: 16, category_id: 4, name: '小米扫地机器人S10+', description: '激光导航5000Pa强吸APP智控', cover_image: img(16), price: 1999, original_price: 2499, stock: 60, sales: 234, is_hot: 1 },
  { id: 17, category_id: 4, name: '飞利浦护眼台灯', description: 'AA级防蓝光无频闪触摸调光', cover_image: img(17), price: 299, original_price: 379, stock: 300, sales: 867, is_hot: 0 },
  { id: 18, category_id: 4, name: '美的电热水壶1.7L', description: '304不锈钢5挡温控保温1小时', cover_image: img(18), price: 129, original_price: 169, stock: 400, sales: 1234, is_hot: 0 },
  { id: 19, category_id: 4, name: '懒人沙发豆袋', description: '超大号舒适绒布可拆洗客厅卧室', cover_image: img(19), price: 399, original_price: 499, stock: 150, sales: 456, is_hot: 0 },
  { id: 20, category_id: 4, name: '禧天龙收纳箱50L×3个', description: '加厚PP可叠放带滑轮透明可视', cover_image: img(20), price: 159, original_price: 199, stock: 500, sales: 2345, is_hot: 0 },

  { id: 21, category_id: 5, name: '雅诗兰黛小棕瓶精华50ml', description: '第七代双重发酵精华修护屏障', cover_image: img(21), price: 799, original_price: 950, stock: 100, sales: 523, is_hot: 1 },
  { id: 22, category_id: 5, name: '兰蔻菁纯臻颜玫瑰水200ml', description: '玫瑰精华水补水保湿敏感肌可用', cover_image: img(22), price: 450, original_price: 550, stock: 150, sales: 367, is_hot: 0 },
  { id: 23, category_id: 5, name: 'SK-II神仙水230ml', description: 'PITERA精华改善肤质焕亮提亮', cover_image: img(23), price: 1050, original_price: 1200, stock: 80, sales: 289, is_hot: 0 },
  { id: 24, category_id: 5, name: '完美日记小金管口红', description: '显色丝滑持久不脱妆10色可选', cover_image: img(24), price: 69.9, original_price: 99.9, stock: 500, sales: 3456, is_hot: 0 },
  { id: 25, category_id: 5, name: '玉兰油多效修护霜50g', description: '7重功效保湿抗皱淡斑敏感肌适用', cover_image: img(25), price: 189, original_price: 239, stock: 300, sales: 1567, is_hot: 0 },
  { id: 26, category_id: 6, name: '迪卡侬瑜伽垫10mm加厚', description: 'NBR防滑183×61cm附绑带多色', cover_image: img(26), price: 89, original_price: 119, stock: 400, sales: 2134, is_hot: 1 },
  { id: 27, category_id: 6, name: '鲨鱼皮泳镜防雾防水', description: 'PC镜片硅胶密封圈可调节鼻梁', cover_image: img(27), price: 59, original_price: 89, stock: 300, sales: 1234, is_hot: 0 },
  { id: 28, category_id: 6, name: '可调节哑铃5-40kg', description: '快速调节重量防滑把手铝制', cover_image: img(28), price: 699, original_price: 899, stock: 80, sales: 356, is_hot: 0 },
  { id: 29, category_id: 6, name: '折叠自行车20寸变速', description: '铝合金车架7速变速折叠便携', cover_image: img(29), price: 1299, original_price: 1599, stock: 40, sales: 123, is_hot: 0 },
  { id: 30, category_id: 6, name: '户外速干衣长袖UPF50+', description: '防紫外线吸湿速干轻薄透气', cover_image: img(30), price: 159, original_price: 199, stock: 250, sales: 678, is_hot: 0 },
  { id: 31, category_id: 7, name: 'Vue.js设计与实现', description: 'Vue3作者出品深度解析响应式系统', cover_image: img(31), price: 109, original_price: 129, stock: 200, sales: 456, is_hot: 1 },
  { id: 32, category_id: 7, name: 'JavaScript高级程序设计第4版', description: '红宝书前端经典必读涵盖ES6+', cover_image: img(32), price: 139, original_price: 179, stock: 300, sales: 789, is_hot: 0 },
  { id: 33, category_id: 7, name: '百乐钢笔套装78G+', description: '经典入门款多色墨水书写流畅', cover_image: img(33), price: 79, original_price: 99, stock: 400, sales: 567, is_hot: 0 },
  { id: 34, category_id: 7, name: 'LEUCHTTURM1917笔记本A5', description: '德国品质硬壳封面附口袋贴纸', cover_image: img(34), price: 89, original_price: 109, stock: 300, sales: 345, is_hot: 0 },
  { id: 35, category_id: 7, name: 'Touch马克笔80色套装', description: '双头快干不晕染设计手绘必备', cover_image: img(35), price: 199, original_price: 259, stock: 200, sales: 234, is_hot: 0 },
  { id: 36, category_id: 8, name: 'MacBook Air M2 8+256G', description: 'Apple M2芯片13.6英寸18小时续航', cover_image: img(36), price: 8499, original_price: 9499, stock: 30, sales: 167, is_hot: 1 },
  { id: 37, category_id: 8, name: '达尔优机械键盘108键', description: '青轴红轴RGB背光铝合金面板', cover_image: img(37), price: 259, original_price: 329, stock: 200, sales: 678, is_hot: 0 },
  { id: 38, category_id: 8, name: '罗技MX Master 3S鼠标', description: '8000DPI静音点击MagSpeed滚轮', cover_image: img(38), price: 699, original_price: 799, stock: 150, sales: 456, is_hot: 0 },
  { id: 39, category_id: 8, name: '三星27寸4K显示器', description: 'IPS面板160Hz HDR600 TypeC65W', cover_image: img(39), price: 3299, original_price: 3999, stock: 40, sales: 123, is_hot: 0 },
  { id: 40, category_id: 8, name: '惠普LaserJet激光打印机', description: '黑白22页/分钟自动双面WiFi', cover_image: img(40), price: 1299, original_price: 1599, stock: 60, sales: 234, is_hot: 0 }
]

// 商品详情图片（每个商品3张）
export function getProductImages(id: number) {
  const emoji = EMOJI[id] || '🛍️'
  const p1 = PALETTE[(id - 1) % PALETTE.length]
  const p2 = PALETTE[id % PALETTE.length]
  const p3 = PALETTE[(id + 1) % PALETTE.length]
  return [
    { id: id * 3 + 1, image_url: svg(emoji, p1[0], p1[1]), sort: 1 },
    { id: id * 3 + 2, image_url: svg(emoji, p2[0], p2[1]), sort: 2 },
    { id: id * 3 + 3, image_url: svg(emoji, p3[0], p3[1]), sort: 3 }
  ]
}

