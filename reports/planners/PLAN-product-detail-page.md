## Implementation Plan: Product Detail Page (PDP)

### 1. Objective
Build a high-converting, visually rich Product Detail Page (PDP) in `pencil-new.pen`, utilizing existing design components from the Landing Page and adding dedicated UX patterns for eCommerce (imagery focus, sticky CTAs, clear variants).

### 2. Task Breakdown

#### Task 1: Initialize PDP Frame & Base Structure
- Create a new root-level frame named `Product Detail Page` at coordinates (x: 3080, y: 0) with width 1440.
- Copy the existing Header (`HWe35`) into the new frame.
- Copy the existing Footer (`9Fh1P`) into the new frame, making sure it sits at the bottom.
- Create a `Breadcrumbs` bar under the Header.

#### Task 2: Build Main Product Information Section
- Insert a large horizontal container (`gap: 64, padding: [60, 120]`).
- Left Column: Image Gallery (vertical layout)
  - Main active image (large container with `aspectRatio`, `clip: true`, AI/Stock image fill).
  - Thumbnail strip (horizontal, 3-4 smaller images).
- Right Column: Details & Purchase
  - Title (`H1`, `Newsreader` font).
  - Rating summary (Stars + Review count).
  - Price (Current + Strikethrough original price).
  - Variants selector (Color swatches / size dropdowns).
  - Key "Add to Cart" button (Distinctive, high contrast) and Secondary "Wishlist".
  - Shipping constraints/advantages ("Free shipping on orders over...")

#### Task 3: Build Product Specifications & Accordions
- Below the main info section, insert an accordion or detailed description layout.
- Include a section for "Sản phẩm tương tự" (Related Products) to cross-sell.
  - Generate 3-4 cohesive product cards with images, titles, prices, and small "Add" buttons.

### 3. Dependencies
- Needs `batch_design` tools from Pencil MCP.
- Use `G` for generating stock/ai images for the product (e.g., household items like pans or smart gadgets).
- Need existing Nodes from Scout report: Header (`HWe35`), Footer (`9Fh1P`).

### 4. Verification Steps
- Verify the layout renders correctly using `mcp_pencil_snapshot_layout` or viewing via `mcp_pencil_get_screenshot`.
- Check if images look premium. All elements should align to the 8px or 16px grid.
