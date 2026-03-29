## Scouter Architecture Mapping: Product Detail Page (PDP)

### Existing Context
The `pencil-new.pen` file contains two existing top-level screens:
1. `Landing Page` (id: `XhtLh`, x:0, y:0)
2. `Products Page` (id: `nmbVW`, x:1540, y:0)

### New Architecture: Product Detail Page

This document outlines the nodes and components to be created for the Product Detail Page.
The new `PDP Page` will be positioned at `x: 3080, y: 0` with a standard desktop width of `1440`.

#### Proposed Top-Level Frame
- **Name**: `Product Detail Page`
- **Type**: `frame`
- **Layout**: `vertical`
- **Position**: `x: 3080, y: 0`
- **Width**: `1440`
- **Fill**: `#FAFAFA` (consistent with existing pages)

#### Internal Structure
1. **Header** (Reusable/Copied)
   - Action: Copy from Landing Page (id: `HWe35`)
   - Role: Main navigation.

2. **Breadcrumbs**
   - Action: Insert text node.
   - Example Content: "Trang chủ / Sản phẩm / Nồi cơm điện tử cao tần Panasonic"

3. **Product Main Information Section** (Layout: `horizontal`)
   - **Left Column: Image Gallery**
     - Main prominent image container.
     - Thumbnail strip (3-4 smaller thumbnails).
   - **Right Column: Product Details & Purchase**
     - Product Title (`H1` equivalent)
     - Reviews / Rating summary (e.g., "5.0 ★★★★☆ (128 đánh giá)")
     - Price block (Current price + Strikethrough original price if on sale)
     - Variations / Options (e.g., Color selector, Capacity selector)
     - Key Features list (3-4 bullet points)
     - Action Buttons: Primary "Thêm vào giỏ" (Add to cart), Secondary "Quan tâm" (Wishlist)
     - Shipping & Policy trust badges (Free shipping, 30 days return).

4. **Detailed Description & Specifications**
   - Tabbed or Accordion frame (Description, Specifications, Shipping details).

5. **Cross-Sell / Related Products Section**
   - Title: "Sản phẩm tương tự"
   - Layout: Horizontal scrollable frame or grid.
   - 4 Product Card instances (can be generated).

6. **Footer** (Reusable/Copied)
   - Action: Copy from Landing Page (id: `9Fh1P`)
   - Role: Universal footer.

### Component Reuse Strategy
- Use existing styles: `#FAFAFA` background, `#1A1A1A` main text.
- Fonts: `Inter` for UI elements, `Newsreader` for large headings.
- Reusable Nodes to Copy: `HWe35` (Header), `9Fh1P` (Footer)

### Action Items for Implementation
- Perform an initial `batch_design` call to instantiate the main root `Product Detail Page` frame, Header, and Footer.
- Perform a second `batch_design` call to populate the `Product Main Information Section`.
- Perform a third `batch_design` call to populate `Related Products` and `Details`.
