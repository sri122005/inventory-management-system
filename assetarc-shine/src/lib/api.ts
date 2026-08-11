/**
 * Centralized REST client for the existing Spring Boot backend.
 * Every network call in the app goes through here.
 */

export const API_BASE_URL =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:8080";

export class ApiError extends Error {
  status: number;
  raw: unknown;

  constructor(message: string, status: number, raw?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.raw = raw;
  }
}

const NETWORK_MESSAGE =
  "Unable to connect to the server. Please make sure the Spring Boot application is running.";

function friendlyMessage(status: number, backendMessage?: string): string {
  const raw = (backendMessage ?? "").toLowerCase();

  if (raw.includes("insufficient") || raw.includes("not enough stock")) {
    return "Insufficient stock available for this product.";
  }
  if (raw.includes("dataintegrityviolation") || raw.includes("constraint") || status === 409) {
    return "Unable to save this record because it is referenced by another record.";
  }

  switch (status) {
    case 400:
      return isTechnical(backendMessage)
        ? "Some of the information provided is invalid. Please review the form and try again."
        : (backendMessage as string);
    case 401:
    case 403:
      return "You are not allowed to perform this action.";
    case 404:
      return "The requested record could not be found.";
    case 500:
      return "The server ran into a problem while processing this request. Please try again.";
    default:
      return isTechnical(backendMessage)
        ? "Something went wrong while talking to the server. Please try again."
        : (backendMessage ?? "Something went wrong. Please try again.");
  }
}

function isTechnical(message?: string) {
  if (!message) return true;
  return (
    message.includes("Exception") ||
    message.includes("org.springframework") ||
    message.includes("java.") ||
    message.includes("SQL") ||
    message.length > 200
  );
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractMessage(body: unknown): string | undefined {
  if (typeof body === "string") return body;
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    for (const key of ["message", "error", "detail", "errorMessage"]) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) return value;
    }
  }
  return undefined;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError(NETWORK_MESSAGE, 0);
  }

  const body = await parseBody(response);

  if (!response.ok) {
    throw new ApiError(friendlyMessage(response.status, extractMessage(body)), response.status, body);
  }

  return body as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(data) }),
  put: <T>(path: string, data: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(data) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

/** Backends sometimes wrap collections ({ data: [...] } / { content: [...] }). */
export function toList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of ["data", "content", "items", "results"]) {
      if (Array.isArray(record[key])) return record[key] as T[];
    }
  }
  return [];
}
