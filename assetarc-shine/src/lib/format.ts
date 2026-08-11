const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-IN");

export function formatCurrency(value: unknown): string {
  const num = toNumber(value);
  if (num === null) return "—";
  return currencyFormatter.format(num);
}

export function formatCurrencyShort(value: unknown): string {
  const num = toNumber(value);
  if (num === null) return "—";
  return compactCurrency.format(num);
}

export function formatNumber(value: unknown): string {
  const num = toNumber(value);
  if (num === null) return "—";
  return numberFormatter.format(num);
}

export function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : null;
}

export function parseDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") return new Date(value);
  if (typeof value !== "string") return null;
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: unknown): string {
  const date = parseDate(value);
  if (!date) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: unknown): string {
  const date = parseDate(value);
  if (!date) return "—";
  return `${formatDate(date)}, ${date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

/** For <input type="date"> values. */
export function toDateInputValue(value: unknown): string {
  const date = parseDate(value);
  if (!date) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function todayInputValue(): string {
  return toDateInputValue(new Date());
}
