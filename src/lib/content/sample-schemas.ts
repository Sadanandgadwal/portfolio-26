/** Schemas for clearly-labelled sample data (hero mockup, playground, showcase). Not portfolio facts. */
import { z } from "zod";
import { optionalText, sectionHeader } from "./fields";

/** Sample data for the interactive hero browser mockup. Clearly labelled as sample in the UI. */
export const heroMockupSchema = z.object({
  sampleLabel: z.string().min(1),
  url: z.string().min(1),
  appName: z.string().min(1),
  title: z.string().min(1),
  navItems: z.array(z.string().min(1)).min(1),
  searchPlaceholder: z.string().min(1),
  primaryAction: z.string().min(1),
  stats: z
    .array(z.object({ label: z.string().min(1), value: z.string().min(1), delta: optionalText }))
    .min(1)
    .max(3),
  chart: z.object({
    title: z.string().min(1),
    points: z.array(z.object({ label: z.string().min(1), value: z.number().nonnegative() })).min(2),
  }),
  table: z.object({
    columns: z.tuple([z.string(), z.string(), z.string()]),
    rows: z
      .array(
        z.object({
          name: z.string().min(1),
          status: z.enum(["success", "pending", "neutral"]),
          statusLabel: z.string().min(1),
          amount: z.string().min(1),
        }),
      )
      .min(1),
  }),
  modal: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    fieldLabel: z.string().min(1),
    fieldValue: z.string().min(1),
    confirm: z.string().min(1),
    cancel: z.string().min(1),
  }),
});

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

/** Sample data for the Frontend Playground. Labelled as sample in the UI. */
export const playgroundSchema = z
  .object({
    ...sectionHeader,
    sampleLabel: z.string().min(1),
    form: z.object({ roles: z.array(z.string().min(1)).min(2) }),
    table: z.object({
      rows: z
        .array(
          z.object({
            id: z.string().min(1),
            name: z.string().min(1),
            email: z.email(),
            team: z.string().min(1),
            status: z.enum(["active", "invited", "suspended"]),
            lastActive: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          }),
        )
        .min(1),
    }),
    tabs: z
      .array(z.object({ id: z.string().min(1), label: z.string().min(1), body: z.string().min(1) }))
      .min(2),
    chart: z.object({
      labels: z.array(z.string().min(1)).min(7),
      series: z
        .array(
          z.object({
            id: z.string().min(1),
            label: z.string().min(1),
            prefix: optionalText,
            values: z.array(z.number().nonnegative()),
          }),
        )
        .min(1),
    }),
  })
  .refine((p) => p.chart.series.every((s) => s.values.length === p.chart.labels.length), {
    message: "Every chart series needs one value per label",
    path: ["chart", "series"],
  });
