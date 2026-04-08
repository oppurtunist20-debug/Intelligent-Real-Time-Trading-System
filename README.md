<div align="center">
  <br />
  <img src="https://img.shields.io/badge/Trade-Intelligent%20Trading%20System-0066CC?style=for-the-badge&labelColor=000000" alt="Trade" />
  <br /><br />

  <p>
    An AI-powered, full-stack trading intelligence platform for Indian equity markets —<br />
    delivering real-time signals, technical analysis, sentiment monitoring, and portfolio management.
  </p>

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" /></a>
    &nbsp;
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
    &nbsp;
    <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white" alt="FastAPI" /></a>
    &nbsp;
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white" alt="Prisma" /></a>
    &nbsp;
    <a href="https://clerk.com/"><img src="https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white" alt="Clerk" /></a>
    &nbsp;
    <a href="https://deepmind.google/technologies/gemini/"><img src="https://img.shields.io/badge/AI-Gemini%202.5-4285F4?logo=google&logoColor=white" alt="Gemini" /></a>
    &nbsp;
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
  </p>

  <p>
    <a href="#getting-started"><strong>Get Started »</strong></a>
    &nbsp;&nbsp;·&nbsp;&nbsp;
    <a href="#api-reference">API Reference</a>
    &nbsp;&nbsp;·&nbsp;&nbsp;
    <a href="../../issues">Report Bug</a>
    &nbsp;&nbsp;·&nbsp;&nbsp;
    <a href="../../issues">Request Feature</a>
  </p>

  <br />
