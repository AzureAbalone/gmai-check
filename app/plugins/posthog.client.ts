import posthog from 'posthog-js'

export default defineNuxtPlugin({
  name: 'posthog',
  parallel: true,
  setup() {
    const runtimeConfig = useRuntimeConfig()

    posthog.init(runtimeConfig.public.posthogKey as string, {
      api_host: 'https://hog.duyenphuong.com',
      capture_pageview: false, // We capture manually on route change
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
    })

    // Capture pageview on every route change
    const router = useRouter()
    router.afterEach((to) => {
      nextTick(() => {
        posthog.capture('$pageview', {
          $current_url: to.fullPath,
        })
      })
    })

    return {
      provide: {
        posthog,
      },
    }
  },
})
