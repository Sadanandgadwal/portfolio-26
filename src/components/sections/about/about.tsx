import { Section, SectionHeader } from "@/components/layout/section";
import { AnimatedNumber } from "@/components/motion/animated-number";
import type { About as AboutData } from "@/lib/content";

export function About({ about }: { about: AboutData }) {
  const { eyebrow, heading, description, paragraphs, focusAreas, stats } = about;

  return (
    <Section id="about" className="pt-12 md:pt-16 lg:pt-20">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeader
            sectionId="about"
            eyebrow={eyebrow}
            heading={heading}
            description={description}
            className="mb-0 md:mb-0 lg:sticky lg:top-28"
          />
        </div>

        <div className="grid gap-14 lg:col-span-7">
          {paragraphs.length > 0 && (
            <div className="reveal grid gap-6 text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? "text-foreground" : undefined}>
                  {p}
                </p>
              ))}
            </div>
          )}

          {stats.length > 0 && (
            <dl className="reveal grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col-reverse gap-2 bg-background p-5 sm:p-6"
                >
                  <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                  <dd className="text-headline font-semibold">
                    <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {focusAreas.length > 0 && (
            <ol className="border-b">
              {focusAreas.map((area, i) => (
                <li
                  key={area.title}
                  className="group/area reveal grid grid-cols-[3rem_1fr] items-baseline gap-x-4 gap-y-1 border-t py-5 transition-colors duration-300 hover:bg-subtle/60 sm:grid-cols-[3rem_14rem_1fr] sm:py-6"
                >
                  <span className="font-mono text-xs text-muted-foreground transition-transform duration-300 ease-out-expo group-hover/area:translate-x-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-medium tracking-tight">{area.title}</h3>
                  {area.description && (
                    <p className="col-start-2 text-muted-foreground sm:col-start-3">
                      {area.description}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </Section>
  );
}
