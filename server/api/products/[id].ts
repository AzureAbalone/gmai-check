// Product Detail API — returns extended product data for PDP
// Follows same cache/typing pattern as /api/products.ts

interface ProductDetail {
  id: number
  name: string
  category: string
  image: string
  images: string[]
  rating: number
  reviews: number
  badge: string | null
  price: number
  originalPrice: number | null
  description: string
  colors: { name: string; hex: string }[]
  specs: { label: string; value: string }[]
  inTheBox: string[]
  features: string[]
}

const productDetails: Record<number, ProductDetail> = {
  1: {
    id: 1,
    name: 'Bộ hộp đựng thực phẩm Lock&Lock 5 món',
    category: 'kitchen',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80',
      'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80',
    ],
    rating: 5,
    reviews: 128,
    badge: 'Mới',
    price: 349000,
    originalPrice: null,
    description: 'Bộ hộp đựng thực phẩm Lock&Lock 5 món với nắp đậy kín khí, giữ thức ăn tươi ngon lâu hơn. Chất liệu nhựa PP cao cấp, an toàn cho sức khỏe, có thể sử dụng trong lò vi sóng.',
    colors: [
      { name: 'Trong suốt', hex: '#E8E8E8' },
      { name: 'Xanh mint', hex: '#0D6E6E' },
      { name: 'Hồng pastel', hex: '#F5A5B8' },
    ],
    specs: [
      { label: 'Chất liệu', value: 'Nhựa PP an toàn thực phẩm' },
      { label: 'Bộ gồm', value: '5 hộp: 350ml, 500ml, 800ml, 1.2L, 2L' },
      { label: 'Chịu nhiệt', value: '-20°C đến 120°C' },
      { label: 'Lò vi sóng', value: 'Có (tháo nắp)' },
      { label: 'Máy rửa chén', value: 'Có' },
      { label: 'Xuất xứ', value: 'Hàn Quốc' },
    ],
    inTheBox: ['5 hộp đựng các kích cỡ', '5 nắp đậy kín khí', 'Hướng dẫn sử dụng', 'Túi đựng bảo quản'],
    features: ['Kín khí 100%', 'An toàn thực phẩm', 'Dùng được lò vi sóng'],
  },
  2: {
    id: 2,
    name: 'Kệ gia vị nhà bếp 3 tầng bằng inox',
    category: 'kitchen',
    image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80',
    ],
    rating: 4,
    reviews: 85,
    badge: null,
    price: 189000,
    originalPrice: null,
    description: 'Kệ gia vị 3 tầng bằng inox 304 cao cấp, thiết kế đơn giản gọn gàng. Dễ dàng tháo lắp và vệ sinh, phù hợp mọi không gian bếp.',
    colors: [
      { name: 'Bạc', hex: '#C0C0C0' },
      { name: 'Đen', hex: '#1A1A1A' },
    ],
    specs: [
      { label: 'Chất liệu', value: 'Inox 304' },
      { label: 'Kích thước', value: '25 x 15 x 38 cm' },
      { label: 'Tải trọng', value: '5kg mỗi tầng' },
      { label: 'Lắp đặt', value: 'Không cần khoan' },
      { label: 'Xuất xứ', value: 'Việt Nam' },
    ],
    inTheBox: ['Kệ 3 tầng', 'Bộ phụ kiện lắp đặt', 'Hướng dẫn sử dụng'],
    features: ['Inox 304 chống gỉ', 'Không cần khoan', 'Dễ tháo lắp'],
  },
  3: {
    id: 3,
    name: 'Kệ nhà tắm dán tường không cần khoan',
    category: 'bathroom',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
      'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800&q=80',
    ],
    rating: 4,
    reviews: 62,
    badge: '-30%',
    price: 129000,
    originalPrice: 185000,
    description: 'Kệ nhà tắm dán tường siêu chắc, không cần khoan đục. Thiết kế thoát nước thông minh, chịu lực tốt, phù hợp đặt dầu gội, sữa tắm, xà phòng.',
    colors: [
      { name: 'Trắng', hex: '#FFFFFF' },
      { name: 'Xám', hex: '#6B7280' },
    ],
    specs: [
      { label: 'Chất liệu', value: 'Nhựa ABS + Inox' },
      { label: 'Kích thước', value: '30 x 12 x 8 cm' },
      { label: 'Tải trọng', value: '8kg' },
      { label: 'Lắp đặt', value: 'Miếng dán 3M' },
      { label: 'Chống nước', value: 'IPX5' },
      { label: 'Xuất xứ', value: 'Việt Nam' },
    ],
    inTheBox: ['Kệ nhà tắm', '2 miếng dán 3M', 'Hướng dẫn lắp đặt'],
    features: ['Không cần khoan', 'Chịu lực 8kg', 'Thoát nước nhanh'],
  },
  4: {
    id: 4,
    name: 'Thùng rác phân loại 3 ngăn 45L',
    category: 'living',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    ],
    rating: 5,
    reviews: 204,
    badge: 'Mới',
    price: 459000,
    originalPrice: null,
    description: 'Thùng rác phân loại 3 ngăn thông minh, giúp phân loại rác hữu cơ, tái chế và rác thường. Thiết kế đạp chân tiện lợi, nắp đậy kín ngăn mùi.',
    colors: [
      { name: 'Đen', hex: '#1A1A1A' },
      { name: 'Xám', hex: '#6B7280' },
      { name: 'Trắng', hex: '#F5F5F5' },
    ],
    specs: [
      { label: 'Dung tích', value: '45L (15L x 3 ngăn)' },
      { label: 'Chất liệu', value: 'Thép không gỉ + PP' },
      { label: 'Kích thước', value: '60 x 30 x 65 cm' },
      { label: 'Cơ chế', value: 'Đạp chân mở nắp' },
      { label: 'Xuất xứ', value: 'Việt Nam' },
    ],
    inTheBox: ['Thùng rác 3 ngăn', '3 xô nhựa rời', 'Nhãn phân loại', 'Hướng dẫn sử dụng'],
    features: ['Phân loại 3 ngăn', 'Đạp chân tiện lợi', 'Ngăn mùi hiệu quả'],
  },
}

// Generate fallback data for products not explicitly defined
function generateFallback(id: number): ProductDetail {
  return {
    id,
    name: `Sản phẩm gia dụng #${id}`,
    category: 'kitchen',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80',
    ],
    rating: 4,
    reviews: 50,
    badge: null,
    price: 199000,
    originalPrice: null,
    description: 'Sản phẩm gia dụng chất lượng cao, thiết kế hiện đại, phù hợp mọi gia đình Việt.',
    colors: [
      { name: 'Mặc định', hex: '#E8E8E8' },
      { name: 'Đen', hex: '#1A1A1A' },
    ],
    specs: [
      { label: 'Chất liệu', value: 'Cao cấp' },
      { label: 'Xuất xứ', value: 'Việt Nam' },
    ],
    inTheBox: ['Sản phẩm chính', 'Hướng dẫn sử dụng'],
    features: ['Chất lượng cao', 'Thiết kế hiện đại'],
  }
}

export default defineEventHandler(async (event) => {
  // Cache response
  setResponseHeaders(event, {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    'Content-Type': 'application/json',
  })

  const id = Number(getRouterParam(event, 'id'))

  if (!id || isNaN(id) || id < 1 || id > 18) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    })
  }

  return productDetails[id] || generateFallback(id)
})
