// Product Detail API — reads from generated data file.

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

interface ProductData {
  id: number
  name: string
  code: string
  category: string
  image: string
  images: string[]
  thumbnail: string
  badge: string | null
  rating: number
  reviews: number
  colors: { name: string; hex: string }[]
  dimensions: string
  material: string
  packaging: string
  url: string
  description: string
  productInfo: string
  advantages: string[]
  usage: string[]
  storage: string[]
}

// Read once at startup
const dataPath = resolve(process.cwd(), 'server/data/products.json')
let allProducts: ProductData[] = []
try {
  allProducts = JSON.parse(readFileSync(dataPath, 'utf-8'))
}
catch {
  // eslint-disable-next-line no-console
  console.warn('[api/products/[id]] Could not load server/data/products.json')
}

// Build lookup map for O(1) access
const productMap = new Map<number, ProductData>()
for (const p of allProducts) {
  productMap.set(p.id, p)
}

export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    'Content-Type': 'application/json',
  })

  const id = Number(event.context.params?.id)
  const p = productMap.get(id)

  if (!p) {
    setResponseStatus(event, 404)
    return { error: 'Product not found' }
  }

  // Build specs from structured fields
  const specs: { label: string; value: string }[] = []
  if (p.code) specs.push({ label: 'Mã sản phẩm', value: p.code })
  if (p.dimensions) specs.push({ label: 'Kích thước', value: p.dimensions })
  if (p.material) specs.push({ label: 'Chất liệu', value: p.material })
  if (p.packaging) specs.push({ label: 'Quy cách', value: p.packaging })

  return {
    id: p.id,
    name: p.name,
    code: p.code,
    category: p.category,
    image: p.image,
    images: p.images,
    thumbnail: p.thumbnail,
    badge: p.badge,
    rating: p.rating,
    reviews: p.reviews,
    colors: p.colors,
    specs,
    description: p.productInfo || p.description,
    productInfo: p.productInfo || p.description,
    advantages: p.advantages || [],
    usage: p.usage || [],
    storage: p.storage || [],
  }
})
