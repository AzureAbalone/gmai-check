import Lenis from 'lenis'

export default defineNuxtPlugin({
  name: 'lenis',
  enforce: 'post',
  setup() {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      return { provide: { lenis: null } }
    }

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    })

    // Cleanup on route change to prevent scroll issues
    const router = useRouter()
    router.beforeEach(() => {
      lenis.scrollTo(0, { immediate: true })
    })

    return {
      provide: { lenis },
    }
  },
})
