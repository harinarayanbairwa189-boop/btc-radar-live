import { ExternalLink, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import type { Article } from "../types/bitcoin";

interface SentimentFeedProps {
  articles: Article[];
  isLoading?: boolean;
}

function SentimentBadge({ value }: { value: number }) {
  if (value > 0.05) {
    return (
      <span
        data-ocid="sentiment_badge.positive"
        className="flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider"
        style={{
          backgroundColor: "rgba(2, 192, 118, 0.15)",
          color: "#02c076",
          border: "1px solid rgba(2, 192, 118, 0.3)",
        }}
      >
        <TrendingUp className="w-3 h-3" />
        POSITIVE
      </span>
    );
  }
  if (value < -0.05) {
    return (
      <span
        data-ocid="sentiment_badge.negative"
        className="flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider"
        style={{
          backgroundColor: "rgba(248, 73, 96, 0.15)",
          color: "#f84960",
          border: "1px solid rgba(248, 73, 96, 0.3)",
        }}
      >
        <TrendingDown className="w-3 h-3" />
        NEGATIVE
      </span>
    );
  }
  return (
    <span
      data-ocid="sentiment_badge.neutral"
      className="flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider"
      style={{
        backgroundColor: "rgba(240, 185, 11, 0.15)",
        color: "#f0b90b",
        border: "1px solid rgba(240, 185, 11, 0.3)",
      }}
    >
      <Minus className="w-3 h-3" />
      NEUTRAL
    </span>
  );
}

const FALLBACK_ARTICLES: Article[] = [
  {
    title:
      "Bitcoin surges past key resistance level as institutional demand grows",
    url: "#",
    sentiment: 0.42,
  },
  {
    title:
      "Regulatory updates signal major markets embracing crypto frameworks",
    url: "#",
    sentiment: -0.12,
  },
  {
    title: "BTC dominance rises amid altcoin market consolidation phase",
    url: "#",
    sentiment: 0.28,
  },
  {
    title:
      "Whale wallets accumulate as on-chain data turns increasingly bullish",
    url: "#",
    sentiment: 0.61,
  },
  {
    title: "Crypto analysts warn of short-term volatility before next leg up",
    url: "#",
    sentiment: -0.18,
  },
];

export function SentimentFeed({ articles, isLoading }: SentimentFeedProps) {
  const items = articles.length > 0 ? articles : FALLBACK_ARTICLES;

  return (
    <section data-ocid="sentiment_feed.section" className="px-4 pb-4">
      <div className="flex items-center gap-3 mb-3">
        <h2 className="font-mono text-xs text-[#848e9c] uppercase tracking-widest">
          News Sentiment
        </h2>
        <div className="flex-1 h-px bg-[#23272e]" />
        <span className="font-mono text-xs text-[#848e9c]">
          {items.length} sources
        </span>
      </div>

      {isLoading ? (
        <div
          data-ocid="sentiment_feed.loading_state"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          {(["s1", "s2", "s3", "s4", "s5"] as const).map((id) => (
            <div
              key={id}
              className="bg-[#161a1e] border border-[#23272e] rounded-sm p-4 animate-pulse"
            >
              <div className="h-3 bg-[#2b3139] rounded w-3/4 mb-3" />
              <div className="h-3 bg-[#2b3139] rounded w-full mb-2" />
              <div className="h-3 bg-[#2b3139] rounded w-2/3 mb-4" />
              <div className="h-5 bg-[#2b3139] rounded w-20" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {items.slice(0, 5).map((article, i) => (
            <motion.a
              key={`article-${i}-${article.title.slice(0, 20)}`}
              href={article.url !== "#" ? article.url : undefined}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid={`sentiment_feed.item.${i + 1}`}
              className="group bg-[#161a1e] border border-[#23272e] rounded-sm p-4 flex flex-col gap-3 hover:border-[#474d57] hover:bg-[#1e2329] transition-colors cursor-pointer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
            >
              <p className="font-body text-sm text-[#eaecef] leading-snug line-clamp-3 flex-1 min-w-0">
                {article.title}
              </p>
              <div className="flex items-center justify-between gap-2">
                <SentimentBadge value={article.sentiment} />
                <div className="flex items-center gap-1">
                  <span className="font-mono text-xs text-[#848e9c] tabular-nums">
                    {article.sentiment >= 0 ? "+" : ""}
                    {article.sentiment.toFixed(2)}
                  </span>
                  <ExternalLink className="w-3 h-3 text-[#474d57] group-hover:text-[#848e9c] transition-colors flex-shrink-0" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </section>
  );
}
