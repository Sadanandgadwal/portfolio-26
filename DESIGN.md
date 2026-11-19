# DESIGN.md — Sadanand Gadwal Portfolio

Single source of truth for visual and interaction decisions. Tokens live in `src/app/globals.css`; this document explains them. If code and this file disagree, fix one of them in the same change.

## 1. Philosophy

- **Prove, don't claim.** Every skill is shown as working UI (playground, live mockups), not a bullet list.
- **Typography + space + motion + interaction + detail.** No decoration that doesn't carry information.
- **Monochrome first.** Ink on paper. One signal color, used sparingly.
- **Real facts only.** Content comes from `src/data/portfolio.json`. Sample data appears only in the clearly labelled Playground and Enterprise UI sections.
- **Fast by default.** Motion never blocks content. Everything is readable before JS hydrates.

## 2. Visual direction

Editorial, product-grade, quiet. References: a premium personal brand, a modern SaaS product surface, an interactive playground and case-study layouts.

Avoid: gradient blobs, neon, glassmorphism stacks, repeated three-column icon cards, emoji icons, stock illustrations, and centered-everything hero layouts.

## 3. Color

All colors are OKLCH and neutral (chroma 0) except `signal` and `destructive`.

| Token              | Light               | Dark                | Use                                                                                                                |
| ------------------ | ------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `background`       | 0.985 (off-white)   | 0.135 (near-black)  | Page                                                                                                               |
| `foreground`       | 0.16                | 0.955               | Primary text, primary buttons                                                                                      |
| `surface`          | 1.0                 | 0.175               | Cards, mockups                                                                                                     |
| `surface-raised`   | 1.0                 | 0.21                | Popovers, nav when scrolled                                                                                        |
| `subtle`           | 0.955               | 0.20                | Section bands, hover fills                                                                                         |
| `muted-foreground` | 0.48                | 0.68                | Secondary text (≥ 4.5:1 on background)                                                                             |
| `border`           | 0.905               | white / 9%          | Hairlines                                                                                                          |
| `border-strong`    | 0.82                | white / 18%         | Inputs, emphasized dividers                                                                                        |
| `signal`           | oklch(0.62 0.19 41) | oklch(0.72 0.17 45) | Status dot, active indicators, one chart series. Never large fills.                                                |
| `destructive`      | oklch(0.55 0.21 27) | oklch(0.68 0.19 24) | Validation errors and destructive actions. Text on it uses `destructive-foreground` (white in light, ink in dark). |

Charts use `chart-1…4` (gray ramp) plus `chart-5` (signal).

**Rule:** signal covers at most about 2% of any viewport.

## 4. Typography

| Role         | Font           | Token / class                                                 | Notes                        |
| ------------ | -------------- | ------------------------------------------------------------- | ---------------------------- |
| Display      | Geist 600      | `text-display` (fluid 48 → 120px, lh 0.92, tracking −0.045em) | Hero name only               |
| Headline     | Geist 600      | `text-headline` (fluid 32 → 64px, lh 1.0, tracking −0.035em)  | Section headings (h2)        |
| Title        | Geist 500      | `text-title` (fluid 22 → 30px)                                | Card and project titles (h3) |
| Body         | Geist 400      | `text-base` / `text-lg`, lh 1.6                               | Max 65ch                     |
| Label / meta | Geist Mono 400 | `text-xs`, uppercase, tracking 0.2em                          | Eyebrows, dates, tags        |
| Code         | Geist Mono     | `font-mono`                                                   | Playground snippets          |

Fonts are loaded through `next/font/google` (self-hosted, `display: swap`). Headings use `text-balance` and paragraphs use `text-pretty`. One `h1` per page, with no skipped heading levels.

## 5. Spacing

Tailwind's 4px base scale.

- Section vertical rhythm: `py-24 md:py-32 lg:py-40`.
- Container: `max-w-6xl` (1152px) with gutters `px-4 sm:px-8`. Wide media may break out to `max-w-7xl`.
- Stack gaps: 8 / 12 / 16 / 24 / 32 / 48 / 64px. Don't use arbitrary values.
- Section header → content gap: 48–64px.

## 6. Layout

- 12-column grid on `lg+`. Use asymmetric splits (5/7, 4/8) instead of centered columns.
- Section headers are left-aligned with a mono eyebrow, an `h2` and an optional description.
- Large media (project mockups) may span full container width. Text never does.
- Mobile layouts are designed separately: single column, a horizontal snap-scroll for project previews, and no hover-only information.

## 7. Components

Built on shadcn/ui (radix-nova, `src/components/ui`) and restyled through tokens. Never fork colors inside components.

