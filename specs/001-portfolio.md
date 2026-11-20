# Spec 001 — Portfolio (Spec Kit style)

## Goal

A premium, interactive portfolio for Sadanand Gadwal that demonstrates frontend skill through working UI. Site: https://sadanandgadwal.com

## Requirements

- **R1 Content:** All content comes from `src/data/portfolio.json`, validated by Zod (`src/lib/content/schema.ts`) at build time.
- **R2 Truthfulness:** No invented facts. Unknown fields stay empty and are hidden in the UI.
- **R3 Sections:** Nav, Hero, About, Skills, Experience, Education, Projects (with case studies), Enterprise UI showcase, Contact, Footer.
- **R4 Theme:** Light and dark themes, persisted, with no flash and `prefers-color-scheme` respected.
- **R5 A11y:** WCAG 2.2 AA, keyboard support, reduced-motion support.
- **R6 Perf/SEO:** Static prerender, optimized media, metadata, sitemap, robots, JSON-LD.
- **R7 Quality:** Typecheck, lint, Prettier, Vitest/RTL, Playwright (390/768/1440) and Lighthouse all pass.

## Plan (phases)

| #   | Phase                    | Status |
| --- | ------------------------ | ------ |
| 1   | Setup & foundation       | ✅     |
| 2   | Design system & theme    | ✅     |
| 3   | Navigation & hero        | ✅     |
| 4   | About & skills           | ✅     |
| 5   | Experience & education   | ✅     |
| 6   | Projects showcase        | ✅     |
| 7   | UI showcase              | ✅     |
| 8   | Contact & footer         | ✅     |
| 9   | Motion polish            | ✅     |
| 10  | Responsive & performance | ✅     |
| 11  | SEO, testing, deployment | ✅     |

## Open inputs (owner: Sadanand)

- Imported from the resume on 2026-11-19: experience, education, certifications, projects (3), skills, email, GitHub, LinkedIn, resume PDF.
- Still open: project screenshots or GIFs, GitHub repo links, YouTube/Medium/Instagram URLs, availability, OG image, and whether to publish a phone number.
