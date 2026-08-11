import { api, toList } from "@/lib/api";
import type { Record_ } from "@/lib/records";

export type Entity =
  | "categories"
  | "suppliers"
  | "warehouses"
  | "products"
  | "inventory"
  | "purchases"
  | "sales";

/** Generic CRUD service factory — all endpoints follow the same REST shape. */
export function createResourceService(resource: Entity) {
  const base = `/api/${resource}`;
  return {
    resource,
    list: async (): Promise<Record_[]> => toList<Record_>(await api.get(base)),
    get: (id: string | number) => api.get<Record_>(`${base}/${id}`),
    create: (payload: Record_) => api.post<Record_>(base, payload),
    update: (id: string | number, payload: Record_) =>
      api.put<Record_>(`${base}/${id}`, payload),
    remove: (id: string | number) => api.delete<unknown>(`${base}/${id}`),
  };
}

export type ResourceService = ReturnType<typeof createResourceService>;
