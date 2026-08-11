import { createResourceService } from "./resourceService";

export const categoryService = createResourceService("categories");
export const supplierService = createResourceService("suppliers");
export const warehouseService = createResourceService("warehouses");
export const productService = createResourceService("products");
export const inventoryService = createResourceService("inventory");
export const purchaseService = createResourceService("purchases");
export const salesService = createResourceService("sales");

export const services = {
  categories: categoryService,
  suppliers: supplierService,
  warehouses: warehouseService,
  products: productService,
  inventory: inventoryService,
  purchases: purchaseService,
  sales: salesService,
} as const;

export type { Entity } from "./resourceService";
