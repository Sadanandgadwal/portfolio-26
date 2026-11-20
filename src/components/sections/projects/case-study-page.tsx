import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { portfolio, visibleNavItems, type Project } from "@/lib/content";
import { findProject } from "@/lib/content/projects";
import { ProjectCaseStudy } from "./project-case-study";
import { techIconMap } from "./projects";

type Options = { projects: Project[]; basePath: string; backHref: string };

export function caseStudyMetadata(projects: Project[], slug: string): Metadata {
  const found = findProject(projects, slug);
  if (!found) return {};
  const { project } = found;
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      ...(project.media.cover && { images: [{ url: project.media.cover }] }),
    },
  };
}

/** Shared by /projects/[slug] and the fixture preview route. */
export function CaseStudyPage({ slug, projects, basePath, backHref }: Options & { slug: string }) {
  const found = findProject(projects, slug);
  if (!found) notFound();
  const { personal, navigation, skills, footer, socials } = portfolio;

  // On sub-pages, nav targets are home-page anchors.
  const navItems = visibleNavItems(navigation.items, ["home", "about", "skills"]).map((i) => ({
    ...i,
    href: i.href.startsWith("#") ? `/${i.href}` : i.href,
  }));

  return (
    <>
      <SiteHeader
        name={personal.name}
        shortName={personal.shortName}
        roles={personal.roles}
        items={navItems}
        homeHref="/#home"
      />
      <main id="main">
        <ProjectCaseStudy
          project={found.project}
          backHref={backHref}
          techIcons={techIconMap(skills)}
          next={found.next && { title: found.next.title, href: `${basePath}/${found.next.slug}` }}
        />
      </main>
      <SiteFooter personal={personal} footer={footer} socials={socials} />
    </>
  );
}
