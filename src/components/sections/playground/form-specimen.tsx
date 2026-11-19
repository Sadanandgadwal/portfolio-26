"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CircleCheck } from "lucide-react";
// zod/mini: tree-shakable build for the browser (full zod stays server-side for content).
import { z } from "zod/mini";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Values = { name: string; email: string; role: string };
type Field = keyof Values;

const schemaFor = (roles: string[]) =>
  z.object({
    name: z.string().check(z.trim(), z.minLength(2, "Enter at least 2 characters.")),
    email: z.email("Enter a valid email address."),
    role: z.string().check(z.refine((r) => roles.includes(r), "Choose a role.")),
  });

const EMPTY: Values = { name: "", email: "", role: "" };

/** Validates on blur, then live; full validation on submit. Errors are linked via aria-describedby. */
export function FormSpecimen({ roles }: { roles: string[] }) {
  const uid = useId();
  const schema = schemaFor(roles);
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const result = schema.safeParse(values);
  const errors: Partial<Record<Field, string>> = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = issue.path[0] as Field;
      errors[key] ??= issue.message;
    }
  }
  const errorFor = (f: Field) => (touched[f] ? errors[f] : undefined);
  const set = (f: Field, v: string) => setValues((prev) => ({ ...prev, [f]: v }));
  const fieldProps = (f: Field) => ({
    id: `${uid}-${f}`,
    "aria-invalid": errorFor(f) ? true : undefined,
    "aria-describedby": errorFor(f) ? `${uid}-${f}-error` : undefined,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, role: true });
    if (!result.success) {
      const first = result.error.issues[0]?.path[0] as Field | undefined;
      if (first) document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setStatus("submitting");
    timer.current = window.setTimeout(() => setStatus("success"), 900);
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="grid flex-1 place-content-center justify-items-center gap-3 text-center"
      >
        <CircleCheck aria-hidden className="size-8" />
        <p className="font-medium">Thanks, {values.name.trim()}.</p>
        <p className="text-sm text-muted-foreground">Sample form. Nothing was sent anywhere.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setValues(EMPTY);
            setTouched({});
            setStatus("idle");
          }}
        >
          Reset
        </Button>
      </div>
    );
  }

  const error = (f: Field) =>
    errorFor(f) && (
      <p id={`${uid}-${f}-error`} className="text-sm text-destructive">
        {errorFor(f)}
      </p>
    );

  return (
    <form
      noValidate
      onSubmit={submit}
      className="grid gap-4 sm:grid-cols-2"
      aria-label="Sample sign-up form"
    >
      <div className="grid gap-1.5">
        <Label htmlFor={`${uid}-name`}>Name</Label>
        <Input
          {...fieldProps("name")}
          autoComplete="off"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
        />
        {error("name")}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${uid}-email`}>Email</Label>
        <Input
          {...fieldProps("email")}
          type="email"
          autoComplete="off"
          placeholder="you@example.com"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        />
        {error("email")}
      </div>
      <div className="grid gap-1.5 sm:col-span-2">
        <Label htmlFor={`${uid}-role`}>Role</Label>
        <Select
          value={values.role}
          onValueChange={(v) => {
            set("role", v);
            setTouched((t) => ({ ...t, role: true }));
          }}
          onOpenChange={(open) => !open && setTouched((t) => ({ ...t, role: true }))}
        >
          <SelectTrigger {...fieldProps("role")} className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error("role")}
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" loading={status === "submitting"} className="w-full sm:w-auto">
          Create account
        </Button>
      </div>
    </form>
  );
}
