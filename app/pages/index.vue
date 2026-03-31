<script setup lang="ts">
import { useHead, ref, onMounted, onUnmounted } from '#imports'
import { useScrollReveal } from '~/composables/useScrollReveal'
import {
  HERO_IMAGES,
  SHOWCASE_IMAGE,
  getHeroImageAttrs,
  getHeroPreloadConfig,
} from '~/utils/homepagePerformance'

useScrollReveal()

// ─── Mobile hero carousel ───
const activeSlide = ref(0)
let autoplayTimer: ReturnType<typeof setInterval> | null = null
let touchStartX = 0
let touchEndX = 0

const startAutoplay = () => {
  stopAutoplay()
  autoplayTimer = setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % heroImages.length
  }, 4000)
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const goToSlide = (i: number) => {
  activeSlide.value = i
  startAutoplay() // reset timer on manual navigation
}

const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.changedTouches[0]!.clientX
  stopAutoplay()
}

const onTouchEnd = (e: TouchEvent) => {
  touchEndX = e.changedTouches[0]!.clientX
  const diff = touchStartX - touchEndX
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      // swipe left → next
      activeSlide.value = (activeSlide.value + 1) % heroImages.length
    } else {
      // swipe right → prev
      activeSlide.value = (activeSlide.value - 1 + heroImages.length) % heroImages.length
    }
  }
  startAutoplay()
}

onMounted(() => startAutoplay())
onUnmounted(() => stopAutoplay())


const heroImages = HERO_IMAGES

const trustBrands = [
  { name: 'Lock&Lock', fontWeight: '900', letterSpacing: '1', fontSize: '13' },
  { name: 'DAIKIN', fontWeight: '700', letterSpacing: '3', fontSize: '14' },
  { name: 'SUNHOUSE', fontWeight: '800', letterSpacing: '2', fontSize: '13' },
  { name: 'KANGAROO', fontWeight: '700', letterSpacing: '2.5', fontSize: '13' },
  { name: 'Tupperware', fontWeight: '600', letterSpacing: '1.5', fontSize: '13' },
]

// ─── SEO: Structured Data (JSON-LD) ───
useHead({
  title: 'Nhà phân phối Duyên Phượng — Tiện ích thông minh, nâng tầm cuộc sống',
  meta: [
    { name: 'description', content: 'Hàng trăm sản phẩm gia dụng chất lượng cao — từ nhà bếp đến phòng tắm. Xem chi tiết và liên hệ ngay.' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Nhà phân phối Duyên Phượng',
        url: 'https://www.duyenphuong.com',
        description: 'Đồ gia dụng thông minh cho mọi gia đình Việt',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.duyenphuong.com/products?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Nhà phân phối Duyên Phượng',
        url: 'https://www.duyenphuong.com',
        logo: 'https://www.duyenphuong.com/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+84-123-456-789',
          contactType: 'customer service',
          availableLanguage: 'Vietnamese',
        },
      }),
    },
  ],
})

</script>

