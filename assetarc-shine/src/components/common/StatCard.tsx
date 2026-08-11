import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  trend,
  tone = "default",
  loading,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string | undefined;
  trend?: { value: string; positive: boolean } | undefined;
  tone?: "default" | "warning" | undefined;
  loading?: boolean | undefined;
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-xl transition-colors",
            tone === "warning"
              ? "bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-amber-950 dark:text-amber-400"
              : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
          )}
        >
          <Icon className="size-5" />
        </span>
        {trend ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              trend.positive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-destructive/10 text-destructive",
            )}
          >
            {trend.positive ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            {trend.value}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-24" />
      ) : (
        <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      )}
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
