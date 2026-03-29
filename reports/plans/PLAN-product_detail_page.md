# PLAN — Product Detail Page

## Constraints (from Scout)
- **Framework**: Nuxt 3 with `<script setup lang="ts">`
- **Styling**: Tailwind CSS utility classes (same palette: `#1A1A1A`, `#0D6E6E`, `#FAFAFA`, `#E5E5E5`, `#666`, `#888`)
- **Fonts**: `Newsreader` (serif headings), `Inter` (body/UI)
- **Icons**: `@nuxt/icon` with `solar:*` icon set
- **Images**: `<NuxtImg>` component with lazy loading
- **Layout**: `default.vue` provides TheNavbar + TheFooter automatically
- **API**: `/api/products` returns `ProductRaw[]` with `id, name, category, image, rating, reviews, badge`
- **Animations**: `useScrollReveal()` composable, `.reveal` classes
- **Routing**: File-based — page at `app/pages/products/[id].vue`

## Acceptance Criteria
- AC1: PDP page accessible at `/products/:id`
- AC2: Shows product image gallery (main image + thumbnails)
- AC3: Shows product title, price, rating, description
- AC4: Color variant swatches functional
- AC5: Quantity selector with +/- works
- AC6: Add to Cart button present (styled `#0D6E6E`)
- AC7: Trust badges (shipping, returns, warranty) visible
- AC8: Accordion sections for specs and "in the box"
- AC9: Breadcrumb navigation (Home > Products > Product Name)
- AC10: Responsive design (mobile + desktop)
- AC11: SEO metadata + JSON-LD structured data
- AC12: Page transitions work with existing setup

## Implementation Steps

### Step 1: Extend API — Add product detail endpoint
- **File**: `server/api/products/[id].ts`
- **Action**: Create new API endpoint that returns single product with extended fields (price, description, colors, specs, inTheBox)
- **Pattern**: Follow same `defineEventHandler` + cache headers pattern from `server/api/products.ts`

### Step 2: Create PDP page component
- **File**: `app/pages/products/[id].vue`
- **Action**: Create the full PDP page with:
  - `<script setup lang="ts">` block with `useFetch`, `useRoute`, `useHead`, `useScrollReveal`
  - Template matching Pencil design layout
  - Reactive state for: selected color, quantity, active accordion, active thumbnail
- **Pattern**: Follow same Vue SFC patterns as `products.vue` and `index.vue`

### Step 3: Add PDP-specific CSS
- **File**: `app/assets/css/main.css`
- **Action**: Append PDP-specific styles:
  - `.pdp-thumbnail` active state
  - `.pdp-accordion` expand/collapse animation
  - `.pdp-color-swatch` ring indicator
  - `.pdp-quantity-btn` styles

### Step 4: Wire product cards to detail pages
- **File**: `app/pages/products.vue`
- **Action**: Update "Xem chi tiết" button to link to `/products/${product.id}`

### Step 5: Update prerender routes
- **File**: `nuxt.config.ts`
- **Action**: Add `/products/*` pattern for prerendering

## Risk Assessment
- **Low risk**: All patterns are well-established in existing code
- **Medium risk**: Dynamic route `[id].vue` needs proper 404 handling

## Checkpoints
- [ ] Step 1 complete — API returns extended product data
- [ ] Step 2 complete — PDP page renders correctly
- [ ] Step 3 complete — CSS animations work
- [ ] Step 4 complete — Product cards link to PDP
- [ ] Step 5 complete — Config updated
