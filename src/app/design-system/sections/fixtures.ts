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
