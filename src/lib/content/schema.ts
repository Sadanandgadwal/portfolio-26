import { z } from "zod";

/** Empty string = "not provided yet". Lets placeholders live in JSON without failing validation. */
const optionalText = z.string().trim().default("");
const optionalUrl = z.union([z.url(), z.literal("")]).default("");
const optionalEmail = z.union([z.email(), z.literal("")]).default("");
/** Asset path inside /public (e.g. "/images/projects/foo.webp") or empty. */
const assetPath = z
  .union([z.string().regex(/^\/[\w\-./]+$/, "Must be an absolute /public path"), z.literal("")])
  .default("");
/** In-page anchor ("#about"), site path ("/projects/x") or absolute URL. */
const href = z.string().regex(/^(#[\w-]*|\/[\w\-./#]*|https?:\/\/.+|mailto:.+)$/, "Invalid href");

const linkSchema = z.object({ label: z.string().min(1), href });

export const socialPlatforms = [
  "github",
  "linkedin",
  "email",
  "youtube",
  "medium",
  "instagram",
  "x",
] as const;

const socialSchema = z.object({
  platform: z.enum(socialPlatforms),
  label: z.string().min(1),
  url: z.union([z.url(), z.string().regex(/^mailto:.+/), z.literal("")]).default(""),
});

const statSchema = z.object({
  label: z.string().min(1),
  value: z.number().nonnegative(),
  prefix: optionalText,
  suffix: optionalText,
});

const skillSchema = z.object({
  name: z.string().min(1),
  /** Icon key resolved by the icon registry (Phase 4). */
  icon: optionalText,
  description: optionalText,
  relatedProjects: z.array(z.string()).default([]),
});

const skillCategorySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  description: optionalText,
  items: z.array(skillSchema).min(1),
});

/** Dates as "YYYY-MM" or "YYYY"; empty end = present. */
const yearMonth = z.union([z.string().regex(/^\d{4}(-\d{2})?$/), z.literal("")]).default("");

const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  start: yearMonth,
  end: yearMonth,
  location: optionalText,
  employmentType: optionalText,
  summary: optionalText,
  responsibilities: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
});

const educationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  start: yearMonth,
  end: yearMonth,
  location: optionalText,
  grade: optionalText,
});

const certificationSchema = z.object({
  name: z.string().min(1),
  provider: z.string().min(1),
  year: optionalText,
  url: optionalUrl,
});

const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be kebab-case"),
  title: z.string().min(1),
  category: optionalText,
  year: optionalText,
  featured: z.boolean().default(false),
  description: z.string().min(1),
  longDescription: optionalText,
  role: optionalText,
  technologies: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  challenges: z.array(z.string()).default([]),
  solutions: z.array(z.string()).default([]),
  results: z.array(z.string()).default([]),
  media: z
    .object({
      cover: assetPath,
      coverAlt: optionalText,
      preview: assetPath,
      previewType: z.enum(["none", "gif", "video"]).default("none"),
      screenshots: z.array(z.object({ src: assetPath, alt: z.string().min(1) })).default([]),
    })
    .prefault({}),
  links: z.object({ live: optionalUrl, github: optionalUrl }).prefault({}),
});

const sectionHeader = {
  eyebrow: optionalText,
  heading: z.string().min(1),
  description: optionalText,
};

export const portfolioSchema = z
  .object({
    site: z.object({
      url: z.url(),
      title: z.string().min(1),
      titleTemplate: z.string().includes("%s"),
      description: z.string().min(1),
      keywords: z.array(z.string()).default([]),
      locale: z.string().default("en_US"),
      ogImage: assetPath,
      twitterHandle: optionalText,
    }),
    personal: z.object({
      name: z.string().min(1),
      shortName: optionalText,
      roles: z.array(z.string().min(1)).min(1),
      location: optionalText,
      email: optionalEmail,
      phone: optionalText,
      availability: optionalText,
      avatar: assetPath,
    }),
    navigation: z.object({ items: z.array(linkSchema).min(1) }),
    hero: z.object({
      eyebrow: optionalText,
      heading: z.string().min(1),
      statement: z.string().min(1),
      primaryCta: linkSchema,
      secondaryCta: linkSchema,
    }),
    about: z.object({
      ...sectionHeader,
      paragraphs: z.array(z.string()).default([]),
      focusAreas: z
        .array(z.object({ title: z.string().min(1), description: optionalText }))
        .default([]),
      stats: z.array(statSchema).default([]),
    }),
    skills: z.object({ ...sectionHeader, categories: z.array(skillCategorySchema).min(1) }),
    experience: z.object({ ...sectionHeader, items: z.array(experienceSchema).default([]) }),
    education: z.object({
      ...sectionHeader,
      items: z.array(educationSchema).default([]),
      certifications: z.array(certificationSchema).default([]),
    }),
    projects: z.object({ ...sectionHeader, items: z.array(projectSchema).default([]) }),
    playground: z.object({ ...sectionHeader }),
    showcase: z.object({ ...sectionHeader }),
    contact: z.object({
      ...sectionHeader,
      cta: z.object({ label: z.string().min(1) }),
      copyEmailLabel: z.string().default("Copy email"),
    }),
    resume: z.object({ label: z.string().min(1), file: assetPath, updated: optionalText }),
    socials: z.array(socialSchema).default([]),
    footer: z.object({ tagline: optionalText, note: optionalText }),
  })
  .superRefine((data, ctx) => {
    const slugs = new Set<string>();
    data.projects.items.forEach((p, i) => {
      if (slugs.has(p.slug)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate project slug "${p.slug}"`,
          path: ["projects", "items", i, "slug"],
        });
      }
      slugs.add(p.slug);
    });

    data.skills.categories.forEach((cat, ci) =>
      cat.items.forEach((skill, si) =>
        skill.relatedProjects.forEach((slug, ri) => {
          if (!slugs.has(slug)) {
            ctx.addIssue({
              code: "custom",
              message: `Skill "${skill.name}" references unknown project "${slug}"`,
              path: ["skills", "categories", ci, "items", si, "relatedProjects", ri],
            });
          }
        }),
      ),
    );
  });

export type Portfolio = z.infer<typeof portfolioSchema>;
export type PortfolioInput = z.input<typeof portfolioSchema>;
export type Site = Portfolio["site"];
export type Personal = Portfolio["personal"];
export type NavLink = z.infer<typeof linkSchema>;
export type Hero = Portfolio["hero"];
export type About = Portfolio["about"];
export type Stat = z.infer<typeof statSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Social = z.infer<typeof socialSchema>;
export type SocialPlatform = (typeof socialPlatforms)[number];
