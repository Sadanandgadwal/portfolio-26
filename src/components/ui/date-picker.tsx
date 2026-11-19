"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover } from "radix-ui";
import { IconButton } from "@/components/ui/icon-button";
import {
  WEEKDAYS,
  addDays,
  addMonths,
  formatLong,
  monthGrid,
  monthLabel,
  sameMonth,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";

type DatePickerProps = {
  id: string;
  value: string;
  onChange: (iso: string) => void;
  /** Month shown when no value is set ("YYYY-MM-DD"). */
  defaultMonth: string;
  placeholder?: string;
  /** id of the visible <label>; the trigger is then named "label + selected value". */
  labelId?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

const KEY_DELTA: Record<string, (iso: string) => string> = {
  ArrowLeft: (d) => addDays(d, -1),
  ArrowRight: (d) => addDays(d, 1),
  ArrowUp: (d) => addDays(d, -7),
  ArrowDown: (d) => addDays(d, 7),
  PageUp: (d) => addMonths(d, -1),
  PageDown: (d) => addMonths(d, 1),
};

/** Popover calendar (WAI-ARIA date grid): arrows move by day/week, PageUp/Down by month, Enter selects. */
export function DatePicker({
  id,
  value,
  onChange,
  defaultMonth,
  placeholder = "Pick a date",
  labelId,
  ...aria
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(value || defaultMonth);
  const gridRef = useRef<HTMLTableElement>(null);

  const focusCell = (iso: string) =>
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`)?.focus();

  // Keep DOM focus on the roving cell as the focused date changes.
  useEffect(() => {
    if (open)
      gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)?.focus();
  }, [open, focused]);

  const onKeyDown = (e: KeyboardEvent) => {
    const move = KEY_DELTA[e.key];
    if (!move) return;
    e.preventDefault();
    setFocused(move(focused));
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(o) => {
        if (o) setFocused(value || defaultMonth);
        setOpen(o);
      }}
    >
      <Popover.Trigger asChild>
        <button
          id={id}
          type="button"
          className="flex h-11 w-full items-center gap-2 rounded-lg border border-border-strong px-3 text-left text-sm aria-invalid:border-destructive"
          aria-labelledby={labelId ? `${labelId} ${id}-value` : undefined}
          {...aria}
        >
          <CalendarDays aria-hidden className="size-4 text-muted-foreground" />
          <span id={`${id}-value`} className={cn(!value && "text-muted-foreground")}>
            {value ? formatLong(value) : placeholder}
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          onOpenAutoFocus={(e) => {
            e.preventDefault(); // focus the date cell, not the first button
            focusCell(focused);
          }}
          className="z-90 w-72 rounded-xl border bg-popover p-3 shadow-lg data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div className="mb-2 flex items-center justify-between">
            <IconButton
              aria-label="Previous month"
              size="sm"
              onClick={() => setFocused(addMonths(focused, -1))}
            >
              <ChevronLeft />
            </IconButton>
            <p className="text-sm font-medium" aria-live="polite" id={`${id}-month`}>
              {monthLabel(focused)}
            </p>
            <IconButton
              aria-label="Next month"
              size="sm"
              onClick={() => setFocused(addMonths(focused, 1))}
            >
              <ChevronRight />
            </IconButton>
          </div>
          <table
            ref={gridRef}
            role="grid"
            aria-labelledby={`${id}-month`}
            className="w-full"
            onKeyDown={onKeyDown}
          >
            <thead>
              <tr>
                {WEEKDAYS.map((d) => (
                  <th
                    key={d}
                    scope="col"
                    className="pb-1 font-mono text-[10px] font-normal text-muted-foreground"
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthGrid(focused).map((week) => (
                <tr key={week[0]}>
                  {week.map((day) => {
                    const selected = day === value;
                    const inMonth = sameMonth(day, focused);
                    return (
                      <td
                        key={day}
                        role="gridcell"
                        aria-selected={selected}
                        className="p-0.5 text-center"
                      >
                        <button
                          type="button"
                          data-date={day}
                          tabIndex={day === focused ? 0 : -1}
                          aria-label={formatLong(day)}
                          onClick={() => {
                            onChange(day);
                            setOpen(false);
                          }}
                          className={cn(
                            "size-9 rounded-md text-sm transition-colors hover:bg-subtle",
                            !inMonth && "text-muted-foreground/50",
                            selected && "bg-foreground text-background hover:bg-foreground",
                          )}
                        >
                          {Number(day.slice(8))}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
