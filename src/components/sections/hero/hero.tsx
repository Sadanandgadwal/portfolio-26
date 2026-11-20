import { Fragment } from "react";
import { ArrowDownRight } from "lucide-react";
import { Container } from "@/components/layout/section";
import { Magnetic } from "@/components/motion/magnetic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Hero as HeroData, Personal } from "@/lib/content";

type HeroProps = { hero: HeroData; personal: Personal };

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

/**
 * Entrance sequence uses CSS keyframes so it runs before hydration (no blank LCP):
 * background → eyebrow → name → roles → statement → CTAs.
 */
export function Hero({ hero, personal }: HeroProps) {
  const words = hero.heading.split(" ");

  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      className="relative isolate overflow-hidden pt-28 pb-12 md:pt-36 md:pb-16 lg:pt-40"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 animate-fade-in bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] mask-[radial-gradient(ellipse_70%_60%_at_65%_35%,black,transparent)] bg-size-[64px_64px]"
      />

      <Container>
        <div className="flex animate-fade-up flex-wrap items-center gap-3" style={delay(100)}>
          {hero.eyebrow && <p className="label-mono">{hero.eyebrow}</p>}
          {personal.availability && <Badge dot>{personal.availability}</Badge>}
          {personal.location && (
            <p className="font-mono text-xs text-muted-foreground">{personal.location}</p>
          )}
        </div>

        <h1 id="home-heading" className="mt-6 text-display font-semibold">
          {words.map((word, i) => (
            <Fragment key={`${word}-${i}`}>
              <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                <span className="inline-block animate-reveal" style={delay(180 + i * 90)}>
                  {word}
                </span>
              </span>
              {i < words.length - 1 && " "}
            </Fragment>
          ))}
        </h1>

        <div className="mt-10 grid max-w-xl gap-6 md:mt-14">
          <p className="animate-fade-up text-title font-medium" style={delay(400)}>
            {personal.roles.join(" / ")}
          </p>
          <p
            className="max-w-md animate-fade-up text-lg leading-relaxed text-muted-foreground"
            style={delay(480)}
          >
            {hero.statement}
          </p>
          <div className="flex animate-fade-up flex-wrap gap-3" style={delay(560)}>
            <Magnetic>
              <Button asChild size="lg">
                <a href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                  <ArrowDownRight aria-hidden data-icon="inline-end" />
                </a>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild size="lg" variant="outline">
                <a href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
              </Button>
            </Magnetic>
          </div>
        </div>
      </Container>
    </section>
  );
}
