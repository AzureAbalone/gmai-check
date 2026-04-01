export default defineNuxtPlugin({
  name: 'vercel-insights',
  parallel: true,
  setup() {
    // Defer Vercel Analytics + Speed Insights to after page is interactive
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(async () => {
        const [{ inject }, { injectSpeedInsights }] = await Promise.all([
          import('@vercel/analytics'),
          import('@vercel/speed-insights'),
        ])
        inject()
        injectSpeedInsights()
      }, { timeout: 4000 })
    } else {
      setTimeout(async () => {
        const [{ inject }, { injectSpeedInsights }] = await Promise.all([
          import('@vercel/analytics'),
          import('@vercel/speed-insights'),
        ])
        inject()
        injectSpeedInsights()
      }, 2500)
    }
  },
})
