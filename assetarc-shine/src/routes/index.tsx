import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  IndianRupee,
  Package,
  Receipt,
  RefreshCw,
  ShoppingCart,
  Truck,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StockBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useResourceList } from "@/hooks/useResource";
import { formatCurrency, formatCurrencyShort, formatDate, formatNumber, parseDate } from "@/lib/format";
import { getId, getName, getRefId, getRefName, pick, pickNumber, type Record_ } from "@/lib/records";
import { indexById, labelFor, minimumStockOf, quantityOf, stockStatus } from "@/lib/stock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — StockFlow Inventory" },
      {
        name: "description",
        content:
          "Real-time inventory dashboard: stock value, low-stock alerts, purchase and sales trends across every warehouse.",
      },
      { property: "og:title", content: "Dashboard — StockFlow Inventory" },
      {
        property: "og:description",
        content: "Real-time inventory dashboard with stock value, alerts and sales trends.",
      },
    ],
  }),
  component: Dashboard,
});

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function lastMonths(count: number) {
  const now = new Date();
  const months: { key: string; label: string }[] = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: monthKey(date),
      label: date.toLocaleDateString("en-IN", { month: "short" }),
    });
  }
  return months;
}

function Dashboard() {
  const products = useResourceList("products");
  const categories = useResourceList("categories");
  const suppliers = useResourceList("suppliers");
  const warehouses = useResourceList("warehouses");
  const inventory = useResourceList("inventory");
  const purchases = useResourceList("purchases");
  const sales = useResourceList("sales");

  const productRows = useMemo(() => products.data ?? [], [products.data]);
  const inventoryRows = useMemo(() => inventory.data ?? [], [inventory.data]);
  const purchaseRows = useMemo(() => purchases.data ?? [], [purchases.data]);
  const saleRows = useMemo(() => sales.data ?? [], [sales.data]);
  const categoryRows = useMemo(() => categories.data ?? [], [categories.data]);
  const warehouseRows = useMemo(() => warehouses.data ?? [], [warehouses.data]);

  const productIndex = useMemo(() => indexById(productRows, "product"), [productRows]);
  const warehouseIndex = useMemo(() => indexById(warehouseRows, "warehouse"), [warehouseRows]);
  const categoryIndex = useMemo(() => indexById(categoryRows, "category"), [categoryRows]);

  const loading =
    products.isLoading || inventory.isLoading || purchases.isLoading || sales.isLoading;

  const refreshAll = () => {
    void products.refetch();
    void categories.refetch();
    void suppliers.refetch();
    void warehouses.refetch();
    void inventory.refetch();
    void purchases.refetch();
    void sales.refetch();
  };

  const priceOf = (product: Record_ | undefined) =>
    pickNumber(product, ["sellingPrice", "selling_price", "price", "unitPrice", "purchasePrice"]) ?? 0;

  const stockRows = useMemo(
    () =>
      inventoryRows.map((row) => {
        const productId = getRefId(row, "product");
        const product = productId ? productIndex.get(productId) : undefined;
        const quantity = quantityOf(row) ?? 0;
        const minimum = minimumStockOf(product);
        return {
          row,
          product,
          quantity,
          minimum,
          status: stockStatus(quantity, minimum),
          value: quantity * priceOf(product),
        };
      }),
    [inventoryRows, productIndex],
  );

  const totals = useMemo(() => {
    const stockValue = stockRows.reduce((sum, item) => sum + item.value, 0);
    const lowStock = stockRows.filter((item) => item.status === "low" || item.status === "out").length;
    const salesValue = saleRows.reduce((sum, row) => {
      const qty = pickNumber(row, ["quantity", "qty"]) ?? 0;
      const price = pickNumber(row, ["sellingPrice", "selling_price", "unitPrice", "price"]) ?? 0;
      return sum + qty * price;
    }, 0);
    const purchaseValue = purchaseRows.reduce((sum, row) => {
      const qty = pickNumber(row, ["quantity", "qty"]) ?? 0;
      const price = pickNumber(row, ["purchasePrice", "purchase_price", "unitPrice", "price", "cost"]) ?? 0;
      return sum + qty * price;
    }, 0);
    return { stockValue, lowStock, salesValue, purchaseValue };
  }, [stockRows, saleRows, purchaseRows]);

  const trend = useMemo(() => {
    const months = lastMonths(6);
    const base = new Map(months.map((month) => [month.key, { month: month.label, purchases: 0, sales: 0 }]));
    const add = (rows: Record_[], field: "purchases" | "sales", dateKeys: string[], priceKeys: string[]) => {
      rows.forEach((row) => {
        const date = parseDate(pick(row, dateKeys));
        if (!date) return;
        const bucket = base.get(monthKey(date));
        if (!bucket) return;
        const qty = pickNumber(row, ["quantity", "qty"]) ?? 0;
        const price = pickNumber(row, priceKeys) ?? 0;
        bucket[field] += qty * price;
      });
    };
    add(purchaseRows, "purchases", ["purchaseDate", "purchase_date", "date", "createdAt"], [
      "purchasePrice",
      "purchase_price",
      "unitPrice",
      "price",
      "cost",
    ]);
    add(saleRows, "sales", ["saleDate", "sale_date", "date", "createdAt"], [
      "sellingPrice",
      "selling_price",
      "unitPrice",
      "price",
    ]);
    return [...base.values()];
  }, [purchaseRows, saleRows]);

  const stockByWarehouse = useMemo(() => {
    const map = new Map<string, number>();
    inventoryRows.forEach((row) => {
      const label = labelFor(row, "warehouse", warehouseIndex, getRefName(row, "warehouse"));
      map.set(label, (map.get(label) ?? 0) + (quantityOf(row) ?? 0));
    });
    return [...map.entries()]
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6);
  }, [inventoryRows, warehouseIndex]);

  const productsByCategory = useMemo(() => {
    const map = new Map<string, number>();
    productRows.forEach((row) => {
      const label = labelFor(row, "category", categoryIndex, getRefName(row, "category"));
      map.set(label, (map.get(label) ?? 0) + 1);
    });
    return [...map.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [productRows, categoryIndex]);

  const lowStockItems = useMemo(
    () =>
      stockRows
        .filter((item) => item.status === "low" || item.status === "out")
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 6),
    [stockRows],
  );

  const recentActivity = useMemo(() => {
    const entries = [
      ...purchaseRows.map((row) => ({
        kind: "purchase" as const,
        row,
        date: parseDate(pick(row, ["purchaseDate", "purchase_date", "date", "createdAt"])),
      })),
      ...saleRows.map((row) => ({
        kind: "sale" as const,
        row,
        date: parseDate(pick(row, ["saleDate", "sale_date", "date", "createdAt"])),
      })),
    ];
    return entries
      .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
      .slice(0, 7);
  }, [purchaseRows, saleRows]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="A live snapshot of stock, purchasing and sales performance."
        actions={
          <Button variant="outline" onClick={refreshAll}>
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Package} label="Total Products" value={formatNumber(productRows.length)} hint={`${categoryRows.length} categories`} loading={products.isLoading} />
        <StatCard icon={IndianRupee} label="Stock Value" value={formatCurrencyShort(totals.stockValue)} hint="Quantity × selling price" loading={loading} />
        <StatCard icon={AlertTriangle} label="Low / Out of Stock" value={formatNumber(totals.lowStock)} hint="Items needing attention" tone={totals.lowStock > 0 ? "warning" : "default"} loading={inventory.isLoading} />
        <StatCard icon={Boxes} label="Total Stock Units" value={formatNumber(stockRows.reduce((sum, item) => sum + item.quantity, 0))} hint={`${warehouseRows.length} warehouses`} loading={inventory.isLoading} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ShoppingCart} label="Purchases" value={formatNumber(purchaseRows.length)} hint={formatCurrencyShort(totals.purchaseValue)} loading={purchases.isLoading} />
        <StatCard icon={Receipt} label="Sales" value={formatNumber(saleRows.length)} hint={formatCurrencyShort(totals.salesValue)} loading={sales.isLoading} />
        <StatCard icon={Truck} label="Suppliers" value={formatNumber((suppliers.data ?? []).length)} hint="Active partners" loading={suppliers.isLoading} />
        <StatCard icon={WarehouseIcon} label="Warehouses" value={formatNumber(warehouseRows.length)} hint="Storage locations" loading={warehouses.isLoading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Purchases vs Sales</CardTitle>
            <CardDescription>Value over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ left: 4, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="purchasesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={70}
                    tickFormatter={(value: number) => formatCurrencyShort(value)}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.75rem",
                      color: "var(--color-popover-foreground)",
                      fontSize: "0.8rem",
                    }}
                    formatter={(value: number | string) => formatCurrency(value)}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "0.8rem" }} />
                  <Area type="monotone" dataKey="purchases" name="Purchases" stroke="var(--color-chart-1)" fill="url(#purchasesFill)" strokeWidth={2} />
                  <Area type="monotone" dataKey="sales" name="Sales" stroke="var(--color-chart-2)" fill="url(#salesFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
            <CardDescription>Top 5 categories</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : productsByCategory.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No product data yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={productsByCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {productsByCategory.map((entry, index) => (
                      <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.75rem",
                      color: "var(--color-popover-foreground)",
                      fontSize: "0.8rem",
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "0.75rem" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Stock by Warehouse</CardTitle>
            <CardDescription>Units currently on hand</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : stockByWarehouse.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No inventory recorded yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockByWarehouse} margin={{ left: 4, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={50} />
                  <Tooltip
                    cursor={{ fill: "var(--color-muted)" }}
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.75rem",
                      color: "var(--color-popover-foreground)",
                      fontSize: "0.8rem",
                    }}
                  />
                  <Bar dataKey="quantity" name="Units" fill="var(--color-primary)" radius={[6, 6, 0, 0]} maxBarSize={56} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
            <div>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>Items at or below minimum</CardDescription>
            </div>
            <Link
              to="/inventory"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View
              <ArrowUpRight className="size-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {inventory.isLoading ? (
              <>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </>
            ) : lowStockItems.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Everything is well stocked.
              </p>
            ) : (
              lowStockItems.map((item, index) => (
                <div
                  key={getId(item.row, "inventory") ?? index}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {item.product ? getName(item.product, "product") : labelFor(item.row, "product", productIndex, getRefName(item.row, "product"))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(item.quantity)} units
                      {item.minimum !== undefined ? ` · min ${formatNumber(item.minimum)}` : ""}
                    </p>
                  </div>
                  <StockBadge status={item.status} />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest purchases and sales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </>
          ) : recentActivity.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No transactions recorded yet.</p>
          ) : (
            recentActivity.map((entry, index) => {
              const qty = pickNumber(entry.row, ["quantity", "qty"]) ?? 0;
              const price =
                pickNumber(
                  entry.row,
                  entry.kind === "purchase"
                    ? ["purchasePrice", "purchase_price", "unitPrice", "price", "cost"]
                    : ["sellingPrice", "selling_price", "unitPrice", "price"],
                ) ?? 0;
              return (
                <div
                  key={`${entry.kind}-${getId(entry.row, entry.kind) ?? index}`}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/60"
                >
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                      entry.kind === "purchase"
                        ? "bg-chart-1/15 text-chart-1"
                        : "bg-chart-2/15 text-chart-2"
                    }`}
                  >
                    {entry.kind === "purchase" ? (
                      <ShoppingCart className="size-4" />
                    ) : (
                      <Receipt className="size-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {entry.kind === "purchase" ? "Purchased" : "Sold"} {formatNumber(qty)} ×{" "}
                      {labelFor(entry.row, "product", productIndex, getRefName(entry.row, "product"))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(entry.date)} ·{" "}
                      {labelFor(entry.row, "warehouse", warehouseIndex, getRefName(entry.row, "warehouse"))}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">
                    {formatCurrency(qty * price)}
                  </span>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
