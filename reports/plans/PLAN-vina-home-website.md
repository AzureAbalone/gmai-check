# PLAN: VINA HOME — Nuxt 3 Landing + Products

## Overview
Nuxt 3 landing page + products listing website with:
- **Framework**: Nuxt 3 (SSR/SSG hybrid)
- **Styling**: TailwindCSS v4
- **Animations**: Inspira UI (Vue-native ReactBits alternative)
- **Smooth Scroll**: Lenis (`@studio-freight/lenis` or `lenis` npm package)
- **Icons**: `@iconify-json/solar` via Nuxt Icon module (`nuxt-icon`)
- **Data**: Server API scraper endpoint for external product images

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 3 + Nitro |
| Styling | TailwindCSS v4 |
| Icons | `@iconify-json/solar` + `nuxt-icon` |
| Smooth Scroll | Lenis (composable/plugin) |
| Animations | Inspira UI (Vue components) |
| Data Fetching | `useFetch('/api/products')` → Nitro scraper |

## Integration Notes

### Lenis in Nuxt 3
```ts
// plugins/lenis.client.ts
import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  const lenis = new Lenis({
    autoRaf: true,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    anchors: { offset: 80 },
  })
  return { provide: { lenis } }
})
```

### Solar Icons in Nuxt 3
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/icon'],
})
```
```vue
<!-- Usage in templates -->
<Icon name="solar:home-smile-bold" size="24" />
<Icon name="solar:cart-large-2-bold" size="20" />
```

### Icon Mapping (Solar Set)
| Element | Icon Name |
|---------|-----------|
| Home | `solar:home-smile-bold` |
| Products | `solar:bag-4-outline` |
| About | `solar:info-circle-outline` |
| Contact | `solar:phone-outline` |
| Cart/Buy | `solar:cart-large-2-bold` |
| Kitchen | `solar:chef-hat-heart-bold` |
| Bathroom | `solar:bath-bold` |
| Living Room | `solar:sofa-2-bold` |
| Star Rating | `solar:star-bold` |
| Add to Cart | `solar:cart-plus-outline` |
| Sort | `solar:sort-from-top-to-bottom-outline` |
| Filter | `solar:filter-outline` |
| Arrow Right | `solar:arrow-right-bold` |
| Menu | `solar:hamburger-menu-outline` |
| Close | `solar:close-circle-outline` |

## Phases (from PLAN-nuxt-landing.md + additions)

### Phase 1: Project Init ⬜
- [ ] `npx nuxi@latest init .`
- [ ] `npx nuxi module add tailwindcss`
- [ ] `npm install lenis @iconify-json/solar`
- [ ] Configure `nuxt.config.ts` (modules, icon)
- [ ] Create `plugins/lenis.client.ts`
- [ ] Add `lenis` CSS import

### Phase 2: Server API ⬜
- [ ] `server/api/products.ts` — scraper/mock endpoint

### Phase 3: Frontend UI ⬜
- [ ] Layout + Navbar (Solar icons)
- [ ] Hero Section (Inspira UI animations)
- [ ] Product Grid + Cards (fetched data, Solar icons)
- [ ] Footer

### Phase 4: Polish ⬜
- [ ] Lenis smooth scroll verification
- [ ] Solar icons all rendering
- [ ] Responsive design
- [ ] SEO meta tags
