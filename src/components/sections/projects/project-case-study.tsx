import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/section";
import { TechIcon } from "@/components/icons/tech-icon";
import { Button } from "@/components/ui/button";
import { BrowserFrame } from "@/components/ui/browser-frame";
import type { Project } from "@/lib/content";
import { ProjectPreview } from "./project-preview";
import { ScreenshotGallery } from "./screenshot-gallery";

type CaseStudyProps = {
  project: Project;
  next?: { title: string; href: string };
  backHref: string;
  techIcons: Record<string, string>;
};

const label = "label-mono";

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section
      aria-labelledby={id}
      className="grid gap-6 border-t py-12 md:grid-cols-[14rem_1fr] md:gap-10 md:py-16"
    >
      <h2 id={id} className={label}>
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

export function ProjectCaseStudy({ project, next, backHref, techIcons }: CaseStudyProps) {
  const { links, media } = project;
  const facts = [
    ["Role", project.role],
    ["Year", project.year],
    ["Category", project.category],
  ].filter(([, v]) => v);
  const pairs = Array.from(
    { length: Math.max(project.challenges.length, project.solutions.length) },
    (_, i) => ({
      challenge: project.challenges[i],
      solution: project.solutions[i],
    }),
  );

  return (
    <article className="pt-28 pb-24 md:pt-36">
      <Container>
        <Link
          href={backHref}
          className="group/back inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft
            aria-hidden
            className="size-4 transition-transform duration-300 group-hover/back:-translate-x-1"
          />
          All projects
        </Link>

        <header className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="grid gap-5 lg:col-span-8">
            {(project.category || project.year) && (
              <p className={`${label} animate-fade-up`}>
                {[project.category, project.year].filter(Boolean).join(" · ")}
              </p>
            )}
            <h1 className="animate-fade-up text-headline font-semibold [animation-delay:80ms] md:text-[clamp(2.5rem,1.5rem+4vw,5.5rem)]">
              {project.title}
            </h1>
            <p className="max-w-2xl animate-fade-up text-lg leading-relaxed text-muted-foreground [animation-delay:160ms] md:text-xl">
              {project.description}
            </p>
          </div>
          {(links.live || links.github) && (
            <div className="flex animate-fade-up flex-wrap gap-3 [animation-delay:240ms] lg:col-span-4 lg:justify-end">
              {links.live && (
                <Button asChild>
                  <a href={links.live} target="_blank" rel="noopener noreferrer">
                    Live demo <ArrowUpRight aria-hidden data-icon="inline-end" />
                  </a>
                </Button>
              )}
              {links.github && (
                <Button asChild variant="outline">
                  <a href={links.github} target="_blank" rel="noopener noreferrer">
                    Source <ArrowUpRight aria-hidden data-icon="inline-end" />
                  </a>
                </Button>
              )}
            </div>
          )}
        </header>

        <div className="mt-12 animate-rise [animation-delay:300ms] md:mt-16">
          <BrowserFrame url={links.live ? new URL(links.live).host : `${project.slug}.case-study`}>
            <div className="aspect-video">
              {media.previewType === "video" && media.preview ? (
                <video
                  src={media.preview}
                  poster={media.cover || undefined}
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  className="size-full bg-subtle object-cover object-top"
                  aria-label={`${project.title} preview video`}
                />
              ) : (
                <ProjectPreview
                  project={project}
                  active={false}
                  sizes="(min-width: 1152px) 1152px, 100vw"
                  priority
                />
              )}
            </div>
          </BrowserFrame>
        </div>

        <dl
          className="mt-12 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))] [&>*]:sm:odd:last:col-span-2 [&>*]:lg:odd:last:col-span-1"
          style={
            {
              "--cols": facts.length + (project.technologies.length > 0 ? 1 : 0),
            } as React.CSSProperties
          }
        >
          {facts.map(([k, v]) => (
            <div key={k} className="grid gap-1 bg-background p-5">
              <dt className={label}>{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
          {project.technologies.length > 0 && (
            <div className="grid gap-2 bg-background p-5">
              <dt className={label}>Stack</dt>
              <dd>
                <ul className="flex flex-wrap gap-1.5">
                  {project.technologies.map((t) => (
                    <li key={t} className="inline-flex items-center gap-1.5 text-sm">
                      {techIcons[t] && (
                        <TechIcon name={techIcons[t]} label={t} className="size-3.5" />
                      )}
                      {t}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-16">
          {project.longDescription && (
            <Block id="cs-overview" title="Overview">
              <p className="max-w-prose text-lg leading-relaxed">{project.longDescription}</p>
            </Block>
          )}

          {project.features.length > 0 && (
            <Block id="cs-features" title="Key features">
              <ul className="grid gap-3 sm:grid-cols-2">
                {project.features.map((f, i) => (
                  <li
                    key={f}
                    className="grid grid-cols-[2rem_1fr] gap-2 rounded-xl border bg-surface p-4"
                  >
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {pairs.length > 0 && (
            <Block id="cs-challenges" title="Challenges & solutions">
              <ol className="grid gap-4">
                {pairs.map((p, i) => (
                  <li key={i} className="grid overflow-hidden rounded-xl border md:grid-cols-2">
                    {p.challenge && (
                      <div className="grid content-start gap-2 p-5">
                        <p className={label}>Challenge</p>
                        <p className="leading-relaxed">{p.challenge}</p>
                      </div>
                    )}
                    {p.solution && (
                      <div className="grid content-start gap-2 border-t bg-surface p-5 md:border-t-0 md:border-l">
                        <p className={label}>Solution</p>
                        <p className="leading-relaxed">{p.solution}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </Block>
          )}

          {project.results.length > 0 && (
            <Block id="cs-results" title="Results">
              <ul className="grid gap-3">
                {project.results.map((r) => (
                  <li key={r} className="grid grid-cols-[1rem_1fr] items-baseline gap-2 text-lg">
                    <span
                      aria-hidden
                      className="size-1.5 -translate-y-0.5 rounded-full bg-signal"
                    />
                    {r}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {media.screenshots.length > 0 && (
            <Block id="cs-screens" title="Screens">
              <ScreenshotGallery shots={media.screenshots.filter((s) => s.src)} />
            </Block>
          )}
        </div>

        {next && (
          <Link
            href={next.href}
            className="group/next mt-8 flex items-end justify-between gap-6 border-t pt-10"
            data-cursor="view"
          >
            <span>
              <span className={label}>Next project</span>
              <span className="mt-3 block text-headline font-semibold transition-transform duration-500 ease-out-expo group-hover/next:translate-x-2">
                {next.title}
              </span>
            </span>
            <ArrowRight
              aria-hidden
              className="mb-3 size-8 shrink-0 transition-transform duration-500 ease-out-expo group-hover/next:translate-x-2"
            />
          </Link>
        )}
      </Container>
    </article>
  );
}
