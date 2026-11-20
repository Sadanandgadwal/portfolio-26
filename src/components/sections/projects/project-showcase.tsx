"use client";

import { useState, ViewTransition } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { TechIcon } from "@/components/icons/tech-icon";
import { BrowserFrame } from "@/components/ui/browser-frame";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";
import { ProjectPreview } from "./project-preview";

type ShowcaseProps = {
  projects: Project[];
  /** Technology name → icon key (from the skills data). */
  techIcons: Record<string, string>;
  /** Case-study base path, e.g. "/projects". */
  basePath: string;
};

const hostOf = (url: string) => {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
};

function ProjectCard({
  project,
  index,
  techIcons,
  href,
}: {
  project: Project;
  index: number;
  techIcons: Record<string, string>;
  href: string;
}) {
  const [active, setActive] = useState(false);
  const reversed = index % 2 === 1;
  const url = hostOf(project.links.live) || `${project.slug}.case-study`;

  return (
    <article
      className="group/project relative grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-12"
      onPointerEnter={(e) => e.pointerType === "mouse" && setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setActive(false)}
      data-active={active || undefined}
    >
      <div
        className={cn("reveal-mask lg:col-span-7", reversed && "lg:order-2")}
        data-testid="project-media"
      >
        <ViewTransition name={`project-frame-${project.slug}`} share="morph" default="none">
          <BrowserFrame
            url={url}
            className="shadow-md transition-[box-shadow,transform] duration-500 ease-out-expo group-hover/project:-translate-y-1 group-hover/project:shadow-lg"
          >
            <div className="aspect-video">
              <ProjectPreview
                project={project}
                active={active}
                sizes="(min-width: 1024px) 58vw, (min-width: 640px) 70vw, 86vw"
                priority={index === 0}
              />
            </div>
          </BrowserFrame>
        </ViewTransition>
      </div>

      <div className={cn("grid content-center gap-5 lg:col-span-5", reversed && "lg:order-1")}>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 label-mono">
          <span className="text-foreground">{String(index + 1).padStart(2, "0")}</span>
          {project.category && <span>{project.category}</span>}
          {project.year && <span>{project.year}</span>}
        </p>

        <h3 className="text-3xl font-semibold tracking-tight lg:text-4xl">
          {/* Stretched link: the whole card opens the case study. */}
          <Link
            href={href}
            data-cursor="view"
            className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none"
          >
            <ViewTransition name={`project-title-${project.slug}`} share="morph" default="none">
              <span className="inline-block">{project.title}</span>
            </ViewTransition>
          </Link>
        </h3>

        <p className="max-w-md leading-relaxed text-muted-foreground">{project.description}</p>

        {project.technologies.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.technologies.map((tech, i) => (
              <li
                key={tech}
                className="inline-flex h-7 items-center gap-1.5 rounded-sm border px-2 font-mono text-xs text-muted-foreground transition-[color,border-color,transform] duration-300 ease-out-expo group-hover/project:border-border-strong group-hover/project:text-foreground lg:group-hover/project:-translate-y-0.5"
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                {techIcons[tech] && (
                  <TechIcon
                    name={techIcons[tech]}
                    label={tech}
                    className="size-3.5 group-hover/project:text-(--brand)"
                  />
                )}
                {tech}
              </li>
            ))}
          </ul>
        )}

        <div className="relative z-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span
            aria-hidden
            className="inline-flex items-center gap-2 font-medium group-has-[a:focus-visible]/project:underline"
          >
            View case study
            <ArrowRight className="size-4 transition-transform duration-300 ease-out-expo group-hover/project:translate-x-1" />
          </span>
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              Live <ArrowUpRight aria-hidden className="size-3.5" />
              <span className="sr-only">{`${project.title} (opens in a new tab)`}</span>
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub <ArrowUpRight aria-hidden className="size-3.5" />
              <span className="sr-only">{`${project.title} source (opens in a new tab)`}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/** Large alternating showcases on desktop; a swipeable snap carousel on mobile/tablet. */
export function ProjectShowcase({ projects, techIcons, basePath }: ShowcaseProps) {
  return (
    <div>
      {projects.length > 1 && (
        <p className="mb-4 label-mono lg:hidden" aria-hidden>
          Swipe → {String(projects.length).padStart(2, "0")} projects
        </p>
      )}
      <ul
        aria-label="Projects"
        className="-mx-4 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:gap-28 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {projects.map((project, i) => (
          <li key={project.slug} className="w-[86%] shrink-0 snap-center sm:w-[70%] lg:w-auto">
            <ProjectCard
              project={project}
              index={i}
              techIcons={techIcons}
              href={`${basePath}/${project.slug}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
