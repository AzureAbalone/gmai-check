<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
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
  title: 'Sản phẩm — Duyên Phượng',
  meta: [
    { name: 'description', content: 'Khám phá bộ sưu tập đồ gia dụng chất lượng cao cho nhà bếp, phòng tắm, phòng khách. Giá tốt nhất, giao hàng toàn quốc.' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Sản phẩm gia dụng — Duyên Phượng',
        description: 'Bộ sưu tập sản phẩm gia dụng chất lượng cao',
        url: 'https://vinahome.vn/products',
      }),
    },
  ],
})
// ─── Dropdown states ───
const showCategoryDropdown = ref(false)
const showSortDropdown = ref(false)
const categoryDropdownRef = ref<HTMLElement | null>(null)
const sortDropdownRef = ref<HTMLElement | null>(null)

const activeCategoryLabel = computed(() => {
  return categories.find(c => c.value === activeCategory.value)?.label || 'Tất cả'
})

const activeCategoryIcon = computed(() => {
  return categories.find(c => c.value === activeCategory.value)?.icon || 'solar:widget-2-outline'
})

const sortOptions = [
  { value: 'default', label: 'Mặc định' },
  { value: 'price-asc', label: 'Giá: thấp → cao' },
  { value: 'price-desc', label: 'Giá: cao → thấp' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
]

const activeSortLabel = computed(() => {
  return sortOptions.find(s => s.value === sortOrder.value)?.label || 'Sắp xếp'
})

function selectCategory(value: string) {
  activeCategory.value = value
  showCategoryDropdown.value = false
}

function selectSort(value: string) {
  sortOrder.value = value
  showSortDropdown.value = false
}

function handleClickOutside(e: MouseEvent) {
  if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(e.target as Node)) {
    showCategoryDropdown.value = false
  }
  if (sortDropdownRef.value && !sortDropdownRef.value.contains(e.target as Node)) {
    showSortDropdown.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
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
    <section class="sticky top-[72px] z-40 flex items-center gap-3 px-6 lg:px-20 py-4 bg-white border-b border-[#E5E5E5]" aria-label="Bộ lọc sản phẩm">
      <!-- Category Dropdown -->
      <div ref="categoryDropdownRef" class="relative">
        <button
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium border transition-all cursor-pointer"
          :class="showCategoryDropdown
            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
            : activeCategory !== 'all'
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
              : 'bg-transparent text-[#666] border-[#E5E5E5] hover:border-[#1A1A1A]'"
          @click.stop="showCategoryDropdown = !showCategoryDropdown; showSortDropdown = false"
        >
          <Icon :name="activeCategoryIcon" size="14" aria-hidden="true" />
          {{ activeCategoryLabel }}
          <Icon
            name="solar:alt-arrow-down-outline"
            size="14"
            aria-hidden="true"
            class="transition-transform duration-200"
            :class="showCategoryDropdown ? 'rotate-180' : ''"
          />
        </button>
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <div
            v-if="showCategoryDropdown"
            class="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl border border-[#E5E5E5] shadow-lg shadow-black/5 overflow-hidden"
          >
            <button
              v-for="cat in categories"
              :key="cat.value"
              class="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] font-medium text-left transition-colors"
              :class="activeCategory === cat.value
                ? 'bg-[#F5F5F5] text-[#1A1A1A]'
                : 'text-[#666] hover:bg-[#FAFAFA] hover:text-[#1A1A1A]'"
              @click.stop="selectCategory(cat.value)"
            >
              <Icon :name="cat.icon" size="16" aria-hidden="true" />
              {{ cat.label }}
              <Icon
                v-if="activeCategory === cat.value"
                name="solar:check-circle-bold"
                size="14"
                class="ml-auto text-[#0D6E6E]"
                aria-hidden="true"
              />
            </button>
          </div>
        </Transition>
      </div>

      <!-- Sort Dropdown -->
      <div ref="sortDropdownRef" class="relative ml-auto">
        <button
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium border transition-all cursor-pointer"
          :class="showSortDropdown
            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
            : sortOrder !== 'default'
              ? 'bg-[#0D6E6E]/10 text-[#0D6E6E] border-[#0D6E6E]/30'
              : 'bg-transparent text-[#666] border-[#E5E5E5] hover:border-[#1A1A1A]'"
          @click.stop="showSortDropdown = !showSortDropdown; showCategoryDropdown = false"
        >
          <Icon name="solar:sort-from-top-to-bottom-outline" size="14" aria-hidden="true" />
          {{ activeSortLabel }}
          <Icon
            name="solar:alt-arrow-down-outline"
            size="14"
            aria-hidden="true"
            class="transition-transform duration-200"
            :class="showSortDropdown ? 'rotate-180' : ''"
          />
        </button>
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <div
            v-if="showSortDropdown"
            class="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl border border-[#E5E5E5] shadow-lg shadow-black/5 overflow-hidden"
          >
            <button
              v-for="opt in sortOptions"
              :key="opt.value"
              class="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] font-medium text-left transition-colors"
              :class="sortOrder === opt.value
                ? 'bg-[#F5F5F5] text-[#1A1A1A]'
                : 'text-[#666] hover:bg-[#FAFAFA] hover:text-[#1A1A1A]'"
              @click.stop="selectSort(opt.value)"
            >
              {{ opt.label }}
              <Icon
                v-if="sortOrder === opt.value"
                name="solar:check-circle-bold"
                size="14"
                class="ml-auto text-[#0D6E6E]"
                aria-hidden="true"
              />
            </button>
          </div>
        </Transition>
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
            <NuxtImg
              :src="product.image"
              :alt="product.name"
              loading="lazy"
              decoding="async"
              width="600"
              height="400"
              sizes="sm:100vw md:50vw lg:33vw"
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
