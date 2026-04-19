import { AlertTriangle, Bitcoin, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { CandlestickChart } from "./components/CandlestickChart";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { PriceHero } from "./components/PriceHero";
import { SentimentFeed } from "./components/SentimentFeed";
import { StatusBar } from "./components/StatusBar";
import {
  useFetchAndUpdate,
  useLatestPrice,
  useOHLCHistory,
} from "./hooks/useBitcoinData";
import type { Article } from "./types/bitcoin";

function Header() {
  return (
    <header
      data-ocid="app.header"
      className="flex items-center justify-between px-4 py-2.5 bg-[#161a1e] border-b border-[#23272e] flex-shrink-0"
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-sm flex items-center justify-center"
          style={{ backgroundColor: "#f0b90b" }}
        >
          <Bitcoin className="w-4 h-4 text-[#0b0e11]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-sm font-bold text-[#eaecef] tracking-wide">
            CRYPTO RADAR
          </span>
          <span className="font-mono text-xs text-[#848e9c]">
            / BTC Live Terminal
          </span>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-4 font-mono text-xs text-[#848e9c]">
        <span className="text-[#f0b90b]">★ BITCOIN</span>
        <span>OHLC · SENTIMENT · LIVE NEWS</span>
      </div>
    </header>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      data-ocid="app.error_state"
      className="flex flex-col items-center justify-center flex-1 gap-4 py-20 px-4"
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f84960]/10 border border-[#f84960]/30">
        <AlertTriangle className="w-6 h-6 text-[#f84960]" />
      </div>
      <div className="text-center">
        <p className="font-mono text-sm text-[#f84960] font-bold mb-1">
          CONNECTION FAILED
        </p>
        <p className="font-mono text-xs text-[#848e9c]">
          Unable to fetch live market data from backend
        </p>
      </div>
      <button
        type="button"
        data-ocid="app.retry_button"
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 border border-[#23272e] rounded-sm font-mono text-xs text-[#eaecef] hover:border-[#474d57] hover:bg-[#161a1e] transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        RETRY CONNECTION
      </button>
    </div>
  );
}

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [sentimentAvg, setSentimentAvg] = useState<number>(0);

  const {
    data: priceData,
    isLoading: priceLoading,
    isError: priceError,
  } = useLatestPrice();

  const { data: ohlcRaw, isLoading: ohlcLoading } = useOHLCHistory();
  const ohlcData = ohlcRaw as import("./types/bitcoin").Candle[] | undefined;

  const {
    mutate: triggerFetch,
    isPending: isFetching,
    isError: fetchError,
  } = useFetchAndUpdate();

  const handleRefresh = () => {
    triggerFetch(undefined, {
      onSuccess: (data) => {
        setArticles(data.articles);
        setSentimentAvg(data.sentimentAvg);
      },
    });
  };

  const connectionStatus = isFetching
    ? "fetching"
    : priceLoading || ohlcLoading
      ? "loading"
      : priceError || fetchError
        ? "error"
        : priceData
          ? "success"
          : "idle";

  const isInitialLoading = priceLoading && !priceData;

  if (isInitialLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div
      data-ocid="app.page"
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0b0e11", color: "#eaecef" }}
    >
      <Header />

      <StatusBar
        status={connectionStatus}
        lastUpdated={priceData?.lastUpdated}
        onRefresh={handleRefresh}
        isRefreshing={isFetching}
      />

      {priceError && !priceData ? (
        <ErrorState onRetry={handleRefresh} />
      ) : (
        <motion.main
          data-ocid="app.main"
          className="flex flex-col flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <PriceHero
            current={priceData}
            previous={null}
            sentimentAvg={sentimentAvg || 0}
            isLoading={priceLoading && !priceData}
          />

          <CandlestickChart
            candles={ohlcData ?? []}
            isLoading={ohlcLoading && !ohlcData?.length}
          />

          <SentimentFeed articles={articles} isLoading={false} />

          <footer className="mt-auto px-4 py-3 border-t border-[#23272e] bg-[#161a1e] flex items-center justify-between">
            <span className="font-mono text-xs text-[#474d57]">
              © {new Date().getFullYear()}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#848e9c] hover:text-[#eaecef] transition-colors"
              >
                Built with love using caffeine.ai
              </a>
            </span>
            <span className="font-mono text-xs text-[#474d57] hidden md:block">
              Real-time BTC data · CoinGecko · NewsAPI
            </span>
          </footer>
        </motion.main>
      )}
    </div>
  );
}
