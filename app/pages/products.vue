<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFetch, useHead, useRoute, useRouter } from '#imports'
import { useScrollReveal } from '~/composables/useScrollReveal'

useScrollReveal()

interface Product {
  id: number
  name: string
  category: string
  price: number
  priceFormatted: string
  originalPrice: number | null
  originalPriceFormatted: string | null
  image: string
  rating: number
  reviews: number
  badge: string | null
}

const { data: products, status } = await useFetch<Product[]>('/api/products', {
  lazy: true,
  default: () => [],
})

const activeCategory = ref('all')
const sortOrder = ref('default')
const route = useRoute()
const router = useRouter()

const categoryValues = new Set(['all', 'kitchen', 'bathroom', 'living'])

function getCategoryFromQuery(category: unknown) {
  if (typeof category === 'string' && categoryValues.has(category)) {
    return category
  }

  return 'all'
}

const categories = [
  { value: 'all', label: 'Tất cả', icon: 'solar:widget-2-outline' },
  { value: 'kitchen', label: 'Nhà bếp', icon: 'solar:chef-hat-heart-outline' },
  { value: 'bathroom', label: 'Phòng tắm', icon: 'solar:bath-outline' },
  { value: 'living', label: 'Phòng khách', icon: 'solar:sofa-2-outline' },
]

watch(() => route.query.category, (category) => {
  activeCategory.value = getCategoryFromQuery(category)
}, { immediate: true })

watch(activeCategory, (category) => {
  const currentQueryCategory = typeof route.query.category === 'string'
    ? route.query.category
    : undefined
  const nextQueryCategory = category === 'all' ? undefined : category

  if (currentQueryCategory === nextQueryCategory) {
    return
  }

  const nextQuery = { ...route.query }

  if (nextQueryCategory) {
    nextQuery.category = nextQueryCategory
  } else {
    delete nextQuery.category
  }

  router.replace({ query: nextQuery })
})

const filteredProducts = computed(() => {
  let items = products.value || []
  if (activeCategory.value !== 'all') {
    items = items.filter((p) => p.category === activeCategory.value)
  }
  if (sortOrder.value === 'price-asc') {
    items = [...items].sort((a, b) => a.price - b.price)
  } else if (sortOrder.value === 'price-desc') {
    items = [...items].sort((a, b) => b.price - a.price)
  } else if (sortOrder.value === 'rating') {
    items = [...items].sort((a, b) => b.rating - a.rating)
  }
  return items
})

// ─── SEO ───
useHead({
  title: 'Sản phẩm — VINA HOME',
  meta: [
    { name: 'description', content: 'Khám phá bộ sưu tập đồ gia dụng chất lượng cao cho nhà bếp, phòng tắm, phòng khách. Giá tốt nhất, giao hàng toàn quốc.' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Sản phẩm gia dụng — VINA HOME',
        description: 'Bộ sưu tập sản phẩm gia dụng chất lượng cao',
        url: 'https://vinahome.vn/products',
      }),
    },
  ],
})
</script>

