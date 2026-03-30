import { describe, expect, it } from 'vitest'

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

  it('keeps the footer map CTA copy and URLs stable', () => {
    expect(FOOTER_MAP.mapsHref).toContain('maps.app.goo.gl')
    expect(FOOTER_MAP.loadButtonLabel).toBe('Tải bản đồ tương tác')
  })
})
