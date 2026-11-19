import { Section, SectionHeader } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import type { Showcase as ShowcaseData } from "@/lib/content";
import { ShowcaseApp } from "./showcase-app";

export function Showcase({ showcase }: { showcase: ShowcaseData }) {
  return (
    <Section id="showcase">
      <SectionHeader
        sectionId="showcase"
        eyebrow={showcase.eyebrow}
        heading={showcase.heading}
        description={showcase.description}
      />
      <Badge dot className="-mt-6 mb-8 md:-mt-10">
        {showcase.sampleLabel}
      </Badge>
      <div className="reveal">
        <ShowcaseApp data={showcase} />
      </div>
    </Section>
  );
}
