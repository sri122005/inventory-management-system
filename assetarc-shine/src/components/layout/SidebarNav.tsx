import { Link, useRouterState } from "@tanstack/react-router";
import {
  Boxes,
  ChevronLeft,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  Truck,
  User,
  Warehouse,
  Receipt,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products", label: "Products", icon: Package },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/suppliers", label: "Suppliers", icon: Truck },
  { to: "/warehouses", label: "Warehouses", icon: Warehouse },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/purchases", label: "Purchases", icon: ShoppingCart },
  { to: "/sales", label: "Sales", icon: Receipt },
] as const;

const bottomItems = [
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function SidebarNav({
  collapsed,
  onNavigate,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onNavigate?: (() => void) | undefined;
  onToggleCollapse?: (() => void) | undefined;
}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const renderItem = (item: { to: string; label: string; icon: typeof Package }) => {
    const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
    return (
      <Link
        key={item.to}
        to={item.to}
        onClick={onNavigate}
        title={collapsed ? item.label : undefined}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
          active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
          collapsed && "justify-center px-0",
        )}
      >
        <item.icon className="size-[18px] shrink-0" />
        {collapsed ? null : <span className="truncate">{item.label}</span>}
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col gap-2 bg-sidebar p-3">
      <div
        className={cn(
          "flex items-center gap-2.5 px-2 py-3",
          collapsed && "justify-center px-0",
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Boxes className="size-5" />
        </span>
        {collapsed ? null : (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">StockFlow</p>
            <p className="truncate text-xs text-muted-foreground">Inventory Suite</p>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {navItems.map(renderItem)}
      </nav>

      <div className="flex flex-col gap-1 border-t border-sidebar-border pt-2">
        {bottomItems.map(renderItem)}
        {onToggleCollapse ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={cn(
              "mt-1 justify-start gap-3 text-muted-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            <ChevronLeft
              className={cn("size-[18px] transition-transform", collapsed && "rotate-180")}
            />
            {collapsed ? null : "Collapse"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
