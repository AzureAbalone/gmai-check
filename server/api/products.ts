// Products API with proper typing, caching headers, and computed fields.
// Ready for production — swap mock data with real scraper/DB queries.

interface ProductRaw {
  id: number
  name: string
  category: string
  image: string
  rating: number
  reviews: number
  badge: string | null
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
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
      rating: 5,
      reviews: 128,
      badge: 'Mới',
    },
    {
      id: 2,
      name: 'Kệ gia vị nhà bếp 3 tầng bằng inox',
      category: 'kitchen',
      image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80',
      rating: 4,
      reviews: 85,
      badge: null,
    },
    {
      id: 3,
      name: 'Kệ nhà tắm dán tường không cần khoan',
      category: 'bathroom',
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80',
      rating: 4,
      reviews: 62,
      badge: '-30%',
    },
    {
      id: 4,
      name: 'Thùng rác phân loại 3 ngăn 45L',
      category: 'living',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80',
      rating: 5,
      reviews: 204,
      badge: 'Mới',
    },
    {
      id: 5,
      name: 'Rổ rá đa năng hình chữ nhật 4L',
      category: 'kitchen',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
      rating: 4,
      reviews: 43,
      badge: null,
    },
    {
      id: 6,
      name: 'Bộ giá treo khăn tắm inox 304',
      category: 'bathroom',
      image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&q=80',
      rating: 5,
      reviews: 97,
      badge: '-27%',
    },
    {
      id: 7,
      name: 'Bộ dao nhà bếp 6 món lưỡi thép không gỉ',
      category: 'kitchen',
      image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&q=80',
      rating: 5,
      reviews: 156,
      badge: 'Mới',
    },
    {
      id: 8,
      name: 'Máy xay sinh tố đa năng 1.5L',
      category: 'kitchen',
      image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&q=80',
      rating: 4,
      reviews: 89,
      badge: '-15%',
    },
    {
      id: 9,
      name: 'Gương phòng tắm có đèn LED cảm ứng',
      category: 'bathroom',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
      rating: 5,
      reviews: 73,
      badge: null,
    },
    {
      id: 10,
      name: 'Bộ ga giường cotton cao cấp 4 món',
      category: 'living',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
      rating: 5,
      reviews: 215,
      badge: 'Mới',
    },
    {
      id: 11,
      name: 'Đèn bàn LED chống cận thị',
      category: 'living',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&q=80',
      rating: 4,
      reviews: 67,
      badge: null,
    },
    {
      id: 12,
      name: 'Nồi áp suất điện đa năng 6L',
      category: 'kitchen',
      image: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=600&q=80',
      rating: 5,
      reviews: 312,
      badge: '-20%',
    },
    {
      id: 13,
      name: 'Bộ ly thuỷ tinh chịu nhiệt 6 cái',
      category: 'kitchen',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed514?w=600&q=80',
      rating: 4,
      reviews: 54,
      badge: null,
    },
    {
      id: 14,
      name: 'Máy hút bụi cầm tay không dây',
      category: 'living',
      image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80',
      rating: 5,
      reviews: 178,
      badge: 'Mới',
    },
    {
      id: 15,
      name: 'Hộp đựng giày trong suốt xếp chồng',
      category: 'living',
      image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
      rating: 4,
      reviews: 92,
      badge: '-25%',
    },
    {
      id: 16,
      name: 'Vòi sen tăng áp tiết kiệm nước',
      category: 'bathroom',
      image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=600&q=80',
      rating: 5,
      reviews: 141,
      badge: null,
    },
    {
      id: 17,
      name: 'Bàn ủi hơi nước đứng 1800W',
      category: 'living',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80',
      rating: 4,
      reviews: 63,
      badge: '-18%',
    },
    {
      id: 18,
      name: 'Máy lọc nước RO 10 lõi',
      category: 'kitchen',
      image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=600&q=80',
      rating: 5,
      reviews: 287,
      badge: 'Mới',
    },
  ]

  return rawProducts
})
