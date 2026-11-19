import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fixtureEducation } from "@/app/design-system/sections/fixtures";
import { Education } from "./education";

describe("Education", () => {
  it("renders nothing when degrees and certifications are empty", () => {
    const { container } = render(
      <Education education={{ ...fixtureEducation, items: [], certifications: [] }} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders degrees and certifications; linked certs open safely in a new tab", () => {
    render(<Education education={fixtureEducation} />);
    const [degree] = fixtureEducation.items;
    const [linked, unlinked] = fixtureEducation.certifications;

    expect(screen.getByRole("heading", { level: 4, name: degree.degree })).toBeInTheDocument();
    expect(screen.getByText("2017 — 2021")).toBeInTheDocument();
    expect(screen.getByText(degree.grade)).toBeInTheDocument();

    const link = screen.getByRole("link", { name: (n) => n.includes(linked.name) });
    expect(link).toHaveAttribute("href", linked.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(
      screen.queryByRole("link", { name: (n) => n.includes(unlinked.name) }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4, name: unlinked.name })).toBeInTheDocument();
  });

  it("shows only the certifications column when there are no degrees", () => {
    render(<Education education={{ ...fixtureEducation, items: [] }} />);
    expect(screen.queryByRole("heading", { level: 3, name: "Education" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Certifications" })).toBeInTheDocument();
  });
});
