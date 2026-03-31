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
    src: 'https://vietnhatplastic.com/Data/Sites/1/Product/4311/1-5591-2.jpg',
    alt: 'Kệ chữ nhật inox 2T Hokori 5591-2',
    label: 'Kệ Hokori',
    desktopSizes: '(max-width: 767px) 100vw, 20vw',
    mobileSizes: '100vw',
    nuxtDesktopSizes: 'xs:100vw md:20vw',
    nuxtMobileSizes: 'xs:100vw',
  },
  {
    src: 'https://vietnhatplastic.com/Data/Sites/1/Product/4104/1-3886-3.jpg',
    alt: 'Tủ Tana 3T Hokori 3886-3',
    label: 'Tủ Hokori',
    desktopSizes: '(max-width: 767px) 100vw, 20vw',
    mobileSizes: '100vw',
    nuxtDesktopSizes: 'xs:100vw md:20vw',
    nuxtMobileSizes: 'xs:100vw',
  },
  {
    src: 'https://vietnhatplastic.com/Data/Sites/1/Product/4109/vn_web_spmm_2310_t12_25-16-(1).png',
    alt: 'Chậu viền 2T9 Hokori 2310',
    label: 'Chậu Hokori',
    desktopSizes: '(max-width: 767px) 100vw, 20vw',
    mobileSizes: '100vw',
    nuxtDesktopSizes: 'xs:100vw md:20vw',
    nuxtMobileSizes: 'xs:100vw',
  },
  {
    src: 'https://vietnhatplastic.com/Data/Sites/1/Product/4351/5-6052-1.jpg',
    alt: 'Bộ ca trong 2500ml 4 cốc Hokori 6052-1',
    label: 'Cốc Hokori',
    desktopSizes: '(max-width: 767px) 100vw, 20vw',
    mobileSizes: '100vw',
    nuxtDesktopSizes: 'xs:100vw md:20vw',
    nuxtMobileSizes: 'xs:100vw',
  },
  {
    src: 'https://vietnhatplastic.com/Data/Sites/1/Product/4374/2-2381.png',
    alt: 'Bộ chậu rổ chữ nhật bé Hokori 2381',
    label: 'Rổ Hokori',
    desktopSizes: '(max-width: 767px) 100vw, 20vw',
    mobileSizes: '100vw',
    nuxtDesktopSizes: 'xs:100vw md:20vw',
    nuxtMobileSizes: 'xs:100vw',
  },
] as const satisfies readonly HeroImageConfig[]

export type HeroImage = (typeof HERO_IMAGES)[number]

export const SHOWCASE_IMAGE = {
  src: 'https://vietnhatplastic.com/Data/Sites/1/Product/4500/vn_tbspm_1813_web_t3_26-04.png',
  alt: 'Bàn vuông Nhật đại Hokori 1813 — sản phẩm cao cấp Duyên Phượng',
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

export type HeroPreloadConfig = false | {
  fetchPriority: 'high'
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

export function getHeroPreloadConfig(index: number): HeroPreloadConfig {
  return index === 0 ? { fetchPriority: 'high' } : false
}
