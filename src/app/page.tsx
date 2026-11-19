import { SiteHeader } from "@/components/layout/site-header";
import { About } from "@/components/sections/about/about";
import { Hero } from "@/components/sections/hero/hero";
import { Skills } from "@/components/sections/skills/skills";
import { portfolio } from "@/lib/content";

export default function Home() {
  const { personal, navigation, hero, about, skills, projects } = portfolio;
  return (
    <>
      <SiteHeader
        name={personal.name}
        shortName={personal.shortName}
        roles={personal.roles}
        items={navigation.items}
      />
      <main id="main">
        <Hero hero={hero} personal={personal} />
        <About about={about} />
        <Skills skills={skills} projects={projects.items} />
      </main>
    </>
  );
}
