import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { portfolio } from "@/lib/content";
import { Hero } from "./hero";

const { hero, personal } = portfolio;

describe("Hero", () => {
  it("renders JSON content with a single h1 and CTA links", () => {
    render(<Hero hero={hero} personal={personal} />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(hero.heading);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText(personal.roles.join(" / "))).toBeInTheDocument();
    expect(screen.getByText(hero.statement)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: hero.primaryCta.label })).toHaveAttribute(
      "href",
      hero.primaryCta.href,
    );
    expect(screen.getByRole("link", { name: hero.secondaryCta.label })).toHaveAttribute(
      "href",
      hero.secondaryCta.href,
    );
  });

  it("hides optional availability/location when empty", () => {
    render(<Hero hero={hero} personal={{ ...personal, availability: "", location: "" }} />);
    expect(screen.queryByText(/available/i)).not.toBeInTheDocument();
  });
});
