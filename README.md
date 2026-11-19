# portfolio-26

Personal portfolio of **Sadanand Gadwal**, Frontend / Full Stack Developer. It is JSON-driven, interactive and statically prerendered.

## Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript 5 · Tailwind CSS 4 · shadcn/ui (Radix) · Motion · Lucide · Simple Icons · Zod 4 · Vitest + React Testing Library · Playwright · ESLint + Prettier

## Requirements

- Node.js **≥ 26** (see `.nvmrc`; verified on 26.13.0)
- npm 11

## Getting started

```bash
npm install
npx playwright install chromium   # once, for e2e tests
npm run dev                       # http://localhost:3000
```

## Editing content

All content lives in **`src/data/portfolio.json`**. It is validated against `src/lib/content/schema.ts` and the build fails with readable errors if the file is invalid. Empty strings or empty arrays mean "not provided" and are hidden in the UI. Put assets in `public/` and reference them by absolute path (`/images/projects/x.webp`).

## Scripts

| Command                           | Purpose                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------ |
| `npm run dev`                     | Dev server                                                                                 |
| `npm run build` / `npm start`     | Production build / serve                                                                   |
| `npm run typecheck`               | Generate route types and run `tsc`                                                         |
| `npm run lint`                    | ESLint                                                                                     |
| `npm run format` / `format:check` | Prettier                                                                                   |
| `npm test`                        | Vitest unit and component tests                                                            |
| `npm run test:e2e`                | Playwright against the production build (run `npm run build` first) at 390, 768 and 1440px |
| `npm run check`                   | Typecheck, lint, format check and unit tests                                               |

## Structure

```
src/
  app/                 routes, layout, global styles and tokens
  components/ui/       shadcn/ui primitives (token-styled)
  app/design-system/   living style guide + /sections fixture previews (noindex)
  components/layout/   SiteHeader, MobileMenu, Container, Section, SectionHeader
  components/icons/    TechIcon registry (simple-icons + Lucide)
  components/motion/   CustomCursor, Magnetic, AnimatedNumber
  components/sections/ page sections (props-only, no hardcoded content)
  components/theme/    theme toggle
  hooks/               client hooks (useTheme, useMediaQuery, useScrolled, useActiveSection)
  data/portfolio.json  single content source
  lib/content/         Zod schema, types and validated loader
  lib/format.ts        locale-independent date range/duration formatting
  lib/theme.ts         theme resolution and no-flash init script
e2e/                   Playwright specs
specs/                 Spec Kit–style requirements and plan
DESIGN.md              design system
```

## Environment variables

None.

## Deployment

Any Node 26 host or Vercel: `npm run build && npm start`. All routes are statically prerendered.
