import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

export function useCountUp(target: number, decimals = 0, duration = 1100) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return { ref, text: value.toFixed(decimals) };
}

export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const { ref, text } = useCountUp(value, decimals);
  return (
    <span ref={ref} className={cn("num", className)}>
      {prefix}
      {Number(text).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

const toneStroke: Record<string, string> = {
  primary: "var(--primary)",
  gold: "var(--gold)",
  accent: "var(--accent)",
  sky: "var(--sky)",
  coral: "var(--coral)",
};

export function Sparkline({ data, tone = "primary" }: { data: number[]; tone?: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 30 - ((d - min) / span) * 26 - 2;
    return `${x},${y}`;
  });
  const id = `spark-${tone}-${data.length}-${Math.round(max)}`;

  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-9 w-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={toneStroke[tone]} stopOpacity="0.35" />
          <stop offset="100%" stopColor={toneStroke[tone]} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polyline
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        points={pts.join(" ")}
        fill="none"
        stroke={toneStroke[tone]}
        strokeWidth="1.8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <polygon points={`0,30 ${pts.join(" ")} 100,30`} fill={`url(#${id})`} />
    </svg>
  );
}

export function Panel({
  title,
  subtitle,
  action,
  className,
  delay = 0,
  children,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("glass-card glass-card-hover p-5 sm:p-6", className)}
    >
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-base font-bold">{title}</h3>}
            {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </motion.section>
  );
}

export function Pill({
  children,
  tone = "primary",
}: {
  children: React.ReactNode;
  tone?: "primary" | "gold" | "accent" | "coral";
}) {
  const tones = {
    primary: "bg-primary/12 text-primary",
    gold: "bg-gold/12 text-gold",
    accent: "bg-accent/15 text-accent",
    coral: "bg-coral/12 text-coral",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
