import type { OrderStatus } from "@/lib/showcase/orders";
import { STATUS_DOT } from "@/lib/showcase/orders";
import { cn } from "@/lib/utils";

export function OrderStatusLabel({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 capitalize",
        status === "cancelled" && "text-muted-foreground",
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", STATUS_DOT[status])} />
      {status}
    </span>
  );
}
