// Products list API — uses static import (works on Vercel serverless).

import productsData from '../data/products.json'

interface Product {
  id: number
  name: string
  code: string
  category: string
  image: string
  thumbnail: string
  badge: string | null
  rating: number
  reviews: number
}

const allProducts: Product[] = productsData as Product[]

export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
    'Content-Type': 'application/json',
  })

  // Return only the fields the list page needs
  return allProducts.map(p => ({
    id: p.id,
    name: p.name,
    code: p.code,
    category: p.category,
    image: p.image,
    thumbnail: p.thumbnail,
    badge: p.badge,
    rating: p.rating,
    reviews: p.reviews,
  }))
})
