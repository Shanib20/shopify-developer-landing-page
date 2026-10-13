# Design System — Shopify Landing Page

Design direction generated via the `ui-ux-pro-max` skill (product type: e-commerce luxury/fashion, with a Mughal Arch-inspired cultural motif) and adapted for the task brief. This is the single source of truth for color, type, iconography, and component styling. Build every section against these tokens — don't invent one-off colors or fonts.

## 1. Creative Direction

**Style name:** *Heritage Modern Luxury* — a refined, editorial e-commerce look (dark ink + warm gold + cream) that gives the Mughal Arch tab shapes somewhere elegant to live, without tipping into kitsch or heavy ornamentation. Think: a premium fashion/home-goods storefront that borrows one architectural motif (the arch) as its signature shape, repeated deliberately across tabs, badges, and section dividers.

**Why this direction:** The brief's one unusual constraint — "Mughal Arch-inspired shape" for tabs — is a strong design anchor. Rather than going full maximalist/ornamental (which clashes with clean product-grid e-commerce conventions), we keep the palette and type restrained and let the arch shape itself carry the cultural reference. Gold is used sparingly as an accent/CTA color to echo that heritage without overpowering product photography.

**Avoid:** heavy ornamental patterns/borders everywhere, saturated/playful colors, multiple competing display fonts, emoji as icons, drop shadows that look like Material defaults.

## 2. Color Palette

Primary direction = premium dark/cream base with gold accent and a muted jewel-tone secondary for depth (arch outlines, hover states, category tags).

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#1C1917` | Headings, header bg (desktop), primary buttons, nav text |
| `--color-on-primary` | `#FFFFFF` | Text/icons on primary |
| `--color-secondary` | `#44403C` | Body copy, secondary text |
| `--color-accent` | `#A16207` | CTA buttons, active tab arch, price highlights, hover underline |
| `--color-accent-deep` | `#7C2D12` | Jewel/terracotta secondary accent — badges ("Sale", "New"), arch inner stroke |
| `--color-background` | `#FAFAF9` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, product tiles, header bg (mobile) |
| `--color-foreground` | `#0C0A09` | Primary text |
| `--color-muted` | `#F2ECE4` | Section alt-background (categories, storytelling), inactive tab fill |
| `--color-muted-foreground` | `#6B6560` | Captions, meta text, placeholder |
| `--color-border` | `#E7E2DA` | Dividers, card borders, input borders |
| `--color-destructive` | `#DC2626` | Error states, out-of-stock badge |
| `--color-ring` | `#1C1917` | Focus ring |

Notes:
- Accent `#A16207` meets WCAG contrast against both white and the cream background at CTA sizes — don't swap in a brighter yellow/gold, it fails contrast.
- Dark mode is **not required** for this task (storefront landing page); tokens above are light-mode only. If asked to add dark mode later, flip primary/background and re-check contrast — don't just invert.
- Use `--color-accent-deep` (terracotta/rust) as the second color anywhere you need two accents at once (e.g., active arch tab = gold fill, badge = terracotta) so the palette reads as intentional, not random.

## 3. Typography

**Pairing:** `Cormorant` (display/serif) + `Montserrat` (body/sans) — the confirmed pairing for fashion/luxury e-commerce.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant:wght@500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

| Role | Font | Weight | Size (desktop → mobile) |
|---|---|---|---|
| Hero headline | Cormorant | 600–700 | 56px → 32px |
| Section titles (H2) | Cormorant | 600 | 36px → 26px |
| Card/product title | Montserrat | 500 | 16px |
| Body copy | Montserrat | 400 | 16px → 15px |
| Nav / tab labels | Montserrat | 500 (uppercase, tracked +0.04em) | 14px |
| Price | Montserrat | 600 | 16px |
| Buttons | Montserrat | 600 (uppercase, tracked +0.05em) | 14px |
| Captions / meta | Montserrat | 400 | 13px |

Rules:
- Base body size is 16px minimum — never drop below 14px for running text (brief explicitly grades this).
- Line-height 1.5 for body, 1.15 for display headlines.
- Only Cormorant is a serif/display font — don't introduce a third font family anywhere (badges, footer, etc. stay Montserrat).

## 4. The Mughal Arch Motif (Part B — Active Tabs)

This is the signature custom element. Implement it as an SVG `clip-path`/mask, not an image, so it scales cleanly and recolors with CSS variables.

**Shape construction:** a pointed/cusped arch — flat base, two straight vertical sides rising to roughly 60–65% of the height, then curving inward to a shallow point (not a full semicircle, not a full ogee — keep it simple and legible at tab size, ~140–220px wide, 48–64px tall for the tab itself, with the arch as the *top edge treatment*, not a full silhouette body).

```css
.tab {
  position: relative;
  padding: 14px 28px 12px;
  background: var(--color-muted);
  color: var(--color-secondary);
  clip-path: path('M0,16 C0,6 10,0 20,0 L calc(100% - 20px),0 C calc(100% - 10px),0 100%,6 100%,16 L100%,100% L0,100% Z');
  transition: background 200ms ease, color 200ms ease;
}
.tab[aria-selected="true"] {
  background: var(--color-accent);
  color: var(--color-on-primary);
}
```

