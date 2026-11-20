import { describe, expect, it } from "vitest";
import raw from "@/data/portfolio.json";
import {
  getVisibleSocials,
  parsePortfolio,
  portfolio,
  resolveSocials,
  visibleNavItems,
} from "./index";
import type { PortfolioInput } from "./schema";

/** Mutable copy typed as schema *input* (optional fields may be omitted). */
const clone = () => structuredClone(raw) as unknown as PortfolioInput; // raw JSON widens enums to string

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
    delete (data.personal as Partial<PortfolioInput["personal"]>).name;
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
    data.projects.items = [
      ...(data.projects.items ?? []),
      { slug: "demo", title: "Demo", description: "d" },
    ];
    const parsed = parsePortfolio(data);
    const demo = parsed.projects.items.at(-1)!;
    expect(parsed.personal.location).toBe("");
    expect(demo.media.previewType).toBe("none");
    expect(demo.links).toEqual({ live: "", github: "" });
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

describe("resolveSocials", () => {
  const socials = [
    { platform: "email" as const, label: "Email", url: "" },
    { platform: "github" as const, label: "GitHub", url: "" },
    { platform: "medium" as const, label: "Medium", url: "https://example.com/medium" },
  ];
  it("derives the email link from personal.email and hides empty ones", () => {
    expect(resolveSocials(socials, "me@example.com").map((s) => s.url)).toEqual([
      "mailto:me@example.com",
      "https://example.com/medium",
    ]);
  });
  it("keeps the email social hidden when there is no email", () => {
    expect(resolveSocials(socials, "").map((s) => s.platform)).toEqual(["medium"]);
  });
});
