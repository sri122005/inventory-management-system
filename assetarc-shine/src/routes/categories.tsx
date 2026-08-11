import { createFileRoute } from "@tanstack/react-router";
import { Tags } from "lucide-react";

import { SimpleCrudPage } from "@/components/crud/SimpleCrudPage";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — StockFlow Inventory" },
      { name: "description", content: "Create and organise the product categories in your catalogue." },
      { property: "og:title", content: "Categories — StockFlow Inventory" },
      { property: "og:description", content: "Create and organise the product categories in your catalogue." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <SimpleCrudPage
      entity="categories"
      singular="Category"
      title="Categories"
      description="Group your products for faster reporting and filtering."
      icon={Tags}
      fallbackFields={["name", "description"]}
    />
  );
}
