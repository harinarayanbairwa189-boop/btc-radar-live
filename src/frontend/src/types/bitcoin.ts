export interface Article {
  title: string;
  url: string;
  sentiment: number;
}

export interface FetchResult {
  usd: number;
  inr: number;
  sentimentAvg: number;
  articles: Article[];
}

export interface PriceSnapshot {
  usd: number;
  inr: number;
  lastUpdated: bigint;
}

export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: bigint;
}

export type ConnectionStatus =
  | "idle"
  | "loading"
  | "fetching"
  | "success"
  | "error";

export interface ChartCandle {
  index: number;
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: number;
  bullish: boolean;
  bodyBottom: number;
  bodyHeight: number;
}
