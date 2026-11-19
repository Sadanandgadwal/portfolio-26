import * as React from "react";
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
      {eyebrow && (
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          {eyebrow}
        </p>
      )}
      <h2 id={sectionHeadingId(sectionId)} className="text-headline font-semibold">
        {heading}
      </h2>
      {description && (
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{description}</p>
      )}
    </header>
  );
}
