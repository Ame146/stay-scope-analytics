import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ArrowUpRight, Download, FileText, TrendingDown, TrendingUp, Upload } from "lucide-react";
import { AppSidebar } from "@/components/stayscope/AppSidebar";
import { TopBar } from "@/components/stayscope/TopBar";
import { MarketMap } from "@/components/stayscope/MarketMap";
import {
  AvailabilityPanel,
  ComparePanel,
  HostRankingsPanel,
  InsightsPanel,
  OccupancyTrendPanel,
  PriceTrendPanel,
  RevenueHeatmapPanel,
  ReviewsPanel,
  SeasonalityPanel,
} from "@/components/stayscope/Panels";
import { CountUp, Sparkline } from "@/components/stayscope/ui-bits";
import { kpis, neighborhoods, type Neighborhood } from "@/lib/stayscope-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StayScope AI — Airbnb Market Intelligence Dashboard" },
      {
        name: "description",
        content:
          "Analyze Airbnb pricing, occupancy, revenue and guest satisfaction across neighborhoods with StayScope AI's premium market intelligence dashboard.",
      },
      { property: "og:title", content: "StayScope AI — Airbnb Market Intelligence" },
      {
        property: "og:description",
        content:
          "Neighborhood-level Airbnb analytics: pricing, occupancy, revenue, host rankings and AI investment insights.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function exportCsv() {
  const header = "neighborhood,city,avg_price,occupancy,revenue,review_score,listings,top_host";
  const rows = neighborhoods.map((n) =>
    [n.name, n.city, n.price, n.occupancy, n.revenue, n.reviews, n.listings, n.topHost].join(","),
  );
  const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "stayscope-neighborhoods.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function Dashboard() {
  const [nav, setNav] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selected, setSelected] = useState<Neighborhood | null>(null);
  const [compare, setCompare] = useState({ a: "sea-cliff", b: "harbor-point" });

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
  };

  return (
    <div className="min-h-screen w-full">
      <AppSidebar
        active={nav}
        onSelect={(l) => {
          setNav(l);
          setMenuOpen(false);
        }}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="lg:pl-[262px]">
        <div className="px-4 pb-16 sm:px-8">
          <TopBar onMenu={() => setMenuOpen(true)} theme={theme} onToggleTheme={toggleTheme} />

          {/* Hero */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card hero-glow relative overflow-hidden p-7 sm:p-10"
          >
            <span className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold tracking-wide text-primary">
              148 MARKETS · 62,400 LISTINGS TRACKED
            </span>
            <h1 className="mt-5 max-w-3xl text-3xl leading-[1.08] sm:text-5xl">
              Discover the Best Airbnb Investment Opportunities
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Analyze pricing, occupancy, guest satisfaction and revenue across neighborhoods — in
              one intelligence layer built for operators and investors.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]">
                <Upload className="size-4" /> Upload Dataset
              </button>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-border px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-primary/40">
                Explore Demo <ArrowUpRight className="size-4" />
              </button>
            </div>
          </motion.section>

          {/* Section header + exports */}
          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-[28px]">Neighborhood Intelligence Dashboard</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Analyze Airbnb performance across cities.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportCsv}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold transition-colors hover:border-primary/40"
              >
                <Download className="size-4" /> Export CSV
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold transition-colors hover:border-primary/40"
              >
                <FileText className="size-4" /> Export PDF
              </button>
            </div>
          </div>

          {/* KPI cards */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((k, i) => (
              <motion.article
                key={k.key}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card glass-card-hover p-5"
              >
                <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
                <div className="mt-2 flex items-end justify-between gap-2">
                  <CountUp
                    value={k.value}
                    decimals={k.key === "revenue" ? 2 : k.key === "occupancy" ? 1 : 2}
                    prefix={k.prefix}
                    suffix={k.suffix}
                    className="text-[26px] font-bold leading-none"
                  />
                  <span
                    className={cn(
                      "num flex items-center gap-1 text-xs font-semibold",
                      k.delta >= 0 ? "text-primary" : "text-coral",
                    )}
                  >
                    {k.delta >= 0 ? (
                      <TrendingUp className="size-3.5" />
                    ) : (
                      <TrendingDown className="size-3.5" />
                    )}
                    {Math.abs(k.delta)}%
                  </span>
                </div>
                <div className="mt-3">
                  <Sparkline data={k.spark} tone={k.tone} />
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">{k.caption}</p>
              </motion.article>
            ))}
          </div>

          {/* Map */}
          <div className="mt-6">
            <MarketMap data={neighborhoods} selected={selected} onSelect={setSelected} />
          </div>

          <div className="mt-6">
            <InsightsPanel />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <PriceTrendPanel />
            <OccupancyTrendPanel />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <HostRankingsPanel />
            <RevenueHeatmapPanel />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <ReviewsPanel />
            <SeasonalityPanel />
            <AvailabilityPanel />
          </div>

          <div className="mt-6">
            <ComparePanel
              a={compare.a}
              b={compare.b}
              onChange={(slot, id) => setCompare((c) => ({ ...c, [slot]: id }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
