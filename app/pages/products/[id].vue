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
  colors: { name: string; hex: string }[]
  specs: { label: string; value: string }[]
  inTheBox: string[]
  features: string[]
}

const { data: product, status } = await useFetch<ProductDetail>(`/api/products/${productId}`)


// ─── Reactive state ───
const selectedColorIndex = ref(0)
const quantity = ref(1)
const activeImageIndex = ref(0)
const openAccordion = ref<string | null>('specs')

// ─── Computed ───
const selectedColor = computed(() => product.value?.colors?.[selectedColorIndex.value])

const formattedPrice = computed(() => {
  if (!product.value) return ''
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.value.price)
})

const formattedOriginalPrice = computed(() => {
  if (!product.value?.originalPrice) return ''
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.value.originalPrice)
})

const discountPercent = computed(() => {
  if (!product.value?.originalPrice) return null
  return Math.round((1 - product.value.price / product.value.originalPrice) * 100)
})

const categoryLabel = computed(() => {
  const map: Record<string, string> = {
    kitchen: 'Nhà bếp',
    bathroom: 'Phòng tắm',
    living: 'Phòng khách',
  }
  return map[product.value?.category || ''] || 'Sản phẩm'
})

// ─── Actions ───
function adjustQuantity(delta: number) {
  const newVal = quantity.value + delta
  if (newVal >= 1 && newVal <= 99) {
    quantity.value = newVal
  }
}

function selectImage(index: number) {
  activeImageIndex.value = index
}

function selectColor(index: number) {
  selectedColorIndex.value = index
}

