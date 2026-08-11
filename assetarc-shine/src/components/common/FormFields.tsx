import type { ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean | undefined;
  error?: string | undefined;
  hint?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  error,
  required,
  hint,
  type = "text",
  placeholder,
  step,
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  required?: boolean | undefined;
  hint?: string | undefined;
  type?: string | undefined;
  placeholder?: string | undefined;
  step?: string | undefined;
  min?: string | undefined;
}) {
  return (
    <Field label={label} required={required} error={error} hint={hint}>
      <Input
        type={type}
        value={value}
        step={step}
        min={min}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(error && "border-destructive focus-visible:ring-destructive/30")}
      />
    </Field>
  );
}

export type Option = { value: string; label: string };

export function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  required,
  hint,
  placeholder = "Select an option",
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  error?: string | undefined;
  required?: boolean | undefined;
  hint?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
}) {
  return (
    <Field label={label} required={required} error={error} hint={hint}>
      <Select value={value} onValueChange={onChange} disabled={disabled ?? false}>
        <SelectTrigger
          className={cn("w-full", error && "border-destructive focus-visible:ring-destructive/30")}
        >
          <SelectValue placeholder={disabled ? "Loading..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.length === 0 ? (
            <div className="px-2 py-3 text-sm text-muted-foreground">No options available</div>
          ) : (
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </Field>
  );
}

export function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
