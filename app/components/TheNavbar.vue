<script setup lang="ts">
const isScrolled = ref(false)
const isMobileOpen = ref(false)

// ─── Throttled scroll listener for performance ───
let ticking = false
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      isScrolled.value = window.scrollY > 20
      ticking = false
    })
    ticking = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

// ─── Close mobile menu on route change ───
const route = useRoute()
watch(() => route.fullPath, () => {
  isMobileOpen.value = false
})

// ─── Close mobile menu on Escape key ───
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isMobileOpen.value) {
    isMobileOpen.value = false
  }
}
onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

// ─── Lock body scroll when mobile menu is open ───
watch(isMobileOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

const navLinks = [
  { label: 'Sản phẩm', to: '/products', icon: 'solar:bag-4-outline' },
  { label: 'Về chúng tôi', to: '/#about', icon: 'solar:info-circle-outline' },
  { label: 'Liên hệ', to: '/#contact', icon: 'solar:phone-outline' },
]
</script>

<template>
  <header
    role="banner"
    class="sticky top-0 z-50 flex items-center justify-between px-6 lg:px-20 py-5 transition-all duration-300"
    :class="isScrolled
      ? 'bg-white/95 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
      : 'bg-[#FAFAFA]'"
  >
    <!-- Logo -->
    <NuxtLink
      to="/"
      class="text-xl font-bold tracking-[2px] text-[#1A1A1A] hover:opacity-70 transition-opacity"
      aria-label="VINA HOME — Trang chủ"
    >
      VINA HOME
    </NuxtLink>

    <!-- Desktop Nav -->
    <nav class="hidden md:flex items-center gap-8" aria-label="Menu chính">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="group flex items-center gap-1.5 text-sm font-medium text-[#666] relative py-1 hover:text-[#0D6E6E] transition-colors"
        :aria-label="link.label"
      >
        <Icon :name="link.icon" size="16" class="opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
        {{ link.label }}
        <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0D6E6E] group-hover:w-full transition-all duration-300" aria-hidden="true" />
      </NuxtLink>

      <NuxtLink
        to="/products"
        class="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0D6E6E] text-white text-sm font-semibold rounded-lg hover:bg-[#0A5858] hover:-translate-y-0.5 active:translate-y-0 transition-all"
      >
        <Icon name="solar:cart-large-2-bold" size="16" aria-hidden="true" />
        Mua ngay
      </NuxtLink>
    </nav>

    <!-- Mobile Menu Toggle -->
    <button
      class="md:hidden p-2 text-[#1A1A1A] hover:text-[#0D6E6E] transition-colors"
      :aria-label="isMobileOpen ? 'Đóng menu' : 'Mở menu'"
      :aria-expanded="isMobileOpen"
      aria-controls="mobile-nav"
      @click="isMobileOpen = !isMobileOpen"
    >
      <Icon
        :name="isMobileOpen ? 'solar:close-circle-outline' : 'solar:hamburger-menu-outline'"
        size="24"
        aria-hidden="true"
      />
    </button>

    <!-- Mobile Menu (overlay) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav
        v-if="isMobileOpen"
        id="mobile-nav"
        aria-label="Menu di động"
        class="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 p-6 flex flex-col gap-4 md:hidden"
      >
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 text-base font-medium text-[#666] hover:text-[#0D6E6E] py-2 transition-colors"
        >
          <Icon :name="link.icon" size="20" aria-hidden="true" />
          {{ link.label }}
        </NuxtLink>
        <NuxtLink
          to="/products"
          class="flex items-center justify-center gap-2 px-6 py-3 bg-[#0D6E6E] text-white text-sm font-semibold rounded-lg active:bg-[#0A5858] transition-colors"
        >
          <Icon name="solar:cart-large-2-bold" size="16" aria-hidden="true" />
          Mua ngay
        </NuxtLink>
      </nav>
    </Transition>
  </header>
</template>
