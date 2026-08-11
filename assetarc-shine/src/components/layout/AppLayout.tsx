import { createContext, useContext, useState, type ReactNode } from "react";

import { SidebarNav } from "@/components/layout/SidebarNav";
import { Topbar } from "@/components/layout/Topbar";
import { cn } from "@/lib/utils";

const GlobalSearchContext = createContext<{ search: string; setSearch: (v: string) => void }>({
  search: "",
  setSearch: () => {},
});

export function useGlobalSearch() {
  return useContext(GlobalSearchContext);
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <GlobalSearchContext.Provider value={{ search, setSearch }}>
      <div className="flex min-h-screen w-full bg-background">
        <aside
          className={cn(
            "hidden shrink-0 border-r border-sidebar-border transition-[width] duration-300 lg:block",
            collapsed ? "w-[76px]" : "w-64",
          )}
        >
          <div className="sticky top-0 h-screen">
            <SidebarNav
              collapsed={collapsed}
              onToggleCollapse={() => setCollapsed((prev) => !prev)}
            />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar search={search} onSearchChange={setSearch} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1400px] space-y-6 duration-300 animate-in fade-in slide-in-from-bottom-1">
              {children}
            </div>
          </main>
        </div>
      </div>
    </GlobalSearchContext.Provider>
  );
}
