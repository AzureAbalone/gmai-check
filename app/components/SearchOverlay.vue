<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

interface Product {
  id: number
  name: string
  category: string
  image: string
  rating: number
  reviews: number
  badge: string | null
}




const PAGE_SIZE = 10
const isExpanded = ref(false)
const showDropdown = ref(false)
let dropdownTimer: ReturnType<typeof setTimeout> | null = null
const isMobileOverlay = ref(false)
const mobileReady = ref(false)
const searchQuery = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const mobileInputRef = ref<HTMLInputElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const activeIndex = ref(-1)
const products = ref<Product[]>([])
const visibleCount = ref(PAGE_SIZE)
const loadingMore = ref(false)

// ─── Fetch products ───
const { data } = await useFetch<Product[]>('/api/products', {
  lazy: true,
  default: () => [],
})
watch(data, (val) => { if (val) products.value = val }, { immediate: true })

// ─── Elastic/fuzzy search ───
function elasticSearch(query: string, items: Product[]): Product[] {
  if (!query.trim()) return []
  const q = query.toLowerCase().trim()
  const terms = q.split(/\s+/)

  return items
    .map((item) => {
      const name = item.name.toLowerCase()
      const cat = item.category.toLowerCase()
      let score = 0

      for (const term of terms) {
        if (name.includes(term)) score += 10
        if (cat.includes(term)) score += 5
        let ti = 0
        for (const ch of name) {
          if (ti < term.length && ch === term[ti]) ti++
        }
        if (ti === term.length) score += 3
      }
      return { item, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((r) => r.item)
}

const results = computed(() => elasticSearch(searchQuery.value, products.value))
const visibleProducts = computed(() => products.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < products.value.length)

// Bold matching text in product names
function highlightMatch(name: string): string {
  const q = searchQuery.value.trim()
  if (!q) return name
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return name.replace(new RegExp(`(${escaped})`, 'gi'), '<strong>$1</strong>')
}

// Infinite scroll: load more suggestions
function loadMore() {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  setTimeout(() => {
    visibleCount.value += PAGE_SIZE
    loadingMore.value = false
  }, 300)
}

function onSuggestionScroll(e: Event) {
  const el = e.target as HTMLElement
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
    loadMore()
  }
}

// ─── Desktop expand / collapse ───
function expand() {
  if (isExpanded.value) return
  isExpanded.value = true
  nextTick(() => inputRef.value?.focus())
  // Delay dropdown until expand animation finishes
  if (dropdownTimer) clearTimeout(dropdownTimer)
  dropdownTimer = setTimeout(() => {
    showDropdown.value = true
  }, 380) // matches CSS width transition
}

function collapse() {
  if (!searchQuery.value.trim()) {
    showDropdown.value = false
    if (dropdownTimer) clearTimeout(dropdownTimer)
    // Delay bar collapse to let dropdown close first
    setTimeout(() => {
      if (!isExpanded.value || searchQuery.value.trim()) return
      isExpanded.value = false
      activeIndex.value = -1
    }, 180)
  }
}

// Desktop: clear text but keep search open & refocus
function clearSearch() {
  searchQuery.value = ''
  activeIndex.value = -1
  visibleCount.value = PAGE_SIZE
  nextTick(() => inputRef.value?.focus())
}

// Desktop: full close (called on Escape or link click)
function clearAndCollapse() {
  searchQuery.value = ''
  visibleCount.value = PAGE_SIZE
  showDropdown.value = false
  if (dropdownTimer) clearTimeout(dropdownTimer)
  setTimeout(() => {
    isExpanded.value = false
    activeIndex.value = -1
  }, 150)
}

// ─── Mobile overlay ───
function openMobile() {
  isMobileOverlay.value = true
  mobileReady.value = false
  visibleCount.value = PAGE_SIZE
  document.body.style.overflow = 'hidden'
  nextTick(() => mobileInputRef.value?.focus())
  setTimeout(() => {
    mobileReady.value = true
  }, 200)
}

// Mobile: clear text but keep overlay open, or close if empty
function mobileClearOrClose() {
  if (searchQuery.value.trim()) {
    searchQuery.value = ''
    activeIndex.value = -1
    visibleCount.value = PAGE_SIZE
    nextTick(() => mobileInputRef.value?.focus())
  } else {
    closeMobile()
  }
}

function closeMobile() {
  mobileReady.value = false
  isMobileOverlay.value = false
  searchQuery.value = ''
  activeIndex.value = -1
  visibleCount.value = PAGE_SIZE
  document.body.style.overflow = ''
}

// ─── Click outside (desktop) ───
function handleClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    collapse()
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

// ─── Keyboard nav (desktop) ───
function onDesktopKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') { clearAndCollapse(); return }
  if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1) }
  if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex.value = Math.max(activeIndex.value - 1, -1) }
  if (e.key === 'Enter' && activeIndex.value >= 0) {
    const p = results.value[activeIndex.value]
    if (p) navigateTo(`/products/${p.id}`)
    clearAndCollapse()
  }
}

