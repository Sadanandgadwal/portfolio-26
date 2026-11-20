/** Schemas for clearly-labelled sample data (showcase). Not portfolio facts. */
import { z } from "zod";
import { sectionHeader } from "./fields";

/** Sample data for the Enterprise UI showcase. Labelled as sample in the UI. */
export const showcaseSchema = z.object({
  ...sectionHeader,
  sampleLabel: z.string().min(1),
  appName: z.string().min(1),
  orders: z
    .array(
      z.object({
        id: z.string().min(1),
        customer: z.string().min(1),
        region: z.string().min(1),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        total: z.number().nonnegative(),
        status: z.enum(["paid", "pending", "shipped", "cancelled"]),
      }),
    )
    .min(1),
  countries: z.array(z.string().min(1)).min(3),
});
