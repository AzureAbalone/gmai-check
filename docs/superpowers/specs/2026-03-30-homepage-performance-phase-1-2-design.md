# Homepage Performance Design: Phase 1 + 2

Date: 2026-03-30
Status: Approved for design review
Scope: Homepage and shared layout/footer performance improvements for Lighthouse mobile

## Goal

Improve the homepage's mobile Lighthouse performance while preserving the current look and feel as much as possible.

This phase intentionally covers only:

1. First paint improvements
2. Heavy media improvements

Phase 3 (`JS/CSS overhead` deeper cleanup) is explicitly deferred until after Phase 1 + 2 are completed and reviewed.

## Current Problems Observed

- A Google Maps embed in the footer loads third-party JavaScript during initial page load and dominates the unused JavaScript report.
- The homepage loads large Unsplash images early, including the likely LCP image.
- Google Fonts are loaded with a stylesheet request that participates in render blocking.
- Lighthouse reports poor LCP on mobile even though Total Blocking Time is already low, so network payload and render path are the main bottlenecks.

## Constraints

- Keep the current homepage structure, content, and overall visual identity.
- Avoid broad behavioral changes to navigation, animations, or page architecture in this phase.
- Minimize risk to accessibility and SEO.
- Do not include the deeper JavaScript/CSS reduction work from Phase 3 yet.

## Section 1: First Paint

### Objective

Reduce resources that block or delay the initial render of the homepage.

### Changes

- Remove the blocking Google Fonts stylesheet from the global head configuration.
- Replace remote-first typography dependency with a local-safe fallback stack for initial paint.
- Keep preconnect or DNS hints only if still useful after the font change; otherwise remove them.
- Tighten hero image priority so only the actual first visible hero image is eagerly prioritized.
- Keep preload focused on the real LCP candidate only.

### Expected Outcome

- Faster first render on mobile.
- Lower render-blocking request cost.
- Lower risk of font-related delays before content appears.

## Section 2: Heavy Media

### Objective

Reduce bytes transferred and defer expensive third-party media until the user asks for it.

### Changes

- Replace the footer's always-on Google Maps iframe with a lightweight preview card.
- Load the iframe only after explicit user interaction such as pressing a "View map" button.
- Preserve a direct Google Maps link so location access remains immediate even without loading the embed.
- Tighten homepage image delivery using more accurate `sizes`, dimensions, and loading priority.
- Keep the visual composition of the hero and showcase sections unchanged where possible.

### Expected Outcome

- Large reduction in third-party JavaScript transferred on initial load.
- Better LCP and lower unused JavaScript.
- Lower image payload for above-the-fold and near-fold content.

## Out Of Scope

- Refactoring scroll-reveal, Lenis, or animation behavior.
- Reworking chunk strategy or route-level hydration.
- Large CSS cleanup beyond what is directly needed for Phase 1 + 2.
- Product-listing and product-detail performance work unless a shared change is required for safety.

## Risks And Mitigations

- Typography may look slightly different after removing remote fonts.
  Mitigation: use a carefully chosen fallback stack and verify headline/body balance visually.

- Some users may prefer seeing an embedded map immediately.
  Mitigation: provide a strong preview state plus a direct external map link and an explicit load action.

- Image tuning can accidentally hurt sharpness on large screens.
  Mitigation: keep dimensions responsive and validate desktop and mobile rendering after the change.

## Verification Plan

- Add or update targeted tests where behavior changes are practical to verify.
- Run `npm run lint`.
- Run `npm run typecheck`.
- Run `npm run build`.
- Spot-check homepage rendering in mobile and desktop layouts.

## Implementation Notes

- This design assumes the current Lighthouse issue is primarily network and media driven, based on the provided screenshots and current codebase review.
- If implementation reveals that Phase 3 work is required to unlock meaningful gains, that will be proposed separately instead of folded into this phase silently.
