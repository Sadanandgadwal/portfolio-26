import type { Metadata } from "next";
import { Container } from "@/components/layout/section";
import { SiteFooter } from "@/components/layout/site-footer";
import { About } from "@/components/sections/about/about";
import { Contact } from "@/components/sections/contact/contact";
import { Education } from "@/components/sections/education/education";
import { Experience } from "@/components/sections/experience/experience";
import { Projects } from "@/components/sections/projects/projects";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { portfolio } from "@/lib/content";
import {
  fixtureContact,
  fixtureEducation,
  fixtureExperience,
  fixtureProjects,
  fixtureStats,
} from "./fixtures";

export const metadata: Metadata = {
  title: "Section previews",
  robots: { index: false, follow: false },
};

/** Previews data-dependent sections with fictional fixtures (not portfolio content). */
export default function SectionPreviewsPage() {
  return (
    <>
      <main id="main">
        <Container className="flex items-center justify-between gap-4 py-6">
          <h1 className="flex items-center gap-3 font-mono text-sm font-normal">
            DESIGN.md / sections <Badge dot>Fixture data</Badge>
          </h1>
          <ThemeToggle />
        </Container>
        <About about={{ ...portfolio.about, stats: fixtureStats }} />
        <Experience experience={fixtureExperience} />
        <Projects
          projects={fixtureProjects}
          skills={portfolio.skills}
          basePath="/design-system/projects"
        />
        <Education education={fixtureEducation} />
        <Contact contact={portfolio.contact} {...fixtureContact} />
      </main>
      <SiteFooter
        personal={fixtureContact.personal}
        footer={portfolio.footer}
        socials={fixtureContact.socials}
      />
    </>
  );
}
