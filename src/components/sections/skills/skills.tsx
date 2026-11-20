import { Section, SectionHeader } from "@/components/layout/section";
import type { Portfolio } from "@/lib/content";
import { SkillsExplorer } from "./skills-explorer";

type SkillsProps = { skills: Portfolio["skills"]; projects: Portfolio["projects"]["items"] };

export function Skills({ skills, projects }: SkillsProps) {
  const projectTitles = Object.fromEntries(projects.map((p) => [p.slug, p.title]));
  return (
    <Section id="skills">
      <SectionHeader
        sectionId="skills"
        eyebrow={skills.eyebrow}
        heading={skills.heading}
        description={skills.description}
      />
      <div className="reveal">
        <SkillsExplorer categories={skills.categories} projectTitles={projectTitles} />
      </div>
    </Section>
  );
}
