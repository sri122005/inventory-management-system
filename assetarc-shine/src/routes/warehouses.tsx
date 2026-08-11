import { createFileRoute } from "@tanstack/react-router";
import { Warehouse } from "lucide-react";

import { SimpleCrudPage } from "@/components/crud/SimpleCrudPage";

export const Route = createFileRoute("/warehouses")({
  head: () => ({
    meta: [
      { title: "Warehouses — StockFlow Inventory" },
      { name: "description", content: "Manage the storage locations that hold your inventory." },
      { property: "og:title", content: "Warehouses — StockFlow Inventory" },
      { property: "og:description", content: "Manage the storage locations that hold your inventory." },
    ],
  }),
  component: WarehousesPage,
});

function WarehousesPage() {
  return (
    <SimpleCrudPage
      entity="warehouses"
      singular="Warehouse"
      title="Warehouses"
      description="Every location where your stock is physically stored."
      icon={Warehouse}
      fallbackFields={["name", "location"]}
    />
  );
}
