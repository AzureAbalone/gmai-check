import { SYSTEM_DISPLAY_STACK, SYSTEM_SANS_STACK } from './app/utils/homepagePerformance'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // ─── PostHog Analytics ───
  runtimeConfig: {
    public: {
      posthogKey: 'phc_CFd1tUTIfsFzpOaE2sFVaPl97ITYjgcjog4g80oeBm9',
    },
  },

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
    url: 'https://www.duyenphuong.com',
    name: 'Nhà phân phối Duyên Phượng',
    description: 'Hàng trăm sản phẩm gia dụng chất lượng cao — từ nhà bếp đến phòng tắm.',
    defaultLocale: 'vi',
  },

  // ─── Robots.txt ───
  // ⚠️ FIX REQUIRED: Cloudflare's "AI Bots" is OVERRIDING this robots.txt entirely.
  // PageSpeed flags "Content-Signal: search=yes,ai-train=no" as "Unknown directive".
  // Steps: Cloudflare Dashboard → Security → Bots → Disable "robots.txt configuration"
  // Then this Nuxt config will serve the correct robots.txt.
  robots: {
    groups: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: '/sitemap.xml',
  },

  // ─── Sitemap ───
  sitemap: {
    zeroRuntime: true,
  },

  // ─── App Head / SEO ───
  app: {
    head: {
      htmlAttrs: { lang: 'vi' },
      bodyAttrs: {
        style: `--font-body:${SYSTEM_SANS_STACK};--font-display:${SYSTEM_DISPLAY_STACK};font-family:var(--font-body);`,
      },
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
        { property: 'og:image', content: 'https://www.duyenphuong.com/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:url', content: 'https://www.duyenphuong.com' },
        { property: 'og:locale', content: 'vi_VN' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Nhà phân phối Duyên Phượng — Tiện ích thông minh, nâng tầm cuộc sống' },
        { name: 'twitter:description', content: 'Hàng trăm sản phẩm gia dụng chất lượng cao — từ nhà bếp đến phòng tắm.' },
        { name: 'twitter:image', content: 'https://www.duyenphuong.com/og-image.png' },
      ],
      link: [
        // Favicon
        { rel: 'icon', type: 'image/png', href: '/favicon.png?v=3' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        // DNS prefetch for images
        { rel: 'dns-prefetch', href: 'https://images.unsplash.com' },
        // Canonical URL
        { rel: 'canonical', href: 'https://www.duyenphuong.com' },
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
      crawlLinks: false,
      routes: ['/', '/products'],
    },
    routeRules: {
      // ── API caching with SWR (24h) ──
      // Product list: cache 24h, serve stale up to 24h while revalidating
      '/api/products': {
        cache: { maxAge: 86400, staleMaxAge: 86400, swr: true },
        headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400' },
      },
      // Product detail: cache 24h, serve stale up to 24h while revalidating
      '/api/products/**': {
        cache: { maxAge: 86400, staleMaxAge: 86400, swr: true },
        headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400' },
      },
      // SWR/ISR for pages
      '/': { isr: 300 },
      '/products/**': { isr: 86400 },
      // Long cache for static assets
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    },
  },

  // ─── Vite optimization ───
  vite: {
    optimizeDeps: {
      include: [
        'lenis',
        '@vue/devtools-core',
        '@vue/devtools-kit',
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
    // Disable only in dev: fs-backed payload cache collides on root ('') vs nested ('products') keys.
    payloadExtraction: process.env.NODE_ENV !== 'development',
    renderJsonPayloads: true,
    viewTransition: true,
  },
})
