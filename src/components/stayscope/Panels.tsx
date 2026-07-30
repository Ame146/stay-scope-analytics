import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Sparkles, Star, TrendingDown, TrendingUp } from "lucide-react";
import {
  availability,
  currency,
  hosts,
  insights,
  neighborhoods,
  priceTrend,
  revenueTrend,
  reviews,
  seasonality,
} from "@/lib/stayscope-data";
import { CountUp, Panel, Pill } from "./ui-bits";
import { cn } from "@/lib/utils";

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  fontSize: 12,
  color: "var(--foreground)",
};

export function PriceTrendPanel() {
  return (
    <Panel
      title="Price Trend"
      subtitle="Your portfolio vs. market median nightly rate"
      delay={0.05}
    >
      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={priceTrend} margin={{ left: -22, right: 6, top: 6 }}>
          <defs>
            <linearGradient id="gPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.45} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="m" {...axis} />
          <YAxis {...axis} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--border)" }} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="var(--accent)"
            strokeWidth={2.2}
            fill="url(#gPrice)"
            animationDuration={1200}
          />
          <Line
            type="monotone"
            dataKey="market"
            stroke="var(--sky)"
            strokeWidth={1.8}
            strokeDasharray="4 4"
            dot={false}
            animationDuration={1400}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Panel>
  );
}

export function OccupancyTrendPanel() {
  return (
    <Panel title="Occupancy Trend" subtitle="Monthly booked-night rate" delay={0.1}>
      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={revenueTrend} margin={{ left: -22, right: 6, top: 6 }}>
          <defs>
            <linearGradient id="gOcc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="m" {...axis} />
          <YAxis {...axis} domain={[50, 100]} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--border)" }} />
          <Area
            type="monotone"
            dataKey="occupancy"
            stroke="var(--primary)"
            strokeWidth={2.2}
            fill="url(#gOcc)"
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Panel>
  );
}

export function HostRankingsPanel() {
  const max = Math.max(...hosts.map((h) => h.revenue));
  return (
    <Panel title="Host Rankings" subtitle="Top earners across tracked markets" delay={0.05}>
      <ul className="space-y-3">
        {hosts.map((h, i) => (
          <li key={h.name} className="flex items-center gap-3">
            <span className="num grid size-8 shrink-0 place-items-center rounded-xl bg-surface/70 text-xs font-semibold text-muted-foreground">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-semibold">{h.name}</p>
                <span className="num text-sm text-gold">{currency(h.revenue)}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-gold/70"
                  style={{ width: `${(h.revenue / max) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {h.area} · {h.listings} listings ·{" "}
                <span className="num">{h.score.toFixed(2)}★</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function RevenueHeatmapPanel() {
  const max = Math.max(...neighborhoods.map((n) => n.revenue));
  return (
    <Panel title="Revenue Heatmap" subtitle="Trailing 12-month revenue by neighborhood" delay={0.1}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {neighborhoods.map((n) => {
          const intensity = n.revenue / max;
          return (
            <div
              key={n.id}
              className="rounded-2xl border border-border p-3 transition-transform hover:-translate-y-1"
              style={{
                background: `color-mix(in oklab, var(--gold) ${8 + intensity * 26}%, transparent)`,
              }}
            >
              <p className="truncate text-xs text-muted-foreground">{n.name}</p>
              <p className="num mt-1 text-lg font-bold">{currency(n.revenue)}</p>
              <p
                className={cn(
                  "num mt-0.5 text-[11px]",
                  n.trend >= 0 ? "text-primary" : "text-coral",
                )}
              >
                {n.trend > 0 ? "+" : ""}
                {n.trend}%
              </p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

export function ReviewsPanel() {
  return (
    <Panel title="Recent Reviews" subtitle="Guest sentiment stream" delay={0.05}>
      <ul className="space-y-3">
        {reviews.map((r) => (
          <li key={r.guest} className="rounded-2xl border border-border bg-surface/40 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{r.guest}</p>
              <span className="num flex items-center gap-1 text-xs text-gold">
                <Star className="size-3.5 fill-current" /> {r.score}.0
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{r.text}</p>
            <p className="mt-2 text-[11px] text-muted-foreground/80">{r.area}</p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function SeasonalityPanel() {
  return (
    <Panel title="Seasonality" subtitle="Demand index by season" delay={0.1}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={seasonality} margin={{ left: -24, right: 6, top: 6 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="q" {...axis} />
          <YAxis {...axis} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--border)" }} />
          <Bar dataKey="demand" radius={[10, 10, 4, 4]} animationDuration={1100}>
            {seasonality.map((s, i) => (
              <Cell
                key={s.q}
                fill={["var(--sky)", "var(--primary)", "var(--gold)", "var(--accent)"][i]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Panel>
  );
}

export function AvailabilityPanel() {
  const tones = ["primary", "accent", "sky"] as const;
  return (
    <Panel title="Availability" subtitle="Next 30 nights across the portfolio" delay={0.15}>
      <div className="space-y-4">
        {availability.map((a, i) => (
          <div key={a.label}>
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-muted-foreground">{a.label}</span>
              <CountUp value={a.value} suffix="%" className="text-sm font-semibold" />
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${a.value}%`,
                  background: `var(--${tones[i]})`,
                }}
              />
            </div>
          </div>
        ))}
        <div className="rounded-2xl border border-border bg-surface/40 p-3">
          <p className="text-xs text-muted-foreground">Median lead time</p>
          <CountUp value={18} suffix=" days" className="text-xl font-bold" />
        </div>
      </div>
    </Panel>
  );
}

