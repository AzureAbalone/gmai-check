import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, _from, savedPosition) {
    // If user navigated back/forward, restore saved position
    if (savedPosition) {
      return savedPosition
    }

    // If there's a hash, scroll to it smoothly
    if (to.hash) {
      return {
        el: to.hash,
        top: 100, // offset for sticky navbar
        behavior: 'smooth',
      }
    }

    // Default: scroll to top
    return { top: 0, behavior: 'smooth' }
  },
}
