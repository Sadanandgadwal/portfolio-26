"use client";

import { LayoutGroup, motion } from "motion/react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrolled } from "@/hooks/use-scrolled";
import type { NavLink } from "@/lib/content";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./mobile-menu";

type SiteHeaderProps = {
  name: string;
  shortName: string;
  roles: string[];
  items: NavLink[];
  /** Brand link target; "/#home" on sub-pages. */
  homeHref?: string;
};

function Brand({ name, shortName, href }: { name: string; shortName: string; href: string }) {
  return (
    <a
      href={href}
      className="group/brand flex items-center gap-2.5 rounded-full pr-2"
      aria-label={`${name}, back to top`}
    >
      <span className="grid size-9 place-items-center rounded-full bg-foreground font-mono text-xs font-medium text-background transition-transform duration-300 ease-out-expo group-hover/brand:rotate-[-8deg]">
        {shortName || name.slice(0, 2)}
      </span>
      <span className="text-sm font-medium tracking-tight transition-opacity duration-300 max-lg:hidden lg:group-data-scrolled/header:hidden">
        {name}
      </span>
    </a>
  );
}

export function SiteHeader({ name, shortName, roles, items, homeHref = "#home" }: SiteHeaderProps) {
  const scrolled = useScrolled(24);
  const sectionIds = items.filter((i) => i.href.startsWith("#")).map((i) => i.href.slice(1));
  const activeId = useActiveSection(sectionIds);
  const activeHref = activeId ? `#${activeId}` : null;

  return (
    <header
      data-scrolled={scrolled || undefined}
      className="group/header pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-4"
    >
      <div
        className={cn(
          "pointer-events-auto flex w-full items-center justify-between gap-4 rounded-full border px-2 py-1.5",
          "transition-[max-width,background-color,border-color,box-shadow] duration-500 ease-out-expo",
          "max-w-6xl border-transparent",
          "group-data-scrolled/header:max-w-3xl group-data-scrolled/header:border-border group-data-scrolled/header:bg-background/75 group-data-scrolled/header:shadow-md group-data-scrolled/header:backdrop-blur-xl",
        )}
      >
        <Brand name={name} shortName={shortName} href={homeHref} />

        <nav aria-label="Primary" className="max-md:hidden">
          <LayoutGroup id="primary-nav">
            <ul className="flex items-center">
              {items.map((item) => {
                const active = activeHref === item.href;
                return (
                  <li key={item.href} className="relative">
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-subtle"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <a
                      href={item.href}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "relative block rounded-full px-3 py-2 text-[0.8125rem] transition-colors duration-150",
                        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <MobileMenu
            items={items}
            activeHref={activeHref}
            brand={<Brand name={name} shortName={shortName} href={homeHref} />}
            footer={<p className="label-mono">{roles.join(" / ")}</p>}
          />
        </div>
      </div>
    </header>
  );
}
