import type { Project } from "./schema";

/** Placeholder param: Cache Components requires ≥1 static param; handled with notFound(). */
export const PLACEHOLDER_SLUG = "__placeholder__";

export function projectStaticParams(projects: Project[]): { slug: string }[] {
  return projects.length > 0
    ? projects.map((p) => ({ slug: p.slug }))
    : [{ slug: PLACEHOLDER_SLUG }];
}

/** Project by slug plus the next one (wrapping), for "Next project" navigation. */
export function findProject(projects: Project[], slug: string) {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : undefined;
  return { project: projects[index], next };
}
