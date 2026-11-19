"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { CircleCheck } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatLong, isWeekend } from "@/lib/calendar";

type Values = { company: string; email: string; country: string; start: string; notes: string };
type Field = keyof Values;
const EMPTY: Values = { company: "", email: "", country: "", start: "", notes: "" };
const NOTES_MAX = 160;
const LABELS: Record<Field, string> = {
  company: "Company",
  email: "Billing email",
  country: "Country",
  start: "Contract start",
  notes: "Notes",
};

const schemaFor = (countries: string[]) =>
  z.object({
    company: z.string().trim().min(2, "Company name is required."),
    email: z.email("Enter a valid billing email."),
    country: z.string().refine((c) => countries.includes(c), "Choose a country from the list."),
    start: z
      .string()
      .min(1, "Pick a contract start date.")
      .refine((d) => !d || !isWeekend(d), "Contracts can only start on a weekday."),
    notes: z.string().max(NOTES_MAX, `Keep notes under ${NOTES_MAX} characters.`),
  });

type CustomerFormViewProps = { countries: string[]; defaultMonth: string };

/** Enterprise form: autocomplete, date picker, inline errors and an error summary on submit. */
export function CustomerFormView({ countries, defaultMonth }: CustomerFormViewProps) {
  const uid = useId();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);

  const result = schemaFor(countries).safeParse(values);
  const errors: Partial<Record<Field, string>> = {};
  if (!result.success)
    for (const i of result.error.issues) errors[i.path[0] as Field] ??= i.message;
  const shown = (f: Field) => (touched[f] || submitted ? errors[f] : undefined);

  const idOf = (f: Field) => `${uid}-${f}`;
  const set = (f: Field, v: string) => setValues((p) => ({ ...p, [f]: v }));
  const touch = (f: Field) => setTouched((t) => ({ ...t, [f]: true }));
  const a11y = (f: Field) => ({
    "aria-invalid": shown(f) ? true : undefined,
    "aria-describedby": shown(f) ? `${idOf(f)}-error` : undefined,
  });
  const error = (f: Field) =>
    shown(f) && (
      <p id={`${idOf(f)}-error`} className="text-xs text-destructive">
        {shown(f)}
      </p>
    );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (result.success) setDone(true);
    else requestAnimationFrame(() => summaryRef.current?.focus());
  };

  if (done) {
    return (
      <div
        role="status"
        className="grid place-items-center gap-3 rounded-xl border bg-surface p-8 text-center"
      >
        <CircleCheck aria-hidden className="size-8" />
        <p className="font-medium">{values.company.trim()} added</p>
        <p className="text-sm text-muted-foreground">
          {values.country} · starts {formatLong(values.start)} (sample, nothing saved)
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setValues(EMPTY);
            setTouched({});
            setSubmitted(false);
            setDone(false);
          }}
        >
          Add another
        </Button>
      </div>
    );
  }

  const errorList = Object.entries(errors) as [Field, string][];

  return (
    <form
      noValidate
      onSubmit={submit}
      aria-label="New customer"
      className="grid gap-4 rounded-xl border bg-surface p-4 @xl/app:p-6"
    >
      <h4 className="text-lg font-semibold tracking-tight">New customer</h4>

      {submitted && errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm outline-none"
        >
          <p className="font-medium">
            Fix {errorList.length === 1 ? "1 field" : `${errorList.length} fields`} to continue:
          </p>
          <ul className="mt-1 list-inside list-disc text-muted-foreground">
            {errorList.map(([f, msg]) => (
              <li key={f}>
                <a
                  href={`#${idOf(f)}`}
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  {LABELS[f]}
                </a>
                : {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 @xl/app:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor={idOf("company")}>{LABELS.company}</Label>
          <Input
            id={idOf("company")}
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
            onBlur={() => touch("company")}
            {...a11y("company")}
          />
          {error("company")}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={idOf("email")}>{LABELS.email}</Label>
          <Input
            id={idOf("email")}
            type="email"
            placeholder="billing@example.com"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => touch("email")}
            {...a11y("email")}
          />
          {error("email")}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={idOf("country")}>{LABELS.country}</Label>
          <Combobox
            id={idOf("country")}
            options={countries}
            value={values.country}
            onChange={(v) => set("country", v)}
            onBlur={() => touch("country")}
            placeholder="Start typing…"
            {...a11y("country")}
          />
          {error("country")}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={idOf("start")} id={`${idOf("start")}-label`}>
            {LABELS.start}
          </Label>
          <DatePicker
            id={idOf("start")}
            value={values.start}
            onChange={(d) => {
              set("start", d);
              touch("start");
            }}
            defaultMonth={defaultMonth}
            labelId={`${idOf("start")}-label`}
            {...a11y("start")}
          />
          {error("start")}
        </div>
        <div className="grid gap-1.5 @xl/app:col-span-2">
          <div className="flex justify-between">
            <Label htmlFor={idOf("notes")}>
              {LABELS.notes} <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <span
              className={
                values.notes.length > NOTES_MAX
                  ? "text-xs text-destructive"
                  : "text-xs text-muted-foreground"
              }
              aria-live="polite"
            >
              {values.notes.length}/{NOTES_MAX}
            </span>
          </div>
          <textarea
            id={idOf("notes")}
            rows={3}
            value={values.notes}
            onChange={(e) => set("notes", e.target.value)}
            onBlur={() => touch("notes")}
            className="rounded-lg border border-border-strong bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring aria-invalid:border-destructive"
            {...a11y("notes")}
          />
          {error("notes")}
        </div>
      </div>
      <div>
        <Button type="submit">Add customer</Button>
      </div>
    </form>
  );
}
