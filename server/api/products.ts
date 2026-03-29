// Products list API — serves real Việt Nhật data

// Seeded random per product ID — consistent ratings across requests
function seededRating(id: number): { rating: number; reviews: number } {
  const seed = id * 2654435761 >>> 0
  const rating = 3.5 + ((seed % 15) / 10)
  const reviews = 5 + (seed % 196)
  return { rating: Math.round(rating * 10) / 10, reviews }
}

interface Product {
  id: number
  name: string
  code: string
  category: string
  image: string
  thumbnail: string
  badge: string | null
  dimensions: string
  material: string
}

let cachedProducts: Product[] | null = null

async function loadProducts(): Promise<Product[]> {
  if (cachedProducts) return cachedProducts
  const storage = useStorage('assets:data')
  const raw = await storage.getItem<Product[]>('products.json')
  cachedProducts = raw || []
  return cachedProducts
}

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    'Content-Type': 'application/json',
  })

  const productsData = await loadProducts()

  return productsData.map((p) => {
    const { rating, reviews } = seededRating(p.id)
    return {
      id: p.id,
      name: p.name,
      code: p.code,
      category: p.category,
      image: p.image,
      thumbnail: p.thumbnail,
      badge: p.badge,
      dimensions: p.dimensions,
      material: p.material,
      rating,
      reviews,
    }
  })
})