- **Buttons** (`ui/button.tsx`): pill (`rounded-full`). Sizes: sm 36px (dense desktop UI only), default 44px, lg 48px. Variants: default (foreground fill), secondary, outline, ghost, destructive, link. `loading` shows a spinner, disables the button and sets `aria-busy`. An `inline-end` icon (`data-icon="inline-end"`) nudges on hover. Pressing scales to 0.98.
- **Cards** (`ui/card.tsx`): `surface` with a 1px `border`, `radius-xl` and 24px padding (16px for `size="sm"`). `interactive` adds a 2px lift, `border-strong` and `shadow-md` on hover or focus-within. `CardTitle` renders an `h3`.
- **Badges** (`ui/badge.tsx`): mono `text-xs`, 24px tall, `radius-sm`. Variants: outline (default), secondary (subtle fill), solid (inverted). `dot` adds a leading signal dot for status.
- **Icon buttons** (`ui/icon-button.tsx`): 44px (36px for `sm`) round, ghost by default. `aria-label` is required by the type.
- **Layout** (`layout/section.tsx`): `Container` (max-w-6xl with gutters), `Section` (anchor id, `aria-labelledby`, vertical rhythm, `scroll-mt-20` for the sticky nav) and `SectionHeader` (eyebrow, `h2` and description).
- **Theme toggle** (`theme/theme-toggle.tsx`): a sun→moon SVG morph driven by the `.dark` class in CSS, so it renders correctly before hydration. Its label changes to "Switch to light/dark theme".
- **Site header** (`layout/site-header.tsx`): full-width and transparent at the top. After 24px of scroll it becomes a floating `max-w-3xl` pill with `bg-background/75`, `backdrop-blur-xl`, a border and `shadow-md` (500ms ease-out-expo). The active section is tracked with an IntersectionObserver and marked by a shared-layout pill (`layoutId`).
- **Mobile menu** (`layout/mobile-menu.tsx`): a full-screen Radix Dialog (focus trap, Esc, scroll lock via `Dialog.Overlay`) with a clip-path wipe, a staggered masked link reveal and a hamburger→X morph. It closes before scrolling to the target.
- **Hero** (`sections/hero`): the entrance uses CSS keyframes (`animate-reveal`, `fade-up`, `rise`), so it runs before hydration. The order is grid background → eyebrow → name (per-word mask) → roles → statement → CTAs → mockup, finishing in about 1.5s.
- **Hero mockup**: `BrowserFrame` showing a sample ERP view. It has pointer parallax and a 3D tilt (±7°), plus depth layers for the badge and modal. Everything in it works: sidebar nav, search that filters the table, chart tooltips and the modal with a confirmation toast. All of its data comes from `hero.mockup` in the JSON and is labelled "Sample data".
- **Magnetic** (`motion/magnetic.tsx`): spring-pulls its child by 30% of the cursor offset.
- **Custom cursor** (`motion/custom-cursor.tsx`): a 10px dot, a 44px ring over interactive elements, and an 84px labelled disc for `data-cursor="view|interact|explore"`. It hides over text inputs (native caret). Fine pointers only, and disabled under reduced motion.
- **About** (`sections/about`): a sticky 5/7 split, with the lead paragraph in `foreground` and the rest in `muted-foreground`. Focus areas are a numbered editorial list with hover tint and number nudge. Stats render only when real values exist, using `AnimatedNumber`: it counts up once in view, the server HTML holds the final value, the value is screen-reader safe, and it stays static under reduced motion.
- **Skills explorer** (`sections/skills`): filter chips (`aria-pressed`, shared-layout active pill) and category groups with popLayout enter/exit. Tiles show a monochrome icon that tints to the brand colour, rotates and scales when active; the other tiles dim while the pointer is in the grid. The detail panel (sticky aside on desktop, inline under the active group on mobile, `aria-live`) shows the description, related projects and "works alongside" shortcuts.
- **Tech icons** (`icons/tech-icon.tsx`): a registry from JSON `icon` key to official simple-icons marks (CC0), with Lucide for generic concepts or removed brands. Brand colours with luminance below 0.02 fall back to `currentColor` so they stay visible in dark mode. Unknown keys render a monogram.
- **Experience timeline** (`sections/experience`): a 1px `border` rail with a `foreground` progress line that scales with scroll (`useScroll`, spring-smoothed, full under reduced motion). Dots activate by position, while the entry top is above 55% of the viewport, so they stay correct after anchor jumps or reloads. Entries use a 14rem mono meta column (range, duration for closed ranges only, location, type) plus content: role, company, summary, en-dash responsibilities, a "Highlights" panel with signal bullets, and technology badges.
- **Education** (`sections/education`): two editorial columns, degrees and certifications. Linked certifications open in a new tab (`noopener noreferrer`, screen-reader hint, `data-cursor="view"`) and have an arrow nudge.
- **Scroll reveal** (`.reveal`): a CSS scroll-driven `fade-up` (`animation-timeline: view()`) with no JS. Unsupported browsers and reduced motion simply show the content.
- **Empty sections:** sections without content render nothing, and the nav lists only rendered sections (`visibleNavItems`). Dates are formatted locale-independently (`lib/format.ts`), and durations never use the current date, which keeps static prerendering deterministic.
- **Living style guide:** `/design-system` (noindex) renders every token and primitive in both themes. `/design-system/sections` previews data-dependent sections with clearly labelled fictional fixtures.
- **Inputs:** 44px height, `border-strong`, focus ring = `ring` at 2px. Errors use `destructive` text plus `aria-invalid`.
- **Browser mockup:** `surface` frame with a 32px chrome bar (three 8px neutral dots plus a URL pill). Reused by the Hero, Projects and Showcase.

