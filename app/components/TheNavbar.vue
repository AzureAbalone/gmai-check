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
  { label: 'Sản phẩm', to: '/products', icon: 'solar:widget-2-outline' },
  { label: 'Về chúng tôi', to: '/#contact', icon: 'solar:info-circle-outline' },
  { label: 'Liên hệ', to: 'https://zalo.me/0968164783', icon: 'solar:chat-round-dots-outline', external: true },
]

const isProductsPage = computed(() => route.path === '/products')
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
      class="hover:opacity-80 transition-opacity"
      aria-label="Nhà phân phối Duyên Phượng — Trang chủ"
    >
      <DuyenPhuongLogo size="sm" />
    </NuxtLink>

    <!-- Desktop Nav -->
    <nav class="hidden md:flex items-center gap-8" aria-label="Menu chính">
      <template v-for="link in navLinks" :key="link.to">
        <a
          v-if="link.external"
          :href="link.to"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-1.5 text-sm font-medium text-[#555] relative py-1 hover:text-[#0D6E6E] transition-colors"
          :aria-label="link.label"
        >
          <Icon :name="link.icon" size="16" class="opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          {{ link.label }}
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0D6E6E] group-hover:w-full transition-all duration-300" aria-hidden="true" />
        </a>
        <NuxtLink
          v-else
          :to="link.to"
          class="group flex items-center gap-1.5 text-sm font-medium text-[#555] relative py-1 hover:text-[#0D6E6E] transition-colors"
          :aria-label="link.label"
        >
          <Icon :name="link.icon" size="16" class="opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          {{ link.label }}
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0D6E6E] group-hover:w-full transition-all duration-300" aria-hidden="true" />
        </NuxtLink>
      </template>

      <NuxtLink
        :to="isProductsPage ? '/' : '/products'"
        class="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0D6E6E] text-white text-sm font-semibold rounded-lg hover:bg-[#0A5858] hover:-translate-y-0.5 active:translate-y-0 transition-all"
      >
        <Icon :name="isProductsPage ? 'solar:home-2-bold' : 'solar:eye-bold'" size="16" aria-hidden="true" />
        {{ isProductsPage ? 'Về trang chủ' : 'Xem sản phẩm' }}
      </NuxtLink>
    </nav>

    <!-- Mobile Menu Toggle — Animated Hamburger/X -->
    <button
      class="md:hidden relative w-10 h-10 flex items-center justify-center text-[#1A1A1A] hover:text-[#0D6E6E] transition-colors"
      :aria-label="isMobileOpen ? 'Đóng menu' : 'Mở menu'"
      :aria-expanded="isMobileOpen"
      aria-controls="mobile-nav"
      @click="isMobileOpen = !isMobileOpen"
    >
      <div class="hamburger-bars" :class="{ 'is-active': isMobileOpen }">
        <span />
        <span />
        <span />
      </div>
    </button>

    <!-- Mobile Menu (overlay) with slide animation -->
    <Transition
      enter-active-class="mobile-menu-enter-active"
      leave-active-class="mobile-menu-leave-active"
      enter-from-class="mobile-menu-enter-from"
      leave-to-class="mobile-menu-leave-to"
    >
      <nav
        v-if="isMobileOpen"
        id="mobile-nav"
        aria-label="Menu di động"
        class="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 p-6 flex flex-col gap-1 md:hidden origin-top"
      >
        <template v-for="(link, i) in navLinks" :key="link.to">
          <a
            v-if="link.external"
            :href="link.to"
            target="_blank"
            rel="noopener noreferrer"
            class="mobile-nav-item flex items-center gap-3 text-base font-medium text-[#555] hover:text-[#0D6E6E] hover:bg-[#F0FAF9] rounded-xl py-3 px-3 transition-all duration-200"
            :style="{ animationDelay: `${(i + 1) * 60}ms` }"
          >
            <Icon :name="link.icon" size="20" aria-hidden="true" />
            {{ link.label }}
          </a>
          <NuxtLink
            v-else
            :to="link.to"
            class="mobile-nav-item flex items-center gap-3 text-base font-medium text-[#555] hover:text-[#0D6E6E] hover:bg-[#F0FAF9] rounded-xl py-3 px-3 transition-all duration-200"
            :style="{ animationDelay: `${(i + 1) * 60}ms` }"
          >
            <Icon :name="link.icon" size="20" aria-hidden="true" />
            {{ link.label }}
          </NuxtLink>
        </template>
        <NuxtLink
          :to="isProductsPage ? '/' : '/products'"
          class="mobile-nav-item flex items-center justify-center gap-2 px-6 py-3.5 mt-2 bg-[#0D6E6E] text-white text-sm font-semibold rounded-xl active:bg-[#0A5858] transition-colors"
          :style="{ animationDelay: `${(navLinks.length + 1) * 60}ms` }"
        >
          <Icon :name="isProductsPage ? 'solar:home-2-bold' : 'solar:eye-bold'" size="16" aria-hidden="true" />
          {{ isProductsPage ? 'Về trang chủ' : 'Xem sản phẩm' }}
        </NuxtLink>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
/* ─── Animated Hamburger → X ─── */
.hamburger-bars {
  width: 22px;
  height: 16px;
  position: relative;
}

.hamburger-bars span {
  display: block;
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.hamburger-bars span:nth-child(1) {
  top: 0;
}

.hamburger-bars span:nth-child(2) {
  top: 7px;
}

.hamburger-bars span:nth-child(3) {
  top: 14px;
}

/* Active state → X */
.hamburger-bars.is-active span:nth-child(1) {
  top: 7px;
  transform: rotate(45deg);
}

.hamburger-bars.is-active span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger-bars.is-active span:nth-child(3) {
  top: 7px;
  transform: rotate(-45deg);
}

/* ─── Mobile menu slide animation ─── */
.mobile-menu-enter-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease-in;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px) scaleY(0.96);
}

/* ─── Staggered item animation ─── */
.mobile-nav-item {
  animation: nav-item-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes nav-item-in {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
