import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Hero, Personal } from "@/lib/content";

type FoundationPreviewProps = {
  hero: Hero;
  personal: Personal;
};

/** Phase 1 placeholder proving the JSON → props → UI pipeline. Replaced by the real Hero in Phase 3. */
export function FoundationPreview({ hero, personal }: FoundationPreviewProps) {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center gap-8 px-4 py-24 sm:px-8"
    >
      {hero.eyebrow && (
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          {hero.eyebrow}
        </p>
      )}
      <h1 id="hero-heading" className="text-display font-semibold">
        {hero.heading}
      </h1>
      <p className="text-title text-muted-foreground">{personal.roles.join(" / ")}</p>
      <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">{hero.statement}</p>
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg" className="h-11 rounded-full px-5">
          <a href={hero.primaryCta.href}>
            {hero.primaryCta.label}
            <ArrowUpRight aria-hidden data-icon="inline-end" />
          </a>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-11 rounded-full px-5">
          <a href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
        </Button>
      </div>
    </section>
  );
}
