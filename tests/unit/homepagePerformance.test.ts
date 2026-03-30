import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  FOOTER_MAP,
  HERO_IMAGES,
  SHOWCASE_IMAGE,
  SYSTEM_DISPLAY_STACK,
  SYSTEM_SANS_STACK,
  getHeroImageAttrs,
  getHeroPreloadLink,
} from '../../app/utils/homepagePerformance'

describe('homepagePerformance', () => {
  it('returns Nuxt-friendly hero size descriptors alongside the HTML sizes contract', () => {
    expect(getHeroImageAttrs(0)).toMatchObject({
      sizes: '(max-width: 767px) 100vw, 20vw',
      mobileSizes: '100vw',
      nuxtSizes: 'xs:100vw md:20vw',
      nuxtMobileSizes: 'xs:100vw',
    })
  })

  it('prioritizes only the first hero image', () => {
    expect(getHeroImageAttrs(0)).toMatchObject({
      loading: 'eager',
      fetchpriority: 'high',
      preload: true,
    })
    expect(getHeroImageAttrs(1)).toMatchObject({
      loading: 'lazy',
      fetchpriority: 'auto',
      preload: false,
    })
  })

  it('falls back to the first hero image sizes when out of range', () => {
    expect(getHeroImageAttrs(HERO_IMAGES.length)).toMatchObject({
      sizes: HERO_IMAGES[0]?.desktopSizes,
    })
  })

  it('returns mobile sizing metadata alongside desktop sizing', () => {
    expect(getHeroImageAttrs(0)).toMatchObject({
      sizes: '(max-width: 767px) 100vw, 20vw',
      mobileSizes: '100vw',
    })
  })

  it('keeps showcase sizing available in both HTML and Nuxt image formats', () => {
    expect(SHOWCASE_IMAGE).toMatchObject({
      sizes: '(max-width: 1023px) 100vw, 58vw',
      nuxtSizes: 'xs:100vw lg:58vw',
    })
  })

  it('uses local font stacks instead of remote Google font names', () => {
    expect(SYSTEM_SANS_STACK).toContain('Segoe UI')
    expect(SYSTEM_SANS_STACK).not.toContain('Inter')
    expect(SYSTEM_DISPLAY_STACK).toContain('Georgia')
    expect(SYSTEM_DISPLAY_STACK).not.toContain('Newsreader')
  })

  it('exposes a preload link for the real LCP hero image only', () => {
    expect(HERO_IMAGES).toHaveLength(5)
    expect(getHeroPreloadLink()).toMatchObject({
      rel: 'preload',
      as: 'image',
      href: HERO_IMAGES[0]?.src,
    })
  })

  it('keeps showcase sizing responsive', () => {
    expect(SHOWCASE_IMAGE.sizes).toBe('(max-width: 1023px) 100vw, 58vw')
  })

  it('keeps helper return types narrow enough for Nuxt image consumers', () => {
    const heroAttrs = getHeroImageAttrs(0)
    const preloadLink = getHeroPreloadLink()

    expectTypeOf(heroAttrs.loading).toEqualTypeOf<'eager' | 'lazy'>()
    expectTypeOf(heroAttrs.fetchpriority).toEqualTypeOf<'high' | 'auto'>()
    expectTypeOf(preloadLink.rel).toEqualTypeOf<'preload'>()
    expectTypeOf(preloadLink.as).toEqualTypeOf<'image'>()

    expect(true).toBe(true)
  })

  it('keeps the footer map CTA copy and URLs stable', () => {
    expect(FOOTER_MAP.mapsHref).toContain('maps.app.goo.gl')
    expect(FOOTER_MAP.loadButtonLabel).toBe('Tải bản đồ tương tác')
  })
})