// ─── Keyboard nav (mobile) ───
function onMobileKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') { closeMobile(); return }
  if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1) }
  if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex.value = Math.max(activeIndex.value - 1, -1) }
  if (e.key === 'Enter' && activeIndex.value >= 0) {
    const p = results.value[activeIndex.value]
    if (p) navigateTo(`/products/${p.id}`)
    closeMobile()
  }
}

watch(searchQuery, () => { activeIndex.value = -1 })

const categoryMap: Record<string, string> = {
  kitchen: 'Nhà bếp',
  bathroom: 'Phòng tắm',
  living: 'Phòng khách',
}
</script>

<template>
  <!-- ═══════════════════════════════════════════
       DESKTOP: Expanding magnifier with connected dropdown
       ═══════════════════════════════════════════ -->
  <div ref="containerRef" class="hidden md:block relative" @mouseleave="collapse">
    <!-- Search bar container -->
    <div
      class="expanding-search"
      :class="{ 'is-expanded': isExpanded, 'has-dropdown': showDropdown }"
      @mouseenter="expand"
    >
      <!-- Magnifier icon -->
      <button
        class="magnifier-btn"
        aria-label="Tìm kiếm sản phẩm"
        @click="expand"
      >
        <Icon name="lucide:search" size="18" aria-hidden="true" />
      </button>

      <!-- Expanding input -->
      <div class="search-input-wrap">
        <input
          ref="inputRef"
          v-model="searchQuery"
          type="search"
          placeholder="Tìm kiếm sản phẩm..."
          class="search-input"
          autocomplete="off"
          aria-label="Tìm kiếm sản phẩm"
          @keydown="onDesktopKeydown"
        />
        <button
          v-if="searchQuery"
          class="clear-btn"
          aria-label="Xóa tìm kiếm"
          @mousedown.prevent="clearSearch"
        >
          <Icon name="solar:close-circle-bold" size="16" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Connected dropdown (grows from the search bar) -->
    <div
      class="connected-dropdown"
      :class="{ 'is-open': showDropdown }"
      data-lenis-prevent
    >
      <div class="dropdown-inner">
        <!-- Thin connector line -->
        <div class="h-px bg-[#E5E5E5]" />

        <!-- Suggested items (when no search query) -->
        <div v-if="!searchQuery.trim()" class="py-2">
          <p class="px-4 py-1.5 text-[10px] font-semibold text-[#AAA] uppercase tracking-widest">Gợi ý tìm kiếm</p>
          <ul class="dropdown-scroll" role="listbox" data-lenis-prevent @scroll="onSuggestionScroll">
            <li v-for="(product, i) in visibleProducts" :key="product.id" role="option">
              <NuxtLink
                :prefetch="false"
                :to="`/products/${product.id}`"
                class="dropdown-item flex items-center gap-3 px-4 py-2.5 transition-colors duration-100 hover:bg-[#F8FAFA]"
                :style="{ animationDelay: `${i * 40}ms` }"
                @click="clearAndCollapse"
              >
                <div class="w-9 h-9 rounded-lg overflow-hidden bg-[#F5F5F5] shrink-0">
                  <NuxtImg :src="product.image" :alt="product.name" width="72" height="72" loading="lazy" class="w-full h-full object-cover" />
                </div>
                <p class="flex-1 min-w-0 text-[13px] font-medium text-[#555] truncate">{{ product.name }}</p>
                <Icon name="lucide:arrow-up-right" size="12" class="text-[#CCC] shrink-0" aria-hidden="true" />
              </NuxtLink>
            </li>
            <li v-if="loadingMore" class="flex justify-center py-3">
              <div class="w-4 h-4 border-2 border-[#0D6E6E] border-t-transparent rounded-full animate-spin" />
            </li>
          </ul>
        </div>

        <!-- Search results -->
        <div v-else-if="results.length" class="py-2">
          <p class="px-4 py-1.5 text-[10px] font-semibold text-[#AAA] uppercase tracking-widest">
            {{ results.length }} kết quả
          </p>
          <ul class="dropdown-scroll" role="listbox" data-lenis-prevent>
            <li
              v-for="(product, i) in results"
              :key="product.id"
              role="option"
              :aria-selected="i === activeIndex"
            >
              <NuxtLink
                :prefetch="false"
                :to="`/products/${product.id}`"
                class="dropdown-item flex items-center gap-3 px-4 py-2.5 transition-colors duration-100"
                :class="i === activeIndex ? 'bg-[#F0FAF9]' : 'hover:bg-[#F8FAFA]'"
                :style="{ animationDelay: `${i * 30}ms` }"
                @click="clearAndCollapse"
                @mouseenter="activeIndex = i"
              >
                <div class="w-9 h-9 rounded-lg overflow-hidden bg-[#F5F5F5] shrink-0">
                  <NuxtImg :src="product.image" :alt="product.name" width="72" height="72" loading="lazy" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <p class="text-[13px] font-medium text-[#1A1A1A] truncate" v-html="highlightMatch(product.name)" />
                  <span class="text-[10px] text-[#999]">{{ categoryMap[product.category] || product.category }}</span>
                </div>
                <Icon name="lucide:arrow-right" size="13" class="text-[#CCC] shrink-0" aria-hidden="true" />
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- No results -->
        <div v-else class="py-6 text-center">
          <Icon name="lucide:search-x" size="20" class="text-[#CCC] mx-auto mb-1.5" aria-hidden="true" />
          <p class="text-[12px] text-[#999]">Không tìm thấy sản phẩm</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════
       MOBILE: Magnifier icon → full-screen overlay
       ═══════════════════════════════════════════ -->
  <button
    class="md:hidden flex items-center justify-center w-9 h-9 rounded-full border border-[#E5E5E5] text-[#888] hover:text-[#0D6E6E] hover:border-[#0D6E6E] transition-all"
    aria-label="Tìm kiếm sản phẩm"
    @click="openMobile"
  >
    <Icon name="lucide:search" size="16" aria-hidden="true" />
  </button>

  <!-- Mobile Overlay -->
  <Teleport to="body">
    <Transition
      enter-active-class="mobile-overlay-enter-active"
      enter-from-class="mobile-overlay-enter-from"
      leave-active-class="mobile-overlay-leave-active"
      leave-to-class="mobile-overlay-leave-to"
    >
      <div v-if="isMobileOverlay" class="fixed inset-0 z-[100] bg-white flex flex-col" data-lenis-prevent>
        <!-- Mobile Search Header -->
        <div class="mobile-search-header flex items-center gap-3 px-4 py-3 border-b border-[#E5E5E5]">
          <Icon name="lucide:search" size="20" class="text-[#0D6E6E] shrink-0" aria-hidden="true" />
          <input
            ref="mobileInputRef"
            v-model="searchQuery"
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            class="flex-1 text-[15px] text-[#1A1A1A] placeholder:text-[#BBB] bg-transparent outline-none"
            autocomplete="off"
            aria-label="Tìm kiếm sản phẩm"
            @keydown="onMobileKeydown"
          />
          <button
            class="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F5F5F5] text-[#999] active:bg-[#E5E5E5] transition-colors"
            aria-label="Đóng"
            @click="mobileClearOrClose"
          >
            <Icon name="solar:close-circle-outline" size="18" aria-hidden="true" />
          </button>
        </div>

        <!-- Mobile Results -->
        <div class="mobile-results-body flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent @scroll="onSuggestionScroll">
          <!-- Loading skeleton while products mount -->
          <div v-if="!mobileReady" class="flex flex-col items-center justify-center py-16 text-center">
            <div class="w-6 h-6 border-2 border-[#0D6E6E] border-t-transparent rounded-full animate-spin mb-3" />
            <p class="text-xs text-[#AAA]">Đang tải sản phẩm...</p>
          </div>

          <!-- Suggested products (deferred) -->
          <template v-else>
            <div v-if="!searchQuery.trim()" class="py-2">
              <p class="px-5 py-2 text-[10px] font-semibold text-[#AAA] uppercase tracking-widest">Gợi ý tìm kiếm</p>
              <ul class="py-1" role="listbox">
                <li v-for="product in visibleProducts" :key="product.id" role="option">
                  <NuxtLink
                    :prefetch="false"
                    :to="`/products/${product.id}`"
                    class="mobile-item flex items-center gap-4 px-5 py-3 transition-colors hover:bg-[#FAFAFA]"
                    @click="closeMobile"
                  >
                    <div class="w-12 h-12 rounded-xl overflow-hidden bg-[#F5F5F5] shrink-0">
                      <NuxtImg :src="product.image" :alt="product.name" width="96" height="96" loading="lazy" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-[#1A1A1A] truncate">{{ product.name }}</p>
                      <div class="flex items-center gap-2 mt-0.5">
                        <span class="text-[11px] text-[#888] bg-[#F0F0F0] px-2 py-0.5 rounded-full">{{ categoryMap[product.category] || product.category }}</span>
                        <span class="flex items-center gap-0.5 text-[11px] text-[#888]">
                          <Icon name="solar:star-bold" size="10" class="text-amber-400" aria-hidden="true" />
                          {{ product.rating }}
                        </span>
                      </div>
                    </div>
                    <Icon name="lucide:arrow-up-right" size="14" class="text-[#CCC] shrink-0" aria-hidden="true" />
                  </NuxtLink>
                </li>
                <li v-if="loadingMore" class="flex justify-center py-4">
                  <div class="w-5 h-5 border-2 border-[#0D6E6E] border-t-transparent rounded-full animate-spin" />
                </li>
              </ul>
            </div>

            <ul v-else-if="results.length" class="py-2" role="listbox">
              <li v-for="(product, i) in results" :key="product.id" role="option" :aria-selected="i === activeIndex">
                <NuxtLink
                  :prefetch="false"
                  :to="`/products/${product.id}`"
                  class="mobile-item flex items-center gap-4 px-5 py-3 transition-colors"
                  :class="i === activeIndex ? 'bg-[#F0FAF9]' : 'hover:bg-[#FAFAFA]'"
                  @click="closeMobile"
                  @mouseenter="activeIndex = i"
                >
                  <div class="w-12 h-12 rounded-xl overflow-hidden bg-[#F5F5F5] shrink-0">
                    <NuxtImg :src="product.image" :alt="product.name" width="96" height="96" loading="lazy" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <p class="text-sm font-medium text-[#1A1A1A] truncate" v-html="highlightMatch(product.name)" />
                    <div class="flex items-center gap-2 mt-0.5">
                      <span class="text-[11px] text-[#888] bg-[#F0F0F0] px-2 py-0.5 rounded-full">{{ categoryMap[product.category] || product.category }}</span>
                      <span class="flex items-center gap-0.5 text-[11px] text-[#888]">
                        <Icon name="solar:star-bold" size="10" class="text-amber-400" aria-hidden="true" />
                        {{ product.rating }}
                      </span>
                    </div>
                  </div>
                  <Icon name="lucide:arrow-right" size="16" class="text-[#CCC] shrink-0" aria-hidden="true" />
                </NuxtLink>
              </li>
            </ul>

            <div v-else class="flex flex-col items-center justify-center py-20 text-center px-6">
              <Icon name="lucide:search-x" size="32" class="text-[#DDD] mb-3" aria-hidden="true" />
              <p class="text-sm font-medium text-[#666]">Không tìm thấy sản phẩm</p>
              <p class="text-xs text-[#AAA] mt-1">Thử từ khóa khác</p>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ═══ Desktop expanding magnifier ═══ */
.expanding-search {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #E5E5E5;
  background: #FAFAFA;
  overflow: hidden;
  width: 40px;
  transition: width 0.4s cubic-bezier(0.34, 1.4, 0.64, 1),
              border-color 0.3s ease,
              background-color 0.3s ease,
              box-shadow 0.3s ease,
              border-radius 0.25s ease;
  cursor: pointer;
}

.expanding-search.is-expanded {
  width: 320px;
  border-color: #0D6E6E;
  background: #fff;
  box-shadow: 0 2px 16px rgba(13, 110, 110, 0.08);
  cursor: default;
}

/* Flatten bottom corners when dropdown is connected */
.expanding-search.is-expanded.has-dropdown {
  border-radius: 20px 20px 0 0;
  border-bottom-color: transparent;
}

.magnifier-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  min-width: 40px;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

.expanding-search.is-expanded .magnifier-btn {
  color: #0D6E6E;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  padding-right: 12px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease 0.1s;
}

.expanding-search.is-expanded .search-input-wrap {
  opacity: 1;
  pointer-events: auto;
}

.search-input {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  color: #1A1A1A;
  background: transparent;
  border: none;
  outline: none;
}

.search-input::placeholder {
  color: #BBB;
}

/* Hide native search clear button (WebKit/Blink) */
.search-input::-webkit-search-cancel-button,
.search-input::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
  display: none;
}

