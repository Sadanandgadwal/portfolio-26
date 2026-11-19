import { FoundationPreview } from "@/components/sections/foundation-preview";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { portfolio } from "@/lib/content";

export default function Home() {
  return (
    <main>
      {/* Temporary placement until the Phase 3 navigation. */}
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <FoundationPreview hero={portfolio.hero} personal={portfolio.personal} />
    </main>
  );
}