</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Data Flows](#data-flows)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Python Backend](#python-backend)
- [API Reference](#api-reference)
- [Technical Analysis Engine](#technical-analysis-engine)
- [AI Signal Generation](#ai-signal-generation)
- [Dashboard Pages](#dashboard-pages)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

---

## Overview

**Intelligent Real-Time Trading System** is a full-stack application combining classical quantitative finance methods with generative AI to assist traders in Indian equity markets (NSE/BSE).

The platform integrates four primary analytical pillars:

1. **Technical Analysis** — SMA, EMA, RSI, MACD, Bollinger Bands, volume analysis, support/resistance
2. **AI-Generated Signals** — [Gemini 2.5 Flash Lite](https://deepmind.google/technologies/gemini/) processes price data, sentiment, and macro context to produce BUY/SELL/HOLD recommendations
3. **Sentiment Monitoring** — news-based scoring across 50+ stocks with 30-day trend visualization
4. **Macroeconomic Tracking** — 14 live indicators covering RBI policy, inflation, GDP, FII/DII flows, and currency

> **Note on market data:** This project uses a deterministic pseudo-random engine to simulate NSE/BSE prices consistently within each trading day. Live market data integration is on the [roadmap](#roadmap).

---

## Features

| Capability | Description |
|---|---|
| AI Trading Signals | Gemini-powered BUY/SELL/HOLD with confidence scores, target price, and stop-loss |
| Technical Analysis | 10+ indicators computed in TypeScript; advanced suite via optional Python backend |
| Sentiment Analysis | Per-stock and market-wide BULLISH/BEARISH/NEUTRAL scoring from news feeds |
| Macro Dashboard | 14 Indian macroeconomic indicators with AI sector-impact analysis |
| Portfolio Tracker | Real-time P&L, day change, sector allocation, position weighting |
| Stock Screener | Search and filter 50+ NSE stocks by sector, signal type, and name |
| Watchlist | Track selected stocks with live price updates |
| AI Chat Assistant | Conversational assistant scoped to NSE/BSE markets and portfolio queries |
| Risk Management | Beta, Sharpe ratio, VaR (95%), max drawdown, position sizing calculator |
| Candlestick Charts | Interactive OHLCV charts with SMA/EMA overlays (lightweight-charts) |
| Authentication | Secure sign-in/sign-up via Clerk (OAuth, magic links, MFA) |
| Python ML Backend | LSTM-style price prediction and RL-based signal generation (optional) |

---

## Architecture

### System Overview

```mermaid
graph TD
    subgraph Client["Client — Next.js 15 React App"]
        UI[Dashboard Pages]
    end

    subgraph Server["Server — Next.js API Routes"]
        MW[Clerk Middleware\nRoute Protection]
        API[API Handlers\n/api/*]
    end

    subgraph External["External Services"]
        GEMINI[Google Gemini\n2.5 Flash Lite]
        CLERK[Clerk Auth]
    end

    subgraph Python["Optional — Python FastAPI :8000"]
        TA_PY[Technical Analyzer\npandas / numpy]
        ML[LSTM Predictor]
        RL[RL Signal Generator]
        SENT[Sentiment NLP]
    end

    subgraph DB["Data Layer"]
        PG[(PostgreSQL\nNeonDB)]
    end

    UI -->|fetch| MW
    MW -->|auth.protect| CLERK
    MW --> API
    API -->|Gemini SDK| GEMINI
    API -->|REST| Python
    API -->|Prisma ORM| PG
```

### Request Lifecycle

```mermaid
sequenceDiagram
    participant Browser
    participant Middleware
    participant Clerk
    participant APIRoute
    participant Gemini
    participant DB

    Browser->>Middleware: HTTP Request
    Middleware->>Clerk: Verify session token
    Clerk-->>Middleware: Auth result
    alt Not authenticated
        Middleware-->>Browser: 401 / redirect to /sign-in
    else Authenticated
        Middleware->>APIRoute: Forward request
        APIRoute->>DB: Query via Prisma
        APIRoute->>Gemini: AI prompt (if needed)
        Gemini-->>APIRoute: Structured JSON response
        APIRoute-->>Browser: JSON payload
    end
```

---

## Data Flows

### AI signal generation (single stock)

```mermaid
flowchart LR
    A[POST /api/signals\n&#123; symbol &#125;] --> B[generateHistoricalData\n100-day OHLCV]
    B --> C[calculateAllIndicators\nRSI · MACD · BB · Trend]
    C --> D[getMockStockData\nCurrent price · PE · Volume]
    D --> E{Gemini API\nAvailable?}
    E -- Yes --> F[generateTradingSignal\nPrompt with all indicators]
    F --> G[Structured JSON\nBUY/SELL/HOLD\nconfidence · target · stop]
    E -- No --> H[Rule-based Fallback\nRSI + MACD + Trend\nheuristics]
    H --> G
    G --> I[TradingSignal\ngeneratedBy: GEMINI or TECHNICAL]
```

### Batch signal cache workflow

```mermaid
flowchart TD
    A[GET /api/signals] --> B{Cache valid?\n5-minute TTL}
    B -- Yes --> C[Return cached signals]
    B -- No --> D[For each of 20 stocks]
    D --> E[Generate 100-day OHLCV]
    E --> F[Compute TA indicators]
    F --> G[Score via signal matrix]
    G --> H[Weight confidence\n50% Technical\n25% Sentiment\n25% Macro]
    H --> I[Build TradingSignal object]
    I --> J[Store in cache]
    J --> C
```

### Full AI analysis pipeline

```mermaid
flowchart LR
    A[POST /api/analysis\n&#123; symbol &#125;] --> B[Stock data\n+ 100-day OHLCV]
    B --> C[All TA indicators]
    C --> D[Mock news headlines\n5 articles]
    D --> E[Gemini:\nanalyzeStockSentiment]
    E --> F[BULLISH / BEARISH / NEUTRAL\n+ key factors]
    F --> G[Gemini:\ngenerateTradingSignal]
    G --> H[BUY / SELL / HOLD\n+ target + stop + timeframe]
    H --> I[Gemini:\nanalyzeFullStock]
    I --> J[Summary · Strengths\nRisks · Price Target]
    J --> K[Unified Response\nall data combined]
```

### Sentiment scoring flow

```mermaid
flowchart TD
    A[GET /api/sentiment] --> B[Select 15 stocks]
    B --> C[Generate 1–3 news articles\nper stock from templates]
    C --> D[Score each article\nbullish vs bearish keywords]
    D --> E[Aggregate per-stock\nsentiment score]
    E --> F[Classify:\nBULLISH  score > 0.2\nBEARISH  score < -0.2\nNEUTRAL  otherwise]
    F --> G[Compute overall\nmarket sentiment]
    G --> H[Generate 30-day\nsentiment trend series]
    H --> I[Response:\noverall · stocks · news · trendData]
```

---

## Database Schema

```mermaid
erDiagram
    User {
        String id PK
        String clerkUserId UK
        String email UK
        String name
        String imageUrl
        DateTime createdAt
        DateTime updatedAt
    }

    Portfolio {
        String id PK
        String userId FK
        String name
        DateTime createdAt
    }

    PortfolioItem {
        String id PK
        String portfolioId FK
        String stockSymbol
        Float quantity
        Float avgBuyPrice
        Float currentValue
    }

    Watchlist {
        String id PK
        String userId FK
        String name
    }

    WatchlistItem {
        String id PK
        String watchlistId FK
        String stockSymbol
        DateTime addedAt
    }

    TradingSignal {
        String id PK
        String stockSymbol
        String signal
        Float confidence
        String reasoning
        Float technicalScore
        Float sentimentScore
        Float macroScore
        Float targetPrice
        Float stopLoss
        String timeframe
        String generatedBy
        String userId FK
    }

    NewsArticle {
        String id PK
        String title
        String url
        String source
        DateTime publishedAt
        String sentiment
        Float sentimentScore
        String[] stockSymbols
    }

    MacroIndicator {
        String id PK
        String name
        Float value
        Float previousValue
        String unit
        DateTime date
        String impact
        String category
    }

    Alert {
        String id PK
        String userId FK
        String stockSymbol
        String condition
        Float targetPrice
        Boolean isActive
        Boolean triggered
    }

    TradeHistory {
        String id PK
        String userId FK
        String stockSymbol
        String action
        Float quantity
        Float price
        Float total
        DateTime timestamp
    }

    User ||--o{ Portfolio : owns
    User ||--o{ Watchlist : owns
    User ||--o{ TradingSignal : generates
    User ||--o{ Alert : configures
    User ||--o{ TradeHistory : records
    Portfolio ||--o{ PortfolioItem : contains
    Watchlist ||--o{ WatchlistItem : contains
```

---

## Project Structure

```
trading-main/
│
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth group — no sidebar layout
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   │
│   ├── (dashboard)/                  # Protected group — sidebar + header
│   │   ├── layout.tsx                # Shell: Sidebar + Header
│   │   ├── dashboard/page.tsx        # Market overview (30s auto-refresh)
│   │   ├── stocks/
│   │   │   ├── page.tsx              # Stock screener (50 NSE stocks)
│   │   │   └── [symbol]/page.tsx     # Individual stock detail + charts
│   │   ├── signals/page.tsx          # AI signal cards grid
│   │   ├── portfolio/page.tsx        # P&L tracker + sector allocation
│   │   ├── sentiment/page.tsx        # News sentiment + 30-day trend
│   │   ├── macro/page.tsx            # Macroeconomic indicators
│   │   └── risk/page.tsx             # Risk metrics + position sizing
│   │
│   ├── api/                          # Server-side route handlers
│   │   ├── stocks/
│   │   │   ├── route.ts              # GET /api/stocks
│   │   │   └── [symbol]/
│   │   │       ├── route.ts          # GET /api/stocks/:symbol
│   │   │       └── historical/route.ts
│   │   ├── signals/route.ts          # GET/POST /api/signals
│   │   ├── analysis/route.ts         # POST /api/analysis
│   │   ├── chat/route.ts             # POST /api/chat
│   │   ├── sentiment/route.ts        # GET /api/sentiment
│   │   ├── macro/route.ts            # GET/POST /api/macro
│   │   ├── portfolio/route.ts        # GET/POST/DELETE /api/portfolio
│   │   └── watchlist/route.ts        # GET/POST/DELETE /api/watchlist
│   │
│   ├── globals.css                   # CSS custom properties + base styles
│   ├── layout.tsx                    # Root layout: ClerkProvider + ThemeProvider
│   └── page.tsx                      # Public landing page
│
├── components/
│   ├── charts/
│   │   ├── candlestick-chart.tsx     # lightweight-charts OHLCV wrapper
│   │   └── technical-chart.tsx       # RSI + MACD sub-charts
│   ├── dashboard/
│   │   ├── market-overview.tsx
│   │   ├── trading-signals-widget.tsx
│   │   ├── sentiment-widget.tsx
│   │   ├── top-movers.tsx
│   │   └── portfolio-summary.tsx
│   ├── layout/
│   │   ├── sidebar.tsx               # Navigation + route links
│   │   └── header.tsx                # Search bar + user avatar
│   ├── signals/
│   │   └── signal-card.tsx
│   ├── stocks/
│   │   ├── stock-table.tsx
│   │   ├── stock-card.tsx
│   │   └── stock-search.tsx
│   └── ui/                           # 18 primitive components (shadcn pattern)
│       ├── button.tsx  card.tsx  badge.tsx  dialog.tsx
│       ├── input.tsx   label.tsx select.tsx tabs.tsx
│       ├── toast.tsx   tooltip.tsx  skeleton.tsx ...
│
├── lib/
│   ├── types.ts                      # All TypeScript interfaces
│   ├── indian-stocks.ts              # 50-stock registry + mock data engine
│   ├── technical-analysis.ts         # Pure-TS TA: SMA/EMA/RSI/MACD/BB
│   ├── gemini.ts                     # Gemini AI helpers (5 functions)
│   ├── utils.ts                      # Formatters, color helpers, date utils
│   └── prisma.ts                     # Prisma client singleton
│
├── prisma/
│   └── schema.prisma                 # PostgreSQL schema (9 models)
│
├── python/                           # Optional FastAPI ML service
│   ├── main.py                       # App entry point + 6 endpoints
│   ├── technical_analysis.py         # pandas/numpy TA engine
│   ├── ml_models.py                  # LSTM predictor + RL generator
│   ├── sentiment_analyzer.py         # Keyword-based NLP sentiment
│   └── requirements.txt
│
├── middleware.ts                      # Clerk route guard
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
└── package.json
```

---

## Tech Stack

### Frontend

| Package | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 15.x | React framework, App Router, API routes |
| [React](https://react.dev/) | 18.x | UI rendering |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Static typing |
| [Tailwind CSS](https://tailwindcss.com/) | 3.x | Utility-first styling |
| [Radix UI](https://www.radix-ui.com/) | Latest | Accessible UI primitives |
| [lightweight-charts](https://tradingview.github.io/lightweight-charts/) | 4.x | TradingView-grade OHLCV charts |
| [Recharts](https://recharts.org/) | 2.x | Pie, line, and area charts |
| [Lucide React](https://lucide.dev/) | Latest | Icon set |
| [next-themes](https://github.com/pacocoursey/next-themes) | 0.4.x | Dark mode provider |
| [date-fns](https://date-fns.org/) | 4.x | Date formatting |
| [class-variance-authority](https://cva.style/) | 0.7.x | Component variant system |

### Backend & Infrastructure

| Package | Version | Purpose |
|---|---|---|
| [Clerk](https://clerk.com/) | 6.x | Authentication and user management |
| [Prisma](https://www.prisma.io/) | 5.x | Type-safe PostgreSQL ORM |
| [NeonDB](https://neon.tech/) | — | Serverless PostgreSQL |
| [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) | 0.21.x | Gemini SDK |
| [FastAPI](https://fastapi.tiangolo.com/) | Latest | Python ASGI backend |
| [pandas](https://pandas.pydata.org/) | Latest | DataFrame-based TA computation |
| [NumPy](https://numpy.org/) | Latest | Numerical computing |
| [uvicorn](https://www.uvicorn.org/) | Latest | Python ASGI server |
| [pydantic](https://docs.pydantic.dev/) | 2.x | Python request/response validation |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Python >= 3.10 (optional, for ML features)
- A [NeonDB](https://neon.tech) or standard PostgreSQL database
- A [Clerk](https://dashboard.clerk.com) application
- A [Google AI Studio](https://aistudio.google.com/app/apikey) API key

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/trading-main.git
cd trading-main
```

**2. Install Node.js dependencies**

```bash
npm install
```

**3. Configure environment variables**

```bash
cp .env.example .env.local
# Edit .env.local with your credentials — see Environment Variables section
```

**4. Push the Prisma schema to your database**

```bash
npm run db:push
```

**5. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**6. (Optional) Start the Python ML backend**

```bash
cd python
pip install -r requirements.txt
python main.py
```

The Python service starts on [http://localhost:8000](http://localhost:8000).

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Clerk — https://dashboard.clerk.com -> API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk redirect config
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# PostgreSQL — NeonDB: https://console.neon.tech -> Connection String
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Google Gemini — https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIza...

# Python backend (optional)
PYTHON_API_URL=http://localhost:8000
```

| Variable | Required | Source |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Yes | Clerk Dashboard → API Keys |
| `DATABASE_URL` | Yes | NeonDB Console → Connection String |
| `GEMINI_API_KEY` | No | Google AI Studio |
| `PYTHON_API_URL` | No | Your deployed Python service URL |

> The application operates without `GEMINI_API_KEY`. All AI calls fall back gracefully to rule-based responses derived from technical indicators.

---

## Python Backend

The Python service is optional and provides enhanced ML-based analysis on top of the TypeScript TA engine.

### Setup

```bash
cd python

python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

pip install -r requirements.txt
```

### Running

```bash
# Development with hot reload
python main.py

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

Interactive API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

### Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/technical-analysis` | Full TA suite via pandas (SMA, EMA, RSI, MACD, Stochastic, ATR, OBV) |
| `POST` | `/api/predict` | 5-day price prediction with confidence intervals |
| `POST` | `/api/rl-signal` | Reinforcement learning-inspired signal generation |
| `POST` | `/api/sentiment` | Keyword-weighted NLP sentiment scoring |
| `GET` | `/api/market-status` | NSE/BSE open/closed status (9:15–15:30 IST) |
| `GET` | `/health` | Service health check |

---

## API Reference

All routes are under `/api/`. Routes marked **public** do not require authentication. All others require a valid Clerk session cookie.

### Stocks

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/stocks` | Public | All 50 stocks with current price, change, volume, P/E |
| `GET` | `/api/stocks/:symbol` | Required | Stock detail with TA indicators |
| `GET` | `/api/stocks/:symbol/historical` | Required | Raw OHLCV array for charting |

### Signals

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/signals` | Required | Cached signals for 20 stocks (5-minute TTL) |
| `POST` | `/api/signals` | Required | Generate signal — body: `{ "symbol": "RELIANCE" }` or `{ "generateAll": true }` |

### Analysis

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/analysis` | Required | Full AI analysis — body: `{ "symbol": "TCS" }` |

Response shape:

```jsonc
{
  "data": {
    "stock": { /* StockQuote */ },
    "technicalIndicators": { /* TechnicalIndicators */ },
    "sentiment": { "overall": "BULLISH", "score": 0.62, "keyFactors": [] },
    "signal": { "signal": "BUY", "confidence": 81, "targetPrice": 4450, "stopLoss": 3990 },
    "fullAnalysis": { "summary": "...", "strengths": [], "risks": [], "priceTarget": 4500 },
    "headlines": []
  }
}
```

### Portfolio

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/portfolio` | Required | Portfolio with live P&L and sector weights |
| `POST` | `/api/portfolio` | Required | Add position — body: `{ "stockSymbol", "quantity", "avgBuyPrice" }` |
| `DELETE` | `/api/portfolio?symbol=RELIANCE` | Required | Remove position |

### Watchlist

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/watchlist` | Required | Watchlist with live stock data |
| `POST` | `/api/watchlist` | Required | Add symbol — body: `{ "symbol": "TCS" }` |
| `DELETE` | `/api/watchlist?symbol=TCS` | Required | Remove symbol |

### Chat

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/chat` | Required | Body: `{ "message": "...", "history": [] }` |

### Macro

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/macro` | Required | All 14 macro indicators |
| `POST` | `/api/macro` | Required | Trigger Gemini sector-impact analysis |

---

## Technical Analysis Engine

The TypeScript engine (`lib/technical-analysis.ts`) computes all indicators from raw OHLCV data without external dependencies.

### Indicators

| Indicator | Parameters | Output |
|---|---|---|
| Simple Moving Average | Periods: 20, 50, 200 | Trend baseline |
| Exponential Moving Average | Periods: 9, 21 | Short-term momentum |
| RSI | Period: 14 | 0–100 (30 = oversold, 70 = overbought) |
| MACD | Fast: 12, Slow: 26, Signal: 9 | Line, signal, histogram |
| Bollinger Bands | Period: 20, Multiplier: 2 | Upper, middle, lower, %B |
| Support / Resistance | 20-period highs/lows | Key price levels |
| Trend | SMA20 vs SMA50 | UPTREND / DOWNTREND / SIDEWAYS |
| Momentum | 10-period ROC | % price change |
| Volume Analysis | 20-period average | Ratio + INCREASING / DECREASING / STABLE |

The Python backend additionally computes: Stochastic Oscillator, ATR, OBV, pivot points, and multi-timeframe trend (200-period).

### Signal Scoring Matrix

```
Score component                          Value
───────────────────────────────────────────────
RSI < 30 (oversold)                     +25
RSI > 70 (overbought)                   −25
MACD line > signal line                 +20
MACD line < signal line                 −20
Bollinger %B < 0.2 (near lower band)    +15
Bollinger %B > 0.8 (near upper band)    −15
Trend = UPTREND                         +20
Trend = DOWNTREND                       −20
SMA20 > SMA50 (golden cross zone)       +10
SMA20 < SMA50 (death cross zone)        −10
High volume confirms uptrend             +10
High volume confirms downtrend           −10

Score ≥  30  →  BUY
Score ≤ −30  →  SELL
Otherwise    →  HOLD

Confidence = 0.50 × technical + 0.25 × sentiment + 0.25 × macro
```

---

## AI Signal Generation

The system uses **Gemini 2.5 Flash Lite** across five functions in `lib/gemini.ts`:

| Function | Inputs | Outputs |
|---|---|---|
| `analyzeStockSentiment` | Symbol, news headlines | Sentiment, score (-1 to 1), reasoning, key factors |
| `generateTradingSignal` | Price, TA indicators, sentiment, macro context | BUY/SELL/HOLD, confidence, reasoning, target price, stop-loss, timeframe |
| `analyzeMacroImpact` | 14 macro indicator objects | Overall impact, market outlook, per-sector impact |
| `analyzeFullStock` | Symbol, price, TA, recent history | Summary, strengths, risks, recommendation, price target |
| `getMarketSummary` | All stocks with change % and signal | 2–3 sentence professional market narrative |

Every function wraps its Gemini call in a try/catch with a deterministic fallback. If the API key is absent or the call fails, the system returns a response derived from the technical indicators so the dashboard always renders correctly.

---

## Dashboard Pages

| Route | Page | Description |
|---|---|---|
| `/dashboard` | Market Dashboard | Overview with market stats, signal widget, sentiment gauge, top movers, portfolio summary. Auto-refreshes every 30 seconds. |
| `/stocks` | Stock Screener | Search, sector filter, and signal filter across all 50 NSE stocks. Sortable table with signal badges. |
| `/stocks/[symbol]` | Stock Detail | Candlestick chart, RSI, MACD, all indicator values, AI analysis panel, news sentiment. |
| `/signals` | Trading Signals | Card grid of AI signals. Filter by type (BUY/SELL/HOLD) and confidence level. Manual regeneration button. |
| `/portfolio` | Portfolio | Holdings table with P&L per position, sector allocation donut chart, add/remove positions. |
| `/sentiment` | Market Sentiment | Per-stock sentiment table, 30-day trend chart, news article feed. |
| `/macro` | Macro Indicators | 14 macro indicators by category. AI sector-impact analysis on demand. |
| `/risk` | Risk Management | Beta, Sharpe, Sortino, max drawdown, VaR. Interactive position sizing calculator. |

---

## Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel --prod
```

Add all environment variables in the Vercel project dashboard under **Settings → Environment Variables**.

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### Database

1. Create a free project at [neon.tech](https://neon.tech)
2. Copy the connection string (`postgresql://...?sslmode=require`)
3. Set as `DATABASE_URL`
4. Run `npm run db:push`

---

## Roadmap

**Near-term**

- [ ] Live NSE/BSE market data via Upstox or Zerodha Kite Connect API
- [ ] Persist portfolio and watchlist to PostgreSQL (Prisma models are ready)
- [ ] Real-time price alerts via email and browser push notifications

**Medium-term**

- [ ] LSTM price prediction with TensorFlow.js (client-side) or PyTorch (Python service)
- [ ] Reinforcement learning agent trained with OpenAI Gymnasium
- [ ] FinBERT-based news sentiment (HuggingFace inference API)
- [ ] Real news feed integration (NewsAPI, Moneycontrol, Economic Times)
- [ ] Options chain analysis and implied volatility surface

**Long-term**

- [ ] Paper trading simulation with virtual capital
- [ ] Strategy backtesting engine
- [ ] Mobile client (React Native / Expo)
- [ ] Multi-exchange support (US markets via Polygon.io)

---

## Contributing

Contributions are welcome. Please follow the steps below.

```bash
# 1. Fork the repository and clone your fork
git clone https://github.com/your-username/trading-main.git

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes and commit
git commit -m "feat: describe your change"

# 4. Push and open a pull request
git push origin feature/your-feature-name
```

### Commit convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use case |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation updates |
| `refactor:` | Code restructuring without behavior change |
| `perf:` | Performance improvements |
| `test:` | Test additions or fixes |
| `chore:` | Build process or tooling changes |

---

## Available Scripts

```bash
npm run dev           # Start Next.js dev server on :3000
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run db:push       # Push Prisma schema to database
npm run db:studio     # Open Prisma Studio (database GUI)
npm run db:generate   # Regenerate Prisma client after schema changes
```

---

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.

---

## Disclaimer

This project is intended for **educational and demonstration purposes only**.

- This is not financial advice. Do not make real investment decisions based on signals or analysis produced by this system.
- All market data is simulated and does not reflect real NSE or BSE prices.
- AI-generated signals are based on simulated historical data and algorithmic heuristics, not live market conditions.
- Trading in equity markets involves significant financial risk. Consult a SEBI-registered investment advisor before making any investment decisions.

---

<div align="center">
  <sub>Built for the Indian trading community. Contributions and feedback welcome.</sub>
</div>
