import type { Portfolio } from "@/lib/content";
import { portfolio } from "@/lib/content";

/**
 * FIXTURE DATA — fictional, for previewing/testing section layouts only.
 * Never rendered on the portfolio page; real content lives in src/data/portfolio.json.
 */
export const fixtureExperience: Portfolio["experience"] = {
  ...portfolio.experience,
  items: [
    {
      company: "Fixture Company A",
      role: "Frontend Developer",
      start: "2023-04",
      end: "",
      location: "Remote",
      employmentType: "Full-time",
      summary: "Fixture summary describing the scope of the role.",
      responsibilities: [
        "Fixture responsibility one describing reusable UI work.",
        "Fixture responsibility two describing API integration.",
      ],
      technologies: ["React.js", "TypeScript", "Redux Toolkit"],
      achievements: ["Fixture achievement placeholder."],
      certificateUrl: "",
    },
    {
      company: "Fixture Company B",
      role: "Junior Developer",
      start: "2021-06",
      end: "2023-03",
      location: "City, Country",
      employmentType: "Full-time",
      summary: "",
      responsibilities: ["Fixture responsibility describing ERP screens."],
      technologies: ["JavaScript", "Material UI"],
      achievements: [],
      certificateUrl: "https://example.com/certificate",
    },
  ],
};

export const fixtureEducation: Portfolio["education"] = {
  ...portfolio.education,
  items: [
    {
      degree: "Fixture Degree in Computer Science",
      institution: "Fixture University",
      start: "2017",
      end: "2021",
      location: "City",
      grade: "Grade: fixture",
    },
  ],
  certifications: [
    {
      name: "Fixture Certification (linked)",
      provider: "Fixture Provider",
      year: "2024",
      url: "https://example.com/",
    },
    {
      name: "Fixture Certification (no link)",
      provider: "Fixture Provider",
      year: "2022",
      url: "",
    },
  ],
};

export const fixtureStats: Portfolio["about"]["stats"] = [
  { label: "Fixture stat", value: 12, prefix: "", suffix: "+" },
  { label: "Fixture percent", value: 98.5, prefix: "", suffix: "%" },
  { label: "Fixture count", value: 1500, prefix: "", suffix: "" },
];

const fixtureProjectBase = {
  role: "Fixture role",
  longDescription: "",
  features: [] as string[],
  challenges: [] as string[],
  solutions: [] as string[],
  results: [] as string[],
  featured: false,
};

/** Media are screenshots/recordings of this portfolio's own UI (public/fixtures). */
export const fixtureProjects: Portfolio["projects"] = {
  ...portfolio.projects,
  items: [
    {
      ...fixtureProjectBase,
      slug: "fixture-erp-dashboard",
      title: "Fixture ERP Dashboard",
      category: "Fixture · Web app",
      year: "2026",
      featured: true,
      description:
        "Fixture description: an interactive operations dashboard with charts, filters and tables.",
      longDescription:
        "Fixture long description. Real case studies describe the problem, the users, constraints and the approach taken.",
      technologies: ["React.js", "TypeScript", "Tailwind CSS", "Chart.js"],
      features: [
        "Fixture feature: searchable data table",
        "Fixture feature: interactive chart",
        "Fixture feature: modal workflow",
      ],
      challenges: ["Fixture challenge: keeping a dense UI readable."],
      solutions: ["Fixture solution: a strict type scale and spacing system."],
      results: ["Fixture result placeholder."],
      media: {
        cover: "/fixtures/dashboard-cover.webp",
        coverAlt: "Fixture: dashboard overview with stats, chart and orders table",
        preview: "/fixtures/dashboard-preview.webm",
        previewType: "video",
        screenshots: [
          { src: "/fixtures/dashboard-dark.webp", alt: "Fixture: dashboard in dark theme" },
          { src: "/fixtures/skills-light.webp", alt: "Fixture: skills explorer" },
        ],
      },
      links: { live: "https://example.com/", github: "" },
    },
    {
      ...fixtureProjectBase,
      slug: "fixture-design-system",
      title: "Fixture Design System",
      category: "Fixture · Design system",
      year: "2025",
      description:
        "Fixture description: tokens, primitives and a living style guide in both themes.",
      technologies: ["React.js", "Tailwind CSS"],
      media: {
        cover: "/fixtures/styleguide-tall.webp",
        coverAlt: "Fixture: full-length style guide page",
        preview: "",
        previewType: "none",
        screenshots: [],
      },
      links: { live: "", github: "" },
    },
    {
      ...fixtureProjectBase,
      slug: "fixture-no-media",
      title: "Fixture Without Media",
      category: "Fixture · API",
      year: "2024",
      description: "Fixture description: a project with no images renders a typographic frame.",
      technologies: ["Node.js", "Express.js", "MongoDB"],
      media: { cover: "", coverAlt: "", preview: "", previewType: "none", screenshots: [] },
      links: { live: "", github: "" },
    },
  ],
};

/** Fictional contact data: example.com only, never real profiles. */
export const fixtureContact = {
  personal: { ...portfolio.personal, email: "hello@example.com" },
  resume: { ...portfolio.resume, file: "/fixtures/fixture-resume.pdf", updated: "Fixture date" },
  socials: [
    { platform: "github" as const, label: "GitHub", url: "https://example.com/github" },
    { platform: "linkedin" as const, label: "LinkedIn", url: "https://example.com/linkedin" },
    { platform: "email" as const, label: "Email", url: "" },
  ],
};
