import { SiteHeader } from "@/components/layout/site-header";
import { Hero } from "@/components/sections/hero/hero";
import { portfolio } from "@/lib/content";

export default function Home() {
  const { personal, navigation, hero } = portfolio;
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
      </main>
    </>
  );
}
