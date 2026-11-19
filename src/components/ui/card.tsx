import * as React from "react";
import { cn } from "@/lib/utils";

type CardProps = React.ComponentProps<"div"> & {
  size?: "default" | "sm";
  /** Lift + stronger border on hover/focus-within. */
  interactive?: boolean;
};

function Card({ className, size = "default", interactive = false, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-interactive={interactive || undefined}
      className={cn(
        "group/card relative flex flex-col gap-(--card-spacing) rounded-xl border bg-card py-(--card-spacing) text-sm text-card-foreground",
        "[--card-spacing:--spacing(6)] data-[size=sm]:[--card-spacing:--spacing(4)]",
        "data-interactive:transition-[border-color,box-shadow,transform] data-interactive:duration-300 data-interactive:ease-out-expo",
        "data-interactive:focus-within:border-border-strong data-interactive:focus-within:shadow-md data-interactive:hover:-translate-y-0.5 data-interactive:hover:border-border-strong data-interactive:hover:shadow-md",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min items-start gap-1.5 px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "text-lg leading-snug font-medium tracking-tight group-data-[size=sm]/card:text-base",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("px-(--card-spacing)", className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-3 border-t px-(--card-spacing) pt-(--card-spacing)",
        className,
      )}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
