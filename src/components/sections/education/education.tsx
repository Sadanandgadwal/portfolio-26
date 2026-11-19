import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import type { Portfolio } from "@/lib/content";
import { formatDateRange } from "@/lib/format";

type EducationProps = { education: Portfolio["education"] };

const columnLabel = "mb-2 label-mono";

/** Renders nothing when there are neither degrees nor certifications. */
export function Education({ education }: EducationProps) {
  const { items, certifications } = education;
  if (items.length === 0 && certifications.length === 0) return null;

  return (
    <Section id="education">
      <SectionHeader
        sectionId="education"
        eyebrow={education.eyebrow}
        heading={education.heading}
        description={education.description}
      />

      <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
        {items.length > 0 && (
          <div>
            <h3 className={columnLabel}>Education</h3>
            <ul className="border-b">
              {items.map((item) => {
                const range = formatDateRange(item.start, item.end);
                return (
                  <li
                    key={`${item.degree}-${item.institution}`}
                    className="reveal grid gap-2 border-t py-6"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <h4 className="text-lg font-medium tracking-tight">{item.degree}</h4>
                      {range && <p className="font-mono text-xs text-muted-foreground">{range}</p>}
                    </div>
                    <p className="text-muted-foreground">
                      {[item.institution, item.location].filter(Boolean).join(" · ")}
                    </p>
                    {item.grade && (
                      <Badge variant="secondary" className="mt-1">
                        {item.grade}
                      </Badge>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {certifications.length > 0 && (
          <div>
            <h3 className={columnLabel}>Certifications</h3>
            <ul className="border-b">
              {certifications.map((cert) => {
                const title = <h4 className="text-lg font-medium tracking-tight">{cert.name}</h4>;
                return (
                  <li key={`${cert.name}-${cert.provider}`} className="reveal border-t">
                    {cert.url ? (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="view"
                        className="group/cert grid grid-cols-[1fr_auto] items-start gap-4 py-6 transition-colors hover:bg-subtle/60"
                      >
                        <span className="grid gap-1">
                          {title}
                          <span className="text-muted-foreground">
                            {cert.provider}
                            {cert.year && ` · ${cert.year}`}
                          </span>
                        </span>
                        <ArrowUpRight
                          aria-hidden
                          className="mt-1 size-5 text-muted-foreground transition-transform duration-300 ease-out-expo group-hover/cert:translate-x-0.5 group-hover/cert:-translate-y-0.5 group-hover/cert:text-foreground"
                        />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ) : (
                      <div className="grid gap-1 py-6">
                        {title}
                        <p className="text-muted-foreground">
                          {cert.provider}
                          {cert.year && ` · ${cert.year}`}
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
}
