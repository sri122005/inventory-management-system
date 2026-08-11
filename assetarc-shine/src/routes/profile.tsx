import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/common/PageHeader";
import { DetailRow } from "@/components/common/FormFields";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — StockFlow Inventory" },
      { name: "description", content: "Your workspace profile inside the inventory dashboard." },
      { property: "og:title", content: "Profile — StockFlow Inventory" },
      { property: "og:description", content: "Your workspace profile inside the inventory dashboard." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Workspace account details." />
      <section className="max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              AK
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-foreground">Inventory Manager</p>
            <p className="truncate text-sm text-muted-foreground">Local workspace user</p>
          </div>
        </div>
        <div className="mt-6">
          <DetailRow label="Role" value="Administrator" />
          <DetailRow label="Authentication" value="Not enabled on the backend" />
          <DetailRow label="Workspace" value="StockFlow Inventory" />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          This screen reflects local workspace settings only — the Spring Boot API does not expose
          user accounts.
        </p>
      </section>
    </div>
  );
}
