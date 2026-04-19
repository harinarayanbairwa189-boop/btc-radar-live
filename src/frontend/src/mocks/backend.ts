import type { backendInterface } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);

export const mockBackend: backendInterface = {
  fetchAndUpdatePrice: async () => ({
    usd: 67432.15,
    inr: 5618904.5,
    articles: [
      {
        title: "Bitcoin surges past $67K amid institutional buying pressure",
        url: "https://example.com/article1",
        sentiment: 0.72,
      },
      {
        title: "Crypto market shows resilience as BTC holds key support levels",
        url: "https://example.com/article2",
        sentiment: 0.45,
      },
      {
        title: "Analysts predict Bitcoin could reach $80K before halving",
        url: "https://example.com/article3",
        sentiment: 0.61,
      },
      {
        title: "BTC dominance rises as altcoins face selling pressure",
        url: "https://example.com/article4",
        sentiment: -0.18,
      },
      {
        title: "Regulatory clarity boosts crypto investor confidence",
        url: "https://example.com/article5",
        sentiment: 0.55,
      },
    ],
    sentimentAvg: 0.43,
  }),

  getLatestPrice: async () => ({
    usd: 67432.15,
    inr: 5618904.5,
    lastUpdated: now,
  }),

  getOHLCHistory: async () => {
    const base = 65000;
    const candles: { open: number; close: number; high: number; low: number; timestamp: bigint }[] = [];
    for (let i = 0; i < 20; i++) {
      const open = base + Math.sin(i * 0.4) * 2000 + i * 120;
      const close = open + (Math.random() - 0.45) * 800;
      const high = Math.max(open, close) + Math.random() * 300;
      const low = Math.min(open, close) - Math.random() * 300;
      candles.push({
        open,
        close,
        high,
        low,
        timestamp: now - BigInt(20 - i) * BigInt(30_000_000_000),
      });
    }
    return candles;
  },

  transform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),
};
