<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'

useScrollReveal()

const route = useRoute()
const productId = Number(route.params.id)

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

interface ProductSummary {
  id: number
  name: string
  category: string
  image: string
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

// Related products: same category first, then others, exclude current, limit to 4
const relatedProducts = computed(() => {
  if (!allProducts.value || !product.value) return []
  const others = allProducts.value.filter(p => p.id !== productId)
  const sameCategory = others.filter(p => p.category === product.value!.category)
  const diffCategory = others.filter(p => p.category !== product.value!.category)
  return [...sameCategory, ...diffCategory].slice(0, 4)
})


// ─── Reactive state ───
const selectedColorIndex = ref(0)
const activeImageIndex = ref(0)


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
        offers: {
          '@type': 'Offer',
          price: product.value?.price || 0,
          priceCurrency: 'VND',
          availability: 'https://schema.org/InStock',
        },
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
          <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm text-[#888]">
            <NuxtLink to="/" class="hover:text-[#0D6E6E] transition-colors">Trang chủ</NuxtLink>
            <Icon name="solar:alt-arrow-right-linear" size="14" aria-hidden="true" />
            <NuxtLink to="/products" class="hover:text-[#0D6E6E] transition-colors">Sản phẩm</NuxtLink>
            <Icon name="solar:alt-arrow-right-linear" size="14" aria-hidden="true" />
            <span class="text-[#666] font-medium">{{ categoryLabel }}</span>
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
              class="inline-flex items-center gap-2 text-sm font-medium text-[#888] hover:text-[#0D6E6E] transition-colors"
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
              <span class="text-sm text-[#666]">{{ product.rating }}.0</span>
              <span class="text-sm text-[#999]">({{ product.reviews }} đánh giá)</span>
            </div>



            <!-- Description -->
            <p class="text-[15px] leading-relaxed text-[#666]">
              {{ product.description }}
            </p>

            <!-- Divider -->
            <div class="border-t border-[#E5E5E5]" />

            <!-- Color Swatches -->
            <div class="space-y-3">
              <p class="text-sm font-medium text-[#1A1A1A]">
                Màu sắc: <span class="font-normal text-[#666]">{{ selectedColor?.name }}</span>
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
                    <span class="text-[#888] min-w-[120px]">{{ spec.label }}</span>
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
                <p class="text-sm leading-relaxed text-[#666]">{{ product.productInfo }}</p>
              </div>

              <!-- Ưu điểm -->
              <div v-if="product.advantages?.length" class="border-b border-[#E5E5E5] py-4">
                <h3 class="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2 mb-3">
                  <Icon name="solar:star-outline" size="16" class="text-[#0D6E6E]" aria-hidden="true" />
                  Ưu điểm
                </h3>
                <ul class="space-y-2">
                  <li v-for="(item, i) in product.advantages" :key="i" class="flex items-start gap-2 text-sm text-[#666]">
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
                  <li v-for="(item, i) in product.usage" :key="i" class="flex items-start gap-2 text-sm text-[#666]">
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
                  <li v-for="(item, i) in product.storage" :key="i" class="flex items-start gap-2 text-sm text-[#666]">
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
      <section v-if="relatedProducts.length" class="py-16 px-6 lg:px-20 bg-[#FAFAFA] border-t border-[#E5E5E5]" aria-labelledby="related-heading">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between mb-8">
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

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <NuxtLink
              v-for="rp in relatedProducts"
              :key="rp.id"
              :to="`/products/${rp.id}`"
              class="group bg-white rounded-2xl overflow-hidden border border-[#E5E5E5] hover:border-[#0D6E6E]/30 hover:shadow-lg transition-all duration-300"
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
                <!-- Badge -->
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
                <!-- Rating -->
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

          <!-- Mobile: View all link -->
          <div class="flex justify-center mt-8 sm:hidden">
            <NuxtLink
              to="/products"
              class="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#0D6E6E] border border-[#0D6E6E]/30 rounded-xl hover:bg-[#0D6E6E]/5 transition-colors"
            >
              Xem tất cả sản phẩm
              <Icon name="solar:arrow-right-outline" size="16" aria-hidden="true" />
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>

    <!-- Error state -->
    <div v-else class="flex flex-col items-center justify-center py-32 px-6 text-center">
      <Icon name="solar:box-minimalistic-outline" size="64" class="text-[#E5E5E5] mb-6" aria-hidden="true" />
      <h1 class="font-['Newsreader'] text-2xl font-medium text-[#1A1A1A] mb-2">Không tìm thấy sản phẩm</h1>
      <p class="text-[#888] mb-6">Sản phẩm này không tồn tại hoặc đã bị xóa.</p>
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
