/**
 * Parallax composable — applies translateY offset to elements based on scroll position.
 * Uses requestAnimationFrame for smooth 60fps updates. GPU-accelerated via translate3d.
 */
export function useParallax() {
  const parallaxElements = ref<{ el: HTMLElement; speed: number }[]>([])

  let ticking = false

  function updateParallax() {
    const scrollY = window.scrollY
    for (const item of parallaxElements.value) {
      const offset = (scrollY + window.innerHeight - item.el.offsetTop) * item.speed
      item.el.style.transform = `translate3d(0, ${offset}px, 0)`
    }
    ticking = false
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax)
      ticking = true
    }
  }

  onMounted(() => {
    // Respect reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    window.addEventListener('scroll', onScroll, { passive: true })
    updateParallax()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  function registerParallax(el: HTMLElement | null, speed: number) {
    if (el) {
      parallaxElements.value.push({ el, speed })
    }
  }

  return { registerParallax }
}
