# Shopify Developer Interview Task — Landing Page Submission

> **Theme Name:** Heritage Modern Luxury  
> **Target Platform:** Shopify Online Store 2.0 & Standalone Preview Harness  
> **Key Design Motif:** Mughal Arch-inspired Category Tabs  

---

## 📌 Executive Summary

This repository contains the complete submission for the **Shopify Developer Interview Task: Landing Page Creation**. The objective is to build a responsive, luxury e-commerce landing page adhering strictly to Shopify best practices, semantic HTML5, modern Liquid (sections and blocks), modular CSS tokens, and lightweight vanilla JavaScript.

All requirements (**Parts A through G**), responsive breakpoints (Mobile, Tablet, Desktop), and micro-interactions have been fully implemented and tested.

---

## 📁 Repository Structure

```
├── heritage-shopify-theme.zip # Ready-to-upload Shopify Theme zip archive
├── theme/                     # Complete Shopify Online Store 2.0 Theme
│   ├── layout/theme.liquid    # Master layout with tokens and drawer containers
│   ├── templates/index.json   # OS 2.0 homepage template referencing sections
│   ├── sections/              # Modular Liquid sections (Parts A through G)
│   │   ├── header.liquid             # Part A: Responsive Header & Drawer
│   │   ├── category-tabs.liquid      # Part B: Mughal Arch Tabs
│   │   ├── hero-slider.liquid        # Part C: Auto-Sliding Hero Carousel
│   │   ├── categories.liquid         # Part D: Product Category Tiles
│   │   ├── product-grid.liquid       # Part E: Product Grid & Live Filter
│   │   ├── brand-story.liquid        # Part F: 3-Part Editorial Brand Story
│   │   └── footer.liquid             # Part G: 4-Column Footer & Newsletter
│   ├── snippets/              # Reusable components & Phosphor icons
│   │   ├── arch-shape.liquid         # Mughal Arch SVG shape with dynamic active state
│   │   ├── product-card.liquid       # Product card with hover alternate image
│   │   ├── cart-drawer.liquid        # Slide-out AJAX cart drawer
│   │   ├── quick-view-modal.liquid   # Product quick-view modal dialog
│   │   └── icon-*.liquid             # Clean inline SVG icon snippets
│   └── assets/                # CSS design tokens & modular JS scripts
│       ├── tokens.css                # CSS custom properties (colors, typography, spacing)
│       ├── base.css                  # Typography, layout, and utility primitives
│       ├── tabs.js                   # Tab selection, keyboard ARIA, and product autoscroll
│       ├── slider.js                 # Hero carousel with pause-on-hover & progress bar
│       ├── wishlist.js               # LocalStorage-backed wishlist toggling
│       └── *.png                     # High-resolution luxury product & story assets
├── preview/                   # Zero-dependency Static Preview Harness
│   ├── index.html             # Standalone mirror of the compiled theme
│   ├── theme/assets/          # Local assets for offline previewing
│   └── *.css, *.js            # Independent preview styles & router
├── design.md                  # Comprehensive Design System tokens & guidelines
├── techstack.md               # Technical choices & architecture rationale
└── README.md                  # Submission documentation & setup instructions
```

---

## ✅ Requirements Fulfillment Checklist

| Part | Component | Requirements Met | Implementation Details |
|---|---|:---:|---|
| **Part A** | **Header Creation** | ✅ | Brand wordmark & logo picker, live search field, account link, wishlist counter, cart trigger with live badge counter, primary nav, and mobile drawer. |
| **Part B** | **Active Tab Section** | ✅ | Directly below header. Features custom **Mughal Arch SVG** silhouette with warm gold active fill (`#A16207`). Tapping/clicking any tab switches state, updates product filters, and **smoothly autoscrolls to the product section**. Full keyboard ARIA support (Arrow keys, Home, End, Enter). |
| **Part C** | **Auto-Sliding Banner** | ✅ | Auto-advances every 6 seconds with animated progress bars. Smooth fade & slide transitions, pause on hover/focus, previous/next controls, dot pagination, and CTA buttons. |
| **Part D** | **Categories Section** | ✅ | 5 curated categories (*Jewelry, Apparel, Footwear, Home, Accessories*) with high-res photography, uniform aspect ratios, and smooth hover elevation. |
| **Part E** | **Product Listing Section** | ✅ | Product image with secondary hover angle, product title, formatted pricing with compare-at discounts, "Sale" & "New" badges, interactive wishlist heart (persisted in `localStorage`), and "Add to Cart" button linked to the slide-in cart drawer. Includes Quick View modal. |
| **Part F** | **Storytelling Section** | ✅ | 3 distinct editorial story blocks (*The Craft, The Materials, The Silhouette*) in an engaging alternating layout with numbered steps, high-res photography, and scroll reveals. |
| **Part G** | **Footer Creation** | ✅ | Brand descriptor, contact email & telephone, social icons (Instagram, Facebook, TikTok, X), **4 menu columns with 4+ links each**, newsletter signup form with success state, and copyright notice. |

---

## 📱 Responsive Design Verification

Tested thoroughly across all three required device viewports:
1. **Mobile (360px – 480px):**
   - Header collapses cleanly into a hamburger drawer with accessible focus trap.
   - Search converts to an expandable full-width drawer.
   - Mughal Arch tabs remain touch-scrollable and centered.
   - Category tiles transition to an elegant scroll-snap rail.
   - Product grid optimizes to a responsive 2-column layout.
   - Storytelling blocks stack vertically with readable typography.
   - Zero horizontal overflow (`overflow-x: hidden` clean pass).
2. **Tablet (768px – 1023px):**
   - 3-column product grid with balanced whitespace.
   - Side-by-side brand story presentation.
3. **Desktop (1024px – 1440px+):**
   - 4-column product grid.
   - Full horizontal navigation and search bar in header.
   - Wide 21:9 cinematic hero slider.

---

## 🚀 How Reviewers Can Test This Project

### Option 1: Instant Standalone Preview (No Shopify Setup Required)

Open the project directly without needing a Shopify store or CLI:

```powershell
# In PowerShell / Command Prompt:
npx -y serve preview -l 3000
```
*Or with Python:*
```powershell
python -m http.server 3000 --directory preview
```
Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

*(Alternatively, simply double-click `preview/index.html` to open it as a local file).*

---

### Option 2: Live Shopify Theme (Online Store 2.0)

#### Method A: Direct Admin Upload (Quickest)
1. In this project root, locate **`heritage-shopify-theme.zip`**.
2. Go to your Shopify Store Admin: **Online Store** &rarr; **Themes** &rarr; **Add Theme** &rarr; **Upload zip file**.
3. Select `heritage-shopify-theme.zip` and click **Actions** &rarr; **Preview**.

#### Method B: Using Shopify CLI
```powershell
cd theme
shopify theme dev --store <your-store-name>.myshopify.com
```

---

## 🎨 Design System Summary

- **Palette:** Warm luxury cream background (`#FAFAF9`), rich charcoal text (`#1C1917`), warm gold accent (`#A16207`), and terracotta secondary accent (`#7C2D12`).
- **Typography:** Google Fonts pairing of **Cormorant** (editorial serif headings) and **Montserrat** (clean geometric sans body).
- **Accessibility:** Full WCAG AA color contrast adherence, keyboard-navigable tabs, ARIA states (`aria-selected`, `aria-expanded`, `aria-modal`), and `prefers-reduced-motion` fallbacks.