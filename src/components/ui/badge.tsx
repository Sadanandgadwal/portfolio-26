import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex h-6 w-fit shrink-0 items-center gap-1.5 rounded-sm border px-2 font-mono text-xs whitespace-nowrap",
    "transition-colors duration-150 [&>svg]:pointer-events-none [&>svg]:size-3",
  ],
  {
    variants: {
      variant: {
        outline:
          "border-border text-muted-foreground [a&]:hover:border-border-strong [a&]:hover:text-foreground",
        secondary: "border-transparent bg-subtle text-foreground",
        solid: "border-transparent bg-foreground text-background",
      },
    },
    defaultVariants: { variant: "outline" },
  },
);

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    /** Leading signal dot (status indicators). */
    dot?: boolean;
  };

function Badge({
  className,
  variant,
  asChild = false,
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span";
  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && !asChild && <span aria-hidden className="size-1.5 rounded-full bg-signal" />}
      {children}
    </Comp>
  );
}

export { Badge, badgeVariants };
