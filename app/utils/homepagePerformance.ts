export const SYSTEM_SANS_STACK = '"Segoe UI", Roboto, Helvetica, Arial, sans-serif'
export const SYSTEM_DISPLAY_STACK = '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif'

type HeroImageConfig = {
  src: string
  alt: string
  label: string
  desktopSizes: string
  mobileSizes: string
  nuxtDesktopSizes: string
  nuxtMobileSizes: string
}

export const HERO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=72',
    alt: 'Nhà bếp hiện đại',
    label: 'Nhà bếp',
    desktopSizes: '(max-width: 767px) 100vw, 20vw',
    mobileSizes: '100vw',
    nuxtDesktopSizes: 'xs:100vw md:20vw',
    nuxtMobileSizes: 'xs:100vw',
  },
  {
    src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=72',
    alt: 'Phòng khách tinh tế',
    label: 'Phòng khách',
    desktopSizes: '(max-width: 767px) 100vw, 20vw',
    mobileSizes: '100vw',
    nuxtDesktopSizes: 'xs:100vw md:20vw',
    nuxtMobileSizes: 'xs:100vw',
  },
  {
    src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=72',
    alt: 'Phòng tắm gọn gàng',
    label: 'Phòng tắm',
    desktopSizes: '(max-width: 767px) 100vw, 20vw',
    mobileSizes: '100vw',
    nuxtDesktopSizes: 'xs:100vw md:20vw',
    nuxtMobileSizes: 'xs:100vw',
  },
  {
    src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=72',
    alt: 'Phòng ngủ ấm cúng',
    label: 'Phòng ngủ',
    desktopSizes: '(max-width: 767px) 100vw, 20vw',
    mobileSizes: '100vw',
    nuxtDesktopSizes: 'xs:100vw md:20vw',
    nuxtMobileSizes: 'xs:100vw',
  },
  {
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=72',
    alt: 'Ngoại thất hiện đại',
    label: 'Ngoại thất',
    desktopSizes: '(max-width: 767px) 100vw, 20vw',
    mobileSizes: '100vw',
    nuxtDesktopSizes: 'xs:100vw md:20vw',
    nuxtMobileSizes: 'xs:100vw',
  },
 ] as const satisfies readonly HeroImageConfig[]

export type HeroImage = (typeof HERO_IMAGES)[number]

export const SHOWCASE_IMAGE = {
  src: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?auto=format&fit=crop&w=1200&q=72',
  alt: 'Bộ sưu tập đồ gia dụng Duyên Phượng chất lượng cao',
  sizes: '(max-width: 1023px) 100vw, 58vw',
  nuxtSizes: 'xs:100vw lg:58vw',
  width: 1200,
  height: 900,
} as const

export const FOOTER_MAP = {
  mapsHref: 'https://maps.app.goo.gl/ULHJwXTF4Xe7MoTQ7',
  embedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3726.0!2d105.5679!3d20.9249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345b2a2e9fa3b7%3A0x5d2b1e1f1e1e1e1e!2zU-G7kSA2NywgVOG7lSAzLCBUaMO0biBUw6JuIELDrG5oLCBYdcOibiBNYWksIEjDoCBO4buZaQ!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn',
  previewTitle: 'Bản đồ cửa hàng Duyên Phượng',
  previewBody: 'Tải bản đồ tương tác khi bạn cần chỉ đường chi tiết.',
  loadButtonLabel: 'Tải bản đồ tương tác',
  externalButtonLabel: 'Mở Google Maps',
}

export type HeroImageAttrs = {
  loading: 'eager' | 'lazy'
  fetchpriority: 'high' | 'auto'
  preload: boolean
  sizes: HeroImage['desktopSizes']
  mobileSizes: HeroImage['mobileSizes']
  nuxtSizes: HeroImage['nuxtDesktopSizes']
  nuxtMobileSizes: HeroImage['nuxtMobileSizes']
}

export type HeroPreloadLink = {
  rel: 'preload'
  as: 'image'
  href: HeroImage['src']
}

export function getHeroImageAttrs(index: number): HeroImageAttrs {
  const image = HERO_IMAGES[index] ?? HERO_IMAGES[0]!

  return {
    loading: index === 0 ? 'eager' : 'lazy',
    fetchpriority: index === 0 ? 'high' : 'auto',
    preload: index === 0,
    sizes: image.desktopSizes,
    mobileSizes: image.mobileSizes,
    nuxtSizes: image.nuxtDesktopSizes,
    nuxtMobileSizes: image.nuxtMobileSizes,
  }
}

export function getHeroPreloadLink(): HeroPreloadLink {
  return {
    rel: 'preload',
    as: 'image',
    href: HERO_IMAGES[0]!.src,
  }
}
