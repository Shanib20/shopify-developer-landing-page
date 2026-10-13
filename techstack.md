# Tech Stack — Shopify Landing Page

Scope: the brief is a Shopify theme interview task graded on Liquid implementation, HTML/CSS/JS, and responsive UI quality — not a framework showcase. The stack below is deliberately plain/native so the reviewer sees real Liquid + CSS + vanilla JS skill, not a wrapper doing the work.

## 1. Core Stack

| Layer | Choice | Why |
|---|---|---|
| Templating | **Shopify Liquid**, Online Store 2.0 **JSON templates + sections + blocks** | This is what's actually graded; sections/blocks also give the merchant (reviewer) a configurable theme editor experience, which reads as more senior work than hardcoded markup |
| Markup | Semantic HTML5 (`<header>`, `<nav>`, `<section>`, `<figure>`, etc.) | Accessibility + SEO, explicitly graded under "attention to detail" |
| Styling | **Plain CSS** with CSS custom properties (design tokens from `design.md`), organized per-section (`assets/section-*.css`) loaded via `{{ 'section-x.css' | asset_url | stylesheet_tag }}` | Shopify themes ship static assets; scoping CSS per section keeps the Liquid/CSS reviewable file-by-file and avoids a build step the task doesn't ask for |
| JS | **Vanilla JS**, one small file per interactive section (`tabs.js`, `slider.js`, `cart-drawer.js`, `mobile-nav.js`), loaded with `defer` | No framework runtime needed for tabs/slider/wishlist-toggle interactions; keeps Lighthouse scores high and matches what a Shopify theme dev is expected to hand-write |
| Icons | Inline SVG snippets, **Phosphor Icons** source (outline weight) — see `design.md` §5 | No `lucide-react` (no React in this project anyway) and no icon font/CDN dependency; inline SVG themes with `currentColor` and needs zero JS to render |
| Images | Shopify's native `image_url` / `image_tag` filters with `srcset`/`sizes`, `loading="lazy"` below the fold, `width`/`height` attributes to prevent layout shift | Required for the "image optimization" and "no layout shift" grading points |
| Build tooling | **Shopify CLI** (`shopify theme dev`, `shopify theme push`) | Standard theme dev workflow; no bundler/webpack/vite needed since there's no JSX/TS to compile |

