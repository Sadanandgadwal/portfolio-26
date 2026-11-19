import { FoundationPreview } from "@/components/sections/foundation-preview";
import { portfolio } from "@/lib/content";

export default function Home() {
  return (
    <main>
      <FoundationPreview hero={portfolio.hero} personal={portfolio.personal} />
    </main>
  );
}
