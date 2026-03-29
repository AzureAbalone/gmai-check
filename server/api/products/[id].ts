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
  productInfo: string
  advantages: string[]
  usage: string[]
  storage: string[]
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
    productInfo: 'Bộ hộp đựng thực phẩm Lock&Lock 5 món là sản phẩm bảo quản thực phẩm cao cấp được làm từ chất liệu nhựa PP nguyên sinh an toàn thực phẩm, thiết kế nắp đậy 4 cạnh khóa kín khí giúp giữ thức ăn tươi ngon lâu hơn. Với 5 kích cỡ đa dạng từ 350ml đến 2L, bộ sản phẩm đáp ứng mọi nhu cầu bảo quản từ gia vị, thức ăn thừa đến trái cây, rau củ. Thiết kế trong suốt giúp dễ dàng nhận biết thực phẩm bên trong, tiết kiệm thời gian tìm kiếm.',
    advantages: [
      'Chất liệu nhựa PP nguyên sinh an toàn thực phẩm, không chứa BPA.',
      'Nắp đậy 4 cạnh khóa kín khí 100%, giữ thức ăn tươi ngon lâu hơn.',
      'Chịu nhiệt từ -20°C đến 120°C, dùng được trong lò vi sóng (tháo nắp).',
      'Thiết kế trong suốt, dễ nhận biết thực phẩm bên trong.',
      'Có thể xếp chồng gọn gàng, tiết kiệm không gian tủ lạnh.',
      'Dễ vệ sinh, có thể rửa bằng máy rửa chén.',
    ],
    usage: [
      'Dùng để bảo quản thực phẩm trong tủ lạnh hoặc tủ đông.',
      'Có thể hâm nóng thức ăn trong lò vi sóng (nhớ tháo nắp).',
      'Phù hợp mang theo cơm trưa, picnic.',
    ],
    storage: [
      'Tránh tiếp xúc với nguồn nhiệt cao hoặc ánh sáng mặt trời trực tiếp trong thời gian dài.',
      'Không sử dụng trong lò nướng.',
      'Rửa sạch và lau khô sau mỗi lần sử dụng.',
    ],
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
    productInfo: 'Kệ gia vị nhà bếp 3 tầng được làm từ inox 304 cao cấp chống gỉ, thiết kế nhỏ gọn với 3 tầng giúp sắp xếp gia vị, lọ tương, dầu ăn ngăn nắp. Chân kệ có đệm cao su chống trơn trượt, đảm bảo kệ luôn đứng vững trên mọi bề mặt. Kiểu dáng tối giản, hiện đại phù hợp mọi phong cách nhà bếp.',
    advantages: [
      'Chất liệu inox 304 cao cấp, chống gỉ, bền bỉ theo thời gian.',
      'Thiết kế 3 tầng gọn gàng, tối ưu không gian bếp.',
      'Chân kệ có đệm cao su chống trơn trượt trên mọi bề mặt.',
      'Dễ dàng tháo lắp, vệ sinh, không cần dụng cụ.',
      'Tải trọng 5kg mỗi tầng, đặt được nhiều loại gia vị.',
    ],
    usage: [
      'Đặt trên bàn bếp hoặc kệ tủ để sắp xếp gia vị, lọ tương, dầu ăn.',
      'Có thể dùng trong phòng tắm để đựng mỹ phẩm, dầu gội.',
    ],
    storage: [
      'Tránh tiếp xúc với hóa chất mạnh.',
      'Lau khô sau khi vệ sinh để giữ bóng sáng.',
    ],
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
    productInfo: 'Kệ nhà tắm dán tường là giải pháp lưu trữ thông minh cho phòng tắm mà không cần phải khoan đục tường. Sử dụng miếng dán 3M siêu chắc, kệ có thể chịu lực lên đến 8kg. Thiết kế khe thoát nước ở đáy kệ giúp nước từ chai dầu gội, sữa tắm nhanh chóng thoát ra, giữ kệ luôn khô ráo, sạch sẽ.',
    advantages: [
      'Chất liệu nhựa ABS kết hợp inox chống gỉ, bền bỉ trong môi trường ẩm ướt.',
      'Dán tường bằng miếng dán 3M, không cần khoan đục, không hư tường.',
      'Thiết kế khe thoát nước thông minh, luôn giữ kệ khô ráo.',
      'Chịu lực lên đến 8kg, đặt được nhiều đồ dùng.',
      'Chống nước IPX5, an toàn sử dụng trong phòng tắm.',
    ],
    usage: [
      'Dùng để đựng dầu gội, sữa tắm, xà phòng và các vật dụng nhà tắm.',
      'Lắp đặt trên tường phòng tắm, nhà bếp hoặc ban công.',
      'Lau sạch bề mặt tường trước khi dán để đảm bảo độ bám dính.',
    ],
    storage: [
      'Tránh đặt vật nặng quá 8kg lên kệ.',
      'Không tháo dỡ sau khi dán 24h đầu để keo đạt độ bám tối đa.',
      'Vệ sinh kệ bằng khăn ẩm, tránh hóa chất mạnh.',
    ],
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
    productInfo: 'Thùng rác phân loại 3 ngăn 45L là giải pháp phân loại rác thông minh cho gia đình hiện đại. Với 3 ngăn riêng biệt (hữu cơ, tái chế, rác thường), mỗi ngăn 15L, sản phẩm giúp gia đình thực hiện phân loại rác tại nguồn dễ dàng. Thiết kế đạp chân mở nắp tiện lợi, không cần dùng tay, nắp đậy kín ngăn mùi hôi hiệu quả. Vỏ ngoài bằng thép không gỉ sang trọng, 3 xô nhựa rời bên trong dễ tháo rửa.',
    advantages: [
      'Phân loại rác 3 ngăn: hữu cơ, tái chế, rác thường.',
      'Cơ chế đạp chân mở nắp tiện lợi, không cần dùng tay.',
      'Nắp đậy kín, ngăn mùi hôi hiệu quả.',
      'Vỏ ngoài thép không gỉ sang trọng, dễ lau chùi.',
      '3 xô nhựa rời bên trong, dễ tháo rửa, thay túi rác.',
      'Nhãn phân loại rác đi kèm, giúp cả gia đình cùng thực hiện.',
    ],
    usage: [
      'Đặt tại khu vực bếp, hành lang hoặc ban công.',
      'Phân loại rác theo 3 ngăn: hữu cơ (thức ăn thừa), tái chế (nhựa, giấy), rác thường.',
      'Đạp chân nhẹ để mở nắp, thả rác vào ngăn phù hợp.',
    ],
    storage: [
      'Vệ sinh xô nhựa bên trong định kỳ mỗi tuần.',
      'Lau vỏ ngoài bằng khăn ẩm, tránh sử dụng chất tẩy mạnh.',
      'Đặt nơi khô ráo, thoáng mát.',
    ],
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
    productInfo: 'Sản phẩm gia dụng chất lượng cao với thiết kế hiện đại, tinh tế. Được làm từ chất liệu bền bỉ, an toàn, đáp ứng mọi nhu cầu sử dụng hàng ngày của gia đình Việt.',
    advantages: [
      'Chất liệu cao cấp, bền bỉ theo thời gian.',
      'Thiết kế hiện đại, phù hợp mọi không gian.',
      'An toàn cho sức khỏe người sử dụng.',
    ],
    usage: [
      'Sử dụng theo hướng dẫn đi kèm sản phẩm.',
    ],
    storage: [
      'Tránh tiếp xúc với nguồn nhiệt cao hoặc ánh sáng mặt trời trực tiếp trong thời gian dài.',
    ],
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
