import { Fragment } from "react";
import { ArrowDownRight } from "lucide-react";
import { Container } from "@/components/layout/section";
import { Magnetic } from "@/components/motion/magnetic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Hero as HeroData, Personal } from "@/lib/content";
import { HeroMockup } from "./hero-mockup";

type HeroProps = { hero: HeroData; personal: Personal };

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

/**
 * Entrance sequence uses CSS keyframes so it runs before hydration (no blank LCP):
 * background → eyebrow → name → roles → statement → CTAs → mockup.
 */
export function Hero({ hero, personal }: HeroProps) {
  const words = hero.heading.split(" ");

  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      className="relative isolate overflow-hidden pt-28 pb-24 md:pt-36 lg:pt-40 lg:pb-32"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 animate-fade-in bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] mask-[radial-gradient(ellipse_70%_60%_at_65%_35%,black,transparent)] bg-size-[64px_64px]"
      />

      <Container>
        <div className="flex animate-fade-up flex-wrap items-center gap-3" style={delay(100)}>
          {hero.eyebrow && (
            <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              {hero.eyebrow}
            </p>
          )}
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

        <div className="mt-10 grid items-start gap-14 md:mt-14 lg:grid-cols-12 lg:gap-10">
          <div className="grid gap-6 lg:col-span-4 lg:pt-6">
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

          <div className="animate-rise lg:col-span-8" style={delay(650)}>
            <HeroMockup data={hero.mockup} />
          </div>
        </div>
      </Container>
    </section>
  );
}
