import { cn } from "@/lib/utils";

export type StockStatus = "healthy" | "low" | "out" | "unknown";

const statusStyles: Record<string, string> = {
  healthy: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400",
  low: "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400",
  out: "bg-destructive/10 text-destructive ring-destructive/20",
  neutral: "bg-muted text-muted-foreground ring-border",
  active: "bg-primary/10 text-primary ring-primary/20",
};

const labels: Record<StockStatus, string> = {
  healthy: "Healthy",
  low: "Low Stock",
  out: "Out of Stock",
  unknown: "Unknown",
};

export function StockBadge({ status }: { status: StockStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        statusStyles[status === "unknown" ? "neutral" : status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}

export function StatusBadge({ value }: { value?: string | null }) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  const normalized = value.toLowerCase();
  const tone =
    normalized.includes("active") || normalized === "true" || normalized === "available"
      ? "active"
      : normalized.includes("inactive") || normalized === "false"
        ? "out"
        : "neutral";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset",
        statusStyles[tone],
      )}
    >
      {value}
    </span>
  );
}