<template>
  <div>
    <!-- ═══════════════════════ HERO ═══════════════════════ -->
    <section
      class="flex flex-col items-center gap-8 py-20 lg:py-24 px-6 lg:px-[120px] bg-[#FAFAFA] text-center"
      aria-labelledby="hero-heading"
    >
      <span class="reveal hero-badge inline-flex items-center gap-2 px-4 py-1.5 bg-[#F0F0F0] border border-[#E5E5E5] rounded-full text-[13px] font-medium text-[#555]">
        <Icon name="solar:star-bold" size="14" class="text-amber-500" aria-hidden="true" />
        Đồ gia dụng cho mọi gia đình Việt
      </span>

      <h1
        id="hero-heading"
        class="reveal font-display text-4xl md:text-5xl lg:text-[56px] font-medium leading-[1.1] text-[#1A1A1A] max-w-[800px]"
      >
        Tiện ích thông minh,<br/>nâng tầm cuộc sống.
      </h1>

      <p class="reveal text-lg text-[#555] max-w-[600px] leading-relaxed">
        Hàng trăm sản phẩm gia dụng chất lượng cao — từ nhà bếp đến phòng tắm.<br class="hidden md:block"/>
        Xem chi tiết sản phẩm và liên hệ ngay.
      </p>

      <div class="reveal flex flex-col sm:flex-row items-center gap-4">
        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white text-base font-semibold rounded-lg hover:bg-[#333] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-lg transition-all"
        >
          <Icon name="solar:eye-outline" size="18" aria-hidden="true" />
          Xem sản phẩm
        </NuxtLink>
        <a
          href="#about"
          class="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1A1A1A] text-base font-semibold rounded-lg border border-[#E5E5E5] hover:border-[#1A1A1A] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-sm transition-all"
        >
          Tìm hiểu thêm
          <Icon name="solar:arrow-right-outline" size="16" aria-hidden="true" />
        </a>
      </div>
    </section>

    <!-- ═══════════════════════ HERO — DIAGONAL ACCORDION (desktop) / SLIDESHOW (mobile) ═══════════════════════ -->
    <section class="reveal" aria-label="Bộ sưu tập không gian sống">
      <!-- Desktop: diagonal accordion -->
      <div class="diagonal-accordion">
        <div
          v-for="(img, i) in heroImages"
          :key="img.label"
          class="diagonal-panel"
          :class="{ 'diagonal-panel--first': i === 0, 'diagonal-panel--last': i === heroImages.length - 1 }"
        >
          <NuxtImg
            :src="img.src"
            :alt="img.alt"
            :loading="getHeroImageAttrs(i).loading"
            :fetchpriority="getHeroImageAttrs(i).fetchpriority"
            :sizes="getHeroImageAttrs(i).nuxtSizes"
            :preload="getHeroPreloadConfig(i)"
            decoding="async"
            width="1200"
            height="900"
            class="diagonal-panel__img"
          />
          <div class="diagonal-panel__overlay">
            <span class="diagonal-panel__label">{{ img.label }}</span>
          </div>
        </div>
      </div>

      <!-- Mobile: swipeable + auto-sliding carousel -->
      <div
        class="hero-slideshow"
        aria-label="Không gian sống slideshow"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <div
          class="hero-slideshow__track"
          :style="{ transform: `translateX(-${activeSlide * 100}%)` }"
        >
          <div v-for="(img, i) in heroImages" :key="img.label" class="hero-slideshow__slide">
            <NuxtImg
              :src="img.src"
              :alt="img.alt"
              :loading="getHeroImageAttrs(i).loading"
              :fetchpriority="getHeroImageAttrs(i).fetchpriority"
              :sizes="getHeroImageAttrs(i).nuxtMobileSizes"
              decoding="async"
              width="1200"
              height="900"
            />
            <div class="hero-slideshow__slide-overlay">
              <span class="hero-slideshow__slide-label">{{ img.label }}</span>
            </div>
          </div>
        </div>
        <!-- Dot indicators -->
        <div class="hero-slideshow__dots">
          <button
            v-for="(img, i) in heroImages"
            :key="'dot-' + img.label"
            :class="['hero-slideshow__dot', { 'hero-slideshow__dot--active': i === activeSlide }]"
            :aria-label="`Xem ${img.label}`"
            @click="goToSlide(i)"
          />
        </div>
      </div>
    </section>

    <!-- ═══════════════════════ TRUST LOGOS — INFINITE CAROUSEL ═══════════════════════ -->
    <section class="reveal relative overflow-hidden py-8 bg-white" aria-label="Thương hiệu đối tác">
      <!-- Edge fades -->
      <div class="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-white to-transparent" aria-hidden="true" />
      <div class="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" aria-hidden="true" />

      <!-- Scrolling track (3x duplicated for seamless loop) -->
      <div class="brand-carousel flex items-center gap-16 w-max">
        <template v-for="n in 3" :key="'set-' + n">
          <span
            v-for="brand in trustBrands"
            :key="n + '-' + brand.name"
            class="shrink-0 text-[#8B8B8B] hover:text-[#444] transition-colors duration-300 cursor-default select-none whitespace-nowrap"
            :style="{
              fontWeight: brand.fontWeight,
              letterSpacing: brand.letterSpacing + 'px',
              fontSize: brand.fontSize + 'px',
            }"
            role="img"
            :aria-label="'Logo ' + brand.name"
          >
            {{ brand.name }}
          </span>
        </template>
      </div>
    </section>



    <!-- ═══════════════════════ SHOWCASE ═══════════════════════ -->
    <section id="about" class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 py-16 px-6 lg:px-[120px] bg-[#FAFAFA]" aria-labelledby="showcase-heading">
      <div class="reveal-left flex-1 space-y-6">
        <span class="font-mono text-[11px] font-semibold tracking-[2px] text-[#0D6E6E] uppercase">
          <span class="section-dot mr-2" aria-hidden="true" />CHẤT LƯỢNG ĐẢM BẢO
        </span>
        <h2 id="showcase-heading" class="font-display text-3xl lg:text-4xl font-medium leading-[1.15] text-[#1A1A1A]">
          Sản phẩm bền đẹp,<br/>giá cả hợp lý.
        </h2>
        <p class="text-[15px] leading-relaxed text-[#666]">
          Chúng tôi hợp tác trực tiếp với các nhà sản xuất hàng đầu Việt Nam và Nhật Bản để mang đến sản phẩm chất lượng cao nhất với mức giá tốt nhất cho người tiêu dùng.
        </p>
        <NuxtLink
          to="/products"
          class="btn-arrow-slide inline-flex items-center gap-2 px-6 py-2.5 bg-[#1A1A1A] text-white text-sm font-semibold rounded-lg hover:bg-[#333] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md transition-all"
        >
          Xem sản phẩm
          <Icon name="solar:arrow-right-bold" size="16" aria-hidden="true" class="arrow-icon" />
        </NuxtLink>
      </div>
      <div class="reveal-right flex-[1.2] -mx-6 lg:mx-0 rounded-none lg:rounded-2xl overflow-hidden h-[280px] lg:h-[380px] w-[calc(100%+48px)] lg:w-auto group">
        <NuxtImg
          :src="SHOWCASE_IMAGE.src"
          :alt="SHOWCASE_IMAGE.alt"
          loading="lazy"
          decoding="async"
          :width="SHOWCASE_IMAGE.width"
          :height="SHOWCASE_IMAGE.height"
          :sizes="SHOWCASE_IMAGE.nuxtSizes"
          class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
      </div>
    </section>

    <!-- ═══════════════════════ FINAL CTA ═══════════════════════ -->
    <section id="contact" class="reveal cta-glow flex flex-col items-center gap-8 py-24 px-6 lg:px-[120px] bg-[#0F172A] text-center overflow-hidden" aria-labelledby="cta-heading">
      <h2 id="cta-heading" class="font-display text-3xl lg:text-5xl font-medium leading-[1.1] text-white max-w-[700px]">
        Sản phẩm chất lượng.<br/>Giá cả hợp lý.
      </h2>
      <p class="text-base text-[#CBD5E1] max-w-[500px]">
        Khám phá bộ sưu tập sản phẩm gia dụng — liên hệ để được tư vấn và báo giá tốt nhất.
      </p>
      <div class="flex flex-col sm:flex-row gap-4">
        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0F172A] text-base font-semibold rounded-lg hover:bg-gray-100 hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <Icon name="solar:eye-outline" size="18" aria-hidden="true" />
          Xem bộ sưu tập
        </NuxtLink>
        <a
          href="https://zalo.me/0968164783"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white text-base font-semibold rounded-lg border border-[#334155] hover:bg-white/[0.08] hover:border-white/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <Icon name="solar:chat-round-dots-outline" size="18" aria-hidden="true" />
          Liên hệ qua Zalo
        </a>
      </div>
    </section>
  </div>
</template>
