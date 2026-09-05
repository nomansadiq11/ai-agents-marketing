# Agentic Hub Marketing Site — Agent Instructions

Static, no-build marketing site (Tailwind CDN + Lucide icons). No package.json, no bundler — every page is a plain `.html` file that can be opened directly in a browser.

## Architecture

- `index.html` (and any future page, e.g. `pricing.html`, `about.html`) is self-contained HTML that pulls in shared assets:
  - `assets/css/style.css` — hand-written CSS (grid background, hero glow, gradient text, selection color). Add new *non-Tailwind* utility classes here, not inline `<style>` blocks.
  - `assets/js/tailwind-config.js` — the single shared `tailwind.config = {...}` object (fonts, custom animations/keyframes). Must be loaded via `<script src>` **after** the Tailwind CDN script and **before** page content.
  - `assets/js/main.js` — shared behavior: `lucide.createIcons()`, mobile menu toggle, pricing monthly/yearly toggle. Guard any new DOM lookups with `if (el)` checks so this file stays safe to include on pages that don't have that section.
- Do not duplicate the Tailwind config or the JS behaviors inline in a page — extend the shared files instead so every page stays visually and behaviorally consistent.

## New Page Checklist

When adding a new page, copy this `<head>`/script pattern from [index.html](../index.html):
1. Tailwind CDN script, then `assets/js/tailwind-config.js`.
2. Lucide CDN script (`unpkg.com/lucide@latest`).
3. Google Font `Inter` `<link>` tags.
4. `<link rel="stylesheet" href="assets/css/style.css">`.
5. Before `</body>`: `<script src="assets/js/main.js"></script>`.
6. Reuse the existing nav/footer markup verbatim (adjust the active link) so header/footer stay identical across pages.

## Design System (light theme — do not revert to dark)

- Background: `bg-white`; page text: `text-slate-600`; headings: `text-slate-900`.
- Borders/dividers: `border-slate-200`. Muted panels: `bg-slate-50`.
- Accent gradient (buttons, logo mark, "Most Popular" badge): `from-indigo-500 to-violet-500`.
- Gradient headline text: use the `.text-gradient` class (defined in `style.css`), not a one-off `bg-clip-text`.
- Success/positive states (checkmarks, "auto-saved" badges): `emerald-500`/`emerald-600` on `emerald-50` backgrounds.
- Negative/removed states (before/after "traditional way" column): `red-400`/`red-500`.
- Cards: `rounded-2xl border border-slate-200 bg-white shadow-sm`, hover to `hover:border-indigo-300 hover:shadow-xl`.
- Icons: Lucide via `<i data-lucide="name">`, always re-run `lucide.createIcons()` (already handled by `main.js`) after adding new icons — don't call it again manually in a page.

## Conventions

- Keep everything in one HTML file per page; don't introduce a templating engine or split header/footer into separate includes (there is no server-side include mechanism here).
- Section IDs (`#features`, `#agents`, `#enterprise`, `#how-it-works`, `#pricing`) are used by nav anchor links — keep these IDs stable if you reorder sections.
- Comments in markup use `<!-- ================= SECTION ================= -->` banners to delineate major page sections — follow this style for new sections.

## Slider / Carousel Pattern

The `#agents` section (`assets/js/main.js`) is the reference implementation for any future horizontal slider: a `flex overflow-x-auto snap-x snap-mandatory scrollbar-hide` track of `snap-start shrink-0` cards, optional prev/next buttons (`#agents-prev`/`#agents-next`), and JS-generated dot indicators (`#agents-dots`) synced to scroll position. Reuse these same element IDs/classes (or param­eterize them) rather than adding a slider library — `main.js` already guards this block with `if (track && dotsWrap)` so it's safe to include on pages without a slider.
