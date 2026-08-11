import { useRouterState } from "@tanstack/react-router";
import { Bell, Menu, Moon, Search, Sun } from "lucide-react";

import { SidebarNav, navItems } from "@/components/layout/SidebarNav";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Topbar({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const current =
    navItems.find((item) => (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)))
      ?.label ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Open navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav collapsed={false} />
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">Inventory Management</p>
        <p className="truncate text-sm font-semibold text-foreground">{current}</p>
      </div>

      <div className="relative hidden md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search this page..."
          className="w-56 pl-9 lg:w-72"
        />
      </div>

      <Button variant="ghost" size="icon" className="relative">
        <Bell className="size-5" />
        <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
        <span className="sr-only">Notifications</span>
      </Button>

      <Button variant="ghost" size="icon" onClick={toggle}>
        {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        <span className="sr-only">Toggle theme</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 px-1.5">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                AK
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Inventory Manager</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={toggle}>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
