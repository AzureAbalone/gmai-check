/**
 * Nitro plugin: defer non-critical CSS to eliminate render-blocking resources.
 *
 * Converts <link rel="stylesheet"> to async-loaded stylesheets using the
 * media="print" / onload="this.media='all'" pattern, with <noscript> fallback.
 *
 * This eliminates the ~600ms render-blocking CSS identified by PageSpeed Insights.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    // Process head tags to defer CSS loading
    html.head = html.head.map((tag: string) => {
      // Match <link rel="stylesheet" href="/_nuxt/..."> tags
      if (
        typeof tag === 'string'
        && tag.includes('rel="stylesheet"')
        && tag.includes('/_nuxt/')
      ) {
        // Convert to non-render-blocking: media="print" + onload swap
        const deferredLink = tag
          .replace('rel="stylesheet"', 'rel="stylesheet" media="print" onload="this.media=\'all\'"')

        // Add <noscript> fallback for users without JS
        const noscriptFallback = `<noscript>${tag}</noscript>`

        return deferredLink + noscriptFallback
      }
      return tag
    })
  })
})
