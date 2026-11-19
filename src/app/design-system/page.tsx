import type { Metadata } from "next";
import { ArrowUpRight, Plus, Search, Settings } from "lucide-react";
import { Container, Section, SectionHeader } from "@/components/layout/section";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { LoadingButtonDemo } from "./loading-button-demo";

/** Living style guide for DESIGN.md. Not part of the portfolio content; excluded from search. */
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const COLOR_TOKENS = [
  "background",
  "foreground",
  "surface",
  "surface-raised",
  "subtle",
  "muted-foreground",
  "border",
  "border-strong",
  "primary",
  "signal",
  "destructive",
] as const;

const BUTTON_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4 border-t py-8 md:grid-cols-[12rem_1fr]">
      <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main>
      <Container className="flex items-center justify-between py-6">
        <p className="font-mono text-sm">DESIGN.md / preview</p>
        <ThemeToggle />
      </Container>

      <Section id="foundations" className="pt-8 md:pt-12 lg:pt-16">
        <SectionHeader
          sectionId="foundations"
          eyebrow="Foundations"
          heading="Design system."
          description="Tokens and primitives used across the portfolio. Toggle the theme to compare both palettes."
        />

        <Row label="Color">
          <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {COLOR_TOKENS.map((token) => (
              <li key={token} className="overflow-hidden rounded-lg border bg-surface">
                <div className="h-16 border-b" style={{ background: `var(--${token})` }} />
                <p className="px-3 py-2 font-mono text-xs">{token}</p>
              </li>
            ))}
          </ul>
        </Row>

        <Row label="Type">
          <div className="grid w-full gap-6">
            <p className="text-display font-semibold">Display</p>
            <p className="text-headline font-semibold">Headline</p>
            <p className="text-title font-medium">Title</p>
            <p className="max-w-prose text-lg leading-relaxed text-muted-foreground">
              Body large. Interfaces should feel as good as they work, with clear hierarchy,
              generous space and motion that explains.
            </p>
            <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Mono label · 2026
            </p>
          </div>
        </Row>

        <Row label="Radius & shadow">
          {(["shadow-xs", "shadow-sm", "shadow-md", "shadow-lg"] as const).map((s) => (
            <div
              key={s}
              className={`grid size-28 place-items-center rounded-xl border bg-surface font-mono text-xs ${s}`}
            >
              {s}
            </div>
          ))}
        </Row>
      </Section>

      <Section id="components" className="pt-0 md:pt-0 lg:pt-0">
        <SectionHeader sectionId="components" eyebrow="Components" heading="Primitives." />

        <Row label="Button variants">
          {BUTTON_VARIANTS.map((v) => (
            <Button key={v} variant={v}>
              {v[0].toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </Row>

        <Row label="Button sizes">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">
            Large
            <ArrowUpRight aria-hidden data-icon="inline-end" />
          </Button>
        </Row>

        <Row label="Button states">
          <LoadingButtonDemo />
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button variant="outline" asChild>
            <a href="#components">
              As link
              <ArrowUpRight aria-hidden data-icon="inline-end" />
            </a>
          </Button>
        </Row>

        <Row label="Icon buttons">
          <IconButton aria-label="Search">
            <Search />
          </IconButton>
          <IconButton aria-label="Settings" variant="outline">
            <Settings />
          </IconButton>
          <IconButton aria-label="Add item" variant="default" size="sm">
            <Plus />
          </IconButton>
          <ThemeToggle />
        </Row>

        <Row label="Badges">
          <Badge>React.js</Badge>
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="solid">Featured</Badge>
          <Badge dot>Available</Badge>
        </Row>

        <Row label="Cards">
          <div className="grid w-full gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic card</CardTitle>
                <CardDescription>Surface, hairline border, no shadow at rest.</CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground">Content area.</CardContent>
            </Card>
            <Card interactive>
              <CardHeader>
                <CardTitle>Interactive card</CardTitle>
                <CardDescription>Lifts on hover and focus-within.</CardDescription>
                <CardAction>
                  <Badge variant="secondary">New</Badge>
                </CardAction>
              </CardHeader>
              <CardFooter>
                <Button size="sm" variant="outline">
                  Action
                  <ArrowUpRight aria-hidden data-icon="inline-end" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Section>
    </main>
  );
}
