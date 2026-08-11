import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/common/PageHeader";
import { DetailRow } from "@/components/common/FormFields";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — StockFlow Inventory" },
      { name: "description", content: "Configure appearance and review the connected Spring Boot API." },
      { property: "og:title", content: "Settings — StockFlow Inventory" },
      { property: "og:description", content: "Configure appearance and review the connected Spring Boot API." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Appearance and backend connection details." />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Appearance</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your theme preference is stored on this device.
          </p>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <span className="text-sm font-medium capitalize">{theme} mode</span>
            <Button variant="outline" onClick={toggle}>
              Switch to {theme === "dark" ? "light" : "dark"}
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">API connection</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All data is served by your existing Spring Boot application.
          </p>
          <div className="mt-3">
            <DetailRow label="Base URL" value={<span className="font-mono text-xs">{API_BASE_URL}</span>} />
            <DetailRow label="Configured via" value={<span className="font-mono text-xs">VITE_API_BASE_URL</span>} />
            <DetailRow label="Transport" value="REST over HTTP" />
          </div>
          <p className="mt-4 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
            If requests fail with a CORS error, allow this origin in Spring Boot — e.g. add
            <span className="font-mono"> @CrossOrigin(origins = "*") </span> on your controllers or a
            global <span className="font-mono">WebMvcConfigurer</span> CORS mapping.
          </p>
        </section>
      </div>
    </div>
  );
}
