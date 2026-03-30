<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'

useScrollReveal()

const route = useRoute()
const productId = Number(route.params.id)

interface ProductDetail {
  id: number
  name: string
  code: string
  category: string
  image: string
  images: string[]
  thumbnail: string
  rating: number
  reviews: number
  badge: string | null
  description: string
  productInfo: string
  advantages: string[]
  usage: string[]
  storage: string[]
  colors: { name: string; hex: string }[]
  specs: { label: string; value: string }[]
  url: string
}

interface ProductSummary {
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

const { data: product, status } = await useFetch<ProductDetail>(`/api/products/${productId}`)

// Fetch all products for the related section
const { data: allProducts } = await useFetch<ProductSummary[]>('/api/products', {
  lazy: true,
  default: () => [],
})

// Related products: same category first, then others, exclude current, limit to 10
const relatedProducts = computed(() => {
  if (!allProducts.value || !product.value) return []
  const others = allProducts.value.filter(p => p.id !== productId)
  const sameCategory = others.filter(p => p.category === product.value!.category)
  const diffCategory = others.filter(p => p.category !== product.value!.category)
  return [...sameCategory, ...diffCategory].slice(0, 10)
})


// ─── Reactive state ───
const selectedColorIndex = ref(0)
const activeImageIndex = ref(0)

// ─── Related Products Carousel ───
const carouselRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)
let scrollRafId: number | null = null

function updateScrollState() {
  const el = carouselRef.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 4
  canScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 4
}

function onScroll() {
  // Debounce with rAF — prevents rapid state flicker during smooth scroll
  if (scrollRafId) cancelAnimationFrame(scrollRafId)
  scrollRafId = requestAnimationFrame(updateScrollState)
}

function scrollCarousel(direction: 'left' | 'right') {
  const el = carouselRef.value
  if (!el) return
  const step = el.clientWidth * 0.7
  if (direction === 'left') {
    // Always snap fully to start when going left
    const target = Math.max(0, el.scrollLeft - step)
    // If we'd be within one card width of start, just go to 0
    el.scrollTo({ left: target < 260 ? 0 : target, behavior: 'smooth' })
  } else {
    const maxScroll = el.scrollWidth - el.clientWidth
    const target = el.scrollLeft + step
    el.scrollTo({ left: target >= maxScroll - 260 ? maxScroll : target, behavior: 'smooth' })
  }
  setTimeout(updateScrollState, 500)
}

// Block mouse wheel scroll on desktop (nav buttons only)
function preventDesktopScroll(e: WheelEvent) {
  if (window.innerWidth >= 1024) e.preventDefault()
}

onMounted(() => {
  const el = carouselRef.value
  if (!el) return
  el.addEventListener('scroll', onScroll, { passive: true })
  el.addEventListener('wheel', preventDesktopScroll, { passive: false })
  setTimeout(updateScrollState, 100)
})

onBeforeUnmount(() => {
  carouselRef.value?.removeEventListener('scroll', onScroll)
  carouselRef.value?.removeEventListener('wheel', preventDesktopScroll)
  if (scrollRafId) cancelAnimationFrame(scrollRafId)
})


// ─── Computed ───
const selectedColor = computed(() => product.value?.colors?.[selectedColorIndex.value])



const categoryLabel = computed(() => {
  const map: Record<string, string> = {
    kitchen: 'Nhà bếp',
    bathroom: 'Phòng tắm',
    living: 'Phòng khách',
  }
  return map[product.value?.category || ''] || 'Sản phẩm'
})



function selectImage(index: number) {
  activeImageIndex.value = index
}

function selectColor(index: number) {
  selectedColorIndex.value = index
}



// ─── SEO ───
useHead({
  title: computed(() => product.value ? `${product.value.name} — Duyên Phượng` : 'Chi tiết sản phẩm — Duyên Phượng'),
  meta: [
    { name: 'description', content: computed(() => product.value?.description || 'Chi tiết sản phẩm gia dụng cao cấp') },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.value?.name || '',
        description: product.value?.description || '',
        image: product.value?.images?.[0] || '',
        brand: { '@type': 'Brand', name: 'Duyên Phượng' },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.value?.rating || 0,
          reviewCount: product.value?.reviews || 0,
        },
        availability: 'https://schema.org/InStock',
      })),
    },
  ],
})
</script>

