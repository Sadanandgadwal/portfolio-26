import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SpecimenProps = {
  id: string;
  index: number;
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

/** Lab tile: numbered header + live stage. */
export function Specimen({ id, index, title, description, className, children }: SpecimenProps) {
  const headingId = `specimen-${id}`;
  return (
    <article
      aria-labelledby={headingId}
      data-cursor="interact"
      className={cn("reveal flex min-w-0 flex-col rounded-2xl border bg-surface", className)}
    >
      <header className="flex items-baseline gap-3 border-b px-5 py-4">
        <span className="label-mono">{String(index).padStart(2, "0")}</span>
        <div className="min-w-0">
          <h3 id={headingId} className="font-medium tracking-tight">
            {title}
          </h3>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
      </header>
      <div className="flex flex-1 flex-col p-5">{children}</div>
    </article>
  );
}
