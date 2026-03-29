<script setup lang="ts">
const currentYear = new Date().getFullYear()

const footerLinks = {
  products: [
    { label: 'Nhà bếp', to: '/products?category=kitchen' },
    { label: 'Phòng tắm', to: '/products?category=bathroom' },
    { label: 'Phòng khách', to: '/products?category=living' },
    { label: 'Ngoài trời', to: '/products' },
  ],
  company: [
    { label: 'Về chúng tôi', to: '/#about' },
    { label: 'Blog', to: '#' },
    { label: 'Tuyển dụng', to: '#' },
  ],
  support: [
    { label: 'Liên hệ', to: 'https://zalo.me/0968164783', external: true },
    { label: 'Hướng dẫn', to: '#' },
    { label: 'FAQ', to: '#' },
  ],
}
</script>

<template>
  <footer role="contentinfo" class="bg-[#0F172A] pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-6 lg:px-20">
      <!-- Top -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
        <!-- Brand -->
        <div class="lg:col-span-2 space-y-4">
          <NuxtLink to="/" class="hover:opacity-80 transition-opacity" aria-label="Về trang chủ">
            <DuyenPhuongLogo variant="light" size="sm" />
          </NuxtLink>
          <p class="text-sm leading-relaxed text-[#64748B] max-w-xs">
            Đồ gia dụng thông minh cho mọi gia đình Việt. Chất lượng cao — giá phải chăng.
          </p>
          <div class="flex gap-3 pt-2" role="list" aria-label="Mạng xã hội">
            <a href="#" role="listitem" class="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:bg-[#0D6E6E] hover:text-white transition-all" aria-label="Email">
              <Icon name="solar:letter-outline" size="18" aria-hidden="true" />
            </a>
            <a href="#" role="listitem" class="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:bg-[#0D6E6E] hover:text-white transition-all" aria-label="Instagram">
              <Icon name="solar:camera-outline" size="18" aria-hidden="true" />
            </a>
            <a href="https://zalo.me/0968164783" target="_blank" rel="noopener noreferrer" role="listitem" class="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:bg-[#0D6E6E] hover:text-white transition-all" aria-label="Zalo">
              <Icon name="solar:chat-round-dots-outline" size="18" aria-hidden="true" />
            </a>
          </div>
        </div>

        <!-- Link Columns -->
        <nav class="space-y-4" aria-label="Sản phẩm">
          <span class="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Sản phẩm</span>
          <div class="flex flex-col gap-3">
            <NuxtLink v-for="link in footerLinks.products" :key="link.label" :to="link.to" class="text-sm text-[#64748B] hover:text-white transition-colors">
              {{ link.label }}
            </NuxtLink>
          </div>
        </nav>
        <nav class="space-y-4" aria-label="Công ty">
          <span class="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Công ty</span>
          <div class="flex flex-col gap-3">
            <NuxtLink v-for="link in footerLinks.company" :key="link.label" :to="link.to" class="text-sm text-[#64748B] hover:text-white transition-colors">
              {{ link.label }}
            </NuxtLink>
          </div>
        </nav>
        <nav class="space-y-4" aria-label="Hỗ trợ">
          <span class="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Hỗ trợ</span>
          <div class="flex flex-col gap-3">
            <template v-for="link in footerLinks.support" :key="link.label">
              <a v-if="link.external" :href="link.to" target="_blank" rel="noopener noreferrer" class="text-sm text-[#64748B] hover:text-white transition-colors">
                {{ link.label }}
              </a>
              <NuxtLink v-else :to="link.to" class="text-sm text-[#64748B] hover:text-white transition-colors">
                {{ link.label }}
              </NuxtLink>
            </template>
          </div>
        </nav>
      </div>

      <!-- Divider + Copyright -->
      <div class="border-t border-[#1E293B] pt-6">
        <p class="text-xs text-[#475569]">&copy; {{ currentYear }} Nhà phân phối Duyên Phượng. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
