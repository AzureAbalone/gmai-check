# DESIGN SPEC: VINA HOME — Vietnamese Homeware E-commerce Website

## 📌 User Request (VERBATIM)
Build a multi-page VINA HOME kitchenware/homeware e-commerce website based on Pencil design files. Two pages: Landing Page + Products Page.

## 🎯 Acceptance Criteria
- [ ] Pixel-perfect implementation of Landing Page
- [ ] Pixel-perfect implementation of Products Page  
- [ ] Responsive layout (desktop-first, 1440px base)
- [ ] All sections interactive (hover effects, transitions)
- [ ] Vietnamese text content preserved exactly
- [ ] Clean, semantic HTML5 structure
- [ ] No frameworks — vanilla HTML/CSS/JS only
- [ ] Navigation between pages works

---

## 🎨 Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Teal | `#0D6E6E` | CTAs, labels, nav active, accent |
| Dark | `#1A1A1A` | Headings, primary buttons |
| Dark Navy | `#0F172A` | CTA section bg, footer bg |
| Body Text | `#666666` | Nav text, body paragraphs |
| Muted Text | `#888888` | Descriptions, secondary text |
| Subtle Text | `#94A3B8` | Footer text, muted labels |
| Footer Links | `#64748B` | Footer navigation |
| Light Gray | `#CCCCCC` | Trust logos |
| Border | `#E5E5E5` | Card borders, dividers |
| Surface | `#FAFAFA` | Page bg, card bg, header bg |
| White | `#FFFFFF` | Content bg, button text |
| Badge BG | `#F0F0F0` | Badge background |
| Coral/Orange | `#E07B54` | Bathroom icon accent |
| Footer Divider | `#333333` | Footer internal divider |
| Accent Green | `#0D6E6E` | Links, active states |

### Typography
| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| Logo | Inter | 20px | 700 | - |
| Nav | Inter | 14px | 500 | - |
| Nav Active | Inter | 14px | 600 | - |
| Hero Headline | Newsreader | 56px | 500 | 1.1 |
| Section Label | JetBrains Mono | 11px | 600 | - |
| Section Title | Newsreader | 40px | 500 | 1.1 |
| Body Text | Inter | 16-18px | 400 | 1.5 |
| Card Title | Newsreader | 22px | 500 | - |
| Card Description | Inter | 14px | 400 | 1.5 |
| CTA Button | Inter | 16px | 600 | - |
| Small Label | Inter | 12-13px | 500-600 | - |
| Breadcrumbs | Inter | 13px | 400 | - |
| Product Name | Inter | 16px | 600 | - |
| Product Price | JetBrains Mono | 14px | 600 | - |

**Letter Spacing**: Logo: 2px, Section labels: 2px, Trust logos: 2px

### Spacing System
| Element | Value |
|---------|-------|
| Page Padding | 80px horizontal |
| Section Padding | 80-120px vertical |
| Card Padding | 32px |
| Navigation Gap | 32px |
| Card Gap | 24px |
| Button Padding | 16px × 32px |
| Corner Radius - Cards | 16px |
| Corner Radius - Buttons | 8px |
| Corner Radius - Pill Buttons | 32px |

---

## 📄 Page 1: Landing Page

