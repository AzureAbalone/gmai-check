/**
 * Scroll-reveal composable with IntersectionObserver.
 * - Properly cleans up observer on unmount (prevents memory leaks)
 * - Respects prefers-reduced-motion
 * - Supports root margin for earlier trigger
 */
export function useScrollReveal(rootMargin = '0px 0px -60px 0px') {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal').forEach((el) => {
        el.classList.add('visible')
      })
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin }
    )

    document.querySelectorAll('.reveal').forEach((el) => {
      observer!.observe(el)
    })
  })

  // ─── Cleanup on unmount to prevent memory leaks ───
  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })
}
