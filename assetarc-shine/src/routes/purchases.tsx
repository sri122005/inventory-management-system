import { createFileRoute } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

import { TransactionPage } from "@/components/crud/TransactionPage";

export const Route = createFileRoute("/purchases")({
  head: () => ({
    meta: [
      { title: "Purchases — StockFlow" },
      { name: "description", content: "Record supplier purchases and keep incoming stock in sync." },
      { property: "og:title", content: "Purchases — StockFlow" },
      { property: "og:description", content: "Record supplier purchases and keep incoming stock in sync." },
    ],
  }),
  component: PurchasesPage,
});

function PurchasesPage() {
  return (
    <TransactionPage
      entity="purchases"
      singular="Purchase"
      title="Purchases"
      description="Incoming stock from your suppliers."
      icon={ShoppingCart}
      withSupplier
      priceLabel="Purchase Price"
      priceAliases={["purchasePrice", "purchase_price", "unitPrice", "unit_price", "price", "cost"]}
      dateAliases={["purchaseDate", "purchase_date", "date", "createdAt", "created_at"]}
      successToast="Purchase recorded — inventory increased"
      formNote="Recording a purchase increases stock for the selected product and warehouse."
    />
  );
}
