import { createFileRoute } from "@tanstack/react-router";
import { Eye, Package, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DataTable, type Column } from "@/components/common/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import { DetailRow, SelectField, TextField } from "@/components/common/FormFields";
import { FormDrawer } from "@/components/common/FormDrawer";
import { PageHeader } from "@/components/common/PageHeader";
import { ALL, FilterSelect } from "@/components/common/FilterSelect";
import { SearchBar } from "@/components/common/SearchBar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useResourceList, useResourceMutations } from "@/hooks/useResource";
import { formatCurrency, formatNumber } from "@/lib/format";
import { getId, getName, getRefId, getRefName, type Record_ } from "@/lib/records";
import { readValue, resolveKey } from "@/lib/schema";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — StockFlow Inventory" },
      { name: "description", content: "Manage your product catalogue, pricing and stock thresholds." },
      { property: "og:title", content: "Products — StockFlow Inventory" },
      { property: "og:description", content: "Manage your product catalogue, pricing and stock thresholds." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const products = useResourceList("products");
  const categories = useResourceList("categories");
  const suppliers = useResourceList("suppliers");

  const rows = useMemo(() => products.data ?? [], [products.data]);
  const categoryRows = useMemo(() => categories.data ?? [], [categories.data]);
  const supplierRows = useMemo(() => suppliers.data ?? [], [suppliers.data]);

  const keys = useMemo(
    () => ({
      name: resolveKey(rows, ["name", "productName", "product_name"]),
      sku: resolveKey(rows, ["sku"]),
      barcode: resolveKey(rows, ["barcode"]),
      purchasePrice: resolveKey(rows, ["purchasePrice", "purchase_price"]),
      sellingPrice: resolveKey(rows, ["sellingPrice", "selling_price"]),
      minimumStock: resolveKey(rows, ["minimumStock", "minimum_stock", "minStock"]),
      category: resolveKey(rows, ["categoryId", "category_id"]),
      supplier: resolveKey(rows, ["supplierId", "supplier_id"]),
      status: resolveKey(rows, ["status"]),
    }),
    [rows],
  );

  const categoryOptions = categoryRows.map((row) => ({
    value: getId(row, "category") ?? "",
    label: getName(row, "category"),
  }));
  const supplierOptions = supplierRows.map((row) => ({
    value: getId(row, "supplier") ?? "",
    label: getName(row, "supplier"),
  }));

  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search);
  const [categoryFilter, setCategoryFilter] = useState(ALL);
  const [supplierFilter, setSupplierFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [drawer, setDrawer] = useState<{ mode: "create" | "edit" | "view"; row: Record_ | null } | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<Record_ | null>(null);

  const { save, remove } = useResourceMutations("products", {
    successMessage: "Product created successfully",
    invalidate: ["inventory"],
    onDone: () => setDrawer(null),
  });

  const statuses = useMemo(() => {
    const values = new Set<string>();
    rows.forEach((row) => {
      const value = row[keys.status];
      if (value !== null && value !== undefined && value !== "") values.add(String(value));
    });
    return [...values];
  }, [rows, keys.status]);

  const filtered = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    return rows.filter((row) => {
      if (categoryFilter !== ALL && getRefId(row, "category") !== categoryFilter) return false;
      if (supplierFilter !== ALL && getRefId(row, "supplier") !== supplierFilter) return false;
      if (statusFilter !== ALL && String(row[keys.status] ?? "") !== statusFilter) return false;
      if (!term) return true;
      return Object.values(row).some((value) =>
        value !== null && typeof value !== "object"
          ? String(value).toLowerCase().includes(term)
          : false,
      );
    });
  }, [rows, debounced, categoryFilter, supplierFilter, statusFilter, keys.status]);

  const categoryLabel = (row: Record_) =>
    getRefName(row, "category") ??
    categoryOptions.find((option) => option.value === getRefId(row, "category"))?.label ??
    "—";
  const supplierLabel = (row: Record_) =>
    getRefName(row, "supplier") ??
    supplierOptions.find((option) => option.value === getRefId(row, "supplier"))?.label ??
    "—";

  const openCreate = () => {
    setForm({
      name: "",
      sku: "",
      barcode: "",
      purchasePrice: "",
      sellingPrice: "",
      minimumStock: "",
      category: "",
      supplier: "",
      status: "ACTIVE",
    });
    setErrors({});
    setDrawer({ mode: "create", row: null });
  };

  const openEdit = (row: Record_) => {
    setForm({
      name: readValue(row, keys.name),
      sku: readValue(row, keys.sku),
      barcode: readValue(row, keys.barcode),
      purchasePrice: readValue(row, keys.purchasePrice),
      sellingPrice: readValue(row, keys.sellingPrice),
      minimumStock: readValue(row, keys.minimumStock),
      category: getRefId(row, "category") ?? "",
      supplier: getRefId(row, "supplier") ?? "",
      status: readValue(row, keys.status),
    });
    setErrors({});
    setDrawer({ mode: "edit", row });
  };

  const submit = () => {
    const next: Record<string, string> = {};
    if (!form["name"]?.trim()) next["name"] = "Product name is required";
    const numeric: [string, string][] = [
      ["purchasePrice", "Purchase price"],
      ["sellingPrice", "Selling price"],
      ["minimumStock", "Minimum stock"],
    ];
    numeric.forEach(([field, label]) => {
      const value = form[field]?.trim();
      if (value && (Number.isNaN(Number(value)) || Number(value) < 0)) {
        next[field] = `${label} must be a positive number`;
      }
    });
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const num = (value?: string) =>
      value && value.trim() !== "" ? Number(value) : null;

    const payload: Record_ = {
      [keys.name]: form["name"]?.trim(),
      [keys.sku]: form["sku"]?.trim() || null,
      [keys.barcode]: form["barcode"]?.trim() || null,
      [keys.purchasePrice]: num(form["purchasePrice"]),
      [keys.sellingPrice]: num(form["sellingPrice"]),
      [keys.minimumStock]: num(form["minimumStock"]),
      [keys.category]: num(form["category"]) ?? form["category"] ?? null,
      [keys.supplier]: num(form["supplier"]) ?? form["supplier"] ?? null,
      [keys.status]: form["status"]==="ACTIVE",
    };

    const id = drawer?.row ? getId(drawer.row, "product") : undefined;
    if (id) payload["id"] = Number.isNaN(Number(id)) ? id : Number(id);
    save.mutate({ id, payload });
  };

  const columns: Column<Record_>[] = [
    {
      key: "id",
      header: "ID",
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">{getId(row, "product") ?? "—"}</span>
      ),
    },
    {
      key: "name",
      header: "Product",
      render: (row) => <span className="font-medium">{getName(row, "product")}</span>,
    },
    { key: "sku", header: "SKU", render: (row) => readValue(row, keys.sku) || "—" },
    { key: "barcode", header: "Barcode", render: (row) => readValue(row, keys.barcode) || "—" },
    {
      key: "purchasePrice",
      header: "Purchase Price",
      align: "right",
      render: (row) => formatCurrency(row[keys.purchasePrice]),
    },
    {
      key: "sellingPrice",
      header: "Selling Price",
      align: "right",
      render: (row) => formatCurrency(row[keys.sellingPrice]),
    },
    {
      key: "minimumStock",
      header: "Min. Stock",
      align: "right",
      render: (row) => formatNumber(row[keys.minimumStock]),
    },
    { key: "category", header: "Category", render: categoryLabel },
    { key: "supplier", header: "Supplier", render: supplierLabel },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge value={readValue(row, keys.status) || null} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your products and pricing."
        actions={
          <>
            <Button variant="outline" onClick={() => products.refetch()} disabled={products.isFetching}>
              <RefreshCw className={`size-4 ${products.isFetching ? "animate-spin" : ""}`} />
              {products.isFetching ? "Refreshing..." : "Refresh"}
            </Button>
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Add Product
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
        <FilterSelect
          value={categoryFilter}
          onChange={setCategoryFilter}
          placeholder="All categories"
          options={categoryOptions}
        />
        <FilterSelect
          value={supplierFilter}
          onChange={setSupplierFilter}
          placeholder="All suppliers"
          options={supplierOptions}
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="All statuses"
          options={statuses.map((status) => ({ value: status, label: status }))}
        />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={products.isLoading}
        error={products.error}
        onRetry={() => products.refetch()}
        rowKey={(row, index) => getId(row, "product") ?? String(index)}
        emptyState={
          <EmptyState
            icon={Package}
            title="No products found"
            description="Add your first product to get started."
            action={
              <Button onClick={openCreate}>
                <Plus className="size-4" />
                Add Product
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
            ? "Add Product"
            : drawer?.mode === "edit"
              ? "Edit Product"
              : "Product details"
        }
        description={
          drawer?.mode === "view"
            ? "Read-only view of this product."
            : "Fields marked * are required."
        }
        readOnly={drawer?.mode === "view"}
        submitting={save.isPending}
        onSubmit={submit}
        submitLabel={drawer?.mode === "edit" ? "Save changes" : "Create Product"}
      >
        {drawer?.mode === "view" && drawer.row ? (
          <div>
            <DetailRow label="Product" value={getName(drawer.row, "product")} />
            <DetailRow label="SKU" value={readValue(drawer.row, keys.sku) || "—"} />
            <DetailRow label="Barcode" value={readValue(drawer.row, keys.barcode) || "—"} />
            <DetailRow label="Purchase price" value={formatCurrency(drawer.row[keys.purchasePrice])} />
            <DetailRow label="Selling price" value={formatCurrency(drawer.row[keys.sellingPrice])} />
            <DetailRow label="Minimum stock" value={formatNumber(drawer.row[keys.minimumStock])} />
            <DetailRow label="Category" value={categoryLabel(drawer.row)} />
            <DetailRow label="Supplier" value={supplierLabel(drawer.row)} />
            <DetailRow
              label="Status"
              value={<StatusBadge value={readValue(drawer.row, keys.status) || null} />}
            />
          </div>
        ) : (
          <>
            <TextField
              label="Product Name"
              required
              value={form["name"] ?? ""}
              error={errors["name"]}
              placeholder="e.g. Wireless Mouse"
              onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="SKU"
                value={form["sku"] ?? ""}
                placeholder="e.g. WM-1024"
                onChange={(value) => setForm((prev) => ({ ...prev, sku: value }))}
              />
              <TextField
                label="Barcode"
                value={form["barcode"] ?? ""}
                placeholder="e.g. 8901234567890"
                onChange={(value) => setForm((prev) => ({ ...prev, barcode: value }))}
              />
              <TextField
                label="Purchase Price"
                type="number"
                step="0.01"
                min="0"
                value={form["purchasePrice"] ?? ""}
                error={errors["purchasePrice"]}
                placeholder="0.00"
                onChange={(value) => setForm((prev) => ({ ...prev, purchasePrice: value }))}
              />
              <TextField
                label="Selling Price"
                type="number"
                step="0.01"
                min="0"
                value={form["sellingPrice"] ?? ""}
                error={errors["sellingPrice"]}
                placeholder="0.00"
                onChange={(value) => setForm((prev) => ({ ...prev, sellingPrice: value }))}
              />
            </div>
            <TextField
              label="Minimum Stock"
              type="number"
              min="0"
              value={form["minimumStock"] ?? ""}
              error={errors["minimumStock"]}
              hint="Used to flag low stock in the inventory screen."
              placeholder="0"
              onChange={(value) => setForm((prev) => ({ ...prev, minimumStock: value }))}
            />
            <SelectField
              label="Category"
              value={form["category"] ?? ""}
              options={categoryOptions}
              disabled={categories.isLoading}
              onChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
            />
            <SelectField
              label="Supplier"
              value={form["supplier"] ?? ""}
              options={supplierOptions}
              disabled={suppliers.isLoading}
              onChange={(value) => setForm((prev) => ({ ...prev, supplier: value }))}
            />
            <SelectField
              label="Status"
              value={form["status"] ?? ""}
              options={[
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
              ]}
              onChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
            />
          </>
        )}
      </FormDrawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => (open ? null : setPendingDelete(null))}
        description="This will permanently delete this product. This action cannot be undone."
        loading={remove.isPending}
        onConfirm={() => {
          const id = getId(pendingDelete, "product");
          if (!id) return;
          remove.mutate(id, { onSettled: () => setPendingDelete(null) });
        }}
      />
    </div>
  );
}
