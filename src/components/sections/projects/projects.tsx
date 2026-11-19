import { Section, SectionHeader } from "@/components/layout/section";
import type { Portfolio } from "@/lib/content";
import { ProjectShowcase } from "./project-showcase";

type ProjectsProps = {
  projects: Portfolio["projects"];
  skills: Portfolio["skills"];
  basePath?: string;
};

/** Technology name → icon key, derived from the skills data (single source of truth). */
export function techIconMap(skills: Portfolio["skills"]): Record<string, string> {
  return Object.fromEntries(
    skills.categories
      .flatMap((c) => c.items)
      .filter((s) => s.icon)
      .map((s) => [s.name, s.icon]),
  );
}

/** Renders nothing without projects. */
export function Projects({ projects, skills, basePath = "/projects" }: ProjectsProps) {
  if (projects.items.length === 0) return null;
  return (
    <Section id="projects">
      <SectionHeader
        sectionId="projects"
        eyebrow={projects.eyebrow}
        heading={projects.heading}
        description={projects.description}
      />
      <ProjectShowcase
        projects={projects.items}
        techIcons={techIconMap(skills)}
        basePath={basePath}
      />
    </Section>
  );
}
