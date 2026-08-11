import { createFileRoute } from "@tanstack/react-router";
import { Truck } from "lucide-react";

import { SimpleCrudPage } from "@/components/crud/SimpleCrudPage";

export const Route = createFileRoute("/suppliers")({
  head: () => ({
    meta: [
      { title: "Suppliers — StockFlow Inventory" },
      { name: "description", content: "Maintain supplier contacts and manage incoming stock partners." },
      { property: "og:title", content: "Suppliers — StockFlow Inventory" },
      { property: "og:description", content: "Maintain supplier contacts and manage incoming stock partners." },
    ],
  }),
  component: SuppliersPage,
});

function SuppliersPage() {
  return (
    <SimpleCrudPage
      entity="suppliers"
      singular="Supplier"
      title="Suppliers"
      description="Keep track of the partners who supply your inventory."
      icon={Truck}
      fallbackFields={["name", "email", "phone", "address"]}
    />
  );
}
