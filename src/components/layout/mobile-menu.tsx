"use client";

import { useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { Dialog, VisuallyHidden } from "radix-ui";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { IconButton } from "@/components/ui/icon-button";
import type { NavLink } from "@/lib/content";
import { cn } from "@/lib/utils";

const EASE = [0.76, 0, 0.24, 1] as const;

/** Two-line hamburger that morphs into an X when `open`. */
function MenuGlyph({ open }: { open: boolean }) {
  const transition = { duration: 0.4, ease: EASE };
  return (
    <span aria-hidden className="relative block h-3 w-5">
      <motion.span
        className="absolute inset-x-0 top-0.5 h-[1.5px] rounded-full bg-current"
        initial={false}
        animate={open ? { y: 4, rotate: 45 } : { y: 0, rotate: 0 }}
        transition={transition}
      />
      <motion.span
        className="absolute inset-x-0 bottom-0.5 h-[1.5px] rounded-full bg-current"
        initial={false}
        animate={open ? { y: -4, rotate: -45 } : { y: 0, rotate: 0 }}
        transition={transition}
      />
    </span>
  );
}

type MobileMenuProps = {
  items: NavLink[];
  activeHref: string | null;
  brand: React.ReactNode;
  footer?: React.ReactNode;
};

export function MobileMenu({ items, activeHref, brand, footer }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pendingHref = useRef<string | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  // Close first, then scroll once the scroll lock is released.
  const onNavigate = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    pendingHref.current = href;
    setOpen(false);
  };
  const onCloseAutoFocus = (e: Event) => {
    const href = pendingHref.current;
    if (!href) return;
    e.preventDefault();
    pendingHref.current = null;
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(href);
      target?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      history.pushState(null, "", href);
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <IconButton aria-label="Open menu" className="md:hidden" data-testid="menu-open">
          <MenuGlyph open={false} />
        </IconButton>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Radix attaches body scroll-lock to the overlay. */}
            <Dialog.Overlay forceMount className="fixed inset-0 z-60 md:hidden" />
            <Dialog.Content
              forceMount
              asChild
              aria-describedby={undefined}
              onCloseAutoFocus={onCloseAutoFocus}
            >
              <motion.div
                className="fixed inset-0 z-60 flex flex-col bg-background px-3 pt-3 pb-8 md:hidden"
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                animate={{ clipPath: "inset(0 0 0% 0)" }}
                exit={{ clipPath: "inset(0 0 100% 0)" }}
                transition={{ duration: reduceMotion ? 0 : 0.6, ease: EASE }}
              >
                <VisuallyHidden.Root>
                  <Dialog.Title>Menu</Dialog.Title>
                </VisuallyHidden.Root>

                <div className="flex items-center justify-between px-2 py-1.5">
                  {brand}
                  <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <Dialog.Close asChild>
                      <IconButton aria-label="Close menu">
                        <MenuGlyph open />
                      </IconButton>
                    </Dialog.Close>
                  </div>
                </div>

                <nav aria-label="Mobile" className="mt-10 flex-1 px-3">
                  <ul className="grid gap-1">
                    {items.map((item, i) => (
                      <li key={item.href} className="overflow-hidden">
                        <motion.a
                          href={item.href}
                          onClick={(e) => onNavigate(e, item.href)}
                          aria-current={activeHref === item.href ? "true" : undefined}
                          className={cn(
                            "flex items-baseline gap-4 py-1.5 text-headline font-semibold transition-colors",
                            activeHref === item.href ? "text-foreground" : "text-muted-foreground",
                          )}
                          initial={reduceMotion ? false : { y: "100%" }}
                          animate={{ y: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.2 + i * 0.05,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <span className="font-mono text-xs font-normal text-muted-foreground">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {item.label}
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </nav>

                {footer && (
                  <motion.div
                    className="px-3"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {footer}
                  </motion.div>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
