import type { LucideIcon } from "lucide-react";
import { Eye, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DataTable, type Column } from "@/components/common/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import { DetailRow, TextField } from "@/components/common/FormFields";
import { FormDrawer } from "@/components/common/FormDrawer";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchBar } from "@/components/common/SearchBar";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useResourceList, useResourceMutations } from "@/hooks/useResource";
import { adaptiveFields, isDateField, isEmailField, isNumericField } from "@/lib/adaptive";
import { formatDate } from "@/lib/format";
import { getId, humanizeKey, type Record_ } from "@/lib/records";
import type { Entity } from "@/services";

type Mode = "create" | "edit" | "view";

export function SimpleCrudPage({
  entity,
  singular,
  title,
  description,
  icon,
  fallbackFields,
  requiredFields = ["name"],
}: {
  entity: Entity;
  singular: string;
  title: string;
  description: string;
  icon: LucideIcon;
  fallbackFields: string[];
  requiredFields?: string[];
}) {
  const { data, isLoading, isFetching, error, refetch } = useResourceList(entity);
  const rows = useMemo(() => data ?? [], [data]);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [drawer, setDrawer] = useState<{ mode: Mode; row: Record_ | null } | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<Record_ | null>(null);

  const { save, remove } = useResourceMutations(entity, {
    successMessage: `${singular} created successfully`,
    onDone: () => setDrawer(null),
  });

  const fields = useMemo(
    () => adaptiveFields(rows, entity.replace(/s$/, ""), fallbackFields),
    [rows, entity, fallbackFields],
  );

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      Object.values(row).some((value) =>
        value !== null && typeof value !== "object"
          ? String(value).toLowerCase().includes(term)
          : false,
      ),
    );
  }, [rows, debouncedSearch]);

  const openCreate = () => {
    setForm(Object.fromEntries(fields.map((key) => [key, ""])));
    setErrors({});
    setDrawer({ mode: "create", row: null });
  };

  const openEdit = (row: Record_) => {
    setForm(
      Object.fromEntries(
        fields.map((key) => [key, row[key] === null || row[key] === undefined ? "" : String(row[key])]),
      ),
    );
    setErrors({});
    setDrawer({ mode: "edit", row });
  };

  const submit = () => {
    const nextErrors: Record<string, string> = {};
    fields.forEach((key) => {
      const value = (form[key] ?? "").trim();
      if (requiredFields.includes(key.toLowerCase()) && !value) {
        nextErrors[key] = `${humanizeKey(key)} is required`;
      }
      if (value && isNumericField(key) && Number.isNaN(Number(value))) {
        nextErrors[key] = "Enter a valid number";
      }
      if (value && isEmailField(key) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        nextErrors[key] = "Enter a valid email address";
      }
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload: Record_ = {};
    fields.forEach((key) => {
      const value = (form[key] ?? "").trim();
      payload[key] = value === "" ? null : isNumericField(key) ? Number(value) : value;
    });

    const id = drawer?.row ? getId(drawer.row, entity.replace(/s$/, "")) : undefined;
    if (id) payload["id"] = Number.isNaN(Number(id)) ? id : Number(id);

    save.mutate({ id, payload });
  };

  const columns: Column<Record_>[] = [
    {
      key: "id",
      header: "ID",
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">
          {getId(row, entity.replace(/s$/, "")) ?? "—"}
        </span>
      ),
    },
    ...fields.slice(0, 5).map<Column<Record_>>((key) => ({
      key,
      header: humanizeKey(key),
      align: isNumericField(key) ? "right" : "left",
      render: (row) => {
        const value = row[key];
        if (value === null || value === undefined || value === "")
          return <span className="text-muted-foreground">—</span>;
        if (isDateField(key)) return formatDate(value);
        return (
          <span className={key.toLowerCase().includes("name") ? "font-medium" : ""}>
            {String(value)}
          </span>
        );
      },
    })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Add {singular}
            </Button>
          </>
        }
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder={`Search ${entity}...`}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        loading={isLoading}
        error={error}
        onRetry={() => refetch()}
        rowKey={(row, index) => getId(row, entity.replace(/s$/, "")) ?? String(index)}
        emptyState={
          <EmptyState
            icon={icon}
            title={search ? `No ${entity} match your search` : `No ${entity} found`}
            description={
              search
                ? "Try a different search term."
                : `Add your first ${singular.toLowerCase()} to get started.`
            }
            action={
              search ? null : (
                <Button onClick={openCreate}>
                  <Plus className="size-4" />
                  Add {singular}
                </Button>
              )
            }
          />
        }
        actions={(row) => [
          {
            label: "View",
            icon: <Eye className="size-4" />,
            onSelect: () => setDrawer({ mode: "view", row }),
          },
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
            ? `Add ${singular}`
            : drawer?.mode === "edit"
              ? `Edit ${singular}`
              : `${singular} details`
        }
        description={
          drawer?.mode === "view"
            ? "Read-only view of this record."
            : `Fill in the details below. Fields marked * are required.`
        }
        readOnly={drawer?.mode === "view"}
        submitting={save.isPending}
        onSubmit={submit}
        submitLabel={drawer?.mode === "edit" ? "Save changes" : `Create ${singular}`}
      >
        {drawer?.mode === "view" ? (
          <div>
            {Object.entries(drawer.row ?? {}).map(([key, value]) => (
              <DetailRow
                key={key}
                label={humanizeKey(key)}
                value={
                  value === null || value === undefined || value === ""
                    ? "—"
                    : typeof value === "object"
                      ? JSON.stringify(value)
                      : isDateField(key)
                        ? formatDate(value)
                        : String(value)
                }
              />
            ))}
          </div>
        ) : (
          fields.map((key) => (
            <TextField
              key={key}
              label={humanizeKey(key)}
              required={requiredFields.includes(key.toLowerCase())}
              type={isNumericField(key) ? "number" : isDateField(key) ? "date" : isEmailField(key) ? "email" : "text"}
              value={form[key] ?? ""}
              error={errors[key]}
              placeholder={`Enter ${humanizeKey(key).toLowerCase()}`}
              onChange={(value) => setForm((prev) => ({ ...prev, [key]: value }))}
            />
          ))
        )}
      </FormDrawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => (open ? null : setPendingDelete(null))}
        description={`This will permanently delete this ${singular.toLowerCase()}. This action cannot be undone.`}
        loading={remove.isPending}
        onConfirm={() => {
          const id = getId(pendingDelete, entity.replace(/s$/, ""));
          if (!id) return;
          remove.mutate(id, { onSettled: () => setPendingDelete(null) });
        }}
      />
    </div>
  );
}
