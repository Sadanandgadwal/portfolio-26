"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import type { Playground } from "@/lib/content";

export function TabsSpecimen({ tabs }: { tabs: Playground["tabs"] }) {
  const [active, setActive] = useState(tabs[0].id);
  const reduceMotion = usePrefersReducedMotion();

  return (
    <Tabs value={active} onValueChange={setActive} className="gap-4">
      <TabsList className="h-11 w-full bg-subtle p-1">
        {tabs.map((t) => (
          <TabsTrigger
            key={t.id}
            value={t.id}
            className="relative z-0 h-full bg-transparent data-active:bg-transparent data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-transparent"
          >
            {active === t.id && (
              <motion.span
                layoutId="playground-tab"
                aria-hidden
                className="absolute inset-0 -z-10 rounded-md bg-surface shadow-sm"
                transition={
                  reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }
                }
              />
            )}
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent
          key={t.id}
          value={t.id}
          className="text-sm leading-relaxed text-muted-foreground"
        >
          {t.body}
        </TabsContent>
      ))}
    </Tabs>
  );
}
