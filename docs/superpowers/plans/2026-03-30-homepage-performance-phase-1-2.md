# Homepage Performance Phase 1 + 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce homepage mobile Lighthouse regressions by improving first paint and deferring heavy media without materially changing the current UX.

**Architecture:** Pull homepage media and font decisions into small shared helpers that can be unit-tested, then wire those helpers into the homepage, footer, and global styles. Replace the always-on footer map embed with an explicit user-triggered embed, and remove remote Google Fonts from the critical render path while preserving typography with local fallback stacks.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, @nuxt/image, Tailwind CSS, Vitest

---

## File Structure

- Create: `vitest.config.ts`
- Create: `app/utils/homepagePerformance.ts`
- Create: `app/composables/useDeferredMapEmbed.ts`
- Create: `tests/unit/homepagePerformance.test.ts`
- Create: `tests/unit/useDeferredMapEmbed.test.ts`
- Modify: `package.json`
- Modify: `nuxt.config.ts`
- Modify: `app/assets/css/main.css`
- Modify: `app/pages/index.vue`
- Modify: `app/components/TheFooter.vue`
- Modify: `app/pages/products/index.vue`
- Modify: `app/pages/products/[id].vue`
- Modify: `app/error.vue`

`app/utils/homepagePerformance.ts` becomes the single source of truth for font stacks, hero/showcase image metadata, preload intent, and footer map labels/URLs. `app/composables/useDeferredMapEmbed.ts` owns the tiny interactive state for the footer embed so the Vue wiring stays simple and testable.

### Task 1: Isolate The Work In A Safe Branch

**Files:**
- Modify: `.git/worktrees/...` created by Git

- [ ] **Step 1: Create a dedicated worktree and branch before any implementation**

Run:

```bash
git worktree add ../gmai-check-homepage-perf-phase-1-2 -b perf/homepage-phase-1-2
```

Expected: Git prints `Preparing worktree` and creates `../gmai-check-homepage-perf-phase-1-2`.

- [ ] **Step 2: Move into the new worktree and verify the branch**

Run:

```bash
cd ../gmai-check-homepage-perf-phase-1-2
git branch --show-current
```

Expected: output is exactly `perf/homepage-phase-1-2`.

- [ ] **Step 3: Re-open the spec and this plan from the new worktree**

Run:

```bash
sed -n '1,220p' docs/superpowers/specs/2026-03-30-homepage-performance-phase-1-2-design.md
sed -n '1,320p' docs/superpowers/plans/2026-03-30-homepage-performance-phase-1-2.md
```

Expected: both documents print without errors so implementation proceeds from the isolated branch.

### Task 2: Add Unit-Test Scaffolding And Shared Performance Helpers

**Files:**
- Create: `vitest.config.ts`
- Create: `app/utils/homepagePerformance.ts`
- Create: `app/composables/useDeferredMapEmbed.ts`
- Create: `tests/unit/homepagePerformance.test.ts`
- Create: `tests/unit/useDeferredMapEmbed.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Add the failing unit tests first**

Create `tests/unit/homepagePerformance.test.ts`:

```ts
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
```

Create `tests/unit/useDeferredMapEmbed.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { useDeferredMapEmbed } from '../../app/composables/useDeferredMapEmbed'

