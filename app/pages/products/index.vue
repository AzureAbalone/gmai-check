<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useFetch, useHead } from '#imports'
import { useScrollReveal } from '~/composables/useScrollReveal'

useScrollReveal()

// Track if initial reveal animation has completed — after that, skip animation on filter changes
const hasRevealed = ref(false)
onMounted(() => {
  setTimeout(() => { hasRevealed.value = true }, 1200)
})

interface Product {
  id: number
  name: string
  code: string
  category: string
  image: string
  thumbnail: string
  rating: number
  reviews: number
  badge: string | null
}

const { data: products, status } = await useFetch<Product[]>('/api/products', {
  lazy: true,
  default: () => [],
})

// Build categories dynamically from products data
const categorySlugToLabel: Record<string, string> = {
  'au-bat-dia': 'Âu bát đĩa',
  'ban-ghe-1': 'Bàn ghế',
  'bat-rac-hokori': 'Bát rác Hokori',
  'binh-giu-nhiet-hokori': 'Bình giữ nhiệt Hokori',
  'binh-nuoc-1': 'Bình nước',
  'bst-tien-ich': 'BST tiện ích',
  'bst-yeu-bep': 'BST yêu bếp',
  'ca-coc-ly-1': 'Ca cốc ly',
  'chai-can': 'Chai can',
  'chau-gao-xo': 'Chậu gáo xô',
  'chau-hokori': 'Chậu Hokori',
  'coc-hokori': 'Cốc Hokori',
  'dia-hokori': 'Đĩa Hokori',
  'dung-cu-ve-sinh': 'Dụng cụ vệ sinh',
  'dung-cu-ve-sinh-1': 'Dụng cụ vệ sinh',
  'ghe-hokori': 'Ghế Hokori',
  'hop-giay-hokori': 'Hộp giấy Hokori',
  'hop-thuc-pham-2': 'Hộp thực phẩm',
  'ke-gio-mac-ao-1': 'Kệ giỏ mắc áo',
  'ke-hokori': 'Kệ Hokori',
  'khay-da-vi-da-khay-lam-kem-1': 'Khay đá & kem',
  'khay-nhua': 'Khay nhựa',
  'lo-gia-vi-tam-tieu': 'Lọ gia vị',
  'lo-keo-1': 'Lọ keo',
  'mac-ao-hokori': 'Mắc áo Hokori',
  'ong-dua-hop-giay-cam-coc': 'Ống đũa & hộp giấy',
  'ro-can-xe': 'Rổ cần xé',
  'ro-hokori': 'Rổ Hokori',
  'ro-ra-1': 'Rổ rá',
  'san-pham-cao-cap-hokori-1': 'SP cao cấp Hokori',
  'san-pham-giu-nhiet-2': 'SP giữ nhiệt',
  'san-pham-khac-1': 'SP khác',
  'san-pham-tre-em': 'SP trẻ em',
  'song-nhua-ro-can-xe': 'Sọng nhựa & rổ cần xé',
  'thung-chu-nhat': 'Thùng chữ nhật',
  'thung-nhua-tron': 'Thùng nhựa tròn',
  'thung-rac-bat-rac': 'Thùng rác & bát rác',
  'tu-hokori-1': 'Tủ Hokori',
  'tu-lucky-1': 'Tủ Lucky',
  'tu-my-pham-hokori': 'Tủ mỹ phẩm Hokori',
}

const dynamicCategories = computed(() => {
  const cats = new Set((products.value || []).map(p => p.category))
  return [
    { value: 'all', label: 'Tất cả' },
    ...Array.from(cats).sort().map(slug => ({
      value: slug,
      label: categorySlugToLabel[slug] || slug.replace(/-\d+$/, '').replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()),
    })),
  ]
})

const activeCategory = ref('all')
const sortOrder = ref('default')
const route = useRoute()
const router = useRouter()

function getCategoryFromQuery(category: unknown) {
  if (typeof category === 'string') {
    // Accept any category slug from the data
    const valid = new Set(dynamicCategories.value.map(c => c.value))
    if (valid.has(category)) return category
  }
  return 'all'
}

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

  // Reset to page 1 when category changes
  currentPage.value = 1

  router.replace({ query: nextQuery })
})