<template>
  <div>
    <!-- Page Title -->
    <section class="flex flex-col items-center gap-4 py-16 px-6 bg-[#FAFAFA] text-center" aria-labelledby="products-heading">
      <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm text-[#888]">
        <NuxtLink to="/" class="hover:text-[#0D6E6E] transition-colors">Trang chủ</NuxtLink>
        <Icon name="solar:alt-arrow-right-linear" size="14" aria-hidden="true" />
        <span class="text-[#1A1A1A] font-medium" aria-current="page">Sản phẩm</span>
      </nav>
      <h1 id="products-heading" class="font-['Newsreader'] text-3xl lg:text-[40px] font-medium text-[#1A1A1A]">
        Sản phẩm gia dụng
      </h1>
      <p class="text-base text-[#888] max-w-md">
        Khám phá bộ sưu tập sản phẩm chất lượng cao cho mọi ngóc ngách trong ngôi nhà của bạn.
      </p>
    </section>

    <!-- Filter Bar -->
    <section class="sticky top-[72px] z-40 flex flex-wrap items-center gap-3 px-6 lg:px-20 py-4 bg-white border-b border-[#E5E5E5]" aria-label="Bộ lọc sản phẩm">
      <div role="tablist" aria-label="Danh mục sản phẩm" class="flex flex-wrap gap-3">
        <button
          v-for="cat in categories"
          :key="cat.value"
          role="tab"
          :aria-selected="activeCategory === cat.value"
          :aria-label="'Lọc theo ' + cat.label"
          class="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-[13px] font-medium border transition-all cursor-pointer"
          :class="activeCategory === cat.value
            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
            : 'bg-transparent text-[#666] border-[#E5E5E5] hover:border-[#1A1A1A]'"
          @click="activeCategory = cat.value"
        >
          <Icon :name="cat.icon" size="14" aria-hidden="true" />
          {{ cat.label }}
        </button>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <Icon name="solar:sort-from-top-to-bottom-outline" size="16" class="text-[#888]" aria-hidden="true" />
        <label for="sort-select" class="sr-only">Sắp xếp sản phẩm</label>
        <select
          id="sort-select"
          v-model="sortOrder"
          class="text-sm text-[#666] bg-transparent border border-[#E5E5E5] rounded-lg px-3 py-2 focus:outline-none focus:border-[#0D6E6E] focus:ring-1 focus:ring-[#0D6E6E]/30 cursor-pointer"
        >
          <option value="default">Sắp xếp</option>
          <option value="price-asc">Giá: thấp → cao</option>
          <option value="price-desc">Giá: cao → thấp</option>
          <option value="rating">Đánh giá cao nhất</option>
        </select>
      </div>
    </section>

    <!-- Product Grid -->
    <section class="py-12 px-6 lg:px-20" aria-label="Danh sách sản phẩm">
      <!-- Loading skeleton -->
      <div v-if="status === 'pending'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
          <div class="h-56 img-skeleton" />
          <div class="p-5 space-y-3">
            <div class="h-4 w-24 img-skeleton rounded" />
            <div class="h-5 w-3/4 img-skeleton rounded" />
            <div class="h-6 w-20 img-skeleton rounded" />
            <div class="h-10 w-32 img-skeleton rounded-lg" />
          </div>
        </div>
      </div>

      <!-- Products loaded -->
      <div v-else-if="filteredProducts?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
        <article
          v-for="(product, i) in filteredProducts"
          :key="product.id"
          role="listitem"
          :class="['reveal', `reveal-delay-${(i % 3) + 1}`, 'group bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300']"
        >
          <!-- Image -->
          <div class="relative h-56 overflow-hidden bg-[#F5F5F5]">
            <img
              :src="product.image"
              :alt="product.name"
              loading="lazy"
              decoding="async"
              width="600"
              height="400"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span
              v-if="product.badge"
              class="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
              :class="product.badge === 'Mới' ? 'bg-[#0D6E6E] text-white' : 'bg-[#DC2626] text-white'"
            >
              <Icon :name="product.badge === 'Mới' ? 'solar:star-bold' : 'solar:tag-price-bold'" size="12" aria-hidden="true" />
              {{ product.badge }}
            </span>
          </div>

          <!-- Info -->
          <div class="p-5 space-y-3">
            <div class="flex items-center gap-1" :aria-label="`Đánh giá ${product.rating} trên 5 sao, ${product.reviews} đánh giá`">
              <Icon
                v-for="star in 5"
                :key="star"
                name="solar:star-bold"
                size="14"
                :class="star <= product.rating ? 'text-amber-400' : 'text-gray-200'"
                aria-hidden="true"
              />
              <span class="text-xs text-[#888] ml-1">({{ product.reviews }})</span>
            </div>
            <h3 class="font-medium text-[#1A1A1A] text-base line-clamp-2">{{ product.name }}</h3>
            <div class="flex items-center gap-2">
              <span class="text-lg font-bold text-[#1A1A1A]">{{ product.priceFormatted }}</span>
              <span v-if="product.originalPrice" class="text-sm line-through text-[#CCC]">{{ product.originalPriceFormatted }}</span>
            </div>
            <button
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-[13px] font-medium rounded-lg hover:bg-[#333] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-sm transition-all w-full justify-center sm:w-auto"
              :aria-label="'Thêm ' + product.name + ' vào giỏ hàng'"
            >
              <Icon name="solar:cart-plus-outline" size="16" aria-hidden="true" />
              Thêm giỏ hàng
            </button>
          </div>
        </article>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-20 text-[#888]" role="status">
        <Icon name="solar:box-minimalistic-outline" size="48" class="mx-auto mb-4 opacity-30" aria-hidden="true" />
        <p class="text-lg font-medium mb-2">Không tìm thấy sản phẩm nào.</p>
        <p class="text-sm">Hãy thử chọn danh mục khác hoặc bỏ bộ lọc.</p>
        <button
          class="mt-4 px-6 py-2 bg-[#0D6E6E] text-white text-sm font-medium rounded-lg hover:bg-[#0A5858] transition-colors"
          @click="activeCategory = 'all'; sortOrder = 'default'"
        >
          Xem tất cả sản phẩm
        </button>
      </div>
    </section>
  </div>
</template>
