import * as React from "react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export const sectionHeadingId = (sectionId: string) => `${sectionId}-heading`;

export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-8", className)} {...props} />;
}

type SectionProps = React.ComponentProps<"section"> & { id: string };

/** Page section with anchor offset (sticky nav) and standard vertical rhythm. */
export function Section({ id, className, children, ...props }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={sectionHeadingId(id)}
      className={cn("scroll-mt-20 py-24 md:py-32 lg:py-40", className)}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  );
}

/**
 * Splits text into masked words for the CSS `.reveal-words` animation. Server-rendered; the text
 * stays a single readable string for assistive tech (spaces are real text nodes).
 */
export function RevealWords({ text }: { text: string }) {
  const words = text.split(" ");
  return words.map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <span className="word inline-block overflow-hidden pb-[0.08em] align-bottom">
        <span className="inline-block" style={{ "--i": i } as React.CSSProperties}>
          {word}
        </span>
      </span>
      {i < words.length - 1 && " "}
    </Fragment>
  ));
}

type SectionHeaderProps = {
  sectionId: string;
  eyebrow?: string;
  heading: string;
  description?: string;
  className?: string;
};

export function SectionHeader({
  sectionId,
  eyebrow,
  heading,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn("mb-12 grid max-w-3xl gap-4 md:mb-16", className)}>
      {eyebrow && <p className="label-mono">{eyebrow}</p>}
      <h2 id={sectionHeadingId(sectionId)} className="reveal-words text-headline font-semibold">
        <RevealWords text={heading} />
      </h2>
      {description && (
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{description}</p>
      )}
    </header>
  );
}