<template>
  <div>
    <!-- Loading skeleton -->
    <div v-if="status === 'pending'" class="py-12 px-6 lg:px-20">
      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        <div class="flex-1">
          <div class="h-[400px] lg:h-[520px] img-skeleton rounded-2xl" />
          <div class="flex gap-3 mt-4">
            <div v-for="n in 3" :key="n" class="w-20 h-20 img-skeleton rounded-xl" />
          </div>
        </div>
        <div class="flex-1 space-y-6">
          <div class="h-4 w-40 img-skeleton rounded" />
          <div class="h-8 w-3/4 img-skeleton rounded" />
          <div class="h-6 w-32 img-skeleton rounded" />
          <div class="h-20 w-full img-skeleton rounded" />
          <div class="h-14 w-48 img-skeleton rounded-xl" />
        </div>
      </div>
    </div>

    <!-- Product loaded -->
    <div v-else-if="product">
      <!-- Breadcrumb -->
      <section class="bg-[#FAFAFA] border-b border-[#E5E5E5]" aria-label="Breadcrumb">
        <div class="max-w-7xl mx-auto px-6 lg:px-20 py-4">
          <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm text-[#666]">
            <NuxtLink to="/" class="hover:text-[#0D6E6E] transition-colors">Trang chủ</NuxtLink>
            <Icon name="solar:alt-arrow-right-linear" size="14" aria-hidden="true" />
            <NuxtLink to="/products" class="hover:text-[#0D6E6E] transition-colors">Sản phẩm</NuxtLink>
            <Icon name="solar:alt-arrow-right-linear" size="14" aria-hidden="true" />
            <span class="text-[#555] font-medium">{{ categoryLabel }}</span>
            <Icon name="solar:alt-arrow-right-linear" size="14" aria-hidden="true" class="hidden sm:block" />
            <span class="text-[#1A1A1A] font-medium hidden sm:block line-clamp-1">{{ product.name }}</span>
          </nav>
        </div>
      </section>

      <!-- Main PDP Content -->
      <section class="py-8 lg:py-12 px-6 lg:px-20 bg-white">
        <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16">

          <!-- ═══ LEFT: Image Gallery ═══ -->
          <div class="reveal flex-1 lg:max-w-[55%] lg:sticky lg:top-[100px] lg:self-start">
            <!-- Main Image -->
            <div class="relative rounded-2xl overflow-hidden bg-[#F5F5F5] h-[360px] sm:h-[440px] lg:h-[520px] group">
              <NuxtImg
                :src="product.images[activeImageIndex] || product.image"
                :alt="product.name"
                loading="eager"
                decoding="async"
                width="800"
                height="600"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <!-- Badge -->
              <span
                v-if="product.badge"
                class="badge-pulse absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
                :class="product.badge === 'Mới' ? 'bg-[#0D6E6E] text-white' : 'bg-[#DC2626] text-white'"
              >
                <Icon :name="product.badge === 'Mới' ? 'solar:star-bold' : 'solar:tag-price-bold'" size="12" aria-hidden="true" />
                {{ product.badge }}
              </span>
            </div>

            <!-- Thumbnails -->
            <div class="flex gap-3 mt-4 overflow-x-auto pb-1">
              <button
                v-for="(img, i) in product.images"
                :key="i"
                class="pdp-thumbnail flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer"
                :class="i === activeImageIndex
                  ? 'border-[#0D6E6E] shadow-[0_0_0_2px_rgba(13,110,110,0.15)]'
                  : 'border-[#E5E5E5] hover:border-[#999]'"
                :aria-label="`Xem ảnh ${i + 1}`"
                @click="selectImage(i)"
              >
                <NuxtImg
                  :src="img"
                  :alt="`${product.name} — ảnh ${i + 1}`"
                  loading="lazy"
                  decoding="async"
                  width="160"
                  height="160"
                  class="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>

          <!-- ═══ RIGHT: Product Info ═══ -->
          <div class="reveal reveal-delay-1 flex-1 space-y-6">

            <!-- Back to products -->
            <NuxtLink
              to="/products"
              class="inline-flex items-center gap-2 text-sm font-medium text-[#666] hover:text-[#0D6E6E] transition-colors"
            >
              <Icon name="solar:arrow-left-outline" size="16" aria-hidden="true" />
              Xem tất cả sản phẩm
            </NuxtLink>

            <!-- Category + Title -->
            <div class="space-y-3">
              <span class="font-mono text-[11px] font-semibold tracking-[2px] text-[#0D6E6E] uppercase">
                <span class="section-dot mr-2" aria-hidden="true" />{{ categoryLabel }}
              </span>
              <h1 class="font-['Newsreader'] text-2xl lg:text-[32px] font-medium leading-[1.2] text-[#1A1A1A]">
                {{ product.name }}
              </h1>
            </div>

            <!-- Rating -->
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-0.5" :aria-label="`Đánh giá ${product.rating} trên 5 sao`">
                <Icon
                  v-for="star in 5"
                  :key="star"
                  name="solar:star-bold"
                  size="16"
                  :class="star <= product.rating ? 'text-amber-400' : 'text-gray-200'"
                  aria-hidden="true"
                />
              </div>
              <span class="text-sm text-[#555]">{{ product.rating }}.0</span>
              <span class="text-sm text-[#777]">({{ product.reviews }} đánh giá)</span>
            </div>




            <!-- Color Swatches -->
            <div class="space-y-3">
              <p class="text-sm font-medium text-[#1A1A1A]">
                Màu sắc: <span class="font-normal text-[#555]">{{ selectedColor?.name }}</span>
              </p>
              <div class="flex items-center gap-3">
                <button
                  v-for="(color, i) in product.colors"
                  :key="color.hex"
                  class="pdp-color-swatch w-10 h-10 rounded-full border-2 transition-all duration-200 cursor-pointer"
                  :class="i === selectedColorIndex
                    ? 'border-[#0D6E6E] ring-2 ring-[#0D6E6E]/20 ring-offset-2 scale-110'
                    : 'border-[#E5E5E5] hover:border-[#999] hover:scale-105'"
                  :style="{ backgroundColor: color.hex }"
                  :aria-label="`Chọn màu ${color.name}`"
                  :title="color.name"
                  @click="selectColor(i)"
                />
              </div>
            </div>



            <!-- Divider -->
            <div class="border-t border-[#E5E5E5]" />

            <!-- Product Detail Sections (always visible) -->
            <div class="space-y-0">
              <!-- Product Specs -->
              <div class="border-b border-[#E5E5E5] py-4">
                <h3 class="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2 mb-3">
                  <Icon name="solar:document-text-outline" size="16" class="text-[#0D6E6E]" aria-hidden="true" />
                  Thông số kỹ thuật
                </h3>
                <div class="space-y-2">
                  <div
                    v-for="spec in product.specs"
                    :key="spec.label"
                    class="flex items-start gap-4 text-sm py-1.5"
                  >
                    <span class="text-[#666] min-w-[120px]">{{ spec.label }}</span>
                    <span class="text-[#1A1A1A] font-medium">{{ spec.value }}</span>
                  </div>
                </div>
              </div>

              <!-- Mô tả sản phẩm -->
              <div class="border-b border-[#E5E5E5] py-4">
                <h3 class="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2 mb-3">
                  <Icon name="solar:info-circle-outline" size="16" class="text-[#0D6E6E]" aria-hidden="true" />
                  Mô tả sản phẩm
                </h3>
                <p class="text-sm leading-relaxed text-[#555]">{{ product.productInfo }}</p>
              </div>

              <!-- Ưu điểm -->
              <div v-if="product.advantages?.length" class="border-b border-[#E5E5E5] py-4">
                <h3 class="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2 mb-3">
                  <Icon name="solar:star-outline" size="16" class="text-[#0D6E6E]" aria-hidden="true" />
                  Ưu điểm
                </h3>
                <ul class="space-y-2">
                  <li v-for="(item, i) in product.advantages" :key="i" class="flex items-start gap-2 text-sm text-[#555]">
                    <Icon name="solar:check-circle-bold" size="16" class="text-[#0D6E6E] mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>

              <!-- Hướng dẫn sử dụng -->
              <div v-if="product.usage?.length" class="border-b border-[#E5E5E5] py-4">
                <h3 class="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2 mb-3">
                  <Icon name="solar:hand-stars-outline" size="16" class="text-[#0D6E6E]" aria-hidden="true" />
                  Hướng dẫn sử dụng
                </h3>
                <ul class="space-y-2">
                  <li v-for="(item, i) in product.usage" :key="i" class="flex items-start gap-2 text-sm text-[#555]">
                    <span class="text-[#0D6E6E] font-medium">•</span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>

              <!-- Bảo quản -->
              <div v-if="product.storage?.length" class="border-b border-[#E5E5E5] py-4">
                <h3 class="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2 mb-3">
                  <Icon name="solar:shield-check-outline" size="16" class="text-[#0D6E6E]" aria-hidden="true" />
                  Bảo quản
                </h3>
                <ul class="space-y-2">
                  <li v-for="(item, i) in product.storage" :key="i" class="flex items-start gap-2 text-sm text-[#555]">
                    <span class="text-[#0D6E6E] font-medium">•</span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════ RELATED PRODUCTS ═══════════════════════ -->
      <section v-if="relatedProducts.length" class="py-16 bg-[#FAFAFA] border-t border-[#E5E5E5]" aria-labelledby="related-heading">
        <!-- Header -->
        <div class="max-w-7xl mx-auto px-6 lg:px-20 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between gap-2 mb-8">
          <h2 id="related-heading" class="font-['Newsreader'] text-2xl lg:text-3xl font-medium text-[#1A1A1A]">
            Sản phẩm liên quan
          </h2>
          <NuxtLink
            to="/products"
            class="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-[#0D6E6E] hover:text-[#0A5858] transition-colors"
          >
            Xem tất cả
            <Icon name="solar:arrow-right-outline" size="16" aria-hidden="true" />
          </NuxtLink>
        </div>

        <!-- Carousel wrapper with side nav buttons -->
        <div class="relative max-w-7xl mx-auto">
          <!-- ◀ Left nav button (desktop) — floats on left side -->
          <button
            v-show="canScrollLeft"
            class="related-nav-btn hidden lg:flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm border border-[#E5E5E5] shadow-lg shadow-black/8 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all duration-200 cursor-pointer"
            aria-label="Cuộn sang trái"
            @click="scrollCarousel('left')"
          >
            <Icon name="solar:alt-arrow-left-outline" size="20" aria-hidden="true" />
          </button>

          <!-- ▶ Right nav button (desktop) — floats on right side -->
          <button
            v-show="canScrollRight"
            class="related-nav-btn hidden lg:flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm border border-[#E5E5E5] shadow-lg shadow-black/8 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all duration-200 cursor-pointer"
            aria-label="Cuộn sang phải"
            @click="scrollCarousel('right')"
          >
            <Icon name="solar:alt-arrow-right-outline" size="20" aria-hidden="true" />
          </button>

          <!-- Left fade gradient — only when scrolled past start -->
          <div
            v-show="canScrollLeft"
            class="absolute left-0 top-0 bottom-0 w-16 lg:w-24 bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/70 to-transparent z-10 pointer-events-none transition-opacity duration-300"
          />
          <!-- Right fade gradient — only when more content to the right -->
          <div
            v-show="canScrollRight"
            class="absolute right-0 top-0 bottom-0 w-16 lg:w-24 bg-gradient-to-l from-[#FAFAFA] via-[#FAFAFA]/70 to-transparent z-10 pointer-events-none transition-opacity duration-300"
          />

          <!-- Scrollable track -->
          <div
            ref="carouselRef"
            class="related-carousel flex gap-5 overflow-x-auto scroll-smooth px-6 lg:px-20 pb-2"
          >
            <NuxtLink
              v-for="rp in relatedProducts"
              :key="rp.id"
              :prefetch="false"
              :to="`/products/${rp.id}`"
              class="related-card group flex-none w-[180px] sm:w-[210px] lg:w-[240px] bg-white rounded-2xl overflow-hidden border border-[#E5E5E5] hover:border-[#0D6E6E]/30 hover:shadow-lg transition-all duration-300"
            >
              <!-- Image -->
              <div class="relative aspect-square overflow-hidden bg-[#F5F5F5]">
                <NuxtImg
                  :src="rp.image"
                  :alt="rp.name"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="400"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  v-if="rp.badge"
                  class="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  :class="rp.badge === 'Mới' ? 'bg-[#0D6E6E] text-white' : 'bg-[#DC2626] text-white'"
                >
                  <Icon :name="rp.badge === 'Mới' ? 'solar:star-bold' : 'solar:tag-price-bold'" size="10" aria-hidden="true" />
                  {{ rp.badge }}
                </span>
              </div>
              <!-- Info -->
              <div class="p-4 space-y-2">
                <h3 class="text-sm font-medium text-[#1A1A1A] leading-snug line-clamp-2 group-hover:text-[#0D6E6E] transition-colors">
                  {{ rp.name }}
                </h3>
                <div class="flex items-center gap-1">
                  <div class="flex items-center gap-0.5">
                    <Icon
                      v-for="star in 5"
                      :key="star"
                      name="solar:star-bold"
                      size="12"
                      :class="star <= rp.rating ? 'text-amber-400' : 'text-gray-200'"
                      aria-hidden="true"
                    />
                  </div>
                  <span class="text-xs text-[#999]">({{ rp.reviews }})</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Mobile: View all link -->
        <div class="flex justify-center mt-6 sm:hidden">
          <NuxtLink
            to="/products"
            class="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#0D6E6E] border border-[#0D6E6E]/30 rounded-xl hover:bg-[#0D6E6E]/5 transition-colors"
          >
            Xem tất cả sản phẩm
            <Icon name="solar:arrow-right-outline" size="16" aria-hidden="true" />
          </NuxtLink>
        </div>
      </section>
    </div>

    <!-- Error state -->
    <div v-else class="flex flex-col items-center justify-center py-32 px-6 text-center">
      <Icon name="solar:box-minimalistic-outline" size="64" class="text-[#E5E5E5] mb-6" aria-hidden="true" />
      <h1 class="font-['Newsreader'] text-2xl font-medium text-[#1A1A1A] mb-2">Không tìm thấy sản phẩm</h1>
      <p class="text-[#666] mb-6">Sản phẩm này không tồn tại hoặc đã bị xóa.</p>
      <NuxtLink
        to="/products"
        class="inline-flex items-center gap-2 px-6 py-3 bg-[#0D6E6E] text-white text-sm font-semibold rounded-xl hover:bg-[#0A5858] transition-colors"
      >
        <Icon name="solar:arrow-left-outline" size="16" aria-hidden="true" />
        Quay lại sản phẩm
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
/* ─── Related Products Carousel ─── */
.related-carousel {
  scrollbar-width: none;
  -ms-overflow-style: none;
  /* Snap only on mobile for touch swipe */
  scroll-snap-type: x mandatory;
  scroll-padding-left: 24px;
}
@media (min-width: 1024px) {
  .related-carousel {
    /* No snap on desktop — let nav buttons scroll freely and smoothly */
    scroll-snap-type: none;
  }
}
.related-carousel::-webkit-scrollbar {
  display: none;
}
.related-card {
  scroll-snap-align: start;
}
</style>
