// Product detail API — serves full Việt Nhật product data by ID

interface ProductDetail {
  id: number
  name: string
  code: string
  category: string
  image: string
  images: string[]
  thumbnail: string
  badge: string | null
  colors: { name: string; hex: string }[]
  dimensions: string
  material: string
  packaging: string
  description: string
  url: string
}

let productsMap: Map<number, ProductDetail> | null = null

async function loadProductsMap(): Promise<Map<number, ProductDetail>> {
  if (productsMap) return productsMap
  const storage = useStorage('assets:data')
  const raw = await storage.getItem<ProductDetail[]>('products.json')
  productsMap = new Map()
  for (const p of (raw || [])) {
    productsMap.set(p.id, p)
  }
  return productsMap
}

// Seeded random per product ID — consistent ratings across requests
function seededRating(id: number): { rating: number; reviews: number } {
  const seed = id * 2654435761 >>> 0
  const rating = 3.5 + ((seed % 15) / 10)
  const reviews = 5 + (seed % 196)
  return { rating: Math.round(rating * 10) / 10, reviews }
}

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    'Content-Type': 'application/json',
  })

  const id = Number(getRouterParam(event, 'id'))

  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid product ID' })
  }

  const map = await loadProductsMap()
  const product = map.get(id)

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  const { rating, reviews } = seededRating(id)
  return { ...product, rating, reviews }
})
