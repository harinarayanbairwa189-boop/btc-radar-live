# Design Brief

## Purpose & Tone
Real-time Bitcoin trading dashboard for active crypto traders. Industrial/utilitarian terminal aesthetic — professional, high-contrast, data-focused. Inspired by Binance dark UI with surgical precision.

## Visual Direction
No decoration, no gradients, no softness. Pure data clarity with grid structure. Every element serves information hierarchy. High contrast white text on near-black background. Green/red only for price direction (bullish/bearish).

## Color Palette

| Name | OKLCH | Hex | Usage |
|------|-------|-----|-------|
| Background | `0.11 0 0` | #0b0e11 | Main dark surface |
| Foreground | `0.99 0 0` | #ffffff | Primary text |
| Border/Grid | `0.17 0.02 0` | #23272e | Subtle grid lines, card borders |
| Bullish | `0.67 0.24 151` | #02c076 | Price up, positive candles, success state |
| Bearish | `0.59 0.21 22` | #f84960 | Price down, negative candles, destructive state |
| Secondary Text | `0.70 0.04 268` | #a0aec0 | Metadata, labels, secondary info |

## Typography
- **Display/Stats**: JetBrains Mono (monospaced, fixed-width numbers)
- **Body/UI**: General Sans (clean, modern sans-serif)
- **Metadata**: Geist Mono (technical details, timestamps)
- **Scale**: Hero stat 24px, chart labels 12px, card titles 14px, body 13px

## Structural Zones

| Zone | Background | Border | Details |
|------|------------|--------|---------|
| Header (Hero Stats) | bg-background | border-b border-border | 4-column grid: BTC/USD, BTC/INR, Sentiment, 24h Change |
| Main Chart Area | bg-background | none | Full-width candlestick chart, grid overlay |
| News Feed | bg-background | border-t border-border | 5 sentiment article cards in horizontal layout |

## Spacing & Rhythm
- Padding: 16px (cards), 24px (sections), 32px (container margins)
- Gap: 12px (card grid), 8px (inline elements)
- Density: High — maximize data display, minimal whitespace

## Component Patterns
- **Stat Cards**: Mono font for numbers, secondary text for labels, no shadow, subtle border
- **Chart**: SVG candlesticks, grid lines at #23272e, no axis decorations
- **Article Cards**: Title + sentiment badge (green/red), no images, compact layout

## Motion
- Price updates: Subtle pulse animation (0.6s ease-in-out)
- Chart draw: Smooth 0.8s entrance from left
- Transitions: All 0.3s cubic-bezier(0.4, 0, 0.2, 1)

## Signature Detail
**Trading Terminal Typography**: All prices and market data rendered in monospaced font (JetBrains Mono) to evoke professional crypto exchange terminals. Gives the interface authenticity and credibility.
