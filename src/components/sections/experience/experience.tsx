import { Section, SectionHeader } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import type { Portfolio } from "@/lib/content";
import { formatDateRange, formatDuration } from "@/lib/format";
import { Timeline, TimelineEntry } from "./timeline";

type ExperienceProps = { experience: Portfolio["experience"] };

/** Renders nothing when there are no entries (no placeholder content). */
export function Experience({ experience }: ExperienceProps) {
  if (experience.items.length === 0) return null;

  return (
    <Section id="experience">
      <SectionHeader
        sectionId="experience"
        eyebrow={experience.eyebrow}
        heading={experience.heading}
        description={experience.description}
      />
      <Timeline>
        {experience.items.map((item) => {
          const range = formatDateRange(item.start, item.end);
          const duration = formatDuration(item.start, item.end);
          return (
            <TimelineEntry key={`${item.company}-${item.role}-${item.start}`}>
              <article className="grid gap-6 lg:grid-cols-[14rem_1fr] lg:gap-10">
                <div className="grid content-start gap-1.5 font-mono text-xs text-muted-foreground">
                  {range && (
                    <p className="text-sm text-foreground">
                      <time dateTime={item.start}>{range}</time>
                    </p>
                  )}
                  {duration && <p>{duration}</p>}
                  {item.location && <p>{item.location}</p>}
                  {item.employmentType && <p>{item.employmentType}</p>}
                </div>

                <div className="grid gap-5">
                  <header>
                    <h3 className="text-title font-semibold">{item.role}</h3>
                    <p className="mt-1 text-lg text-muted-foreground">{item.company}</p>
                  </header>

                  {item.summary && <p className="max-w-prose leading-relaxed">{item.summary}</p>}

                  {item.responsibilities.length > 0 && (
                    <ul className="grid max-w-prose gap-2 text-muted-foreground">
                      {item.responsibilities.map((r) => (
                        <li key={r} className="grid grid-cols-[1rem_1fr] gap-2 leading-relaxed">
                          <span aria-hidden className="text-border-strong">
                            –
                          </span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.achievements.length > 0 && (
                    <div className="grid gap-3 rounded-xl border bg-surface p-5">
                      <h4 className="label-mono">Highlights</h4>
                      <ul className="grid gap-2">
                        {item.achievements.map((a) => (
                          <li
                            key={a}
                            className="grid grid-cols-[1rem_1fr] items-baseline gap-2 leading-relaxed"
                          >
                            <span
                              aria-hidden
                              className="size-1.5 translate-y-[-2px] rounded-full bg-signal"
                            />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.technologies.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
                      {item.technologies.map((t) => (
                        <li key={t}>
                          <Badge>{t}</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </TimelineEntry>
          );
        })}
      </Timeline>
    </Section>
  );
}
