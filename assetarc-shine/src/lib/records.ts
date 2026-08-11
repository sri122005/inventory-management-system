/**
 * Field helpers. The backend response shape is the source of truth, so we read
 * values defensively across the common naming conventions (camelCase /
 * snake_case / prefixed ids) instead of assuming one exact schema.
 */
export type Record_ = Record<string, unknown>;

export function pick(record: Record_ | null | undefined, keys: string[]): unknown {
  if (!record) return undefined;
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

export function pickString(record: Record_ | null | undefined, keys: string[]): string | undefined {
  const value = pick(record, keys);
  if (value === undefined) return undefined;
  if (typeof value === "object") return undefined;
  return String(value);
}

export function pickNumber(record: Record_ | null | undefined, keys: string[]): number | undefined {
  const value = pick(record, keys);
  if (value === undefined) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

const idKeys = (entity: string) => [
  "id",
  `${entity}Id`,
  `${entity}_id`,
  `${entity}ID`,
];

export function getId(record: Record_ | null | undefined, entity: string): string | undefined {
  const value = pick(record, idKeys(entity));
  return value === undefined ? undefined : String(value);
}

export function getRefId(
  record: Record_ | null | undefined,
  entity: string,
): string | undefined {
  const direct = pick(record, [`${entity}Id`, `${entity}_id`, `${entity}ID`]);
  if (direct !== undefined && typeof direct !== "object") return String(direct);
  const nested = record?.[entity];
  if (nested && typeof nested === "object") {
    return getId(nested as Record_, entity);
  }
  return undefined;
}

export function getRefName(
  record: Record_ | null | undefined,
  entity: string,
): string | undefined {
  const direct = pickString(record, [
    `${entity}Name`,
    `${entity}_name`,
    `${entity}Title`,
  ]);
  if (direct) return direct;
  const nested = record?.[entity];
  if (nested && typeof nested === "object") {
    return pickString(nested as Record_, ["name", `${entity}Name`, "title"]);
  }
  return undefined;
}

/** Human readable label of an entity row. */
export function getName(record: Record_ | null | undefined, entity: string): string {
  return (
    pickString(record, ["name", `${entity}Name`, `${entity}_name`, "title", "productName"]) ??
    `#${getId(record, entity) ?? "—"}`
  );
}

/** Collect all keys present across a list, useful for adaptive rendering. */
export function collectKeys(rows: Record_[]): string[] {
  const keys = new Set<string>();
  rows.forEach((row) => Object.keys(row ?? {}).forEach((key) => keys.add(key)));
  return [...keys];
}

export function humanizeKey(key: string): string {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}