(The `clip-path: path()` above is illustrative — generate the exact cusped-arch path in a vector tool and inline the `d` string; percentage units inside `path()` aren't universally supported, so for production prefer an inline `<svg>` arch shape with `currentColor` fill behind each tab label instead of a CSS clip-path, for safer cross-browser support.)

**Practical implementation guidance:**
- Build one arch SVG (viewBox ~200×70), expose it as a template snippet/partial, and reuse it behind every tab button — swap only the fill color via `fill="currentColor"` + a CSS color change on `[aria-selected]`.
- Active tab: gold fill (`--color-accent`), white label, subtle `box-shadow: 0 4px 10px rgba(161,98,7,0.25)` lift.
- Inactive tab: cream/muted fill, dark secondary text, no shadow.
- Keep a thin accent-deep (`#7C2D12`) 1px inner stroke on the arch outline for the "inspired by" detail — don't overdo ornamentation (no repeating lattice patterns inside the arch).
- Tabs row: horizontal scroll on mobile (snap, no visible scrollbar) rather than wrapping/shrinking past legibility.

## 5. Iconography

**Library: Phosphor Icons — explicitly NOT lucide-react.** Phosphor ships as plain SVGs / a web font / a CDN script, which fits a Liquid/HTML/CSS/JS project with no React/JSX build step.

Use the **regular (outline) weight** everywhere for consistency; reserve **fill/bold weight only** for the wishlist heart once "favorited" (filled = active state).

| UI element | Phosphor icon | Notes |
|---|---|---|
| Search | `magnifying-glass` | Header search input |
| Account | `user` | Header, outline only |
| Wishlist | `heart` (outline → fill on active) | Header + product card |
| Cart | `shopping-cart` | Header, with item-count badge |
| Menu (mobile) | `list` | Hamburger, becomes `x` when open |
| Chevron (slider/tabs) | `caret-left` / `caret-right` | Banner arrows, tab scroll affordance |
| Social (footer) | `instagram-logo`, `facebook-logo`, `tiktok-logo`, `x-logo` | Outline weight, 20px |
| Add to cart (product card) | `shopping-cart-simple` or plus icon | Small, inline with price |

**How to include it without a bundler (Shopify theme-friendly):**
Self-host the specific SVGs you need as inline `<svg>` partials/snippets (`snippets/icon-heart.liquid`, etc.) rather than pulling the whole Phosphor web-font/CDN script at runtime — inline SVG gives you `currentColor` theming, no extra network request, and no FOUC. Download the exact icons needed from phosphoricons.com (outline/"regular" style export) once, then paste each `<path>` into its own snippet.

Never use emoji as icons, and never ship an icon without a visible label or `aria-label` (header icon buttons especially — search/account/wishlist/cart must each carry an `aria-label`).

## 6. Layout & Spacing

- Spacing scale (marketing-page density, not dashboard-dense): `4, 8, 12, 16, 24, 32, 48, 64, 96`px. Section vertical padding: 96px desktop / 64px tablet / 48px mobile.
- Breakpoints to design and test at: **375px / 768px / 1024px / 1440px** (per the skill's checklist — matches the brief's mobile/tablet/desktop requirement).
- Container max-width: 1280px, with 24px side gutters on mobile, 48px on desktop.
- Product grid: 2 columns mobile → 3 tablet → 4 desktop, consistent card aspect ratio (e.g. 3:4 image) — never let cards vary height within a row.
- Category section: horizontal scroll-snap on mobile, grid on tablet/desktop.
- No horizontal page scroll anywhere outside intentional carousels/tab rows (brief calls this out explicitly as an evaluation point).

## 7. Components

**Buttons**
- Primary: `--color-accent` bg, white text, 4px radius (sharp-ish, not pill — keeps the "editorial luxury" feel distinct from the arch's curves), uppercase, letter-spacing 0.05em, 150–250ms background transition on hover (darken ~10%).
- Secondary/outline: 1px `--color-border`, dark text, fills on hover.
- Minimum touch target 44×44px for icon buttons (header icons, wishlist, carousel arrows).

**Product card**
- Image (square or 3:4), badge top-left (New/Sale — `--color-accent-deep` bg, white text, small uppercase), wishlist heart top-right (ghost button, white circular bg over image for contrast), name + price below, "Add to cart" as a full-width button or icon button depending on card density.

**Banner/slider (Part C)**
- Full-bleed image, left- or center-aligned text block with a scrim gradient (`linear-gradient(to right, rgba(28,25,23,0.55), transparent 60%)`) for text contrast — never place text directly on an unprocessed photo.
- Autoplay interval 5–6s, pause on hover/focus, visible dot indicators + prev/next arrows, swipe-enabled on touch, respects `prefers-reduced-motion` (reduce/remove the slide transition, keep manual controls).

**Storytelling section (Part F)**
- Asymmetric image/text rhythm (alternate image-left/text-right, then flip) rather than three identical repeating blocks — avoids the "templated" look called out by the design skill's anti-patterns.

**Footer**
- 4 link columns + brand block on a `--color-primary` (dark) background with `--color-on-primary` text, so it reads as a clear visual anchor distinct from the cream body — social icons in outline style, accent-colored on hover.

## 8. Motion

- Standard tier: hover/focus transitions 150–250ms ease; tab switch 200ms; slider transitions 500–600ms ease-in-out.
- No continuous/looping decorative animation (brief and skill both flag this as unprofessional/distracting) — motion should always be state-driven (hover, active, slide change), never ambient.
- Respect `prefers-reduced-motion: reduce` — disable slider auto-transition animation and tab color-fades' easing, keep instant state changes instead.

## 9. Accessibility checklist (apply before calling any section done)

- [ ] Text contrast ≥ 4.5:1 for body, ≥ 3:1 for large text/headlines (verify gold-on-cream specifically for the active tab + CTA buttons)
- [ ] All icon-only buttons have `aria-label`
- [ ] Tabs use `role="tablist"` / `role="tab"` / `aria-selected`, keyboard-operable (arrow keys + Enter)
- [ ] Visible focus ring (`--color-ring`) on every interactive element, never `outline: none` without a replacement
- [ ] Slider has pause control or pauses on focus-within; no auto-advancing content trap
- [ ] Images have meaningful `alt` text (not filenames)
- [ ] Minimum 44×44px tap targets on mobile
