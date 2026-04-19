import Types "../types/market";
import List "mo:core/List";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";

module {
  // Maximum candles kept in history
  public let MAX_CANDLES : Nat = 30;

  // Append a new candle derived from previousClose and currentPrice.
  // Removes the oldest candle when history exceeds MAX_CANDLES.
  public func appendCandle(
    history       : List.List<Types.Candle>,
    previousClose : Float,
    currentPrice  : Float,
    timestamp     : Int,
  ) : () {
    let o = previousClose;
    let c = currentPrice;
    let wick = currentPrice * 0.0001;
    let h = (if (o > c) o else c) + wick;
    let l = (if (o < c) o else c) - wick;
    let candle : Types.Candle = { open = o; high = h; low = l; close = c; timestamp };
    history.add(candle);
    // Trim to MAX_CANDLES by keeping only the last MAX_CANDLES entries
    let sz = history.size();
    if (sz > MAX_CANDLES) {
      let keep = history.sliceToArray(sz - MAX_CANDLES : Int, sz : Int);
      history.clear();
      history.addAll(keep.values());
    };
  };

  // Compute a simple keyword-based sentiment score for a title string.
  // Returns a Float in [-1.0, 1.0].
  public func computeSentiment(title : Text) : Float {
    let lower = title.toLower();
    let positiveWords : [Text] = ["surge", "rally", "bull", "gain", "rise", "high", "soar", "profit", "bullish", "up"];
    let negativeWords : [Text] = ["crash", "drop", "bear", "loss", "fall", "low", "plunge", "fear", "bearish", "down"];
    var score : Float = 0.0;
    for (w in positiveWords.vals()) {
      if (lower.contains(#text w)) score := score + 0.2;
    };
    for (w in negativeWords.vals()) {
      if (lower.contains(#text w)) score := score - 0.2;
    };
    // Clamp to [-1.0, 1.0]
    if (score > 1.0) score := 1.0;
    if (score < -1.0) score := -1.0;
    score;
  };

  // Parse raw JSON text from CoinGecko price endpoint.
  // Extracts usd and inr values from:
  // {"bitcoin":{"usd":XXXXX,"inr":XXXXXXX}}
  public func parsePriceJson(json : Text) : (Float, Float) {
    let usd = extractJsonFloat(json, "\"usd\":");
    let inr = extractJsonFloat(json, "\"inr\":");
    (usd, inr);
  };

  // Parse raw JSON text from NewsAPI everything endpoint.
  // Returns up to 5 articles with title and url.
  public func parseNewsJson(json : Text) : [(Text, Text)] {
    var results : List.List<(Text, Text)> = List.empty();
    // Split on "title":" to locate each article title field
    let titleParts = json.split(#text "\"title\":\"").toArray();
    var i = 1; // index 0 is the prefix before the first match
    while (i < titleParts.size() and results.size() < 5) {
      let part = titleParts[i];
      // The title value ends at the next unescaped quote
      let titleChunks = part.split(#text "\"").toArray();
      if (titleChunks.size() > 0) {
        let title = titleChunks[0];
        // Find url in the same article segment
        let urlChunks = part.split(#text "\"url\":\"").toArray();
        let url = if (urlChunks.size() > 1) {
          let afterUrl = urlChunks[1];
          let urlEnd = afterUrl.split(#text "\"").toArray();
          if (urlEnd.size() > 0) urlEnd[0] else "";
        } else "";
        results.add((title, url));
      };
      i += 1;
    };
    results.toArray();
  };

  // Internal helper: extract a float value following a given key in JSON text.
  func extractJsonFloat(json : Text, key : Text) : Float {
    let parts = json.split(#text key).toArray();
    if (parts.size() < 2) return 0.0;
    let after = parts[1];
    // Collect characters that form a number (digits, '.', optional leading '-')
    var chars : List.List<Char> = List.empty();
    var started = false;
    label scan for (c in after.chars()) {
      if (not started) {
        if (c == '-' or (c >= '0' and c <= '9')) {
          chars.add(c);
          started := true;
        };
      } else {
        if ((c >= '0' and c <= '9') or c == '.') {
          chars.add(c);
        } else {
          break scan;
        };
      };
    };
    let numText = Text.fromIter(chars.values());
    // Parse manually: split on '.' and combine integer and fractional parts
    let dotParts = numText.split(#char '.').toArray();
    let isNegative = numText.startsWith(#char '-');
    let intPart = if (dotParts.size() > 0) {
      let s = dotParts[0];
      let stripped = if (isNegative and s.size() > 0) {
        Text.fromIter(s.toIter().drop(1))
      } else s;
      switch (Nat.fromText(stripped)) { case null 0; case (?n) n };
    } else 0;
    let fracValue : Float = if (dotParts.size() > 1) {
      let fracStr = dotParts[1];
      let fracNat = switch (Nat.fromText(fracStr)) { case null 0; case (?n) n };
      var divisor : Float = 1.0;
      var cnt = 0;
      while (cnt < fracStr.size()) { divisor := divisor * 10.0; cnt += 1 };
      fracNat.toFloat() / divisor;
    } else 0.0;
    let result = intPart.toFloat() + fracValue;
    if (isNegative) -result else result;
  };
};
