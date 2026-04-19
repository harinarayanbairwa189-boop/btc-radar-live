import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PriceSnapshot } from "../types/bitcoin";

interface PriceHeroProps {
  current?: PriceSnapshot | null;
  previous?: PriceSnapshot | null;
  sentimentAvg?: number;
  isLoading?: boolean;
}

function SentimentGauge({ value }: { value: number }) {
  const pct = Math.round(((value + 1) / 2) * 100);
  const color = value > 0.1 ? "#02c076" : value < -0.1 ? "#f84960" : "#f0b90b";
  const label = value > 0.1 ? "BULLISH" : value < -0.1 ? "BEARISH" : "NEUTRAL";

  return (
    <div data-ocid="sentiment.gauge" className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-[#848e9c] text-xs uppercase tracking-widest font-mono">
          Sentiment Score
        </span>
        <span className="font-mono text-xs text-[#848e9c]">
          {value.toFixed(3)}
        </span>
      </div>
      <div className="font-mono text-2xl font-bold" style={{ color }}>
        {pct}
        <span className="text-sm ml-1 font-normal text-[#848e9c]">/ 100</span>
      </div>
      <div className="relative h-1.5 bg-[#23272e] rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span
        className="text-xs font-mono font-bold tracking-widest"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}

function PriceStat({
  label,
  value,
  prefix,
  direction,
  pctChange,
}: {
  label: string;
  value: string;
  prefix: string;
  direction: "up" | "down" | "flat";
  pctChange?: string;
}) {
  const dirColor =
    direction === "up"
      ? "#02c076"
      : direction === "down"
        ? "#f84960"
        : "#848e9c";
  const DirIcon =
    direction === "up"
      ? TrendingUp
      : direction === "down"
        ? TrendingDown
        : Minus;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[#848e9c] text-xs uppercase tracking-widest font-mono">
          {label}
        </span>
        <div className="flex items-center gap-1" style={{ color: dirColor }}>
          <DirIcon className="w-3.5 h-3.5" />
          {pctChange && <span className="font-mono text-xs">{pctChange}</span>}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          className="font-mono font-bold tracking-tight tabular-nums leading-none"
          style={{ fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)", color: dirColor }}
        >
          <span className="text-[#848e9c] font-normal mr-1 text-lg">
            {prefix}
          </span>
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function PriceHero({
  current,
  previous,
  sentimentAvg = 0,
  isLoading,
}: PriceHeroProps) {
  const usd = current?.usd ?? 0;
  const inr = current?.inr ?? 0;
  const prevUsd = previous?.usd ?? usd;

  const direction = usd > prevUsd ? "up" : usd < prevUsd ? "down" : "flat";
  const pctChange =
    prevUsd > 0 ? (((usd - prevUsd) / prevUsd) * 100).toFixed(2) : "0.00";
  const pctDisplay = `${direction === "up" ? "+" : ""}${pctChange}%`;

  const fmtUsd = usd.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const fmtInr = inr.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (isLoading) {
    return (
      <div
        data-ocid="price_hero.loading_state"
        className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#23272e] border-b border-[#23272e]"
      >
        {(["s1", "s2", "s3", "s4"] as const).map((id) => (
          <div key={id} className="bg-[#0b0e11] p-5 flex flex-col gap-3">
            <div className="h-3 w-24 bg-[#1e2329] rounded animate-pulse" />
            <div className="h-8 w-40 bg-[#1e2329] rounded animate-pulse" />
            <div className="h-2 w-32 bg-[#1e2329] rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      data-ocid="price_hero.section"
      className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#23272e] border-b border-[#23272e]"
    >
      <div className="bg-[#0b0e11] p-5">
        <PriceStat
          label="BTC / USD"
          value={fmtUsd}
          prefix="$"
          direction={direction}
          pctChange={pctDisplay}
        />
      </div>
      <div className="bg-[#0b0e11] p-5">
        <PriceStat
          label="BTC / INR"
          value={fmtInr}
          prefix="₹"
          direction={direction}
        />
      </div>
      <div className="bg-[#0b0e11] p-5">
        <SentimentGauge value={sentimentAvg} />
      </div>
      <div className="bg-[#0b0e11] p-5">
        <div className="flex flex-col gap-2">
          <span className="text-[#848e9c] text-xs uppercase tracking-widest font-mono">
            24h Change
          </span>
          <div
            className="font-mono font-bold text-2xl tabular-nums"
            style={{
              color:
                direction === "up"
                  ? "#02c076"
                  : direction === "down"
                    ? "#f84960"
                    : "#848e9c",
            }}
          >
            {pctDisplay}
          </div>
          <div className="font-mono text-sm text-[#848e9c] tabular-nums">
            {direction === "up" ? "+" : direction === "down" ? "-" : ""}$
            {Math.abs(usd - prevUsd).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  direction === "up"
                    ? "#02c076"
                    : direction === "down"
                      ? "#f84960"
                      : "#848e9c",
              }}
            />
            <span className="font-mono text-xs text-[#848e9c]">
              {direction === "up"
                ? "Upward trend"
                : direction === "down"
                  ? "Downward trend"
                  : "Stable"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
