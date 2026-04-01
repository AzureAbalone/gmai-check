export default defineNuxtPlugin({
  name: 'lenis',
  enforce: 'post',
  parallel: true,
  setup() {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    type LenisProxy = {
      scrollTo: (...args: [target: string | number | HTMLElement, options?: import('lenis').LenisOptions]) => void
      readonly instance: import('lenis').default | null
    }

    if (prefersReducedMotion) {
      const noopProxy: LenisProxy = {
        scrollTo: () => {},
        get instance() { return null },
      }
      return { provide: { lenis: noopProxy } }
    }

    const router = useRouter()
    let lenisInstance: import('lenis').default | null = null

    // Proxy that safely delegates to Lenis once initialized.
    // This prevents null-reference errors in components that access $lenis
    // before requestIdleCallback fires.
    const lenisProxy: LenisProxy = {
      scrollTo: (...args) => {
        lenisInstance?.scrollTo(...(args as Parameters<import('lenis').default['scrollTo']>))
      },
      get instance() {
        return lenisInstance
      },
    }

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
        lenis: lenisProxy,
      },
    }
  },
})
