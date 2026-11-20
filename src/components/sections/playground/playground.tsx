import { Section, SectionHeader } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import type { Playground as PlaygroundData } from "@/lib/content";
import { ButtonsSpecimen } from "./buttons-specimen";
import { CardsSpecimen } from "./cards-specimen";
import { ChartSpecimen } from "./chart-specimen";
import { FormSpecimen } from "./form-specimen";
import { OverlaySpecimen } from "./overlay-specimen";
import { Specimen } from "./specimen";
import { TableSpecimen } from "./table-specimen";
import { TabsSpecimen } from "./tabs-specimen";
import { ThemeSpecimen } from "./theme-specimen";

/** Frontend lab: every tile is a working component, not an illustration. */
export function Playground({ playground }: { playground: PlaygroundData }) {
  return (
    <Section id="playground" className="bg-subtle/40">
      <SectionHeader
        sectionId="playground"
        eyebrow={playground.eyebrow}
        heading={playground.heading}
        description={playground.description}
      />
      <Badge dot className="-mt-6 mb-8 md:-mt-10">
        {playground.sampleLabel}
      </Badge>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <Specimen
          id="buttons"
          index={1}
          title="Buttons"
          description="Variants, loading and disabled states."
          className="lg:col-span-5"
        >
          <ButtonsSpecimen />
        </Specimen>
        <Specimen
          id="form"
          index={2}
          title="Form validation"
          description="Text, email and select with inline errors."
          className="lg:col-span-7"
        >
          <FormSpecimen roles={playground.form.roles} />
        </Specimen>
        <Specimen
          id="table"
          index={3}
          title="Data table"
          description="Search, filter, sort and paginate."
          className="md:col-span-2 lg:col-span-12"
        >
          <TableSpecimen rows={playground.table.rows} />
        </Specimen>
        <Specimen
          id="chart"
          index={4}
          title="Chart"
          description="Hover or use arrow keys to inspect."
          className="md:col-span-2 lg:col-span-8"
        >
          <ChartSpecimen chart={playground.chart} />
        </Specimen>
        <Specimen
          id="cards"
          index={5}
          title="Cards"
          description="Basic, interactive and hover."
          className="lg:col-span-4"
        >
          <CardsSpecimen />
        </Specimen>
        <Specimen
          id="tabs"
          index={6}
          title="Tabs"
          description="Keyboard-navigable, animated indicator."
          className="lg:col-span-4"
        >
          <TabsSpecimen tabs={playground.tabs} />
        </Specimen>
        <Specimen
          id="overlays"
          index={7}
          title="Modal & tooltip"
          description="Focus-trapped dialog; hover/focus tooltips."
          className="lg:col-span-4"
        >
          <OverlaySpecimen />
        </Specimen>
        <Specimen
          id="theme"
          index={8}
          title="Theme"
          description="Switches the whole site, live tokens."
          className="md:col-span-2 lg:col-span-4"
        >
          <ThemeSpecimen />
        </Specimen>
      </div>
    </Section>
  );
}
