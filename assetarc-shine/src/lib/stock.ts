import type { StockStatus } from "@/components/common/StatusBadge";
import { getId, getName, getRefId, pickNumber, type Record_ } from "@/lib/records";
import { resolveKey } from "@/lib/schema";

export function stockStatus(quantity: number | undefined, minimum: number | undefined): StockStatus {
  if (quantity === undefined) return "unknown";
  if (quantity <= 0) return "out";
  if (minimum !== undefined && quantity <= minimum) return "low";
  return "healthy";
}

export function quantityOf(row: Record_): number | undefined {
  return pickNumber(row, ["quantity", "qty", "stock", "stockQuantity", "availableQuantity"]);
}

export function minimumStockOf(product: Record_ | undefined): number | undefined {
  return pickNumber(product, ["minimumStock", "minimum_stock", "minStock", "min_stock"]);
}

/** Index products by their id so inventory/purchase/sale rows can be enriched. */
export function indexById(rows: Record_[], entity: string): Map<string, Record_> {
  const map = new Map<string, Record_>();
  rows.forEach((row) => {
    const id = getId(row, entity);
    if (id) map.set(id, row);
  });
  return map;
}

export function labelFor(
  row: Record_,
  entity: string,
  index: Map<string, Record_>,
  fallbackName?: string | undefined,
): string {
  if (fallbackName) return fallbackName;
  const id = getRefId(row, entity);
  if (!id) return "—";
  const match = index.get(id);
  return match ? getName(match, entity) : `#${id}`;
}

export const priceKeyFor = (rows: Record_[], aliases: string[]) => resolveKey(rows, aliases);
