import { Bell, Menu, Moon, Search, Sun } from "lucide-react";

export function TopBar({
  onMenu,
  theme,
  onToggleTheme,
}: {
  onMenu: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 -mx-4 mb-6 border-b border-border bg-background/70 px-4 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          aria-label="Open navigation"
          onClick={onMenu}
          className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground lg:hidden"
        >
          <Menu className="size-4.5" />
        </button>

        <div className="relative flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search neighborhoods, hosts, markets…"
            className="h-11 w-full rounded-2xl border border-border bg-card/60 pl-10 pr-4 text-sm outline-none backdrop-blur-xl transition-shadow placeholder:text-muted-foreground focus:border-primary/40 focus:shadow-[var(--shadow-glow)]"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            aria-label="Toggle theme"
            onClick={onToggleTheme}
            className="rounded-xl border border-border p-2.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
          </button>
          <button
            aria-label="Notifications"
            className="relative rounded-xl border border-border p-2.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Bell className="size-4.5" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
          </button>
          <div className="flex items-center gap-2.5 rounded-2xl border border-border py-1.5 pl-1.5 pr-3.5">
            <span className="num grid size-8 place-items-center rounded-xl bg-accent/20 text-xs font-semibold text-accent">
              AV
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-semibold">Ava Reyes</p>
              <p className="text-[11px] text-muted-foreground">Portfolio Analyst</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
