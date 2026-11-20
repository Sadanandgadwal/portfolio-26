import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { SkillCategory } from "@/lib/content";
import { SkillsExplorer } from "./skills-explorer";

const categories: SkillCategory[] = [
  {
    id: "frontend",
    name: "Frontend",
    description: "",
    items: [
      { name: "React.js", icon: "react", description: "UI library.", relatedProjects: ["erp"] },
      { name: "TypeScript", icon: "typescript", description: "Typed JS.", relatedProjects: [] },
    ],
  },
  {
    id: "backend",
    name: "Backend",
    description: "",
    items: [{ name: "Node.js", icon: "nodedotjs", description: "Runtime.", relatedProjects: [] }],
  },
];

// Both the mobile inline panel and the desktop aside exist in the DOM (one hidden by CSS).
const detailNames = () => screen.getAllByTestId("skill-detail-name").map((n) => n.textContent);

/** Skill tiles (not the "works alongside" chips) carry data-active. */
const tile = (name: string) =>
  screen.getAllByRole("button", { name }).find((b) => b.hasAttribute("data-active"))!;

const setup = () => {
  const user = userEvent.setup();
  render(<SkillsExplorer categories={categories} projectTitles={{ erp: "ERP Dashboard" }} />);
  return user;
};

describe("SkillsExplorer", () => {
  it("selects the first skill by default and shows related project titles", () => {
    setup();
    expect(detailNames()).toContain("React.js");
    expect(screen.getAllByText("ERP Dashboard").length).toBeGreaterThan(0);
  });

  it("updates the detail panel on click and on keyboard focus", async () => {
    const user = setup();
    await user.click(tile("TypeScript"));
    await waitFor(() => expect(detailNames()).toContain("TypeScript"));
    expect(tile("TypeScript")).toHaveAttribute("aria-pressed", "true");

    tile("Node.js").focus();
    await waitFor(() => expect(detailNames()).toContain("Node.js"));
  });

  it("filters categories and moves the selection into the filtered category", async () => {
    const user = setup();
    const toolbar = screen.getByRole("toolbar", { name: /filter/i });
    expect(within(toolbar).getByRole("button", { name: /All/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(within(toolbar).getByRole("button", { name: /Backend/ }));
    expect(within(toolbar).getByRole("button", { name: /Backend/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("heading", { level: 3, name: "Backend" })).toBeInTheDocument();
    await waitFor(() => expect(detailNames()).toContain("Node.js"));
    // Removal of the exiting "Frontend" group (popLayout exit) is verified in Playwright.
  });

  it("'works alongside' chips jump to sibling skills", async () => {
    const user = setup();
    const aside = screen.getByRole("complementary", { name: "Selected technology" });
    await user.click(within(aside).getByRole("button", { name: "TypeScript" }));
    await waitFor(() => expect(detailNames()).toContain("TypeScript"));
  });
});
