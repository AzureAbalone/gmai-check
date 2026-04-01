import type posthogLib from 'posthog-js'

export default defineNuxtPlugin({
  name: 'posthog',
  parallel: true,
  setup() {
    const runtimeConfig = useRuntimeConfig()
    const router = useRouter()

    // Defer PostHog to after page is idle — eliminates ~186ms main-thread blocking
    let posthogInstance: typeof posthogLib | null = null
    const queuedEvents: Array<{ event: string; props: Record<string, unknown> }> = []

    const initPostHog = async () => {
      const { default: posthog } = await import('posthog-js')
      posthog.init(runtimeConfig.public.posthogKey as string, {
        api_host: 'https://hog.duyenphuong.com',
        capture_pageview: false,
        capture_pageleave: true,
        persistence: 'localStorage+cookie',
        loaded: () => {
          // Flush queued events
          for (const { event, props } of queuedEvents) {
            posthog.capture(event, props)
          }
          queuedEvents.length = 0
        },
      })
      posthogInstance = posthog

      // Capture pageview on every route change
      router.afterEach((to) => {
        nextTick(() => {
          posthog.capture('$pageview', {
            $current_url: to.fullPath,
          })
        })
      })
    }

    // Use requestIdleCallback if available, otherwise setTimeout with 2s delay
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => initPostHog(), { timeout: 3000 })
    } else {
      setTimeout(initPostHog, 2000)
    }

    // Capture initial pageview immediately (will be queued)
    queuedEvents.push({
      event: '$pageview',
      props: { $current_url: window.location.pathname },
    })

    return {
      provide: {
        posthog: {
          capture: (event: string, props: Record<string, unknown> = {}) => {
            if (posthogInstance) {
              posthogInstance.capture(event, props)
            } else {
              queuedEvents.push({ event, props })
            }
          },
        },
      },
    }
  },
})
