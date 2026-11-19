import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { portfolio } from "@/lib/content";
import { FoundationPreview } from "./foundation-preview";

describe("FoundationPreview", () => {
  it("renders hero content from JSON props", () => {
    render(<FoundationPreview hero={portfolio.hero} personal={portfolio.personal} />);
    expect(
      screen.getByRole("heading", { level: 1, name: portfolio.hero.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(portfolio.personal.roles.join(" / "))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: portfolio.hero.primaryCta.label })).toHaveAttribute(
      "href",
      portfolio.hero.primaryCta.href,
    );
  });

  it("omits the eyebrow when empty", () => {
    render(
      <FoundationPreview hero={{ ...portfolio.hero, eyebrow: "" }} personal={portfolio.personal} />,
    );
    expect(screen.queryByText(portfolio.hero.eyebrow)).not.toBeInTheDocument();
  });
});