const filteredProducts = computed(() => {
  let items = products.value || []
  if (activeCategory.value !== 'all') {
    items = items.filter((p) => p.category === activeCategory.value)
  }
  if (sortOrder.value === 'rating') {
    items = [...items].sort((a, b) => b.rating - a.rating)
  }
  return items
})

// ─── Pagination ───
const ITEMS_PER_PAGE = 9

// Initialize from URL but keep it local to prevent re-renders on page change
const initialPage = Number(route.query.page)
const currentPage = ref((initialPage > 0 && Number.isInteger(initialPage)) ? initialPage : 1)

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredProducts.value.length / ITEMS_PER_PAGE))
})

// Clamp page when filters change and reduce total pages
watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = newTotal
  }
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredProducts.value.slice(start, start + ITEMS_PER_PAGE)
})

// Visible page numbers (window of 5 around current)
const visiblePages = computed(() => {
  const total = totalPages.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  const current = currentPage.value
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)

  // Adjust window if near edges
  if (current <= 3) {
    end = 5
  } else if (current >= total - 2) {
    start = total - 4
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const firstVisiblePage = computed(() => visiblePages.value[0] ?? 1)
const lastVisiblePage = computed(() => visiblePages.value[visiblePages.value.length - 1] ?? totalPages.value)

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return

  currentPage.value = page

  // Update URL without triggering Nuxt re-render
  const nextQuery = new URLSearchParams(window.location.search)
  if (page === 1) nextQuery.delete('page')
  else nextQuery.set('page', String(page))
  
  const newUrl = window.location.pathname + (nextQuery.toString() ? `?${nextQuery.toString()}` : '')
  window.history.replaceState({}, '', newUrl)
}

// ─── Hide mobile pagination when footer is visible ───
const isFooterVisible = ref(false)

onMounted(() => {
  const footer = document.querySelector('footer')
  if (!footer) return

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry) isFooterVisible.value = entry.isIntersecting
    },
    { threshold: 0 }
  )
  observer.observe(footer)

  onBeforeUnmount(() => observer.disconnect())
})

// Reset page when category/sort changes
watch([activeCategory, sortOrder], () => {
  currentPage.value = 1
})

