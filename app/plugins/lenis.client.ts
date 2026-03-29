import Lenis from 'lenis'

export default defineNuxtPlugin({
  name: 'lenis',
  enforce: 'post',
  setup() {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      return { provide: { lenis: null as Lenis | null } }
    }

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    })

    // Cleanup on route change to prevent scroll issues
    // Skip scroll-to-top when navigating to a hash anchor (e.g. /#about)
    const router = useRouter()
    router.beforeEach((to) => {
      if (to.hash) return
      lenis.scrollTo(0, { immediate: true })
    })

    return {
      provide: { lenis: lenis as Lenis | null },
    }
  },
})
