import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { portfolio } from "@/lib/content";
import { About } from "./about";

const { about } = portfolio;

describe("About", () => {
  it("renders heading, paragraphs and focus areas from JSON", () => {
    render(<About about={about} />);
    expect(screen.getByRole("heading", { level: 2, name: about.heading })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: about.heading })).toHaveAttribute("id", "about");
    for (const p of about.paragraphs) expect(screen.getByText(p)).toBeInTheDocument();
    for (const area of about.focusAreas) {
      expect(screen.getByRole("heading", { level: 3, name: area.title })).toBeInTheDocument();
    }
  });

  it("hides the stats block when no verified stats exist", () => {
    render(<About about={{ ...about, stats: [] }} />);
    expect(screen.queryByRole("term")).not.toBeInTheDocument();
  });

  it("renders stats with their final value available to assistive tech", () => {
    render(
      <About
        about={{
          ...about,
          stats: [
            { label: "Projects shipped", value: 12, prefix: "", suffix: "+" },
            { label: "Lighthouse", value: 99.5, prefix: "", suffix: "%" },
          ],
        }}
      />,
    );
    expect(screen.getAllByRole("term")).toHaveLength(2);
    expect(screen.getByText("Projects shipped")).toBeInTheDocument();
    expect(screen.getAllByText("12+").length).toBeGreaterThan(0);
    expect(screen.getAllByText("99.5%").length).toBeGreaterThan(0);
  });
});
