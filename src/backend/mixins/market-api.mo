import Types "../types/market";
import MarketLib "../lib/market";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import OutCall "mo:caffeineai-http-outcalls/outcall";

mixin (
  ohlcHistory    : List.List<Types.Candle>,
  latestPrice    : { var usd : Float; var inr : Float; var lastUpdated : Int },
) {

  // Transform callback required by the IC HTTP outcall system
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Returns the stored OHLC candle history (up to 30 entries)
  public query func getOHLCHistory() : async [Types.Candle] {
    ohlcHistory.toArray();
  };

  // Returns the most recently fetched BTC price in USD and INR
  public query func getLatestPrice() : async Types.PriceSnapshot {
    { usd = latestPrice.usd; inr = latestPrice.inr; lastUpdated = latestPrice.lastUpdated };
  };

  // Calls CoinGecko + NewsAPI, updates state, returns enriched result
  public func fetchAndUpdatePrice() : async Types.FetchResult {
    // Fetch price from CoinGecko
    let priceUrl = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,inr";
    let priceJson = await OutCall.httpGetRequest(priceUrl, [], transform);
    let (usd, inr) = MarketLib.parsePriceJson(priceJson);

    // Fetch news from NewsAPI
    let newsUrl = "https://newsapi.org/v2/everything?q=bitcoin&apiKey=7d11b8c30e074124a6343779e81d5aa7";
    let newsJson = await OutCall.httpGetRequest(newsUrl, [], transform);
    let rawArticles = MarketLib.parseNewsJson(newsJson);

    // Build articles with sentiment using dot notation
    let articles : [Types.Article] = rawArticles.map<(Text, Text), Types.Article>(
      func((title, url)) {
        { title; url; sentiment = MarketLib.computeSentiment(title) }
      }
    );

    // Compute average sentiment
    var sentimentSum : Float = 0.0;
    for (a in articles.vals()) {
      sentimentSum += a.sentiment;
    };
    let sentimentAvg = if (articles.size() == 0) 0.0 else sentimentSum / articles.size().toFloat();

    // Update candle history
    let previousClose = latestPrice.usd;
    let now = Time.now();
    if (usd > 0.0) {
      MarketLib.appendCandle(ohlcHistory, (if (previousClose == 0.0) usd else previousClose), usd, now);
    };

    // Update latest price cache
    latestPrice.usd := usd;
    latestPrice.inr := inr;
    latestPrice.lastUpdated := now;

    { usd; inr; sentimentAvg; articles };
  };
};
