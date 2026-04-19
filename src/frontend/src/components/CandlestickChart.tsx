import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  ErrorBar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Candle, ChartCandle } from "../types/bitcoin";

interface CandlestickChartProps {
  candles: Candle[];
  isLoading?: boolean;
}

function formatPrice(v: number) {
  if (v >= 100000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function formatTime(ts: bigint) {
  const d = new Date(Number(ts) / 1_000_000);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

const CustomTooltip = ({
  active,
  payload,
}: { active?: boolean; payload?: { payload: ChartCandle }[] }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const color = d.bullish ? "#02c076" : "#f84960";
  return (
    <div className="bg-[#1e2329] border border-[#2b3139] rounded p-3 font-mono text-xs shadow-xl">
      <div className="text-[#848e9c] mb-2">#{d.index + 1}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span className="text-[#848e9c]">O</span>
        <span style={{ color }}>
          ${d.open.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
        <span className="text-[#848e9c]">H</span>
        <span style={{ color: "#02c076" }}>
          ${d.high.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
        <span className="text-[#848e9c]">L</span>
        <span style={{ color: "#f84960" }}>
          ${d.low.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
        <span className="text-[#848e9c]">C</span>
        <span style={{ color }}>
          ${d.close.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};

function LoadingSkeleton() {
  const skeletonBars = Array.from({ length: 20 }, (_, i) => ({
    id: `skel-${i}`,
    height: 30 + ((i * 17 + 13) % 70),
    delay: i * 40,
  }));
  return (
    <div
      data-ocid="chart.loading_state"
      className="h-80 flex items-end gap-1 p-4"
    >
      {skeletonBars.map((bar) => (
        <div
          key={bar.id}
          className="flex-1 flex flex-col items-center justify-end gap-0.5"
        >
          <div className="w-0.5 h-4 bg-[#2b3139] rounded animate-pulse" />
          <div
            className="w-full bg-[#1e2329] rounded-sm animate-pulse"
            style={{
              height: `${bar.height}%`,
              animationDelay: `${bar.delay}ms`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function CandlestickChart({
  candles,
  isLoading,
}: CandlestickChartProps) {
  const data = useMemo<ChartCandle[]>(() => {
    return candles.map((c, i) => {
      const bullish = c.close >= c.open;
      const bodyBottom = Math.min(c.open, c.close);
      const bodyHeight = Math.max(Math.abs(c.close - c.open), c.close * 0.0003);
      return {
        index: i,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        timestamp: Number(c.timestamp),
        bullish,
        bodyBottom,
        bodyHeight,
      };
    });
  }, [candles]);

  const prices = data.flatMap((d) => [d.high, d.low]);
  const minPrice = prices.length ? Math.min(...prices) * 0.9995 : 0;
  const maxPrice = prices.length ? Math.max(...prices) * 1.0005 : 100000;

  if (isLoading || !data.length) {
    return (
      <div className="bg-[#0b0e11] border border-[#23272e] rounded-sm mx-4 mb-4">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#23272e]">
          <span className="font-mono text-xs text-[#848e9c] uppercase tracking-widest">
            BTC/USD · 30-Candle OHLC
          </span>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div
      data-ocid="chart.panel"
      className="bg-[#0b0e11] border border-[#23272e] rounded-sm mx-4 mb-4"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#23272e]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-[#eaecef] font-bold">
            BTC/USD
          </span>
          <span className="font-mono text-xs text-[#848e9c]">
            OHLC · {data.length} candles
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs text-[#848e9c]">
          <span>
            <span
              className="w-2 h-2 inline-block rounded-sm mr-1"
              style={{ backgroundColor: "#02c076" }}
            />
            Bullish
          </span>
          <span>
            <span
              className="w-2 h-2 inline-block rounded-sm mr-1"
              style={{ backgroundColor: "#f84960" }}
            />
            Bearish
          </span>
        </div>
      </div>

      <div className="p-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#23272e"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(v) => formatTime(BigInt(v))}
              tick={{
                fill: "#848e9c",
                fontSize: 10,
                fontFamily: "JetBrains Mono, monospace",
              }}
              axisLine={{ stroke: "#23272e" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tickFormatter={formatPrice}
              tick={{
                fill: "#848e9c",
                fontSize: 10,
                fontFamily: "JetBrains Mono, monospace",
              }}
              axisLine={false}
              tickLine={false}
              width={60}
              orientation="right"
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
            />

            {/* Wick lines via ErrorBar */}
            <Bar
              dataKey="bodyBottom"
              stackId="candle"
              fill="transparent"
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((d) => (
                <Cell key={`wick-${d.index}`} fill="transparent" />
              ))}
              <ErrorBar
                dataKey="bodyHeight"
                width={0}
                strokeWidth={1.5}
                stroke="#848e9c"
                direction="y"
              />
            </Bar>

            {/* Candle bodies */}
            <Bar
              dataKey="bodyHeight"
              stackId="body"
              minPointSize={2}
              isAnimationActive={false}
            >
              {data.map((d) => (
                <Cell
                  key={`body-${d.index}`}
                  fill={d.bullish ? "#02c076" : "#f84960"}
                  stroke={d.bullish ? "#02c076" : "#f84960"}
                  strokeWidth={0}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
