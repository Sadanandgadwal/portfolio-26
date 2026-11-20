"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ComboboxProps = {
  id: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  onBlur?: () => void;
};

/** WAI-ARIA combobox with list autocomplete. Only listed options can be committed. */
export function Combobox({
  id,
  options,
  value,
  onChange,
  placeholder,
  onBlur,
  ...aria
}: ComboboxProps) {
  const listId = useId();
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const q = query.trim().toLowerCase();
  const matches =
    q && q !== value.toLowerCase() ? options.filter((o) => o.toLowerCase().includes(q)) : options;
  const optionId = (i: number) => `${listId}-opt-${i}`;

  const commit = (option: string) => {
    onChange(option);
    setQuery(option);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return setOpen(true);
      const delta = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => (matches.length ? (a + delta + matches.length) % matches.length : 0));
    } else if (e.key === "Enter" && open && matches[active]) {
      e.preventDefault();
      commit(matches[active]);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && matches[active] ? optionId(active) : undefined}
        autoComplete="off"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
          if (value) onChange(""); // editing invalidates the committed value
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onBlur={() => {
          const exact = options.find((o) => o.toLowerCase() === q);
          if (exact && exact !== value) commit(exact);
          setOpen(false);
          onBlur?.();
        }}
        onKeyDown={onKeyDown}
        className="h-11 w-full rounded-lg border border-border-strong bg-transparent pr-9 pl-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring aria-invalid:border-destructive"
        {...aria}
      />
      <ChevronsUpDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-1 max-h-56 overflow-auto rounded-lg border bg-popover p-1 shadow-md"
        >
          {matches.length === 0 && (
            <li className="px-2.5 py-2 text-sm text-muted-foreground">No matches</li>
          )}
          {matches.map((o, i) => (
            <li
              key={o}
              id={optionId(i)}
              role="option"
              aria-selected={o === value}
              onMouseDown={(e) => e.preventDefault()} // keep focus in the input
              onClick={() => commit(o)}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "flex cursor-default items-center justify-between rounded-md px-2.5 py-2 text-sm",
                i === active && "bg-subtle",
              )}
            >
              {o}
              {o === value && <Check aria-hidden className="size-4" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
