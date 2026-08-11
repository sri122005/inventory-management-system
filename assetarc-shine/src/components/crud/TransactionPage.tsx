import type { LucideIcon } from "lucide-react";
import { Eye, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DataTable, type Column } from "@/components/common/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import { ALL, FilterSelect } from "@/components/common/FilterSelect";
import { DetailRow, SelectField, TextField } from "@/components/common/FormFields";
import { FormDrawer } from "@/components/common/FormDrawer";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchBar } from "@/components/common/SearchBar";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useResourceList, useResourceMutations } from "@/hooks/useResource";
import { formatCurrency, formatDate, formatNumber, toDateInputValue, todayInputValue } from "@/lib/format";
import { getId, getName, getRefId, getRefName, pick, type Record_ } from "@/lib/records";
import { resolveKey } from "@/lib/schema";
import { indexById, labelFor } from "@/lib/stock";

type Config = {
  entity: "purchases" | "sales";
  singular: string;
  title: string;
  description: string;
  icon: LucideIcon;
  withSupplier: boolean;
  priceLabel: string;
  priceAliases: string[];
  dateAliases: string[];
  successToast: string;
  formNote: string;
};

export function TransactionPage(config: Config) {
  const list = useResourceList(config.entity);
  const products = useResourceList("products");
  const warehouses = useResourceList("warehouses");
  const suppliers = useResourceList("suppliers", config.withSupplier);

  const rows = useMemo(() => list.data ?? [], [list.data]);
  const productRows = useMemo(() => products.data ?? [], [products.data]);
  const warehouseRows = useMemo(() => warehouses.data ?? [], [warehouses.data]);
  const supplierRows = useMemo(() => suppliers.data ?? [], [suppliers.data]);

  const productIndex = useMemo(() => indexById(productRows, "product"), [productRows]);
  const warehouseIndex = useMemo(() => indexById(warehouseRows, "warehouse"), [warehouseRows]);
  const supplierIndex = useMemo(() => indexById(supplierRows, "supplier"), [supplierRows]);

  const keys = useMemo(
    () => ({
      product: resolveKey(rows, ["productId", "product_id"]),
      warehouse: resolveKey(rows, ["warehouseId", "warehouse_id"]),
      supplier: resolveKey(rows, ["supplierId", "supplier_id"]),
      quantity: resolveKey(rows, ["quantity", "qty"]),
      price: resolveKey(rows, config.priceAliases),
      date: resolveKey(rows, config.dateAliases),
    }),
    [rows, config.priceAliases, config.dateAliases],
  );

  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search);
  const [supplierFilter, setSupplierFilter] = useState(ALL);
  const [warehouseFilter, setWarehouseFilter] = useState(ALL);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [drawer, setDrawer] = useState<{ mode: "create" | "edit" | "view"; row: Record_ | null } | null>(null);
  const [form, setForm] = useState({
    supplier: "",
    product: "",
    warehouse: "",
    quantity: "",
    price: "",
    date: todayInputValue(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<Record_ | null>(null);

  const { save, remove } = useResourceMutations(config.entity, {
    successMessage: config.successToast,
    invalidate: ["inventory", "products"],
    onDone: () => setDrawer(null),
  });

  const productLabel = (row: Record_) =>
    labelFor(row, "product", productIndex, getRefName(row, "product"));
  const warehouseLabel = (row: Record_) =>
    labelFor(row, "warehouse", warehouseIndex, getRefName(row, "warehouse"));
  const supplierLabel = (row: Record_) =>
    labelFor(row, "supplier", supplierIndex, getRefName(row, "supplier"));

  const dateOf = (row: Record_) => pick(row, [keys.date, ...config.dateAliases]);

  const filtered = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    return rows.filter((row) => {
      if (config.withSupplier && supplierFilter !== ALL && getRefId(row, "supplier") !== supplierFilter)
        return false;
      if (warehouseFilter !== ALL && getRefId(row, "warehouse") !== warehouseFilter) return false;
      const rowDate = toDateInputValue(dateOf(row));
      if (fromDate && rowDate && rowDate < fromDate) return false;
      if (toDate && rowDate && rowDate > toDate) return false;
      if (!term) return true;
      return (
        productLabel(row).toLowerCase().includes(term) ||
        warehouseLabel(row).toLowerCase().includes(term) ||
        (config.withSupplier && supplierLabel(row).toLowerCase().includes(term)) ||
        Object.values(row).some((value) =>
          value !== null && typeof value !== "object"
            ? String(value).toLowerCase().includes(term)
            : false,
        )
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, debounced, supplierFilter, warehouseFilter, fromDate, toDate, productIndex, warehouseIndex, supplierIndex]);

  const openCreate = () => {
    setForm({
      supplier: "",
      product: "",
      warehouse: "",
      quantity: "",
      price: "",
      date: todayInputValue(),
    });
    setErrors({});
    setDrawer({ mode: "create", row: null });
  };

  const openEdit = (row: Record_) => {
    setForm({
      supplier: getRefId(row, "supplier") ?? "",
      product: getRefId(row, "product") ?? "",
      warehouse: getRefId(row, "warehouse") ?? "",
      quantity: row[keys.quantity] === undefined || row[keys.quantity] === null ? "" : String(row[keys.quantity]),
      price: row[keys.price] === undefined || row[keys.price] === null ? "" : String(row[keys.price]),
      date: toDateInputValue(dateOf(row)),
    });
    setErrors({});
    setDrawer({ mode: "edit", row });
  };

  const submit = () => {
    const next: Record<string, string> = {};
    if (config.withSupplier && !form.supplier) next["supplier"] = "Select a supplier";
    if (!form.product) next["product"] = "Select a product";
    if (!form.warehouse) next["warehouse"] = "Select a warehouse";
    if (!form.quantity.trim()) next["quantity"] = "Quantity is required";
    else if (Number.isNaN(Number(form.quantity)) || Number(form.quantity) <= 0)
      next["quantity"] = "Quantity must be greater than zero";
    if (!form.price.trim()) next["price"] = `${config.priceLabel} is required`;
    else if (Number.isNaN(Number(form.price)) || Number(form.price) < 0)
      next["price"] = `${config.priceLabel} must be a positive number`;
    if (!form.date) next["date"] = "Select a date";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const asId = (value: string) => (Number.isNaN(Number(value)) ? value : Number(value));
    const payload: Record_ = {
      [keys.product]: asId(form.product),
      [keys.warehouse]: asId(form.warehouse),
      [keys.quantity]: Number(form.quantity),
      [keys.price]: Number(form.price),
      [keys.date]: `${form.date}T00:00:00`,
    };
    if (config.withSupplier) payload[keys.supplier] = asId(form.supplier);

    const id = drawer?.row ? getId(drawer.row, config.entity.replace(/s$/, "")) : undefined;
    if (id) payload["id"] = asId(id);

    save.mutate(
      { id, payload },
      {
        onSuccess: () => {
          if (!id) toast.info("Inventory has been updated by the server.");
        },
      },
    );
  };

  const columns: Column<Record_>[] = [
    {
      key: "id",
      header: "ID",
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">
          {getId(row, config.entity.replace(/s$/, "")) ?? "—"}
        </span>
      ),
    },
    ...(config.withSupplier
      ? [{ key: "supplier", header: "Supplier", render: supplierLabel } as Column<Record_>]
      : []),
    { key: "product", header: "Product", render: (row) => <span className="font-medium">{productLabel(row)}</span> },
    { key: "warehouse", header: "Warehouse", render: warehouseLabel },
    { key: "quantity", header: "Quantity", align: "right", render: (row) => formatNumber(row[keys.quantity]) },
    { key: "price", header: config.priceLabel, align: "right", render: (row) => formatCurrency(row[keys.price]) },
    { key: "date", header: "Date", render: (row) => formatDate(dateOf(row)) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={config.title}
        description={config.description}
        actions={
          <>
            <Button variant="outline" onClick={() => list.refetch()} disabled={list.isFetching}>
              <RefreshCw className={`size-4 ${list.isFetching ? "animate-spin" : ""}`} />
              {list.isFetching ? "Refreshing..." : "Refresh"}
            </Button>
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Add {config.singular}
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder={`Search ${config.entity}...`} />
        {config.withSupplier ? (
          <FilterSelect
            value={supplierFilter}
            onChange={setSupplierFilter}
            placeholder="All suppliers"
            options={supplierRows.map((row) => ({
              value: getId(row, "supplier") ?? "",
              label: getName(row, "supplier"),
            }))}
          />
        ) : null}
        <FilterSelect
          value={warehouseFilter}
          onChange={setWarehouseFilter}
          placeholder="All warehouses"
          options={warehouseRows.map((row) => ({
            value: getId(row, "warehouse") ?? "",
            label: getName(row, "warehouse"),
          }))}
        />
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            aria-label="From date"
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
          />
          <span className="text-sm text-muted-foreground">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            aria-label="To date"
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={list.isLoading}
        error={list.error}
        onRetry={() => list.refetch()}
        rowKey={(row, index) => getId(row, config.entity.replace(/s$/, "")) ?? String(index)}
        emptyState={
          <EmptyState
            icon={config.icon}
            title={`No ${config.entity} found`}
            description={`Record your first ${config.singular.toLowerCase()} to get started.`}
            action={
              <Button onClick={openCreate}>
                <Plus className="size-4" />
                Add {config.singular}
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
            ? `Add ${config.singular}`
            : drawer?.mode === "edit"
              ? `Edit ${config.singular}`
              : `${config.singular} details`
        }
        description={drawer?.mode === "view" ? "Read-only view of this record." : config.formNote}
        readOnly={drawer?.mode === "view"}
        submitting={save.isPending}
        onSubmit={submit}
        submitLabel={drawer?.mode === "edit" ? "Save changes" : `Record ${config.singular}`}
      >
        {drawer?.mode === "view" && drawer.row ? (
          <div>
            {config.withSupplier ? <DetailRow label="Supplier" value={supplierLabel(drawer.row)} /> : null}
            <DetailRow label="Product" value={productLabel(drawer.row)} />
            <DetailRow label="Warehouse" value={warehouseLabel(drawer.row)} />
            <DetailRow label="Quantity" value={formatNumber(drawer.row[keys.quantity])} />
            <DetailRow label={config.priceLabel} value={formatCurrency(drawer.row[keys.price])} />
            <DetailRow
              label="Total value"
              value={formatCurrency(
                (Number(drawer.row[keys.quantity]) || 0) * (Number(drawer.row[keys.price]) || 0),
              )}
            />
            <DetailRow label="Date" value={formatDate(dateOf(drawer.row))} />
          </div>
        ) : (
          <>
            <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">{config.formNote}</p>
            {config.withSupplier ? (
              <SelectField
                label="Supplier"
                required
                value={form.supplier}
                error={errors["supplier"]}
                disabled={suppliers.isLoading}
                options={supplierRows.map((row) => ({
                  value: getId(row, "supplier") ?? "",
                  label: getName(row, "supplier"),
                }))}
                onChange={(value) => setForm((prev) => ({ ...prev, supplier: value }))}
              />
            ) : null}
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
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Quantity"
                required
                type="number"
                min="1"
                value={form.quantity}
                error={errors["quantity"]}
                placeholder="0"
                onChange={(value) => setForm((prev) => ({ ...prev, quantity: value }))}
              />
              <TextField
                label={config.priceLabel}
                required
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                error={errors["price"]}
                placeholder="0.00"
                onChange={(value) => setForm((prev) => ({ ...prev, price: value }))}
              />
            </div>
            <TextField
              label="Date"
              required
              type="date"
              value={form.date}
              error={errors["date"]}
              onChange={(value) => setForm((prev) => ({ ...prev, date: value }))}
            />
          </>
        )}
      </FormDrawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => (open ? null : setPendingDelete(null))}
        description={`This will permanently delete this ${config.singular.toLowerCase()}. Inventory will be adjusted by the server.`}
        loading={remove.isPending}
        onConfirm={() => {
          const id = getId(pendingDelete, config.entity.replace(/s$/, ""));
          if (!id) return;
          remove.mutate(id, { onSettled: () => setPendingDelete(null) });
        }}
      />
    </div>
  );
}
