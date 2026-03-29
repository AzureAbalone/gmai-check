// Products list API — serves real Việt Nhật data
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const productsData = JSON.parse(
  readFileSync(resolve('./server/data/products.json'), 'utf-8'),
)

// Seeded random per product ID — consistent ratings across requests
function seededRating(id: number): { rating: number; reviews: number } {
  const seed = id * 2654435761 >>> 0 // Knuth multiplicative hash
  const rating = 3.5 + ((seed % 15) / 10) // 3.5 – 4.9
  const reviews = 5 + (seed % 196) // 5 – 200
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

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    'Content-Type': 'application/json',
  })

  return productsData.map((p: Product) => {
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
