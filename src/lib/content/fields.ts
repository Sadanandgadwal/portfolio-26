import { z } from "zod";

/** Empty string = "not provided yet". Lets placeholders live in JSON without failing validation. */
export const optionalText = z.string().trim().default("");
export const optionalUrl = z.union([z.url(), z.literal("")]).default("");
export const optionalEmail = z.union([z.email(), z.literal("")]).default("");
/** Asset path inside /public (e.g. "/images/projects/foo.webp") or empty. */
export const assetPath = z
  .union([z.string().regex(/^\/[\w\-./]+$/, "Must be an absolute /public path"), z.literal("")])
  .default("");
/** In-page anchor ("#about"), site path ("/projects/x") or absolute URL. */
export const href = z
  .string()
  .regex(/^(#[\w-]*|\/[\w\-./#]*|https?:\/\/.+|mailto:.+)$/, "Invalid href");

export const linkSchema = z.object({ label: z.string().min(1), href });

/** Shared eyebrow/heading/description fields for section headers. */
export const sectionHeader = {
  eyebrow: optionalText,
  heading: z.string().min(1),
  description: optionalText,
};
