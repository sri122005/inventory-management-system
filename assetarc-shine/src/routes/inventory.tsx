import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Boxes, Eye, PackageX, Pencil, Plus, RefreshCw, Trash2, Warehouse as WarehouseIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DataTable, type Column } from "@/components/common/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import { ALL, FilterSelect } from "@/components/common/FilterSelect";
import { DetailRow, SelectField, TextField } from "@/components/common/FormFields";
import { FormDrawer } from "@/components/common/FormDrawer";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchBar } from "@/components/common/SearchBar";
import { StatCard } from "@/components/common/StatCard";
import { StockBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useResourceList, useResourceMutations } from "@/hooks/useResource";
import { formatDateTime, formatNumber } from "@/lib/format";
import { getId, getName, getRefId, pick, type Record_ } from "@/lib/records";
import { resolveKey } from "@/lib/schema";
import { indexById, labelFor, minimumStockOf, quantityOf, stockStatus } from "@/lib/stock";
import { getRefName } from "@/lib/records";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — StockFlow" },
      { name: "description", content: "Live stock levels per product and warehouse with low-stock alerts." },
      { property: "og:title", content: "Inventory — StockFlow" },
      { property: "og:description", content: "Live stock levels per product and warehouse with low-stock alerts." },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const inventory = useResourceList("inventory");
  const products = useResourceList("products");
  const warehouses = useResourceList("warehouses");

  const rows = useMemo(() => inventory.data ?? [], [inventory.data]);
  const productRows = useMemo(() => products.data ?? [], [products.data]);
  const warehouseRows = useMemo(() => warehouses.data ?? [], [warehouses.data]);

  const productIndex = useMemo(() => indexById(productRows, "product"), [productRows]);
  const warehouseIndex = useMemo(() => indexById(warehouseRows, "warehouse"), [warehouseRows]);

  const keys = useMemo(
    () => ({
      quantity: resolveKey(rows, ["quantity", "qty", "stock"]),
      product: resolveKey(rows, ["productId", "product_id"]),
      warehouse: resolveKey(rows, ["warehouseId", "warehouse_id"]),
    }),
    [rows],
  );

  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search);
  const [warehouseFilter, setWarehouseFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [drawer, setDrawer] = useState<{ mode: "create" | "edit" | "view"; row: Record_ | null } | null>(null);
  const [form, setForm] = useState({ product: "", warehouse: "", quantity: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<Record_ | null>(null);

  const { save, remove } = useResourceMutations("inventory", {
    successMessage: "Inventory record created successfully",
    onDone: () => setDrawer(null),
  });

  const productLabel = (row: Record_) =>
    labelFor(row, "product", productIndex, getRefName(row, "product"));
  const warehouseLabel = (row: Record_) =>
    labelFor(row, "warehouse", warehouseIndex, getRefName(row, "warehouse"));

  const minimumFor = (row: Record_) => {
    const id = getRefId(row, "product");
    return minimumStockOf(id ? productIndex.get(id) : undefined);
  };

  const statusFor = (row: Record_) => stockStatus(quantityOf(row), minimumFor(row));

  const summary = useMemo(() => {
    let total = 0;
    let low = 0;
    let out = 0;
    const usedWarehouses = new Set<string>();
    rows.forEach((row) => {
      total += quantityOf(row) ?? 0;
      const status = statusFor(row);
      if (status === "low") low += 1;
      if (status === "out") out += 1;
      const warehouseId = getRefId(row, "warehouse");
      if (warehouseId) usedWarehouses.add(warehouseId);
    });
    return {
      total,
      low,
      out,
      warehouses: warehouseRows.length || usedWarehouses.size,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, productIndex, warehouseRows.length]);

  const filtered = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    return rows.filter((row) => {
      if (warehouseFilter !== ALL && getRefId(row, "warehouse") !== warehouseFilter) return false;
      if (statusFilter !== ALL && statusFor(row) !== statusFilter) return false;
      if (!term) return true;
      return (
        productLabel(row).toLowerCase().includes(term) ||
        warehouseLabel(row).toLowerCase().includes(term) ||
        Object.values(row).some((value) =>
          value !== null && typeof value !== "object"
            ? String(value).toLowerCase().includes(term)
            : false,
        )
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, debounced, warehouseFilter, statusFilter, productIndex, warehouseIndex]);

  const openCreate = () => {
    setForm({ product: "", warehouse: "", quantity: "" });
    setErrors({});
    setDrawer({ mode: "create", row: null });
  };

  const openEdit = (row: Record_) => {
    setForm({
      product: getRefId(row, "product") ?? "",
      warehouse: getRefId(row, "warehouse") ?? "",
      quantity: String(quantityOf(row) ?? ""),
    });
    setErrors({});
    setDrawer({ mode: "edit", row });
  };

  const submit = () => {
    const next: Record<string, string> = {};
    if (!form.product) next["product"] = "Select a product";
    if (!form.warehouse) next["warehouse"] = "Select a warehouse";
    if (form.quantity.trim() === "") next["quantity"] = "Quantity is required";
    else if (Number.isNaN(Number(form.quantity)) || Number(form.quantity) < 0)
      next["quantity"] = "Quantity must be a positive number";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const asId = (value: string) => (Number.isNaN(Number(value)) ? value : Number(value));
    const payload: Record_ = {
      [keys.product]: asId(form.product),
      [keys.warehouse]: asId(form.warehouse),
      [keys.quantity]: Number(form.quantity),
    };
    const id = drawer?.row ? getId(drawer.row, "inventory") : undefined;
    if (id) payload["id"] = asId(id);
    save.mutate({ id, payload });
  };

  const columns: Column<Record_>[] = [
    {
      key: "id",
      header: "ID",
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">{getId(row, "inventory") ?? "—"}</span>
      ),
    },
    { key: "product", header: "Product", render: (row) => <span className="font-medium">{productLabel(row)}</span> },
    { key: "warehouse", header: "Warehouse", render: warehouseLabel },
    { key: "quantity", header: "Quantity", align: "right", render: (row) => formatNumber(quantityOf(row)) },
    {
      key: "updated",
      header: "Last Updated",
      render: (row) =>
        formatDateTime(pick(row, ["lastUpdated", "last_updated", "updatedAt", "updated_at", "modifiedAt"])),
    },
    { key: "status", header: "Stock Status", render: (row) => <StockBadge status={statusFor(row)} /> },
  ];

  const detailRow = drawer?.row;
  const detailQuantity = detailRow ? (quantityOf(detailRow) ?? 0) : 0;
  const detailMinimum = detailRow ? minimumFor(detailRow) : undefined;
  const progress =
    detailMinimum && detailMinimum > 0
      ? Math.min(100, Math.round((detailQuantity / (detailMinimum * 2)) * 100))
      : detailQuantity > 0
        ? 100
        : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Live stock positions across every warehouse."
        actions={
          <>
            <Button variant="outline" onClick={() => inventory.refetch()} disabled={inventory.isFetching}>
              <RefreshCw className={`size-4 ${inventory.isFetching ? "animate-spin" : ""}`} />
              {inventory.isFetching ? "Refreshing..." : "Refresh"}
            </Button>
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Add Record
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Boxes} label="Total Stock" value={formatNumber(summary.total)} hint="Units across all warehouses" loading={inventory.isLoading} />
        <StatCard icon={AlertTriangle} label="Low Stock" value={formatNumber(summary.low)} hint="At or below minimum stock" loading={inventory.isLoading} />
        <StatCard icon={PackageX} label="Out of Stock" value={formatNumber(summary.out)} hint="Records with zero quantity" loading={inventory.isLoading} />
        <StatCard icon={WarehouseIcon} label="Warehouses" value={formatNumber(summary.warehouses)} hint="Active storage locations" loading={warehouses.isLoading} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search inventory..." />
        <FilterSelect
          value={warehouseFilter}
          onChange={setWarehouseFilter}
          placeholder="All warehouses"
          options={warehouseRows.map((row) => ({
            value: getId(row, "warehouse") ?? "",
            label: getName(row, "warehouse"),
          }))}
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="All statuses"
          options={[
            { value: "healthy", label: "Healthy" },
            { value: "low", label: "Low Stock" },
            { value: "out", label: "Out of Stock" },
          ]}
        />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={inventory.isLoading}
        error={inventory.error}
        onRetry={() => inventory.refetch()}
        rowKey={(row, index) => getId(row, "inventory") ?? String(index)}
        emptyState={
          <EmptyState
            icon={Boxes}
            title="No inventory records found"
            description="Record stock for a product and warehouse to get started."
            action={
              <Button onClick={openCreate}>
                <Plus className="size-4" />
                Add Record
              </Button>
            }
          />
        }
        actions={(row) => [
          { label: "View", icon: <Eye className="size-4" />, onSelect: () => setDrawer({ mode: "view", row }) },
          { label: "Edit", icon: <Pencil className="size-4" />, onSelect: () => openEdit(row) },
          {
            label: "Delete",
            icon: <Trash2 className="size-4" />,
            destructive: true,
            onSelect: () => setPendingDelete(row),
          },
        ]}
      />

      <FormDrawer
        open={drawer !== null}
        onOpenChange={(open) => (open ? null : setDrawer(null))}
        title={
          drawer?.mode === "create"
            ? "Add Inventory Record"
            : drawer?.mode === "edit"
              ? "Edit Inventory Record"
              : "Inventory details"
        }
        description={
          drawer?.mode === "view"
            ? "Stock position for this product and warehouse."
            : "Purchases and sales update stock automatically — edit here only to correct a record."
        }
        readOnly={drawer?.mode === "view"}
        submitting={save.isPending}
        onSubmit={submit}
        submitLabel={drawer?.mode === "edit" ? "Save changes" : "Create record"}
      >
        {drawer?.mode === "view" && detailRow ? (
          <div className="space-y-6">
            <div>
              <DetailRow label="Product" value={productLabel(detailRow)} />
              <DetailRow label="Warehouse" value={warehouseLabel(detailRow)} />
              <DetailRow label="Current quantity" value={formatNumber(detailQuantity)} />
              <DetailRow label="Minimum stock" value={detailMinimum === undefined ? "—" : formatNumber(detailMinimum)} />
              <DetailRow label="Stock status" value={<StockBadge status={statusFor(detailRow)} />} />
              <DetailRow
                label="Last updated"
                value={formatDateTime(
                  pick(detailRow, ["lastUpdated", "last_updated", "updatedAt", "updated_at"]),
                )}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stock level</span>
                <span className="font-medium">{formatNumber(detailQuantity)} units</span>
              </div>
              <Progress value={progress} />
            </div>
          </div>
        ) : (
          <>
            <SelectField
              label="Product"
              required
              value={form.product}
              error={errors["product"]}
              disabled={products.isLoading}
              options={productRows.map((row) => ({
                value: getId(row, "product") ?? "",
                label: getName(row, "product"),
              }))}
              onChange={(value) => setForm((prev) => ({ ...prev, product: value }))}
            />
            <SelectField
              label="Warehouse"
              required
              value={form.warehouse}
              error={errors["warehouse"]}
              disabled={warehouses.isLoading}
              options={warehouseRows.map((row) => ({
                value: getId(row, "warehouse") ?? "",
                label: getName(row, "warehouse"),
              }))}
              onChange={(value) => setForm((prev) => ({ ...prev, warehouse: value }))}
            />
            <TextField
              label="Quantity"
              required
              type="number"
              min="0"
              value={form.quantity}
              error={errors["quantity"]}
              placeholder="0"
              onChange={(value) => setForm((prev) => ({ ...prev, quantity: value }))}
            />
          </>
        )}
      </FormDrawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => (open ? null : setPendingDelete(null))}
        description="This will permanently delete this inventory record. This action cannot be undone."
        loading={remove.isPending}
        onConfirm={() => {
          const id = getId(pendingDelete, "inventory");
          if (!id) return;
          remove.mutate(id, { onSettled: () => setPendingDelete(null) });
        }}
      />
    </div>
  );
}