// ─── SEO ───
useHead({
  title: 'Sản phẩm — Duyên Phượng',
  meta: [
    { name: 'description', content: 'Khám phá bộ sưu tập đồ gia dụng chất lượng cao cho nhà bếp, phòng tắm, phòng khách. Liên hệ để được tư vấn và báo giá.' },
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
  return dynamicCategories.value.find(c => c.value === activeCategory.value)?.label || 'Tất cả'
})

const sortOptions = [
  { value: 'default', label: 'Mặc định' },
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
    <section class="sticky top-[72px] z-40 flex items-center gap-3 px-6 lg:px-20 py-4 bg-white border-b border-[#E5E5E5] relative" aria-label="Bộ lọc sản phẩm">
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
          <Icon name="solar:widget-2-outline" size="14" aria-hidden="true" />
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
            class="absolute top-full left-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white rounded-xl border border-[#E5E5E5] shadow-lg shadow-black/5"
          >
            <button
              v-for="cat in dynamicCategories"
              :key="cat.value"
              class="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] font-medium text-left transition-colors"
              :class="activeCategory === cat.value
                ? 'bg-[#F5F5F5] text-[#1A1A1A]'
                : 'text-[#666] hover:bg-[#FAFAFA] hover:text-[#1A1A1A]'"
              @click.stop="selectCategory(cat.value)"
            >
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

      <!-- ★ Center: Expanding Search Magnifier ★ -->
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <SearchOverlay />
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
    <section class="py-12 px-6 lg:px-20 pb-28 lg:pb-12" aria-label="Danh sách sản phẩm">
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
      <div v-else-if="paginatedProducts?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
        <article
          v-for="(product, i) in paginatedProducts"
          :key="product.id"
          role="listitem"
          :class="[
            'reveal',
            `reveal-delay-${(i % 3) + 1}`,
            { 'visible': hasRevealed },
            'group bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300',
          ]"
        >
          <!-- Image -->
          <div class="product-shine relative h-56 overflow-hidden bg-[#F5F5F5]">
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
              class="badge-pulse absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
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
            <NuxtLink
              :to="`/products/${product.id}`"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-[13px] font-medium rounded-lg hover:bg-[#333] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-sm transition-all w-full justify-center sm:w-auto"
              :aria-label="'Xem chi tiết ' + product.name"
            >
              <Icon name="solar:info-circle-outline" size="16" aria-hidden="true" />
              Xem chi tiết
            </NuxtLink>
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

      <!-- Desktop Pagination (hidden on mobile) -->
      <nav
        v-if="totalPages > 1 && paginatedProducts?.length"
        class="hidden lg:flex items-center justify-center gap-2 mt-12"
        aria-label="Phân trang sản phẩm"
      >
        <!-- Previous -->
        <button
          :disabled="currentPage === 1"
          class="pagination-btn pagination-nav"
          :class="{ 'pagination-disabled': currentPage === 1 }"
          aria-label="Trang trước"
          @click="goToPage(currentPage - 1)"
        >
          <Icon name="solar:alt-arrow-left-outline" size="16" aria-hidden="true" />
        </button>

        <!-- First + ellipsis -->
        <template v-if="firstVisiblePage > 1">
          <button class="pagination-btn" @click="goToPage(1)">1</button>
          <span v-if="firstVisiblePage > 2" class="pagination-ellipsis">…</span>
        </template>

        <!-- Page numbers -->
        <button
          v-for="page in visiblePages"
          :key="page"
          class="pagination-btn"
          :class="{ 'pagination-active': page === currentPage }"
          :aria-current="page === currentPage ? 'page' : undefined"
          :aria-label="`Trang ${page}`"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <!-- Last + ellipsis -->
        <template v-if="lastVisiblePage < totalPages">
          <span v-if="lastVisiblePage < totalPages - 1" class="pagination-ellipsis">…</span>
          <button class="pagination-btn" @click="goToPage(totalPages)">{{ totalPages }}</button>
        </template>

        <!-- Next -->
        <button
          :disabled="currentPage === totalPages"
          class="pagination-btn pagination-nav"
          :class="{ 'pagination-disabled': currentPage === totalPages }"
          aria-label="Trang sau"
          @click="goToPage(currentPage + 1)"
        >
          <Icon name="solar:alt-arrow-right-outline" size="16" aria-hidden="true" />
        </button>
      </nav>

      <!-- Result count -->
      <p v-if="filteredProducts?.length" class="hidden lg:block text-center text-xs text-[#999] mt-4">
        Hiển thị {{ (currentPage - 1) * ITEMS_PER_PAGE + 1 }}–{{ Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length) }}
        trên {{ filteredProducts.length }} sản phẩm
      </p>
    </section>

    <!-- Mobile Sticky Pagination (visible only on mobile/tablet) -->
    <Transition name="fade-slide">
    <nav
      v-if="totalPages > 1 && paginatedProducts?.length && !isFooterVisible"
      class="pagination-mobile-sticky lg:hidden"
      aria-label="Phân trang sản phẩm"
    >
      <div class="pagination-mobile-inner">
        <!-- Previous -->
        <button
          :disabled="currentPage === 1"
          class="pagination-btn pagination-nav"
          :class="{ 'pagination-disabled': currentPage === 1 }"
          aria-label="Trang trước"
          @click="goToPage(currentPage - 1)"
        >
          <Icon name="solar:alt-arrow-left-outline" size="16" aria-hidden="true" />
        </button>

        <!-- Page info -->
        <div class="flex items-center gap-1.5">
          <button
            v-for="page in visiblePages"
            :key="page"
            class="pagination-btn pagination-btn-sm"
            :class="{ 'pagination-active': page === currentPage }"
            :aria-current="page === currentPage ? 'page' : undefined"
            :aria-label="`Trang ${page}`"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>

        <!-- Next -->
        <button
          :disabled="currentPage === totalPages"
          class="pagination-btn pagination-nav"
          :class="{ 'pagination-disabled': currentPage === totalPages }"
          aria-label="Trang sau"
          @click="goToPage(currentPage + 1)"
        >
          <Icon name="solar:alt-arrow-right-outline" size="16" aria-hidden="true" />
        </button>
      </div>

      <!-- Result count mobile -->
      <p class="text-center text-[11px] text-[#999] mt-1">
        {{ (currentPage - 1) * ITEMS_PER_PAGE + 1 }}–{{ Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length) }}
        / {{ filteredProducts.length }}
      </p>
    </nav>
    </Transition>
  </div>
</template>
