/**
 * Nitro plugin: defer non-critical CSS to eliminate render-blocking resources.
 *
 * 1. Injects critical inline CSS to prevent FOUC (Flash of Unstyled Content)
 * 2. Converts <link rel="stylesheet"> to async-loaded stylesheets using the
 *    media="print" / onload="this.media='all'" pattern, with <noscript> fallback.
 *
 * This eliminates the ~600ms render-blocking CSS identified by PageSpeed Insights
 * while preserving initial animation states to prevent visual flicker.
 */

// Critical CSS: styles that MUST be present on first paint to prevent FOUC.
// These define initial states for animations & layout-critical rules.
const CRITICAL_CSS = `<style data-critical>
/* Scroll-reveal: elements must start hidden */
.reveal{opacity:0;transform:translate3d(0,32px,0);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1);will-change:opacity,transform}
.reveal.visible{opacity:1;transform:translate3d(0,0,0);will-change:auto}
/* Page transition initial states */
.page-enter-active,.page-leave-active{transition:opacity .25s ease,transform .25s ease}
.page-enter-from{opacity:0;transform:translateY(8px)}
.page-leave-to{opacity:0;transform:translateY(-8px)}
/* Layout transition */
.layout-enter-active,.layout-leave-active{transition:opacity .2s ease}
.layout-enter-from,.layout-leave-to{opacity:0}
/* Lenis base — prevent scroll behavior conflicts */
html.lenis,html.lenis body{height:auto}
.lenis.lenis-smooth{scroll-behavior:auto!important}
.lenis.lenis-stopped{overflow:hidden}
/* Icon CLS prevention */
iconify-icon,.iconify{display:inline-block;width:1em;height:1em}
/* Font stack (prevent FOUT) */
:root{--font-body:"Segoe UI",Roboto,Helvetica,Arial,sans-serif;--font-display:"Iowan Old Style","Palatino Linotype","Book Antiqua",Georgia,serif}
html,body{font-family:var(--font-body)}
</style>`

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    let criticalInjected = false

    // Process head tags to defer CSS loading
    html.head = html.head.map((tag: string) => {
      // Match <link rel="stylesheet" href="/_nuxt/..."> tags
      if (
        typeof tag === 'string'
        && tag.includes('rel="stylesheet"')
        && tag.includes('/_nuxt/')
      ) {
        // Inject critical CSS before the first deferred stylesheet
        const prefix = criticalInjected ? '' : CRITICAL_CSS
        criticalInjected = true

        // Convert to non-render-blocking: media="print" + onload swap
        const deferredLink = tag
          .replace('rel="stylesheet"', 'rel="stylesheet" media="print" onload="this.media=\'all\'"')

        // Add <noscript> fallback for users without JS
        const noscriptFallback = `<noscript>${tag}</noscript>`

        return prefix + deferredLink + noscriptFallback
      }
      return tag
    })
  })
})
