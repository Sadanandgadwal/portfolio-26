"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { TechIcon } from "@/components/icons/tech-icon";
import { Badge } from "@/components/ui/badge";
import type { Skill, SkillCategory } from "@/lib/content";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const ALL = "all";

type Selection = { categoryId: string; name: string };
type SkillsExplorerProps = {
  categories: SkillCategory[];
  /** slug → project title, for related-project lookups. */
  projectTitles: Record<string, string>;
};

function SkillDetail({
  skill,
  category,
  projectTitles,
  onSelect,
}: {
  skill: Skill;
  category: SkillCategory;
  projectTitles: Record<string, string>;
  onSelect: (s: Selection) => void;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const related = skill.relatedProjects.map((slug) => projectTitles[slug]).filter(Boolean);
  const siblings = category.items.filter((s) => s.name !== skill.name);

  return (
    <div className="overflow-hidden rounded-2xl border bg-surface p-6 shadow-sm" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${category.id}-${skill.name}`}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="grid gap-5"
        >
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-xl border bg-background">
              <TechIcon name={skill.icon} label={skill.name} className="size-7 text-(--brand)" />
            </span>
            <div>
              <p className="label-mono">{category.name}</p>
              <p className="mt-1 text-title font-semibold" data-testid="skill-detail-name">
                {skill.name}
              </p>
            </div>
          </div>

          {skill.description && (
            <p className="leading-relaxed text-muted-foreground">{skill.description}</p>
          )}

          {related.length > 0 && (
            <div className="grid gap-2">
              <p className="label-mono">Used in</p>
              <ul className="flex flex-wrap gap-1.5">
                {related.map((title) => (
                  <li key={title}>
                    <Badge variant="secondary">{title}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {siblings.length > 0 && (
            <div className="grid gap-2 border-t pt-5">
              <p className="label-mono">Works alongside</p>
              <ul className="flex flex-wrap gap-1.5">
                {siblings.map((s) => (
                  <li key={s.name}>
                    <button
                      type="button"
                      onClick={() => onSelect({ categoryId: category.id, name: s.name })}
                      className="inline-flex h-7 items-center gap-1.5 rounded-sm border px-2 font-mono text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                    >
                      <TechIcon name={s.icon} label={s.name} className="size-3" />
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Interactive, filterable technology map. Hover/focus/tap a tile to inspect it. */
export function SkillsExplorer({ categories, projectTitles }: SkillsExplorerProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [filter, setFilter] = useState<string>(ALL);
  const [selection, setSelection] = useState<Selection>({
    categoryId: categories[0].id,
    name: categories[0].items[0].name,
  });
  const [pointerInside, setPointerInside] = useState(false);

  const visible = filter === ALL ? categories : categories.filter((c) => c.id === filter);
  const activeCategory = categories.find((c) => c.id === selection.categoryId) ?? categories[0];
  const activeSkill =
    activeCategory.items.find((s) => s.name === selection.name) ?? activeCategory.items[0];
  const total = categories.reduce((n, c) => n + c.items.length, 0);

  const applyFilter = (id: string) => {
    setFilter(id);
    const target = categories.find((c) => c.id === id);
    if (target && target.id !== selection.categoryId) {
      setSelection({ categoryId: target.id, name: target.items[0].name });
    }
  };

  const detail = (
    <SkillDetail
      skill={activeSkill}
      category={activeCategory}
      projectTitles={projectTitles}
      onSelect={setSelection}
    />
  );

  return (
    <div>
      <LayoutGroup id="skill-filters">
        <div
          role="toolbar"
          aria-label="Filter technologies by category"
          className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {[
            { id: ALL, name: "All", count: total },
            ...categories.map((c) => ({ id: c.id, name: c.name, count: c.items.length })),
          ].map((chip) => {
            const active = filter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                aria-pressed={active}
                onClick={() => applyFilter(chip.id)}
                className={cn(
                  "relative inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-150",
                  active
                    ? "border-transparent text-background"
                    : "text-muted-foreground hover:border-border-strong hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="skill-filter-active"
                    className="absolute inset-0 rounded-full bg-foreground"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 400, damping: 34 }
                    }
                  />
                )}
                <span className="relative">{chip.name}</span>
                <span
                  className={cn(
                    "relative font-mono text-xs",
                    active ? "opacity-80" : "text-muted-foreground",
                  )}
                >
                  {String(chip.count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div
          className="grid content-start gap-10 lg:col-span-8"
          onPointerEnter={(e) => e.pointerType === "mouse" && setPointerInside(true)}
          onPointerLeave={() => setPointerInside(false)}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((category) => (
              <motion.section
                key={category.id}
                layout={!reduceMotion}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.4, ease: EASE }}
                aria-labelledby={`skills-cat-${category.id}`}
              >
                <h3
                  id={`skills-cat-${category.id}`}
                  className="mb-4 flex items-baseline gap-3 label-mono"
                >
                  {category.name}
                  <span className="h-px flex-1 bg-border" aria-hidden />
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {category.items.map((skill) => {
                    const active =
                      selection.categoryId === category.id && selection.name === skill.name;
                    const select = () =>
                      setSelection({ categoryId: category.id, name: skill.name });
                    return (
                      <li key={skill.name}>
                        <button
                          type="button"
                          data-active={active}
                          aria-pressed={active}
                          onPointerEnter={(e) => e.pointerType === "mouse" && select()}
                          onFocus={select}
                          onClick={select}
                          className={cn(
                            "group/tile inline-flex h-12 items-center gap-3 rounded-xl border bg-surface pr-4 pl-2 text-sm",
                            "transition-[opacity,border-color,box-shadow,transform] duration-300 ease-out-expo",
                            active
                              ? "border-foreground/30 shadow-sm"
                              : "hover:border-border-strong",
                            pointerInside && !active && "opacity-50",
                          )}
                        >
                          <span className="grid size-8 place-items-center rounded-lg bg-subtle">
                            <TechIcon
                              name={skill.icon}
                              label={skill.name}
                              className={cn(
                                "size-4 transition-[color,transform] duration-300 ease-out-expo",
                                active && "scale-115 -rotate-6 text-(--brand)",
                              )}
                            />
                          </span>
                          {skill.name}
                          {active && (
                            <motion.span
                              layoutId="skill-active-dot"
                              aria-hidden
                              className="size-1.5 rounded-full bg-signal"
                              transition={
                                reduceMotion
                                  ? { duration: 0 }
                                  : { type: "spring", stiffness: 500, damping: 36 }
                              }
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {activeCategory.id === category.id && (
                  <div className="mt-4 lg:hidden">{detail}</div>
                )}
              </motion.section>
            ))}
          </AnimatePresence>
        </div>

        <aside className="max-lg:hidden lg:col-span-4" aria-label="Selected technology">
          <div className="sticky top-28">{detail}</div>
        </aside>
      </div>
    </div>
  );
}
