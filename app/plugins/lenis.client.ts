export default defineNuxtPlugin({
  name: 'lenis',
  enforce: 'post',
  parallel: true,
  setup() {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      return { provide: { lenis: null as null } }
    }

    const router = useRouter()
    let lenisInstance: import('lenis').default | null = null

    // Defer Lenis initialization to reduce main-thread blocking
    const initLenis = async () => {
      const { default: Lenis } = await import('lenis')
      const lenis = new Lenis({
        autoRaf: true,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
      })
      lenisInstance = lenis

      // Cleanup on route change to prevent scroll issues
      // Skip scroll-to-top when navigating to a hash anchor (e.g. /#about)
      router.beforeEach((to) => {
        if (to.hash) return
        lenis.scrollTo(0, { immediate: true })
      })
    }

    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => initLenis(), { timeout: 2000 })
    } else {
      setTimeout(initLenis, 1000)
    }

    return {
      provide: {
        lenis: lenisInstance,
      },
    }
  },
})
