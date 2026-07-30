import { motion } from "motion/react";
import {
  LayoutDashboard,
  MapPinned,
  Building2,
  DollarSign,
  TrendingUp,
  Star,
  Users,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Markets", icon: MapPinned },
  { label: "Neighborhoods", icon: Building2 },
  { label: "Revenue", icon: DollarSign },
  { label: "Trends", icon: TrendingUp },
  { label: "Reviews", icon: Star },
  { label: "Hosts", icon: Users },
  { label: "Settings", icon: Settings },
];

export function AppSidebar({
  active,
  onSelect,
  open,
  onClose,
}: {
  active: string;
  onSelect: (label: string) => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <motion.aside
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[262px] flex-col border-r border-border bg-sidebar/85 px-4 py-6 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
              <Sparkles className="size-4.5" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-[15px] font-bold">StayScope AI</p>
              <p className="text-[11px] text-muted-foreground">Market Intelligence</p>
            </div>
          </div>
          <button
            aria-label="Close navigation"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {items.map(({ label, icon: Icon }) => {
            const isActive = active === label;
            return (
              <button
                key={label}
                onClick={() => onSelect(label)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl border border-primary/25 bg-primary/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon
                  className={cn("relative size-4.5", isActive && "text-primary")}
                  strokeWidth={1.9}
                />
                <span className="relative font-medium">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="glass-card mt-4 p-4">
          <p className="text-[11px] font-semibold tracking-wide text-gold">PRO INSIGHTS</p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Unlock forecasting across 148 global markets.
          </p>
          <button className="mt-3 w-full rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-shadow hover:shadow-[var(--shadow-glow)]">
            Upgrade
          </button>
        </div>
      </motion.aside>
    </>
  );
}
