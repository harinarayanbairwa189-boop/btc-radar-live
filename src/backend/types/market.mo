module {
  // A single OHLC candlestick
  public type Candle = {
    open      : Float;
    high      : Float;
    low       : Float;
    close     : Float;
    timestamp : Int;
  };

  // Latest price snapshot
  public type PriceSnapshot = {
    usd         : Float;
    inr         : Float;
    lastUpdated : Int;
  };

  // A parsed news article with its sentiment score
  public type Article = {
    title     : Text;
    url       : Text;
    sentiment : Float; // -1.0 to 1.0
  };

  // Result returned from fetchAndUpdatePrice
  public type FetchResult = {
    usd          : Float;
    inr          : Float;
    sentimentAvg : Float;
    articles     : [Article];
  };
};