function toggleAccordion(key: string) {
  openAccordion.value = openAccordion.value === key ? null : key
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
          <div class="reveal flex-1 lg:max-w-[55%]">
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
          <div class="reveal reveal-delay-1 flex-1 space-y-6 lg:sticky lg:top-[100px] lg:self-start">

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

            <!-- Price -->
            <div class="flex items-baseline gap-3">
              <span class="text-3xl lg:text-[36px] font-bold text-[#1A1A1A]">{{ formattedPrice }}</span>
              <span v-if="formattedOriginalPrice" class="text-lg text-[#999] line-through">{{ formattedOriginalPrice }}</span>
              <span
                v-if="discountPercent"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600"
              >
                -{{ discountPercent }}%
              </span>
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

            <!-- Quantity + Add to Cart -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <!-- Quantity selector -->
              <div class="flex items-center border border-[#E5E5E5] rounded-xl overflow-hidden">
                <button
                  class="pdp-quantity-btn w-12 h-12 flex items-center justify-center text-[#666] hover:bg-[#F5F5F5] hover:text-[#1A1A1A] transition-colors"
                  :disabled="quantity <= 1"
                  :class="{ 'opacity-30 cursor-not-allowed': quantity <= 1 }"
                  aria-label="Giảm số lượng"
                  @click="adjustQuantity(-1)"
                >
                  <Icon name="solar:minus-circle-outline" size="18" aria-hidden="true" />
                </button>
                <span class="w-12 h-12 flex items-center justify-center text-base font-semibold text-[#1A1A1A] select-none border-x border-[#E5E5E5]">
                  {{ quantity }}
                </span>
                <button
                  class="pdp-quantity-btn w-12 h-12 flex items-center justify-center text-[#666] hover:bg-[#F5F5F5] hover:text-[#1A1A1A] transition-colors"
                  :disabled="quantity >= 99"
                  aria-label="Tăng số lượng"
                  @click="adjustQuantity(1)"
                >
                  <Icon name="solar:add-circle-outline" size="18" aria-hidden="true" />
                </button>
              </div>

              <!-- Add to cart -->
              <button
                class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#0D6E6E] text-white text-base font-semibold rounded-xl hover:bg-[#0A5858] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-lg transition-all"
              >
                <Icon name="solar:cart-plus-bold" size="20" aria-hidden="true" />
                Thêm vào giỏ hàng
              </button>
            </div>

            <!-- Trust Badges -->
            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <div class="flex items-center gap-2.5 px-4 py-3 bg-[#F5F9F9] rounded-xl border border-[#E0EFEF]">
                <Icon name="solar:delivery-bold" size="20" class="text-[#0D6E6E]" aria-hidden="true" />
                <div>
                  <p class="text-xs font-semibold text-[#1A1A1A]">Miễn phí vận chuyển</p>
                  <p class="text-[11px] text-[#888]">Đơn từ 300K</p>
                </div>
              </div>
              <div class="flex items-center gap-2.5 px-4 py-3 bg-[#F5F9F9] rounded-xl border border-[#E0EFEF]">
                <Icon name="solar:refresh-circle-bold" size="20" class="text-[#0D6E6E]" aria-hidden="true" />
                <div>
                  <p class="text-xs font-semibold text-[#1A1A1A]">Đổi trả 30 ngày</p>
                  <p class="text-[11px] text-[#888]">Miễn phí</p>
                </div>
              </div>
              <div class="flex items-center gap-2.5 px-4 py-3 bg-[#F5F9F9] rounded-xl border border-[#E0EFEF]">
                <Icon name="solar:shield-check-bold" size="20" class="text-[#0D6E6E]" aria-hidden="true" />
                <div>
                  <p class="text-xs font-semibold text-[#1A1A1A]">Bảo hành 12 tháng</p>
                  <p class="text-[11px] text-[#888]">Chính hãng</p>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-[#E5E5E5]" />

            <!-- Accordions -->
            <div class="space-y-0">
              <!-- Product Specs -->
              <div class="border-b border-[#E5E5E5]">
                <button
                  class="pdp-accordion-trigger flex items-center justify-between w-full py-4 text-left transition-colors"
                  :aria-expanded="openAccordion === 'specs'"
                  @click="toggleAccordion('specs')"
                >
                  <span class="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <Icon name="solar:document-text-outline" size="16" class="text-[#0D6E6E]" aria-hidden="true" />
                    Thông số kỹ thuật
                  </span>
                  <Icon
                    name="solar:alt-arrow-down-outline"
                    size="16"
                    class="text-[#999] transition-transform duration-300"
                    :class="{ 'rotate-180': openAccordion === 'specs' }"
                    aria-hidden="true"
                  />
                </button>
                <Transition
                  enter-active-class="pdp-accordion-enter-active"
                  leave-active-class="pdp-accordion-leave-active"
                  enter-from-class="pdp-accordion-enter-from"
                  leave-to-class="pdp-accordion-leave-to"
                >
                  <div v-if="openAccordion === 'specs'" class="pb-4">
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
                </Transition>
              </div>

              <!-- In the Box -->
              <div class="border-b border-[#E5E5E5]">
                <button
                  class="pdp-accordion-trigger flex items-center justify-between w-full py-4 text-left transition-colors"
                  :aria-expanded="openAccordion === 'inbox'"
                  @click="toggleAccordion('inbox')"
                >
                  <span class="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <Icon name="solar:box-outline" size="16" class="text-[#0D6E6E]" aria-hidden="true" />
                    Trong hộp gồm có
                  </span>
                  <Icon
                    name="solar:alt-arrow-down-outline"
                    size="16"
                    class="text-[#999] transition-transform duration-300"
                    :class="{ 'rotate-180': openAccordion === 'inbox' }"
                    aria-hidden="true"
                  />
                </button>
                <Transition
                  enter-active-class="pdp-accordion-enter-active"
                  leave-active-class="pdp-accordion-leave-active"
                  enter-from-class="pdp-accordion-enter-from"
                  leave-to-class="pdp-accordion-leave-to"
                >
                  <div v-if="openAccordion === 'inbox'" class="pb-4">
                    <ul class="space-y-2">
                      <li
                        v-for="item in product.inTheBox"
                        :key="item"
                        class="flex items-center gap-2.5 text-sm text-[#666]"
                      >
                        <Icon name="solar:check-circle-bold" size="16" class="text-[#0D6E6E] flex-shrink-0" aria-hidden="true" />
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </Transition>
              </div>

              <!-- Features -->
              <div>
                <button
                  class="pdp-accordion-trigger flex items-center justify-between w-full py-4 text-left transition-colors"
                  :aria-expanded="openAccordion === 'features'"
                  @click="toggleAccordion('features')"
                >
                  <span class="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <Icon name="solar:star-outline" size="16" class="text-[#0D6E6E]" aria-hidden="true" />
                    Tính năng nổi bật
                  </span>
                  <Icon
                    name="solar:alt-arrow-down-outline"
                    size="16"
                    class="text-[#999] transition-transform duration-300"
                    :class="{ 'rotate-180': openAccordion === 'features' }"
                    aria-hidden="true"
                  />
                </button>
                <Transition
                  enter-active-class="pdp-accordion-enter-active"
                  leave-active-class="pdp-accordion-leave-active"
                  enter-from-class="pdp-accordion-enter-from"
                  leave-to-class="pdp-accordion-leave-to"
                >
                  <div v-if="openAccordion === 'features'" class="pb-4">
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="feat in product.features"
                        :key="feat"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F9F9] text-[#0D6E6E] text-xs font-medium rounded-full border border-[#E0EFEF]"
                      >
                        <Icon name="solar:verified-check-bold" size="12" aria-hidden="true" />
                        {{ feat }}
                      </span>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- Back to products -->
            <NuxtLink
              to="/products"
              class="inline-flex items-center gap-2 text-sm font-medium text-[#888] hover:text-[#0D6E6E] transition-colors pt-2"
            >
              <Icon name="solar:arrow-left-outline" size="16" aria-hidden="true" />
              Xem tất cả sản phẩm
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
