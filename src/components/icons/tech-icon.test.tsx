import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { portfolio } from "@/lib/content";
import { TechIcon, brandColor, hasTechIcon, luminance } from "./tech-icon";

describe("TechIcon registry", () => {
  it("resolves every skill icon key used in portfolio.json", () => {
    const missing = portfolio.skills.categories
      .flatMap((c) => c.items)
      .filter((s) => s.icon && !hasTechIcon(s.icon))
      .map((s) => `${s.name} → ${s.icon}`);
    expect(missing).toEqual([]);
  });

  it("drops near-black brand colors so icons stay visible in dark mode", () => {
    expect(luminance("000000")).toBe(0);
    expect(luminance("FFFFFF")).toBeCloseTo(1);
    expect(brandColor("express")).toBeUndefined();
    expect(brandColor("github")).toBeUndefined();
    expect(brandColor("react")).toBe("#61DAFB");
    expect(brandColor("api")).toBeUndefined(); // lucide, no brand color
  });

  it("renders a decorative monogram for unknown keys", () => {
    const { container } = render(<TechIcon name="unknown" label="Svelte" />);
    expect(container.firstChild).toHaveAttribute("aria-hidden");
    expect(container).toHaveTextContent("Sv");
  });
});
