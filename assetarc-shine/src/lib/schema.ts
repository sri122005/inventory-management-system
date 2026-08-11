import type { Record_ } from "@/lib/records";

/**
 * Find the key the backend actually uses for a logical field, so payloads we
 * send back match the shape the API returned. Falls back to the first alias.
 */
export function resolveKey(rows: Record_[], aliases: string[]): string {
  const present = new Set<string>();
  rows.forEach((row) => Object.keys(row ?? {}).forEach((key) => present.add(key)));
  const lowerMap = new Map<string, string>();
  present.forEach((key) => lowerMap.set(key.toLowerCase(), key));
  for (const alias of aliases) {
    const match = lowerMap.get(alias.toLowerCase());
    if (match) return match;
  }
  return aliases[0] as string;
}

export function readValue(row: Record_ | null | undefined, key: string): string {
  const value = row?.[key];
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return "";
  return String(value);
}