input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
  display: none;
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #CCC;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.clear-btn:hover {
  color: #999;
}

/* ═══ Connected dropdown ═══ */
.connected-dropdown {
  position: absolute;
  top: 39px; /* overlaps 1px with bottom border of search bar */
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  z-index: 1;
  background: #fff;
  border: 1px solid #0D6E6E;
  border-top: none;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 8px 32px rgba(13, 110, 110, 0.1),
              0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;

  /* Animate open/close */
  max-height: 0;
  opacity: 0;
  pointer-events: none;
  transition: max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.25s ease;
}

.connected-dropdown.is-open {
  max-height: 380px;
  opacity: 1;
  pointer-events: auto;
}

.dropdown-inner {
  min-height: 0;
}

.dropdown-scroll {
  max-height: 260px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #E0E0E0 transparent;
}

.dropdown-scroll::-webkit-scrollbar {
  width: 4px;
}

.dropdown-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-scroll::-webkit-scrollbar-thumb {
  background: #E0E0E0;
  border-radius: 2px;
}

.dropdown-scroll::-webkit-scrollbar-thumb:hover {
  background: #CCC;
}

/* Highlight matching text in search results */
.dropdown-item :deep(strong),
.mobile-item :deep(strong) {
  font-weight: 700;
  color: #0D6E6E;
}

/* Stagger-animate items */
.connected-dropdown.is-open .dropdown-item {
  animation: dropdownItemIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes dropdownItemIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ═══ Mobile overlay animations ═══ */
.mobile-overlay-enter-active {
  animation: mobile-expand-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.mobile-overlay-enter-active .mobile-search-header {
  animation: mobile-header-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
}

.mobile-overlay-enter-active .mobile-results-body {
  animation: mobile-body-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both;
}

.mobile-overlay-leave-active {
  animation: mobile-expand-out 0.25s ease-in both;
}

.mobile-overlay-enter-from {
  opacity: 0;
}

.mobile-overlay-leave-to {
  opacity: 0;
}

@keyframes mobile-expand-in {
  0% {
    opacity: 0;
    clip-path: circle(0% at 50% 0);
  }
  100% {
    opacity: 1;
    clip-path: circle(150% at 50% 0);
  }
}

@keyframes mobile-expand-out {
  0% {
    opacity: 1;
    clip-path: circle(150% at 50% 0);
  }
  100% {
    opacity: 0;
    clip-path: circle(0% at 50% 0);
  }
}

@keyframes mobile-header-in {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes mobile-body-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
