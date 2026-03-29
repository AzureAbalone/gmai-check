// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/eslint',
  ],

  // ─── Icon optimization ───
  icon: {
    serverBundle: 'local',
    componentName: 'Icon',
  },

  // ─── Image optimization ───
  image: {
    quality: 80,
    format: ['avif', 'webp'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },

  // ─── Site config for SEO / Sitemap ───
  site: {
    url: 'https://vinahome.vn',
    name: 'Nhà phân phối Duyên Phượng',
    description: 'Hàng trăm sản phẩm gia dụng chất lượng cao — từ nhà bếp đến phòng tắm.',
    defaultLocale: 'vi',
  },

  // ─── Robots.txt ───
  robots: {
    groups: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: '/sitemap.xml',
  },

  // ─── App Head / SEO ───
  app: {
    head: {
      htmlAttrs: { lang: 'vi' },
      title: 'Nhà phân phối Duyên Phượng — Tiện ích thông minh, nâng tầm cuộc sống',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Hàng trăm sản phẩm gia dụng chất lượng cao — từ nhà bếp đến phòng tắm. Giao hàng toàn quốc, đổi trả dễ dàng.' },
        // Theme / PWA color
        { name: 'theme-color', content: '#0D6E6E' },
        { name: 'msapplication-TileColor', content: '#0D6E6E' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Nhà phân phối Duyên Phượng' },
        { property: 'og:title', content: 'Nhà phân phối Duyên Phượng — Tiện ích thông minh, nâng tầm cuộc sống' },
        { property: 'og:description', content: 'Hàng trăm sản phẩm gia dụng chất lượng cao — từ nhà bếp đến phòng tắm. Giao hàng toàn quốc.' },
        { property: 'og:image', content: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80' },
        { property: 'og:locale', content: 'vi_VN' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Nhà phân phối Duyên Phượng — Tiện ích thông minh, nâng tầm cuộc sống' },
        { name: 'twitter:description', content: 'Hàng trăm sản phẩm gia dụng chất lượng cao — từ nhà bếp đến phòng tắm.' },
      ],
      link: [
        // Favicon
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        // Font preconnect + swap
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;0,600;1,400&display=swap' },
        // DNS prefetch for images
        { rel: 'dns-prefetch', href: 'https://images.unsplash.com' },
        // Canonical URL
        { rel: 'canonical', href: 'https://vinahome.vn' },
      ],
    },
    // Page transitions
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  css: ['~/assets/css/main.css'],

  // ─── Nitro (Server) optimization ───
  nitro: {
    compressPublicAssets: { gzip: true, brotli: true },
    prerender: {
      crawlLinks: true,
      routes: ['/', '/products', '/products/1', '/products/2', '/products/3', '/products/4'],
    },
    routeRules: {
      // Cache API responses for 60 seconds
      '/api/**': { cache: { maxAge: 60 } },
      // SWR/ISR for pages
      '/': { isr: 300 },
      // Long cache for static assets
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    },
  },

  // ─── Vite optimization ───
  vite: {
    optimizeDeps: {
      include: [
        'lenis',
      ],
    },
    build: {
      // Chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            'lenis': ['lenis'],
          },
        },
      },
      // Enable CSS code splitting
      cssCodeSplit: true,
    },
  },

  // ─── Experimental features ───
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    viewTransition: true,
  },
})