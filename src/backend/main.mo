import Types "types/market";
import MarketMixin "mixins/market-api";
import List "mo:core/List";

actor {
  // OHLC candle ring-buffer (up to 30 entries)
  let ohlcHistory : List.List<Types.Candle> = List.empty<Types.Candle>();

  // Latest price cache — mutable fields allow in-place updates
  let latestPrice = { var usd : Float = 0.0; var inr : Float = 0.0; var lastUpdated : Int = 0 };

  include MarketMixin(ohlcHistory, latestPrice);
};