export function InsightsPanel() {
  return (
    <Panel
      title="AI Insights"
      subtitle="Plain-language recommendations from your dataset"
      delay={0}
      action={<Pill tone="accent">Updated 3m ago</Pill>}
    >
      <ul className="grid gap-3 md:grid-cols-3">
        {insights.map((ins) => (
          <li
            key={ins.title}
            className="rounded-2xl border border-border bg-surface/40 p-4 transition-transform hover:-translate-y-1"
          >
            <Sparkles
              className={cn(
                "size-4",
                ins.tone === "primary" && "text-primary",
                ins.tone === "gold" && "text-gold",
                ins.tone === "coral" && "text-coral",
              )}
            />
            <p className="mt-2 text-sm font-semibold">{ins.title}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{ins.body}</p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function ComparePanel({
  a,
  b,
  onChange,
}: {
  a: string;
  b: string;
  onChange: (slot: "a" | "b", id: string) => void;
}) {
  const left = neighborhoods.find((n) => n.id === a)!;
  const right = neighborhoods.find((n) => n.id === b)!;
  const rows: [string, string, string, boolean][] = [
    ["Avg price", `$${left.price}`, `$${right.price}`, left.price >= right.price],
    ["Occupancy", `${left.occupancy}%`, `${right.occupancy}%`, left.occupancy >= right.occupancy],
    ["Revenue", currency(left.revenue), currency(right.revenue), left.revenue >= right.revenue],
    [
      "Review score",
      left.reviews.toFixed(2),
      right.reviews.toFixed(2),
      left.reviews >= right.reviews,
    ],
    ["Listings", `${left.listings}`, `${right.listings}`, left.listings >= right.listings],
  ];

  const select = (slot: "a" | "b", value: string) => (
    <select
      value={value}
      onChange={(e) => onChange(slot, e.target.value)}
      className="w-full rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-primary/40"
    >
      {neighborhoods.map((n) => (
        <option key={n.id} value={n.id}>
          {n.name}
        </option>
      ))}
    </select>
  );

  return (
    <Panel title="Compare Neighborhoods" subtitle="Side-by-side performance" delay={0.05}>
      <div className="grid grid-cols-2 gap-3">
        {select("a", a)}
        {select("b", b)}
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map(([label, lv, rv, leftWins]) => (
          <li
            key={label}
            className="grid grid-cols-3 items-center rounded-xl border border-border px-3 py-2 text-sm"
          >
            <span className={cn("num", leftWins ? "text-primary" : "text-muted-foreground")}>
              {lv}
            </span>
            <span className="text-center text-[11px] text-muted-foreground">{label}</span>
            <span
              className={cn("num text-right", !leftWins ? "text-primary" : "text-muted-foreground")}
            >
              {rv}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        {left.trend >= right.trend ? (
          <TrendingUp className="size-3.5 text-primary" />
        ) : (
          <TrendingDown className="size-3.5 text-coral" />
        )}
        {left.trend >= right.trend ? left.name : right.name} is growing faster year over year.
      </p>
    </Panel>
  );
}