**Explicitly not used:** React/Vue/any JS framework, Tailwind/Bootstrap (optional only if you want faster utility styling — not required and adds a build step the brief doesn't call for), lucide-react, jQuery.

> If you'd rather use Tailwind for the utility classes, that's a reasonable swap — just run it as a one-time CLI build (`npx tailwindcss -i ... -o assets/theme.css --minify`) committed as a static asset, not a live dev-server dependency, so the Shopify theme itself stays framework-free.

## 2. Theme File Structure

```
theme/
├── layout/
│   └── theme.liquid
├── templates/
│   └── index.json                 # OS 2.0 JSON template, references sections below
├── sections/
│   ├── header.liquid               # Part A
│   ├── category-tabs.liquid        # Part B — Mughal arch tabs
│   ├── hero-slider.liquid          # Part C
│   ├── categories.liquid           # Part D
│   ├── product-grid.liquid         # Part E
│   ├── brand-story.liquid          # Part F
│   └── footer.liquid               # Part G
├── snippets/
│   ├── icon-cart.liquid
│   ├── icon-heart.liquid
│   ├── icon-user.liquid
│   ├── icon-search.liquid
│   ├── icon-caret.liquid
│   ├── product-card.liquid         # reused by product-grid + any "related" rail
│   └── arch-shape.liquid           # reusable Mughal arch SVG/clip path
├── assets/
│   ├── tokens.css                  # :root CSS variables from design.md
│   ├── base.css                    # resets, typography, layout primitives
│   ├── header.css
│   ├── category-tabs.css
│   ├── hero-slider.css
│   ├── categories.css
│   ├── product-grid.css
│   ├── brand-story.css
│   ├── footer.css
│   ├── mobile-nav.js
│   ├── tabs.js
│   ├── slider.js
│   └── wishlist.js
├── config/
│   └── settings_schema.json
└── locales/
    └── en.default.json
```

## 3. Section-by-section notes

- **Header (Part A):** `header.liquid` section with blocks for logo, search, account/wishlist/cart icons, and a `linklist` picker for the nav menu. Mobile breakpoint collapses nav into a drawer (`mobile-nav.js`, `aria-expanded` toggle, focus trap, `Escape` to close).
- **Active tabs (Part B):** render categories from a `linklist` or a metafield-driven list; each tab is a `<button role="tab">` wrapped by the arch snippet from `snippets/arch-shape.liquid`. `tabs.js` handles `aria-selected` + showing/hiding the matching panel(s) — or, if tabs just filter the product grid, dispatch a custom event `tabs:change` that `product-grid` section's JS listens for.
- **Hero slider (Part C):** block-based slides (image, heading, subtext, CTA) so merchants can add/remove slides in the theme editor. `slider.js`: plain CSS-transform carousel, `IntersectionObserver` or simple `setInterval` with pause-on-hover/focus, dot nav, swipe via `touchstart/touchmove/touchend`. No slider library needed — keeps JS payload small and avoids another "not lucide, not X" dependency question.
- **Categories (Part D):** section with repeatable blocks (image + title + link), CSS grid on tablet/desktop, scroll-snap flex row on mobile.
- **Product grid (Part E):** pull from a real Shopify collection (`{% for product in collection.products %}`) so the task demonstrates actual Liquid/Shopify object usage, not static markup. `product-card.liquid` snippet handles badge logic (`product.tags` → "Sale"/"New"), price via `money` filter, wishlist heart toggles a `localStorage`-backed state via `wishlist.js` (no backend wishlist app required for this task).
- **Storytelling (Part F):** block-based alternating image/text rows, each block configurable (image, heading, body, alignment) in the theme editor.
- **Footer (Part G):** section with brand block + 4 linklist-driven columns + social icon block list.

## 4. Responsive approach

- Mobile-first CSS: base styles target the smallest breakpoint, `@media (min-width: 768px)` / `1024px` / `1440px` layer up from there.
- One shared `tokens.css` (colors, spacing scale, font tokens from `design.md`) imported before all section CSS files.
- Test matrix: 375px (mobile), 768px (tablet), 1024px (small desktop/landscape tablet), 1440px (desktop) — matches the design system's checklist and the brief's three target device classes.

## 5. Performance & QA checklist

- [ ] All images served via `image_url`/`srcset`, explicit `width`/`height`, `loading="lazy"` except the first hero slide
- [ ] CSS/JS split per section so unused code isn't loaded on templates that don't include that section
- [ ] No horizontal scroll at any breakpoint (test by setting `overflow-x: hidden` only as a last-resort smoke test, then actually fix the overflowing element)
- [ ] Lighthouse mobile pass (performance + accessibility) before calling it done
- [ ] Keyboard-only pass: tab through header, tabs, slider controls, product cards, footer

## 6. Local fallback tooling — OmniRoute (non-blocking note)

You asked about [OmniRoute](https://github.com/diegosouzapw/OmniRoute) as a way to keep working if Claude usage runs out. It's unrelated to the Shopify build itself (it's a local AI-gateway/router), so treat this as separate dev-environment setup, not part of the theme.

**What it is:** a free, self-hosted, MIT-licensed AI gateway. It exposes one OpenAI-compatible endpoint on your machine and routes requests across providers you connect (Claude, GPT, Gemini, DeepSeek, etc.), with automatic fallback when one provider is out of quota, failing, or too expensive, plus 19 routing strategies and an `auto` virtual model.

**Install (pick one):**
```bash
# npm (simplest)
npm install -g omniroute

# or Docker
docker pull diegosouzapw/omniroute

# or from source
git clone https://github.com/diegosouzapw/OmniRoute.git
cd OmniRoute
pnpm install
```

**Set up:**
1. Start it — it listens on `http://localhost:20128`:
   ```bash
   omniroute serve
   ```
2. Open the dashboard it prints (or `http://localhost:20128`) and connect at least one provider — your own ChatGPT/Claude subscription login, or an API key for Claude/OpenAI/Gemini/etc. `auto` routing only works once a provider is connected.
3. Copy an OmniRoute API key from **Dashboard → Endpoints**.

**Use it as a Claude Code fallback:**
```bash
# one-off launch with credentials injected, no config file written
omniroute run claude --model auto

# or write Claude Code's own config to point at OmniRoute permanently
omniroute configure claude
```
Or manually point any OpenAI-compatible client at it:
```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer <your-omniroute-key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"auto","messages":[{"role":"user","content":"hello"}]}'
```

**Caveats worth knowing before relying on it:**
- `auto` needs at least one connected, eligible provider — a bare install with nothing connected won't route anywhere.
- It's a *gateway to other providers' quotas*, not free unlimited Claude — if you connect only your own Claude subscription/API key, you're still bound by that account's limits; the benefit is automatic failover to a second provider (e.g. a free-tier Gemini/DeepSeek key) once Claude runs out, plus its reported token-compression (RTK/Caveman) savings.
- Check `docs/guides/CLI-INTEGRATIONS.md` in the repo for the exact current CLI integration commands — the project is actively developed and flags/commands may shift between versions.
