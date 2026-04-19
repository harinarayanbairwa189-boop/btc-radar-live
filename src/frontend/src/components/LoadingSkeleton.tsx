const CHART_HEIGHTS = [
  45, 62, 38, 71, 55, 80, 42, 68, 35, 73, 58, 88, 44, 65, 39, 77, 51, 85, 40,
  70, 53, 79, 46, 67, 36, 75, 49, 83, 43, 60,
];
const chartBars = CHART_HEIGHTS.map((h, i) => ({
  id: `cb-${i}`,
  height: h,
  delay: i * 30,
  green: i % 3 === 0,
}));

export function LoadingSkeleton() {
  return (
    <div
      data-ocid="app.loading_state"
      className="min-h-screen bg-[#0b0e11] flex flex-col"
    >
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161a1e] border-b border-[#23272e]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#2b3139] rounded animate-pulse" />
          <div className="h-4 w-40 bg-[#2b3139] rounded animate-pulse" />
        </div>
        <div className="h-3 w-24 bg-[#2b3139] rounded animate-pulse" />
      </div>

      {/* Status bar skeleton */}
      <div className="h-9 bg-[#161a1e] border-b border-[#23272e] animate-pulse" />

      {/* Hero stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#23272e] border-b border-[#23272e]">
        {(["h1", "h2", "h3", "h4"] as const).map((id) => (
          <div key={id} className="bg-[#0b0e11] p-5 flex flex-col gap-3">
            <div className="h-3 w-24 bg-[#1e2329] rounded animate-pulse" />
            <div className="h-8 w-40 bg-[#1e2329] rounded animate-pulse" />
            <div className="h-2 w-32 bg-[#1e2329] rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="bg-[#0b0e11] border border-[#23272e] rounded-sm m-4">
        <div className="h-10 border-b border-[#23272e] animate-pulse bg-[#0f1114]" />
        <div className="h-80 flex items-end gap-1 p-4">
          {chartBars.map((bar) => (
            <div
              key={bar.id}
              className="flex-1 flex flex-col items-center justify-end gap-0.5"
            >
              <div className="w-0.5 h-3 bg-[#2b3139] rounded animate-pulse" />
              <div
                className={`w-full rounded-sm animate-pulse ${bar.green ? "bg-[#1a3329]" : "bg-[#2d1a1e]"}`}
                style={{
                  height: `${bar.height}%`,
                  animationDelay: `${bar.delay}ms`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Feed skeleton */}
      <div className="px-4 pb-4">
        <div className="h-4 w-32 bg-[#1e2329] rounded mb-3 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {(["f1", "f2", "f3", "f4", "f5"] as const).map((id) => (
            <div
              key={id}
              className="bg-[#161a1e] border border-[#23272e] rounded-sm p-4 animate-pulse"
            >
              <div className="h-3 bg-[#2b3139] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[#2b3139] rounded w-full mb-2" />
              <div className="h-3 bg-[#2b3139] rounded w-2/3 mb-4" />
              <div className="h-5 bg-[#2b3139] rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
