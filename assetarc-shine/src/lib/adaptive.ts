import { collectKeys, type Record_ } from "@/lib/records";

const HIDDEN = new Set([
  "id",
  "createdat",
  "created_at",
  "updatedat",
  "updated_at",
  "createdon",
  "modifiedon",
]);

/**
 * Derive the editable field list from what the API actually returns.
 * Falls back to a sensible default set when the table is still empty.
 */
export function adaptiveFields(rows: Record_[], entity: string, fallback: string[]): string[] {
  const keys = collectKeys(rows).filter((key) => {
    const lower = key.toLowerCase();
    if (HIDDEN.has(lower)) return false;
    if (lower === `${entity}id` || lower === `${entity}_id`) return false;
    return true;
  });
  const scalarKeys = keys.filter((key) =>
    rows.every((row) => row[key] === null || typeof row[key] !== "object"),
  );
  return scalarKeys.length > 0 ? scalarKeys : fallback;
}

export function isNumericField(key: string): boolean {
  return /price|amount|qty|quantity|stock|count|total|level/i.test(key);
}

export function isDateField(key: string): boolean {
  return /date/i.test(key);
}

export function isEmailField(key: string): boolean {
  return /email/i.test(key);
}
