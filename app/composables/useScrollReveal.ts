/**
 * Scroll-reveal composable with IntersectionObserver.
 * - Properly cleans up observer on unmount (prevents memory leaks)
 * - Respects prefers-reduced-motion
 * - Supports root margin for earlier trigger
 * - Watches for async DOM updates so lazily rendered content also reveals
 */
export function useScrollReveal(rootMargin = '0px 0px -60px 0px') {
  let observer: IntersectionObserver | null = null
  let mutationObserver: MutationObserver | null = null
  const observedElements = new WeakSet<Element>()

  function revealElement(element: Element) {
    element.classList.add('visible')
  }

  function observeElement(element: Element) {
    if (
      (!element.classList.contains('reveal')
        && !element.classList.contains('reveal-left')
        && !element.classList.contains('reveal-right'))
      || observedElements.has(element)
    ) {
      return
    }

    observedElements.add(element)
    observer?.observe(element)
  }

  function observeRevealTree(root: ParentNode) {
    if (root instanceof Element) {
      observeElement(root)
    }

    root.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((element) => {
      observeElement(element)
    })
  }

  onMounted(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
        revealElement(el)
      })
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target)
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin }
    )

    observeRevealTree(document)

    mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            observeRevealTree(node)
          }
        })
      })
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })

  // ─── Cleanup on unmount to prevent memory leaks ───
  onUnmounted(() => {
    observer?.disconnect()
    mutationObserver?.disconnect()
    observer = null
    mutationObserver = null
  })
}
