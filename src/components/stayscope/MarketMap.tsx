import { AnimatePresence, motion } from "motion/react";
import { Star, TrendingDown, TrendingUp, X } from "lucide-react";
import { currency, type Neighborhood } from "@/lib/stayscope-data";
import { Pill } from "./ui-bits";
import { cn } from "@/lib/utils";

function bubbleTone(n: Neighborhood) {
  if (n.occupancy < 66) return "coral";
  if (n.reviews >= 4.9) return "gold";
  if (n.revenue >= 2_000_000) return "accent";
  return "primary";
}

const toneVar: Record<string, string> = {
  primary: "var(--primary)",
  accent: "var(--accent)",
  gold: "var(--gold)",
  coral: "var(--coral)",
};

export function MarketMap({
  data,
  selected,
  onSelect,
}: {
  data: Neighborhood[];
  selected: Neighborhood | null;
  onSelect: (n: Neighborhood | null) => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card relative overflow-hidden p-0"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
        <div>
          <h3 className="text-base font-bold">Live Market Map</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Bubble size reflects listing volume · click a neighborhood for the full profile
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill tone="primary">High occupancy</Pill>
          <Pill tone="accent">High revenue</Pill>
          <Pill tone="gold">Top reviews</Pill>
          <Pill tone="coral">Low occupancy</Pill>
        </div>
      </div>

      <div className="relative h-[420px] w-full overflow-hidden sm:h-[500px]">
        <div className="hero-glow absolute inset-0" />
        <svg className="absolute inset-0 size-full opacity-[0.5]" aria-hidden>
          <defs>
            <pattern id="grid" width="46" height="46" patternUnits="userSpaceOnUse">
              <path
                d="M46 0H0V46"
                fill="none"
                stroke="currentColor"
                className="text-border"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path
            d="M -40 300 C 180 220, 300 380, 520 300 S 900 240, 1200 330"
            fill="none"
            stroke="currentColor"
            className="text-sky/25"
            strokeWidth="26"
            strokeLinecap="round"
          />
          <path
            d="M 120 -20 C 200 160, 140 320, 260 520"
            fill="none"
            stroke="currentColor"
            className="text-border"
            strokeWidth="2"
          />
          <path
            d="M 700 -20 C 640 200, 780 340, 720 540"
            fill="none"
            stroke="currentColor"
            className="text-border"
            strokeWidth="2"
          />
        </svg>

        {data.map((n, i) => {
          const tone = bubbleTone(n);
          const size = 42 + (n.listings / 613) * 46;
          const isActive = selected?.id === n.id;
          return (
            <motion.button
              key={n.id}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.07, type: "spring", stiffness: 220, damping: 18 }}
              whileHover={{ scale: 1.14 }}
              onClick={() => onSelect(isActive ? null : n)}
              style={{
                left: `${n.x}%`,
                top: `${n.y}%`,
                width: size,
                height: size,
                background: `radial-gradient(circle at 32% 28%, color-mix(in oklab, ${toneVar[tone]} 62%, transparent), color-mix(in oklab, ${toneVar[tone]} 14%, transparent))`,
                boxShadow: `0 0 0 1px color-mix(in oklab, ${toneVar[tone]} 45%, transparent), 0 0 38px color-mix(in oklab, ${toneVar[tone]} ${isActive ? 55 : 30}%, transparent)`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              aria-label={`${n.name} details`}
            >
              <span className="num absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] font-semibold text-foreground">
                {n.occupancy.toFixed(0)}%
              </span>
              <span className="absolute left-1/2 top-[calc(100%+6px)] w-max -translate-x-1/2 text-[11px] font-medium text-muted-foreground">
                {n.name}
              </span>
            </motion.button>
          );
        })}

        <AnimatePresence>
          {selected && (
            <motion.aside
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-3 right-3 z-10 w-[min(340px,calc(100%-24px))] overflow-y-auto rounded-2xl border border-border bg-card/85 p-4 backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold">{selected.name}</h4>
                  <p className="text-xs text-muted-foreground">{selected.city}</p>
                </div>
                <button
                  aria-label="Close panel"
                  onClick={() => onSelect(null)}
                  className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              <img
                src={selected.photo}
                alt={`${selected.name} listing`}
                loading="lazy"
                className="mt-3 h-28 w-full rounded-xl object-cover"
              />

              {selected.badge && (
                <div className="mt-3">
                  <Pill tone={selected.badge === "Top Pick" ? "gold" : "primary"}>
                    ★ {selected.badge}
                  </Pill>
                </div>
              )}

              <dl className="mt-3 grid grid-cols-2 gap-2">
                {[
                  ["Avg price", `$${selected.price}`],
                  ["Occupancy", `${selected.occupancy}%`],
                  ["Revenue", currency(selected.revenue)],
                  ["Reviews", selected.reviews.toFixed(2)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-border bg-surface/50 px-3 py-2">
                    <dt className="text-[11px] text-muted-foreground">{k}</dt>
                    <dd className="num mt-0.5 text-sm font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-3 flex items-center justify-between rounded-xl border border-border px-3 py-2">
                <div>
                  <p className="text-[11px] text-muted-foreground">Top host</p>
                  <p className="text-sm font-semibold">{selected.topHost}</p>
                </div>
                <span className="num flex items-center gap-1 text-xs text-gold">
                  <Star className="size-3.5" /> {selected.hostListings} listings
                </span>
              </div>

              <p
                className={cn(
                  "num mt-3 flex items-center gap-1.5 text-sm font-semibold",
                  selected.trend >= 0 ? "text-primary" : "text-coral",
                )}
              >
                {selected.trend >= 0 ? (
                  <TrendingUp className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}
                {selected.trend > 0 ? "+" : ""}
                {selected.trend}% YoY revenue
              </p>

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {selected.summary}
              </p>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