### Section 1: Header/Navbar
- Fixed top, white bg (#FAFAFA), padding 20px × 80px
- Left: Logo "VINA HOME" (Inter 20px bold, letter-spacing 2px)
- Right: Nav links (Sản phẩm, Về chúng tôi, Liên hệ) + CTA button "Mua ngay" (teal bg #0D6E6E)

### Section 2: Hero
- Centered layout, bg #FAFAFA, padding 80px × 120px
- Badge pill: "✨ Đồ gia dụng cho mọi gia đình Việt" 
- Headline: "Tiện ích thông minh, nâng tầm cuộc sống." (Newsreader 56px)
- Subline: shipping & return info (Inter 18px, #666)
- Two CTAs: "Khám phá sản phẩm" (dark bg) + "Tìm hiểu thêm →" (outlined)

### Section 3: Hero Images
- 3 equal images in row, gap 16px, height 400px
- Border radius 16px, padding 0 80px
- Images: kitchen, patterns/textures, bathroom (Unsplash)

### Section 4: Trust Logos Bar
- Center-aligned brand names: LOCK&LOCK, DAIKIN, SUNHOUSE, KANGAROO, TUPPERWARE
- Gray text (#CCCCCC), Inter 16px bold, letter-spacing 2px
- Gap 48px between logos

### Section 5: Features Section
- Label: "SẢN PHẨM NỔI BẬT" (JetBrains Mono 11px, teal)
- Title: "Mọi tiện ích cho ngôi nhà của bạn, tất cả ở một nơi." (Newsreader 40px)
- 3 cards in row: Nhà Bếp, Phòng Tắm, Phòng Khách
- Each card: icon (48×48 rounded 12px), title (Newsreader 22px), description (Inter 14px)
- Card icons: teal, coral, dark

### Section 6: Showcase Section
- Two-column layout (text left, image right), height 500px
- Label: "CHẤT LƯỢNG ĐẢM BẢO"
- Title: "Sản phẩm bền đẹp, giá cả hợp lý." (Newsreader 36px)
- CTA: "Xem sản phẩm →" (dark button)

### Section 7: Final CTA (Dark Section)
- Full-width dark navy bg (#0F172A)
- Title: "Mua sắm thông minh. Giao hàng tận nơi." (Newsreader 48px, white)
- Two buttons: "Bắt đầu mua sắm" (white bg) + "Liên hệ tư vấn" (outlined)

### Section 8: Footer
- Dark navy bg, 4 columns: Brand, Sản phẩm, Công ty, Hỗ trợ
- Logo "VINA HOME" + tagline
- Links in gray tones

---

## 📄 Page 2: Products Page

### Section 1: Same Header (with "Sản phẩm" highlighted in teal)

### Section 2: Page Title
- Breadcrumbs: "Trang chủ / Sản phẩm / Tất cả sản phẩm"
- Label: "BỘ SƯU TẬP" (teal)
- Title: "Tất cả sản phẩm" (Newsreader 40px)
- Description text

### Section 3: Filter Bar
- Pill-shaped category filters: Tất cả (active, dark bg), Nhà bếp, Phòng tắm, Phòng khách, Ngoài trời
- Sort dropdown on right: "Sắp xếp: Mới nhất"

### Section 4: Main Layout (Sidebar + Grid)
- **Sidebar** (240px width):
  - DANH MỤC with counts: Nấu ăn (24), Làm bánh (12), Đựng thực phẩm (45), Dụng cụ khác (8)
  - MỨC GIÁ slider: 0đ - 2,000.000đ+
  - MÀU SẮC: 4 color swatches (black, white, copper, gray)
  
- **Product Grid** (3 columns):
  - 6 products (2 rows × 3)
  - Each product card: image (with badge Mới/-15%/-10%), name, star rating, category, price (teal), "Thêm vào giỏ" button
  - Product data:
    1. Nồi Inox 3 Lớp Đáy — 450.000đ — Mới
    2. Bộ Hộp Đựng Thực Phẩm — 280.000đ — -15%
    3. Bộ Phụ Kiện Phòng Tắm — 195.000đ
    4. Thùng Rác Phân Loại — 320.000đ — Mới
    5. Thớt Gỗ Tre Tự Nhiên — 175.000đ — Mới
    6. Giá Treo Khăn Inox — 220.000đ — -10%

### Section 5: Pagination
- Page 1 (active, teal bg), 2, 3, → arrow

### Section 6: Footer
- Brand "CULINARY" with tagline
- Product links + Support links
- Copyright © 2026

---

## 🖼️ Image Assets
All from Unsplash (direct URLs extracted from design):
1. Hero Image 1: kitchen scene
2. Hero Image 2: texture/pattern
3. Hero Image 3: bathroom soap dispenser
4. Showcase Image: home goods collection
5. Product images: stock photos for all 6 products

---

## ⚡ Interactions & Micro-Animations
- Header: sticky on scroll with subtle shadow
- Buttons: hover scale + color transition
- Cards: hover lift with shadow
- Filter pills: active state toggle
- Product cards: image zoom on hover
- Smooth scroll between sections
- Page transitions between Landing → Products
