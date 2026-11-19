import type { CSSProperties } from "react";
import { ChartGantt, CodeXml, ListChecks, Webhook, type LucideIcon } from "lucide-react";
import {
  siBootstrap,
  siChartdotjs,
  siCss,
  siExpress,
  siFigma,
  siFormik,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siLinux,
  siMongodb,
  siMui,
  siNetlify,
  siNextdotjs,
  siNodedotjs,
  siPostman,
  siReact,
  siReactrouter,
  siRedux,
  siSass,
  siTailwindcss,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons";
import { cn } from "@/lib/utils";

type IconDef = { kind: "brand"; icon: SimpleIcon } | { kind: "lucide"; icon: LucideIcon };

/**
 * JSON `icon` key → icon. Official brand marks from simple-icons (CC0); Lucide for generic
 * concepts and brands removed from simple-icons at the owner's request (e.g. VS Code).
 */
const REGISTRY: Record<string, IconDef> = {
  react: { kind: "brand", icon: siReact },
  nextdotjs: { kind: "brand", icon: siNextdotjs },
  reactrouter: { kind: "brand", icon: siReactrouter },
  sass: { kind: "brand", icon: siSass },
  bootstrap: { kind: "brand", icon: siBootstrap },
  figma: { kind: "brand", icon: siFigma },
  postman: { kind: "brand", icon: siPostman },
  vercel: { kind: "brand", icon: siVercel },
  netlify: { kind: "brand", icon: siNetlify },
  linux: { kind: "brand", icon: siLinux },
  javascript: { kind: "brand", icon: siJavascript },
  typescript: { kind: "brand", icon: siTypescript },
  html5: { kind: "brand", icon: siHtml5 },
  css: { kind: "brand", icon: siCss },
  tailwindcss: { kind: "brand", icon: siTailwindcss },
  mui: { kind: "brand", icon: siMui },
  redux: { kind: "brand", icon: siRedux },
  formik: { kind: "brand", icon: siFormik },
  nodedotjs: { kind: "brand", icon: siNodedotjs },
  express: { kind: "brand", icon: siExpress },
  mongodb: { kind: "brand", icon: siMongodb },
  chartdotjs: { kind: "brand", icon: siChartdotjs },
  git: { kind: "brand", icon: siGit },
  github: { kind: "brand", icon: siGithub },
  yup: { kind: "lucide", icon: ListChecks },
  api: { kind: "lucide", icon: Webhook },
  gantt: { kind: "lucide", icon: ChartGantt },
  vscode: { kind: "lucide", icon: CodeXml },
};

export const hasTechIcon = (key: string) => key in REGISTRY;

/** Relative luminance of a hex color (0–1). Very dark brand colors would vanish in dark mode. */
export function luminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Brand color usable on both themes, or undefined (falls back to currentColor). */
export function brandColor(key: string): string | undefined {
  const def = REGISTRY[key];
  if (def?.kind !== "brand") return undefined;
  return luminance(def.icon.hex) < 0.02 ? undefined : `#${def.icon.hex}`;
}

type TechIconProps = { name: string; label: string; className?: string };

/** Monochrome icon (currentColor). Exposes `--brand` so parents can tint it on hover. */
export function TechIcon({ name, label, className }: TechIconProps) {
  const def = REGISTRY[name];
  const style = { "--brand": brandColor(name) } as CSSProperties;

  if (!def) {
    return (
      <span
        aria-hidden
        className={cn("grid place-items-center font-mono text-[0.6em] font-medium", className)}
      >
        {label.slice(0, 2)}
      </span>
    );
  }
  if (def.kind === "lucide") {
    const Icon = def.icon;
    return <Icon aria-hidden className={className} strokeWidth={1.75} style={style} />;
  }
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d={def.icon.path} />
    </svg>
  );
}
