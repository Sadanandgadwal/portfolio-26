import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fixtureExperience } from "@/app/design-system/sections/fixtures";
import { Experience } from "./experience";

describe("Experience", () => {
  it("renders nothing without entries", () => {
    const { container } = render(<Experience experience={{ ...fixtureExperience, items: [] }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a timeline entry per item with dates, roles and details", () => {
    const { container } = render(<Experience experience={fixtureExperience} />);
    const [current, previous] = fixtureExperience.items;
    expect(container.querySelectorAll("ol > li")).toHaveLength(fixtureExperience.items.length);

    expect(screen.getByRole("heading", { level: 3, name: current.role })).toBeInTheDocument();
    expect(screen.getByText("Apr 2023 — Present")).toBeInTheDocument();
    expect(screen.getByText("Jun 2021 — Mar 2023")).toBeInTheDocument();
    expect(screen.getByText("1 yr 10 mos")).toBeInTheDocument(); // closed range only
    expect(screen.getByText(current.achievements[0])).toBeInTheDocument();
    expect(screen.getByText(previous.responsibilities[0])).toBeInTheDocument();
    expect(screen.getAllByRole("list", { name: "Technologies" })).toHaveLength(2);
  });

  it("omits the highlights block when there are no achievements", () => {
    render(
      <Experience experience={{ ...fixtureExperience, items: [fixtureExperience.items[1]] }} />,
    );
    expect(screen.queryByRole("heading", { name: "Highlights" })).not.toBeInTheDocument();
  });
});
