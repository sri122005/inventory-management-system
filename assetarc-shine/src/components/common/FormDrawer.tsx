import type { FormEvent, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/** Side drawer used for every create/edit form in the app. */
export function FormDrawer({
  open,
  onOpenChange,
  title,
  description,
  submitting,
  onSubmit,
  submitLabel = "Save",
  children,
  readOnly,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string | undefined;
  submitting?: boolean | undefined;
  onSubmit?: (() => void) | undefined;
  submitLabel?: string | undefined;
  children: ReactNode;
  readOnly?: boolean | undefined;
}) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle>{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6">{children}</div>
          <SheetFooter className="flex-row justify-end gap-2 border-t border-border px-6 py-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {readOnly ? "Close" : "Cancel"}
            </Button>
            {readOnly ? null : (
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : submitLabel}
              </Button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
