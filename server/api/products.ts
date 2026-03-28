// Products API with proper typing, caching headers, and computed fields.
// Ready for production — swap mock data with real scraper/DB queries.

interface ProductRaw {
  id: number
  name: string
  category: string
  price: number
  originalPrice: number | null
  image: string
  rating: number
  reviews: number
  badge: string | null
}

const VND = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

function formatProduct(p: ProductRaw) {
  return {
    ...p,
    priceFormatted: VND.format(p.price),
    originalPriceFormatted: p.originalPrice ? VND.format(p.originalPrice) : null,
    discount: p.originalPrice
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : null,
  }
}

export default defineEventHandler(async (event) => {
  // ─── Cache response for 60s (CDN) + stale-while-revalidate ───
  setResponseHeaders(event, {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    'Content-Type': 'application/json',
  })

  const rawProducts: ProductRaw[] = [
    {
      id: 1,
      name: 'Bộ hộp đựng thực phẩm Lock&Lock 5 món',
      category: 'kitchen',
      price: 249000,
      originalPrice: 350000,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
      rating: 5,
      reviews: 128,
      badge: 'Mới',
    },
    {
      id: 2,
      name: 'Kệ gia vị nhà bếp 3 tầng bằng inox',
      category: 'kitchen',
      price: 189000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80',
      rating: 4,
      reviews: 85,
      badge: null,
    },
    {
      id: 3,
      name: 'Kệ nhà tắm dán tường không cần khoan',
      category: 'bathroom',
      price: 139000,
      originalPrice: 199000,
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80',
      rating: 4,
      reviews: 62,
      badge: '-30%',
    },
    {
      id: 4,
      name: 'Thùng rác phân loại 3 ngăn 45L',
      category: 'living',
      price: 459000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80',
      rating: 5,
      reviews: 204,
      badge: 'Mới',
    },
    {
      id: 5,
      name: 'Rổ rá đa năng hình chữ nhật 4L',
      category: 'kitchen',
      price: 79000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
      rating: 4,
      reviews: 43,
      badge: null,
    },
    {
      id: 6,
      name: 'Bộ giá treo khăn tắm inox 304',
      category: 'bathroom',
      price: 219000,
      originalPrice: 299000,
      image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&q=80',
      rating: 5,
      reviews: 97,
      badge: '-27%',
    },
  ]

  return rawProducts.map(formatProduct)
})
