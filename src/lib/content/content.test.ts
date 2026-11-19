import { describe, expect, it } from "vitest";
import raw from "@/data/portfolio.json";
import { getVisibleSocials, parsePortfolio, portfolio, visibleNavItems } from "./index";

const clone = () => structuredClone(raw) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

describe("portfolio.json", () => {
  it("passes schema validation", () => {
    expect(() => parsePortfolio(raw)).not.toThrow();
    expect(portfolio.personal.name).toBe("Sadanand Gadwal");
  });

  it("has a unique href for every nav item", () => {
    const hrefs = portfolio.navigation.items.map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

describe("parsePortfolio", () => {
  it("rejects missing required fields with a readable path", () => {
    const data = clone();
    delete data.personal.name;
    expect(() => parsePortfolio(data)).toThrow(/personal\.name/);
  });

  it("rejects invalid site url", () => {
    const data = clone();
    data.site.url = "not-a-url";
    expect(() => parsePortfolio(data)).toThrow(/site\.url/);
  });

  it("applies defaults for omitted optional fields", () => {
    const data = clone();
    delete data.personal.location;
    data.projects.items = [{ slug: "demo", title: "Demo", description: "d" }];
    const parsed = parsePortfolio(data);
    expect(parsed.personal.location).toBe("");
    expect(parsed.projects.items[0].media.previewType).toBe("none");
    expect(parsed.projects.items[0].links).toEqual({ live: "", github: "" });
  });

  it("rejects duplicate project slugs", () => {
    const data = clone();
    const p = { slug: "dup", title: "A", description: "d" };
    data.projects.items = [p, { ...p }];
    expect(() => parsePortfolio(data)).toThrow(/Duplicate project slug "dup"/);
  });

  it("rejects skills referencing unknown projects", () => {
    const data = clone();
    data.skills.categories[0].items[0].relatedProjects = ["ghost"];
    expect(() => parsePortfolio(data)).toThrow(/unknown project "ghost"/);
  });

  it("rejects asset paths outside /public", () => {
    const data = clone();
    data.resume.file = "https://evil.example/resume.pdf";
    expect(() => parsePortfolio(data)).toThrow(/resume\.file/);
  });
});

describe("getVisibleSocials", () => {
  it("hides placeholder socials with empty url", () => {
    const result = getVisibleSocials([
      { platform: "github", label: "GitHub", url: "https://github.com/x" },
      { platform: "medium", label: "Medium", url: "" },
    ]);
    expect(result.map((s) => s.platform)).toEqual(["github"]);
  });
});

describe("visibleNavItems", () => {
  it("drops in-page links to sections that are not rendered, keeps external links", () => {
    const items = [
      { label: "Home", href: "#home" },
      { label: "Experience", href: "#experience" },
      { label: "Blog", href: "https://example.com" },
    ];
    expect(visibleNavItems(items, ["home"]).map((i) => i.label)).toEqual(["Home", "Blog"]);
  });
});
