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
    { label: 'Về chúng tôi', to: '/#contact' },
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
          <p class="text-sm leading-relaxed text-[#94A3B8] max-w-xs">
            Đồ gia dụng thông minh cho mọi gia đình Việt. Chất lượng cao — giá phải chăng.
          </p>
          <ul class="flex gap-3 pt-2 list-none" aria-label="Mạng xã hội">
            <li>
              <a href="#" class="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:bg-[#0D6E6E] hover:text-white transition-all" aria-label="Email">
                <Icon name="solar:letter-outline" size="18" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a href="#" class="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:bg-[#0D6E6E] hover:text-white transition-all" aria-label="Instagram">
                <Icon name="solar:camera-outline" size="18" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a href="https://zalo.me/0968164783" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:bg-[#0D6E6E] hover:text-white transition-all" aria-label="Zalo">
                <Icon name="solar:chat-round-dots-outline" size="18" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>

        <!-- Link Columns -->
        <nav class="space-y-4" aria-label="Sản phẩm">
          <span class="text-xs font-semibold text-[#B0BEC5] uppercase tracking-wider">Sản phẩm</span>
          <div class="flex flex-col gap-3">
            <NuxtLink v-for="link in footerLinks.products" :key="link.label" :to="link.to" class="text-sm text-[#94A3B8] hover:text-white transition-colors">
              {{ link.label }}
            </NuxtLink>
          </div>
        </nav>
        <nav class="space-y-4" aria-label="Công ty">
          <span class="text-xs font-semibold text-[#B0BEC5] uppercase tracking-wider">Công ty</span>
          <div class="flex flex-col gap-3">
            <NuxtLink v-for="link in footerLinks.company" :key="link.label" :to="link.to" class="text-sm text-[#94A3B8] hover:text-white transition-colors">
              {{ link.label }}
            </NuxtLink>
          </div>
        </nav>
        <nav class="space-y-4" aria-label="Hỗ trợ">
          <span class="text-xs font-semibold text-[#B0BEC5] uppercase tracking-wider">Hỗ trợ</span>
          <div class="flex flex-col gap-3">
            <template v-for="link in footerLinks.support" :key="link.label">
              <a v-if="link.external" :href="link.to" target="_blank" rel="noopener noreferrer" class="text-sm text-[#94A3B8] hover:text-white transition-colors">
                {{ link.label }}
              </a>
              <NuxtLink v-else :to="link.to" class="text-sm text-[#94A3B8] hover:text-white transition-colors">
                {{ link.label }}
              </NuxtLink>
            </template>
          </div>
        </nav>
      </div>

      <!-- ═══ Contact Info + Map ═══ -->
      <div class="border-t border-[#1E293B] pt-10 pb-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <!-- Contact Details -->
          <div class="space-y-5">
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Icon name="solar:map-point-wave-outline" size="16" class="text-[#0D6E6E]" aria-hidden="true" />
              Thông tin liên hệ
            </h3>
            <div class="space-y-4">
              <!-- Address -->
              <div class="flex items-start gap-3">
                <Icon name="solar:home-2-outline" size="18" class="text-[#94A3B8] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p class="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-1">Địa chỉ</p>
                  <p class="text-sm text-[#CBD5E1] leading-relaxed">
                    Số 67, Tổ 3, Thôn Tân Bình, Xã Xuân Mai, Thành phố Hà Nội
                  </p>
                </div>
              </div>
              <!-- Phone -->
              <div class="flex items-start gap-3">
                <Icon name="solar:phone-calling-outline" size="18" class="text-[#94A3B8] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p class="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-1">Hotline</p>
                  <a href="tel:0968164783" class="text-sm text-[#CBD5E1] hover:text-white transition-colors">0968 164 783</a>
                </div>
              </div>
              <!-- Zalo -->
              <div class="flex items-start gap-3">
                <Icon name="solar:chat-round-dots-outline" size="18" class="text-[#94A3B8] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p class="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-1">Zalo</p>
                  <a href="https://zalo.me/0968164783" target="_blank" rel="noopener noreferrer" class="text-sm text-[#CBD5E1] hover:text-white transition-colors">zalo.me/0968164783</a>
                </div>
              </div>
              <!-- Map link -->
              <a
                href="https://maps.app.goo.gl/ULHJwXTF4Xe7MoTQ7"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 mt-2 text-sm font-medium text-[#2DD4BF] hover:text-[#5EEAD4] transition-colors"
              >
                <Icon name="solar:map-arrow-right-outline" size="16" aria-hidden="true" />
                Xem trên Google Maps
              </a>
            </div>
          </div>

          <!-- Google Map Embed -->
          <div class="rounded-xl overflow-hidden border border-[#1E293B] h-[250px] lg:h-[280px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3726.0!2d105.5679!3d20.9249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345b2a2e9fa3b7%3A0x5d2b1e1f1e1e1e1e!2zU-G7kSA2NywgVOG7lSAzLCBUaMO0biBUw6JuIELDrG5oLCBYdcOibiBNYWksIEjDoCBO4buZaQ!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
              width="100%"
              height="100%"
              style="border: 0"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Bản đồ Duyên Phượng - Số 67, Tổ 3, Thôn Tân Bình, Xã Xuân Mai, Hà Nội"
            />
          </div>
        </div>
      </div>

      <!-- Divider + Copyright -->
      <div class="border-t border-[#1E293B] pt-6">
        <p class="text-xs text-[#94A3B8]">&copy; {{ currentYear }} Nhà phân phối Duyên Phượng. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