describe('useDeferredMapEmbed', () => {
  it('starts with the map unloaded', () => {
    const { isMapLoaded } = useDeferredMapEmbed()
    expect(isMapLoaded.value).toBe(false)
  })

  it('loads the map permanently after explicit interaction', () => {
    const { isMapLoaded, loadMap } = useDeferredMapEmbed()
    loadMap()
    expect(isMapLoaded.value).toBe(true)
    loadMap()
    expect(isMapLoaded.value).toBe(true)
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail for the right reason**

Run:

```bash
npx vitest run tests/unit/homepagePerformance.test.ts tests/unit/useDeferredMapEmbed.test.ts
```

Expected: FAIL with module resolution errors because the helper files and Vitest config do not exist yet.

- [ ] **Step 3: Add the minimal test runner setup**

Modify `package.json`:

```json
{
  "scripts": {
    "test": "vitest run"
  },
  "devDependencies": {
    "vitest": "^3.2.4"
  }
}
```

Create `vitest.config.ts`:

```ts
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('.', import.meta.url)),
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
})
```

- [ ] **Step 4: Add the minimal implementation for the shared helpers**

Create `app/utils/homepagePerformance.ts`:

```ts
export const SYSTEM_SANS_STACK = 'InterVar, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
export const SYSTEM_DISPLAY_STACK = '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif'

export type HeroImage = {
  src: string
  alt: string
  label: string
  desktopSizes: string
  mobileSizes: string
}

export const HERO_IMAGES: HeroImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=72',
    alt: 'Nhà bếp hiện đại',
    label: 'Nhà bếp',
    desktopSizes: '(max-width: 767px) 100vw, 20vw',
    mobileSizes: '100vw',
  },
  {
    src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=72',
    alt: 'Phòng khách tinh tế',
    label: 'Phòng khách',
    desktopSizes: '(max-width: 767px) 100vw, 20vw',
    mobileSizes: '100vw',
  },
  {
    src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=72',
    alt: 'Phòng tắm gọn gàng',
    label: 'Phòng tắm',
    desktopSizes: '(max-width: 767px) 100vw, 20vw',
    mobileSizes: '100vw',
  },
  {
    src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=72',
    alt: 'Phòng ngủ ấm cúng',
    label: 'Phòng ngủ',
    desktopSizes: '(max-width: 767px) 100vw, 20vw',
    mobileSizes: '100vw',
  },
  {
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=72',
    alt: 'Ngoại thất hiện đại',
    label: 'Ngoại thất',
    desktopSizes: '(max-width: 767px) 100vw, 20vw',
    mobileSizes: '100vw',
  },
]

export const SHOWCASE_IMAGE = {
  src: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?auto=format&fit=crop&w=1200&q=72',
  alt: 'Bộ sưu tập đồ gia dụng Duyên Phượng chất lượng cao',
  sizes: '(max-width: 1023px) 100vw, 58vw',
  width: 1200,
  height: 900,
}

export const FOOTER_MAP = {
  mapsHref: 'https://maps.app.goo.gl/ULHJwXTF4Xe7MoTQ7',
  embedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3726.0!2d105.5679!3d20.9249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345b2a2e9fa3b7%3A0x5d2b1e1f1e1e1e1e!2zU-G7kSA2NywgVOG7lSAzLCBUaMO0biBUw6JuIELDrG5oLCBYdcOibiBNYWksIEjDoCBO4buZaQ!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn',
  previewTitle: 'Bản đồ cửa hàng Duyên Phượng',
  previewBody: 'Tải bản đồ tương tác khi bạn cần chỉ đường chi tiết.',
  loadButtonLabel: 'Tải bản đồ tương tác',
  externalButtonLabel: 'Mở Google Maps',
}

export function getHeroImageAttrs(index: number) {
  return {
    loading: index === 0 ? 'eager' : 'lazy',
    fetchpriority: index === 0 ? 'high' : 'auto',
    preload: index === 0,
    sizes: index === 0 ? HERO_IMAGES[0]!.desktopSizes : HERO_IMAGES[index]!.desktopSizes,
  }
}

export function getHeroPreloadLink() {
  return {
    rel: 'preload',
    as: 'image',
    href: HERO_IMAGES[0]!.src,
  }
}
```

Create `app/composables/useDeferredMapEmbed.ts`:

```ts
import { ref } from 'vue'

export function useDeferredMapEmbed(initiallyLoaded = false) {
  const isMapLoaded = ref(initiallyLoaded)

  const loadMap = () => {
    isMapLoaded.value = true
  }

  return {
    isMapLoaded,
    loadMap,
  }
}
```

- [ ] **Step 5: Run the tests to verify the new helpers pass**

Run:

```bash
npm install
npx vitest run tests/unit/homepagePerformance.test.ts tests/unit/useDeferredMapEmbed.test.ts
```

Expected: PASS for both test files.

- [ ] **Step 6: Commit the test scaffolding**

Run:

```bash
git add package.json package-lock.json vitest.config.ts app/utils/homepagePerformance.ts app/composables/useDeferredMapEmbed.ts tests/unit/homepagePerformance.test.ts tests/unit/useDeferredMapEmbed.test.ts
git commit -m "test: add homepage performance helper coverage"
```

Expected: Git creates a commit containing only the new test scaffolding and helper files.

### Task 3: Implement First-Paint Improvements

**Files:**
- Modify: `nuxt.config.ts`
- Modify: `app/assets/css/main.css`
- Modify: `app/pages/index.vue`
- Modify: `app/pages/products/index.vue`
- Modify: `app/pages/products/[id].vue`
- Modify: `app/error.vue`

- [ ] **Step 1: Add a failing test for the final preload and font-stack contract**

Update `tests/unit/homepagePerformance.test.ts` with this extra assertion:

```ts
  it('keeps hero sizing tuned for desktop and mobile render paths', () => {
    expect(HERO_IMAGES[0]?.desktopSizes).toBe('(max-width: 767px) 100vw, 20vw')
    expect(HERO_IMAGES[0]?.mobileSizes).toBe('100vw')
  })
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
npx vitest run tests/unit/homepagePerformance.test.ts -t "keeps hero sizing tuned for desktop and mobile render paths"
```

Expected: FAIL until the implementation exports the final hero sizing contract exactly.

- [ ] **Step 3: Update the helper data so the test passes**

Modify `app/utils/homepagePerformance.ts`:

```ts
export function getHeroImageAttrs(index: number) {
  const image = HERO_IMAGES[index] ?? HERO_IMAGES[0]!

  return {
    loading: index === 0 ? 'eager' : 'lazy',
    fetchpriority: index === 0 ? 'high' : 'auto',
    preload: index === 0,
    sizes: image.desktopSizes,
    mobileSizes: image.mobileSizes,
  }
}
```

- [ ] **Step 4: Wire the global head and typography to the new local-first approach**

Modify `nuxt.config.ts`:

```ts
import { SYSTEM_DISPLAY_STACK, SYSTEM_SANS_STACK } from './app/utils/homepagePerformance'

export default defineNuxtConfig({
  app: {
    head: {
      bodyAttrs: {
        style: `font-family:${SYSTEM_SANS_STACK}`,
      },
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png?v=3' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'dns-prefetch', href: 'https://images.unsplash.com' },
        { rel: 'canonical', href: 'https://vinahome.vn' },
      ],
    },
  },
})
```

Modify the top of `app/assets/css/main.css`:

```css
:root {
  --font-body: InterVar, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-display: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif;
}

html,
body {
  font-family: var(--font-body);
}

.font-display {
  font-family: var(--font-display);
}
```

Replace display-font usages in:

- `app/pages/index.vue`
- `app/pages/products/index.vue`
- `app/pages/products/[id].vue`
- `app/error.vue`

Example replacement:

```vue
<h1 class="font-display text-4xl md:text-5xl lg:text-[56px] font-medium leading-[1.1] text-[#1A1A1A] max-w-[800px]">
  Tiện ích thông minh,<br/>nâng tầm cuộc sống.
</h1>
```

- [ ] **Step 5: Wire the homepage hero and showcase images to the shared media helper**

Modify the script section of `app/pages/index.vue`:

```ts
import {
  HERO_IMAGES,
  SHOWCASE_IMAGE,
  getHeroImageAttrs,
  getHeroPreloadLink,
} from '~/app/utils/homepagePerformance'

const heroImages = HERO_IMAGES

useHead({
  link: [getHeroPreloadLink()],
})
```

Modify the desktop hero image markup:

```vue
<NuxtImg
  :src="img.src"
  :alt="img.alt"
  :loading="getHeroImageAttrs(i).loading"
  :fetchpriority="getHeroImageAttrs(i).fetchpriority"
  :sizes="getHeroImageAttrs(i).sizes"
  decoding="async"
  width="1200"
  height="900"
  class="diagonal-panel__img"
/>
```

Modify the mobile slideshow image markup:

```vue
<NuxtImg
  :src="img.src"
  :alt="img.alt"
  :loading="i === 0 ? 'eager' : 'lazy'"
  :fetchpriority="i === 0 ? 'high' : undefined"
  :sizes="getHeroImageAttrs(i).mobileSizes"
  decoding="async"
  width="1200"
  height="900"
/>
```

Modify the showcase image markup:

```vue
<NuxtImg
  :src="SHOWCASE_IMAGE.src"
  :alt="SHOWCASE_IMAGE.alt"
  loading="lazy"
  decoding="async"
  :width="SHOWCASE_IMAGE.width"
  :height="SHOWCASE_IMAGE.height"
  :sizes="SHOWCASE_IMAGE.sizes"
  class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
/>
```

- [ ] **Step 6: Re-run the focused helper tests and then the full unit suite**

Run:

```bash
npx vitest run tests/unit/homepagePerformance.test.ts
npm test
```

Expected: PASS, with the new helper contract test green.

- [ ] **Step 7: Commit the first-paint work**

Run:

```bash
git add nuxt.config.ts app/assets/css/main.css app/pages/index.vue app/pages/products/index.vue app/pages/products/[id].vue app/error.vue tests/unit/homepagePerformance.test.ts app/utils/homepagePerformance.ts
git commit -m "perf: reduce homepage first-paint overhead"
```

Expected: Git creates a commit containing the font and image-priority changes.

### Task 4: Defer The Footer Map Embed And Finish Media Tightening

**Files:**
- Modify: `app/components/TheFooter.vue`
- Modify: `app/assets/css/main.css`
- Modify: `app/pages/index.vue`
- Modify: `tests/unit/useDeferredMapEmbed.test.ts`

- [ ] **Step 1: Add a failing test that locks the map interaction behavior**

Update `tests/unit/useDeferredMapEmbed.test.ts`:

```ts
  it('supports starting in an already-loaded state', () => {
    const { isMapLoaded } = useDeferredMapEmbed(true)
    expect(isMapLoaded.value).toBe(true)
  })
```

- [ ] **Step 2: Run the focused test to verify it fails first**

Run:

```bash
npx vitest run tests/unit/useDeferredMapEmbed.test.ts -t "supports starting in an already-loaded state"
```

Expected: FAIL until the composable explicitly preserves the initial state contract.

- [ ] **Step 3: Update the composable and footer markup to lazy-load the embed on demand**

Modify `app/composables/useDeferredMapEmbed.ts`:

```ts
import { ref } from 'vue'

export function useDeferredMapEmbed(initiallyLoaded = false) {
  const isMapLoaded = ref(Boolean(initiallyLoaded))

  const loadMap = () => {
    if (!isMapLoaded.value) {
      isMapLoaded.value = true
    }
  }

  return {
    isMapLoaded,
    loadMap,
  }
}
```

Modify `app/components/TheFooter.vue`:

```vue
<script setup lang="ts">
import { FOOTER_MAP } from '~/app/utils/homepagePerformance'
import { useDeferredMapEmbed } from '~/app/composables/useDeferredMapEmbed'

const { isMapLoaded, loadMap } = useDeferredMapEmbed()
</script>

<div class="footer-map-shell rounded-xl overflow-hidden border border-[#1E293B] h-[250px] lg:h-[280px]">
  <iframe
    v-if="isMapLoaded"
    :src="FOOTER_MAP.embedSrc"
    width="100%"
    height="100%"
    style="border: 0"
    allowfullscreen
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    title="Bản đồ Duyên Phượng - Số 67, Tổ 3, Thôn Tân Bình, Xã Xuân Mai, Hà Nội"
  />
  <div v-else class="footer-map-preview h-full">
    <div class="footer-map-preview__content">
      <Icon name="solar:map-point-wave-outline" size="28" class="text-[#2DD4BF]" aria-hidden="true" />
      <h4 class="font-display text-xl text-white">{{ FOOTER_MAP.previewTitle }}</h4>
      <p class="text-sm text-[#CBD5E1] max-w-sm">{{ FOOTER_MAP.previewBody }}</p>
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#2DD4BF] text-[#042F2E] font-semibold"
          @click="loadMap"
        >
          <Icon name="solar:map-arrow-up-bold" size="16" aria-hidden="true" />
          {{ FOOTER_MAP.loadButtonLabel }}
        </button>
        <a
          :href="FOOTER_MAP.mapsHref"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-[#334155] text-white font-semibold"
        >
          <Icon name="solar:map-arrow-right-outline" size="16" aria-hidden="true" />
          {{ FOOTER_MAP.externalButtonLabel }}
        </a>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 4: Add the minimal preview styling and finish the last image tightening**

Append to `app/assets/css/main.css`:

```css
.footer-map-shell {
  background:
    radial-gradient(circle at top right, rgba(45, 212, 191, 0.16), transparent 40%),
    linear-gradient(135deg, #0f172a 0%, #111827 52%, #0b1120 100%);
}

.footer-map-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.footer-map-preview__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
}
```

Tighten the homepage showcase container in `app/pages/index.vue` so the image request matches its rendered width:

```vue
<div class="reveal-right flex-[1.2] -mx-6 lg:mx-0 rounded-none lg:rounded-2xl overflow-hidden h-[280px] lg:h-[380px] w-[calc(100%+48px)] lg:w-auto group">
  <NuxtImg
    :src="SHOWCASE_IMAGE.src"
    :alt="SHOWCASE_IMAGE.alt"
    loading="lazy"
    decoding="async"
    :width="SHOWCASE_IMAGE.width"
    :height="SHOWCASE_IMAGE.height"
    :sizes="SHOWCASE_IMAGE.sizes"
    class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
  />
</div>
```

- [ ] **Step 5: Run the focused map tests, then the full quality checks**

Run:

```bash
npx vitest run tests/unit/useDeferredMapEmbed.test.ts
npm test
npm run lint
npm run typecheck
npm run build
```

Expected: all commands PASS. If `lint`, `typecheck`, or `build` fail, stop and fix before continuing.

- [ ] **Step 6: Commit the deferred-map and media work**

Run:

```bash
git add app/components/TheFooter.vue app/assets/css/main.css app/pages/index.vue app/composables/useDeferredMapEmbed.ts tests/unit/useDeferredMapEmbed.test.ts
git commit -m "perf: defer footer map embed and tune homepage media"
```

Expected: Git creates a commit containing only the footer-map and remaining media changes.

### Task 5: Final Verification And Manual QA

**Files:**
- Modify: none

- [ ] **Step 1: Re-run the full automated verification from a clean working tree**

Run:

```bash
git status --short
npm test
npm run lint
npm run typecheck
npm run build
```

Expected: `git status --short` is empty and every verification command PASS.

- [ ] **Step 2: Capture the exact production preview command**

Run:

```bash
npm run preview
```

Expected: Nuxt prints a local preview URL for manual browser validation.

- [ ] **Step 3: Manually verify the required behaviors in the browser**

Check:

```text
1. Homepage headings render with the new local fallback display font and no layout breakage.
2. Only the first hero image is eagerly prioritized.
3. The footer initially shows the preview card, not the live Google iframe.
4. Pressing "Tải bản đồ tương tác" swaps the preview for the iframe.
5. The "Mở Google Maps" link opens the external maps destination in a new tab.
6. Mobile and desktop layouts still match the existing visual hierarchy.
```

- [ ] **Step 4: Prepare the branch for review**

Run:

```bash
git log --oneline --decorate -3
```

Expected: The top commits are the three implementation commits from this plan, ready for review.
