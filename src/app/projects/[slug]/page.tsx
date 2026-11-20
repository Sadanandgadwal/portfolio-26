import type { Metadata } from "next";
import { CaseStudyPage, caseStudyMetadata } from "@/components/sections/projects/case-study-page";
import { portfolio } from "@/lib/content";
import { projectStaticParams } from "@/lib/content/projects";

const projects = portfolio.projects.items;

export function generateStaticParams() {
  return projectStaticParams(projects);
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return caseStudyMetadata(projects, slug);
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  return (
    <CaseStudyPage slug={slug} projects={projects} basePath="/projects" backHref="/#projects" />
  );
}
