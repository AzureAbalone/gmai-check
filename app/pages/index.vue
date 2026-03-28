<script setup lang="ts">
import { useHead } from '#imports'
import { useScrollReveal } from '~/composables/useScrollReveal'

useScrollReveal()

const features = [
  {
    icon: 'solar:chef-hat-heart-bold',
    title: 'Nhà Bếp',
    desc: 'Rổ rá, hộp đựng thực phẩm, kệ gia vị, dụng cụ nấu ăn — tất cả để căn bếp gọn gàng hơn.',
    color: 'bg-[#0D6E6E]',
  },
  {
    icon: 'solar:bath-bold',
    title: 'Phòng Tắm',
    desc: 'Kệ nhà tắm, giá treo, hộp xà phòng, rèm cửa — sạch sẽ và tiện nghi mỗi ngày.',
    color: 'bg-[#E07B54]',
  },
  {
    icon: 'solar:sofa-2-bold',
    title: 'Phòng Khách',
    desc: 'Thùng rác phân loại, hộp lưu trữ, ghế nhựa, kệ đa năng — ngôi nhà ngăn nắp hơn.',
    color: 'bg-[#1A1A1A]',
  },
]

const heroImages = [
  { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', alt: 'Nhà bếp hiện đại', label: 'Nhà bếp' },
  { src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80', alt: 'Phòng khách tinh tế', label: 'Phòng khách' },
  { src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80', alt: 'Phòng tắm gọn gàng', label: 'Phòng tắm', objectPosition: 'center 70%' },
  { src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80', alt: 'Phòng ngủ ấm cúng', label: 'Phòng ngủ' },
  { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', alt: 'Ngoại thất hiện đại', label: 'Ngoại thất' },
]

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
    { name: 'description', content: 'Hàng trăm sản phẩm gia dụng chất lượng cao — từ nhà bếp đến phòng tắm. Giao hàng toàn quốc, đổi trả dễ dàng.' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Nhà phân phối Duyên Phượng',
        url: 'https://vinahome.vn',
        description: 'Đồ gia dụng thông minh cho mọi gia đình Việt',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://vinahome.vn/products?q={search_term_string}',
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
        url: 'https://vinahome.vn',
        logo: 'https://vinahome.vn/logo.png',
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

// ─── Preload hero images for LCP ───
useHead({
  link: [
    { rel: 'preload', as: 'image', href: heroImages[0]!.src },
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
      <span class="reveal inline-flex items-center gap-2 px-4 py-1.5 bg-[#F0F0F0] border border-[#E5E5E5] rounded-full text-[13px] font-medium text-[#666]">
        <Icon name="solar:star-bold" size="14" class="text-amber-500" aria-hidden="true" />
        Đồ gia dụng cho mọi gia đình Việt
      </span>

      <h1
        id="hero-heading"
        class="reveal font-['Newsreader'] text-4xl md:text-5xl lg:text-[56px] font-medium leading-[1.1] text-[#1A1A1A] max-w-[800px]"
      >
        Tiện ích thông minh,<br/>nâng tầm cuộc sống.
      </h1>

      <p class="reveal text-lg text-[#666] max-w-[600px] leading-relaxed">
        Hàng trăm sản phẩm gia dụng chất lượng cao — từ nhà bếp đến phòng tắm.<br class="hidden md:block"/>
        Giao hàng toàn quốc, đổi trả dễ dàng.
      </p>

      <div class="reveal flex flex-col sm:flex-row items-center gap-4">
        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white text-base font-semibold rounded-lg hover:bg-[#333] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-lg transition-all"
        >
          <Icon name="solar:bag-4-outline" size="18" aria-hidden="true" />
          Khám phá sản phẩm
        </NuxtLink>
        <a
          href="#features"
          class="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1A1A1A] text-base font-semibold rounded-lg border border-[#E5E5E5] hover:border-[#1A1A1A] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-sm transition-all"
        >
          Tìm hiểu thêm
          <Icon name="solar:arrow-right-outline" size="16" aria-hidden="true" />
        </a>
      </div>
    </section>

    <!-- ═══════════════════════ HERO — DIAGONAL ACCORDION ═══════════════════════ -->
    <section class="reveal" aria-label="Bộ sưu tập không gian sống">
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
            :loading="i === 0 ? 'eager' : 'lazy'"
            :fetchpriority="i === 0 ? 'high' : undefined"
            decoding="async"
            width="800"
            height="600"
            class="diagonal-panel__img"
            :style="img.objectPosition ? { objectPosition: img.objectPosition } : undefined"
          />
          <!-- Overlay gradient + label -->
          <div class="diagonal-panel__overlay">
            <span class="diagonal-panel__label">{{ img.label }}</span>
          </div>
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
            class="shrink-0 text-[#C0C0C0] hover:text-[#666] transition-colors duration-300 cursor-default select-none whitespace-nowrap"
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

    <!-- ═══════════════════════ FEATURES ═══════════════════════ -->
    <section id="features" class="py-20 px-6 lg:px-[120px] bg-white" aria-labelledby="features-heading">
      <div class="reveal flex flex-col items-center gap-4 text-center mb-16">
        <span class="font-mono text-[11px] font-semibold tracking-[2px] text-[#0D6E6E] uppercase">
          SẢN PHẨM NỔI BẬT
        </span>
        <h2 id="features-heading" class="font-['Newsreader'] text-3xl lg:text-[40px] font-medium leading-[1.1] text-[#1A1A1A] max-w-[700px]">
          Mọi tiện ích cho ngôi nhà của bạn,<br/>tất cả ở một nơi.
        </h2>
        <p class="text-base text-[#888] max-w-[560px]">
          Từ nhà bếp gọn gàng đến phòng tắm sạch sẽ — chúng tôi mang đến sản phẩm chất lượng với giá phải chăng nhất.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6" role="list">
        <article
          v-for="(feature, i) in features"
          :key="feature.title"
          role="listitem"
          :class="['reveal', `reveal-delay-${i + 1}`, 'flex flex-col gap-5 p-8 bg-[#FAFAFA] border border-[#E5E5E5] rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group']"
        >
          <div :class="[feature.color, 'w-12 h-12 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform']" aria-hidden="true">
            <Icon :name="feature.icon" size="22" />
          </div>
          <h3 class="font-['Newsreader'] text-[22px] font-medium text-[#1A1A1A]">{{ feature.title }}</h3>
          <p class="text-sm leading-relaxed text-[#888]">{{ feature.desc }}</p>
        </article>
      </div>
    </section>

    <!-- ═══════════════════════ SHOWCASE ═══════════════════════ -->
    <section id="about" class="reveal flex flex-col lg:flex-row items-center gap-12 lg:gap-16 py-16 px-6 lg:px-[120px] bg-[#FAFAFA]" aria-labelledby="showcase-heading">
      <div class="flex-1 space-y-6">
        <span class="font-mono text-[11px] font-semibold tracking-[2px] text-[#0D6E6E] uppercase">
          CHẤT LƯỢNG ĐẢM BẢO
        </span>
        <h2 id="showcase-heading" class="font-['Newsreader'] text-3xl lg:text-4xl font-medium leading-[1.15] text-[#1A1A1A]">
          Sản phẩm bền đẹp,<br/>giá cả hợp lý.
        </h2>
        <p class="text-[15px] leading-relaxed text-[#888]">
          Chúng tôi hợp tác trực tiếp với các nhà sản xuất hàng đầu Việt Nam và Nhật Bản để mang đến sản phẩm chất lượng cao nhất với mức giá tốt nhất cho người tiêu dùng.
        </p>
        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1A1A1A] text-white text-sm font-semibold rounded-lg hover:bg-[#333] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md transition-all"
        >
          Xem sản phẩm
          <Icon name="solar:arrow-right-bold" size="16" aria-hidden="true" />
        </NuxtLink>
      </div>
      <div class="flex-[1.2] rounded-2xl overflow-hidden h-[320px] lg:h-[380px] group">
        <NuxtImg
          src="https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&q=80"
          alt="Bộ sưu tập đồ gia dụng Duyên Phượng chất lượng cao"
          loading="lazy"
          decoding="async"
          width="800"
          height="600"
          sizes="sm:100vw lg:60vw"
          class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
      </div>
    </section>

    <!-- ═══════════════════════ FINAL CTA ═══════════════════════ -->
    <section id="contact" class="reveal flex flex-col items-center gap-8 py-24 px-6 lg:px-[120px] bg-[#0F172A] text-center" aria-labelledby="cta-heading">
      <h2 id="cta-heading" class="font-['Newsreader'] text-3xl lg:text-5xl font-medium leading-[1.1] text-white max-w-[700px]">
        Mua sắm thông minh.<br/>Giao hàng tận nơi.
      </h2>
      <p class="text-base text-[#94A3B8] max-w-[500px]">
        Bắt đầu mua sắm ngay hôm nay — miễn phí giao hàng cho đơn từ 300.000đ
      </p>
      <div class="flex flex-col sm:flex-row gap-4">
        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0F172A] text-base font-semibold rounded-lg hover:bg-gray-100 hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <Icon name="solar:bag-4-outline" size="18" aria-hidden="true" />
          Bắt đầu mua sắm
        </NuxtLink>
        <a
          href="tel:+84123456789"
          class="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white text-base font-semibold rounded-lg border border-[#334155] hover:bg-white/[0.08] hover:border-white/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <Icon name="solar:phone-outline" size="18" aria-hidden="true" />
          Liên hệ tư vấn
        </a>
      </div>
    </section>
  </div>
</template>
