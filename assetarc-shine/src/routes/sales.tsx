import { createFileRoute } from "@tanstack/react-router";
import { Receipt } from "lucide-react";

import { TransactionPage } from "@/components/crud/TransactionPage";

export const Route = createFileRoute("/sales")({
  head: () => ({
    meta: [
      { title: "Sales — StockFlow" },
      { name: "description", content: "Record customer sales and automatically draw down stock." },
      { property: "og:title", content: "Sales — StockFlow" },
      { property: "og:description", content: "Record customer sales and automatically draw down stock." },
    ],
  }),
  component: SalesPage,
});

function SalesPage() {
  return (
    <TransactionPage
      entity="sales"
      singular="Sale"
      title="Sales"
      description="Outgoing stock sold to your customers."
      icon={Receipt}
      withSupplier={false}
      priceLabel="Selling Price"
      priceAliases={["sellingPrice", "selling_price", "unitPrice", "unit_price", "price"]}
      dateAliases={["saleDate", "sale_date", "date", "createdAt", "created_at"]}
      successToast="Sale recorded — inventory reduced"
      formNote="Recording a sale reduces stock. The server rejects sales that exceed available quantity."
    />
  );
}
