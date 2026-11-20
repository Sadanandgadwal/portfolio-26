import type { Metadata } from "next";
import { CaseStudyPage, caseStudyMetadata } from "@/components/sections/projects/case-study-page";
import { projectStaticParams } from "@/lib/content/projects";
import { fixtureProjects } from "../../sections/fixtures";

/** Fixture case studies for layout verification (noindex). */
const projects = fixtureProjects.items;

export function generateStaticParams() {
  return projectStaticParams(projects);
}

export async function generateMetadata({
  params,
}: PageProps<"/design-system/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { ...caseStudyMetadata(projects, slug), robots: { index: false, follow: false } };
}

export default async function FixtureProjectPage({
  params,
}: PageProps<"/design-system/projects/[slug]">) {
  const { slug } = await params;
  return (
    <CaseStudyPage
      slug={slug}
      projects={projects}
      basePath="/design-system/projects"
      backHref="/design-system/sections#projects"
    />
  );
}
