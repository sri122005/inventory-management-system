import { MoreHorizontal, ServerCrash } from "lucide-react";
import type { ReactNode } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { TableSkeleton } from "@/components/common/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  align?: "left" | "right" | "center" | undefined;
  className?: string | undefined;
  render: (row: T) => ReactNode;
};

export type RowAction<T> = {
  label: string;
  icon?: ReactNode | undefined;
  destructive?: boolean | undefined;
  onSelect: (row: T) => void;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  error,
  onRetry,
  emptyState,
  actions,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  loading?: boolean | undefined;
  error?: unknown | undefined;
  onRetry?: (() => void) | undefined;
  emptyState: ReactNode;
  actions?: ((row: T) => RowAction<T>[]) | undefined;
}) {
  const totalColumns = columns.length + (actions ? 1 : 0);

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card">
        <EmptyState
          icon={ServerCrash}
          title="Couldn't load this data"
          description={
            error instanceof Error
              ? error.message
              : "Something went wrong while contacting the server."
          }
          action={
            onRetry ? (
              <Button variant="outline" onClick={onRetry}>
                Try again
              </Button>
            ) : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="max-h-[calc(100vh-20rem)] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    column.align === "right" && "text-right",
                    column.align === "center" && "text-center",
                    column.className,
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
              {actions ? (
                <TableHead className="w-16 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Actions
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton columns={totalColumns} />
            ) : rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={totalColumns} className="p-0">
                  {emptyState}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => {
                const rowActions = actions ? actions(row) : [];
                return (
                <TableRow
                  key={rowKey(row, index)}
                  className="transition-colors hover:bg-muted/50"
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn(
                        "whitespace-nowrap py-3 text-sm",
                        column.align === "right" && "text-right tabular-nums",
                        column.align === "center" && "text-center",
                        column.className,
                      )}
                    >
                      {column.render(row)}
                    </TableCell>
                  ))}
                  {actions ? (
                    <TableCell className="py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {rowActions.map((action) => (
                            <DropdownMenuItem
                              key={action.label}
                              onSelect={() => action.onSelect(row)}
                              className={cn(
                                "gap-2",
                                action.destructive && "text-destructive focus:text-destructive",
                              )}
                            >
                              {action.icon}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  ) : null}
                </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
