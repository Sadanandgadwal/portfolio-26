import { describe, expect, it } from "vitest";
import { fixtureProjects } from "@/app/design-system/sections/fixtures";
import { PLACEHOLDER_SLUG, findProject, projectStaticParams } from "./projects";

const items = fixtureProjects.items;

describe("projectStaticParams", () => {
  it("returns one param per project", () => {
    expect(projectStaticParams(items).map((p) => p.slug)).toEqual(items.map((p) => p.slug));
  });
  it("returns a placeholder when there are no projects (Cache Components needs ≥1)", () => {
    expect(projectStaticParams([])).toEqual([{ slug: PLACEHOLDER_SLUG }]);
  });
});

describe("findProject", () => {
  it("finds a project and the next one, wrapping around", () => {
    expect(findProject(items, items[0].slug)?.next?.slug).toBe(items[1].slug);
    expect(findProject(items, items.at(-1)!.slug)?.next?.slug).toBe(items[0].slug);
  });
  it("has no next project when there is only one", () => {
    expect(findProject([items[0]], items[0].slug)?.next).toBeUndefined();
  });
  it("returns null for unknown slugs (incl. the placeholder)", () => {
    expect(findProject(items, "nope")).toBeNull();
    expect(findProject([], PLACEHOLDER_SLUG)).toBeNull();
  });
});
