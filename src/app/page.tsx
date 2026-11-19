import { SiteHeader } from "@/components/layout/site-header";
import { About } from "@/components/sections/about/about";
import { Education } from "@/components/sections/education/education";
import { Experience } from "@/components/sections/experience/experience";
import { Hero } from "@/components/sections/hero/hero";
import { Playground } from "@/components/sections/playground/playground";
import { Projects } from "@/components/sections/projects/projects";
import { Showcase } from "@/components/sections/showcase/showcase";
import { Skills } from "@/components/sections/skills/skills";
import { portfolio, visibleNavItems } from "@/lib/content";

export default function Home() {
  const {
    personal,
    navigation,
    hero,
    about,
    skills,
    experience,
    education,
    projects,
    playground,
    showcase,
  } = portfolio;

  // Sections render only when they have content; the nav mirrors what is on the page.
  const rendered = [
    "home",
    "about",
    "skills",
    experience.items.length > 0 && "experience",
    (education.items.length > 0 || education.certifications.length > 0) && "education",
    projects.items.length > 0 && "projects",
    "playground",
  ].filter((id): id is string => Boolean(id));

  return (
    <>
      <SiteHeader
        name={personal.name}
        shortName={personal.shortName}
        roles={personal.roles}
        items={visibleNavItems(navigation.items, rendered)}
      />
      <main id="main">
        <Hero hero={hero} personal={personal} />
        <About about={about} />
        <Skills skills={skills} projects={projects.items} />
        <Experience experience={experience} />
        <Projects projects={projects} skills={skills} />
        <Education education={education} />
        <Playground playground={playground} />
        <Showcase showcase={showcase} />
      </main>
    </>
  );
}