## 8. Radius

`--radius` = 12px. Scale: sm 6, md 9, lg 12, xl 18, 2xl 24, 3xl 36. Pills use `rounded-full`. Nested radius = outer radius − padding.

## 9. Shadows

Light: soft, layered, low-opacity (`shadow-xs` … `shadow-lg`). Dark: an inset top highlight plus a deep falloff, because plain drop shadows disappear on dark backgrounds. Don't use colored glows.

## 10. Motion

Library: `motion` (Motion for React) for orchestration, layout, scroll and gestures. Use CSS transitions for simple hover and focus.

| Token               | Value                                          | Use                   |
| ------------------- | ---------------------------------------------- | --------------------- |
| `ease-out-expo`     | cubic-bezier(0.16, 1, 0.3, 1)                  | Reveals, entrances    |
| `ease-in-out-quart` | cubic-bezier(0.76, 0, 0.24, 1)                 | Page/menu transitions |
| Durations           | 150ms (hover), 300ms (UI), 600–900ms (reveals) |                       |
| Stagger             | 60–80ms                                        | Lists, hero sequence  |

Rules:

- Animate only `transform`, `opacity`, `clip-path` and `filter`.
- Reveal once (`viewport: { once: true }`). No looping attention-seekers.
- The hero sequence finishes in under 1.2s, and content is interactive throughout.
- Every motion component respects `useReducedMotion()`. The global CSS also collapses durations under `prefers-reduced-motion: reduce`.
- Custom cursor and magnetic effects are enabled only on `(hover: hover) and (pointer: fine)`.

## 11. Breakpoints

Tailwind defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536. QA viewports: **390** (mobile), **768** (tablet), **1440** (desktop), plus 1280 (laptop).

## 12. Theme

- `.dark` class on `<html>` switches token sets (`@custom-variant dark`).
- Default theme follows `prefers-color-scheme`, and the user's choice persists in `localStorage`.
- An inline `<head>` script (`lib/theme.ts` → `themeInitScript`) applies the class before first paint, so there is no flash. `<html>` has `suppressHydrationWarning`.
- State: `useTheme()` (`hooks/use-theme.ts`) uses `useSyncExternalStore` over the `<html>` class, so no provider is needed. It syncs across tabs via the `storage` event and follows OS changes until the user picks a theme.
- Transition: a View Transitions cross-fade (400ms, ease-out-expo), with a 300ms color-transition fallback (`.theme-transition`).
- Under reduced motion the theme switches instantly.
- `color-scheme` is set per theme so native controls and scrollbars match.

## 13. Accessibility

- WCAG 2.2 AA: text contrast ≥ 4.5:1 (≥ 3:1 for large text and UI). Check both themes.
- Visible `:focus-visible` outline (2px, offset 2px) on every interactive element.
- Full keyboard support. Dialogs trap focus and close on Esc (Radix primitives).
- Semantic landmarks (`header`, `nav`, `main`, `section[aria-labelledby]`, `footer`).
- Every image has meaningful `alt` text, or `alt=""` if decorative. Icons are `aria-hidden` and icon-only buttons have `aria-label`.
- Touch targets are ≥ 44×44px.
- Hover-only information always has a focus or tap equivalent.

## 14. Content rules

- Edit only `src/data/portfolio.json`. Components receive slices through props.
- Empty string or empty array means "not provided" and is hidden in the UI. Never ship invented placeholders.
- Assets live in `/public` and are referenced by absolute path in the JSON.
