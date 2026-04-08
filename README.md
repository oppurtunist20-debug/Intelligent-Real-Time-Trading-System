<div align="center">

# 📈 Intelligent Real-Time Trading System

### AI-Powered Stock Analysis & Signal Generation for Indian Markets

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-1.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini_2.5-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

*A professional-grade, AI-powered trading intelligence platform for NSE & BSE markets — delivering real-time signals, technical analysis, sentiment monitoring, and portfolio management.*

[🚀 Live Demo](#) · [📖 Documentation](#table-of-contents) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

---

</div>

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🔄 Data Flow & Workflows](#-data-flow--workflows)
- [🗄️ Database Schema](#️-database-schema)
- [📁 Project Structure](#-project-structure)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚡ Quick Start](#-quick-start)
- [🔧 Environment Variables](#-environment-variables)
- [🐍 Python Backend Setup](#-python-backend-setup)
- [📡 API Reference](#-api-reference)
- [🧮 Technical Analysis Engine](#-technical-analysis-engine)
- [🤖 AI Signal Generation](#-ai-signal-generation)
- [📊 Dashboard Pages](#-dashboard-pages)
- [🚀 Deployment](#-deployment)
- [🗺️ Roadmap](#️-roadmap)
- [⚠️ Disclaimer](#️-disclaimer)

---

## 🎯 Overview

The **Intelligent Real-Time Trading System** is a full-stack application that combines classical quantitative finance with modern AI to help traders make data-driven decisions in Indian equity markets (NSE/BSE).

The system integrates:
- 📐 **Classical Technical Analysis** — RSI, MACD, Bollinger Bands, moving averages, volume analysis
- 🤖 **Generative AI** — Gemini 2.5 Flash Lite for signal generation, sentiment analysis, macro impact analysis, and an AI chat assistant
- 📰 **Sentiment Monitoring** — News-based sentiment scoring across 50+ stocks
- 🌏 **Macroeconomic Tracking** — RBI policy, inflation, GDP, FII/DII flows, USD/INR
- 💼 **Portfolio Management** — P&L tracking, sector allocation, position sizing
- ⚠️ **Risk Management** — Beta, Sharpe ratio, max drawdown, VaR, stop-loss recommendations

> **Note:** This application uses simulated market data with a seeded pseudo-random engine for demonstration purposes. Stock prices are generated consistently within each trading day. See the [Roadmap](#️-roadmap) for live data integration plans.

---

## ✨ Features

| Feature | Description | Status |
|---|---|---|
| 🤖 **AI Trading Signals** | Gemini-powered BUY/SELL/HOLD signals with confidence scores | ✅ Ready |
| 📉 **Technical Analysis** | RSI, MACD, Bollinger Bands, SMA/EMA, support/resistance | ✅ Ready |
| 📰 **Sentiment Analysis** | News-driven sentiment scoring per stock and market-wide | ✅ Ready |
| 🌏 **Macro Indicators** | 14 key Indian macro indicators with AI impact analysis | ✅ Ready |
| 💼 **Portfolio Tracker** | Real-time P&L, sector allocation pie chart, trade history | ✅ Ready |
| 📋 **Stock Screener** | Filter 50+ stocks by sector, signal type, and search | ✅ Ready |
| 👁️ **Watchlist** | Add/remove stocks, live price updates | ✅ Ready |
| 💬 **AI Chat Assistant** | Conversational trading assistant for NSE/BSE markets | ✅ Ready |
| ⚠️ **Risk Management** | Beta, Sharpe ratio, VaR, position sizing calculator | ✅ Ready |
| 📊 **Candlestick Charts** | Interactive OHLCV charts with SMA/EMA overlays | ✅ Ready |
| 🔐 **Authentication** | Secure sign-in/sign-up via Clerk | ✅ Ready |
| 🐍 **Python ML Backend** | LSTM price prediction, RL signal generation | ✅ Ready |

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│   Next.js 15 React App  •  Tailwind CSS  •  lightweight-charts  │
└───────────────────────┬─────────────────────────────────────────┘
                        │ HTTPS / fetch()
┌───────────────────────▼─────────────────────────────────────────┐
│                   NEXT.JS 15 SERVER                             │
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────────────────────┐   │
│  │   Clerk Auth     │    │      API Route Handlers          │   │
│  │  (Middleware)    │    │  /api/stocks  /api/signals       │   │
│  │                  │    │  /api/analysis  /api/chat        │   │
│  │  JWT Validation  │    │  /api/sentiment  /api/macro      │   │
│  │  Route Guard     │    │  /api/portfolio  /api/watchlist  │   │
│  └──────────────────┘    └────────┬─────────────┬───────────┘   │
│                                   │             │               │
└───────────────────────────────────┼─────────────┼───────────────┘
                                    │             │
              ┌─────────────────────▼──┐   ┌──────▼───────────────┐
              │   Google Gemini AI    │   │   Python FastAPI     │
              │   gemini-2.5-flash    │   │   :8000              │
              │                       │   │                      │
              │  • Trading signals    │   │  • Advanced TA       │
              │  • Sentiment analysis │   │  • LSTM prediction   │
              │  • Macro impact       │   │  • RL signals        │
              │  • Full stock analysis│   │  • Sentiment NLP     │
              │  • Market summary     │   │  • Market status     │
              │  • Chat assistant     │   │                      │
              └───────────────────────┘   └──────────────────────┘
                                    │
              ┌─────────────────────▼──────────────────┐
              │         PostgreSQL (NeonDB)             │
              │         via Prisma ORM v5               │
              │                                         │
              │  Users • Portfolios • Watchlists        │
              │  TradingSignals • NewsArticles           │  
              │  MacroIndicators • Alerts               │
              │  TradeHistory                           │
              └─────────────────────────────────────────┘
```

### Component Interaction Model

```
┌───────────────────────────────────────────────────────┐
│  lib/indian-stocks.ts          lib/technical-analysis.ts  │
│  ┌────────────────────┐        ┌──────────────────────┐   │
│  │  50 NSE Stocks     │        │  SMA / EMA / RSI     │   │
│  │  Mock OHLCV Engine │──────▶│  MACD / Bollinger    │   │
│  │  Seeded RNG        │        │  Trend / Momentum    │   │
│  └────────────────────┘        └──────────┬───────────┘   │
│                                            │               │
│                               lib/gemini.ts│               │
│                               ┌────────────▼───────────┐   │
│                               │  Gemini 2.5 Flash Lite │   │
│                               │  • analyzeStockSent.   │   │
│                               │  • generateSignal()    │   │
│                               │  • analyzeMacro()      │   │
│                               │  • analyzeFullStock()  │   │
│                               └────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow & Workflows

### Signal Generation Workflow

```
User Request: "Generate AI Signal for RELIANCE"
        │
        ▼
POST /api/signals { symbol: "RELIANCE" }
        │
        ├──▶ generateHistoricalData("RELIANCE", 100 days)
        │         └── Seeded RNG → OHLCV[]
        │
        ├──▶ calculateAllIndicators(ohlcv)
        │         ├── RSI(14), MACD(12/26/9)
        │         ├── Bollinger Bands(20)
        │         ├── SMA(20/50/200), EMA(9/21)
        │         ├── Volume Analysis
        │         └── Support / Resistance
        │
        ├──▶ getMockStockData("RELIANCE")
        │         └── Current price, change, P/E, market cap
        │
        ├──▶ Gemini AI: generateTradingSignal()
        │         │
        │         │  Prompt includes:
        │         │   • Current price: ₹{price}
        │         │   • RSI, MACD Line, Signal
        │         │   • Trend, SMA20, SMA50
        │         │   • Bollinger %B
        │         │   • Sentiment score
        │         │   • Macro context
        │         │
        │         └── Returns JSON:
        │               { signal, confidence, reasoning,
        │                 targetPrice, stopLoss, timeframe }
        │
        ▼
    TradingSignal {
      signal: "BUY" | "SELL" | "HOLD"
      confidence: 0-100
      reasoning: "..."
      targetPrice: ₹XXXX
      stopLoss: ₹XXXX
      timeframe: "2 weeks"
      generatedBy: "GEMINI"
    }
```

### Batch Signal Generation (Technical Mode)

```
GET /api/signals  (cached 5 minutes)
        │
        │  For each of 20 stocks:
        ▼
┌─────────────────────────────────────┐
│  Historical Data (100 days)         │
│           ↓                         │
│  Technical Indicators               │
│           ↓                         │
│  generateTechnicalSignal()          │
│                                     │
│  Scoring Matrix:                    │
│  ┌────────────────────┬──────────┐ │
│  │ RSI < 30           │  +25 pts │ │
│  │ RSI > 70           │  -25 pts │ │
│  │ MACD Bullish Cross │  +20 pts │ │
│  │ MACD Bearish Cross │  -20 pts │ │
│  │ BB %B < 0.2        │  +15 pts │ │
│  │ BB %B > 0.8        │  -15 pts │ │
│  │ Uptrend            │  +20 pts │ │
│  │ Downtrend          │  -20 pts │ │
│  │ SMA20 > SMA50      │  +10 pts │ │
│  │ High Volume+Trend  │  ±10 pts │ │
│  └────────────────────┴──────────┘ │
│           ↓                         │
│  Score ≥ 30 → BUY                  │
│  Score ≤ -30 → SELL                │
│  Else → HOLD                       │
│           ↓                         │
│  Confidence = 50% Technical         │
│            + 25% Sentiment          │
│            + 25% Macro              │
└─────────────────────────────────────┘
```

### Full Analysis Workflow

```
POST /api/analysis { symbol }
        │
        ├──▶ [1] Stock Data + 100-day OHLCV
        ├──▶ [2] All Technical Indicators
        ├──▶ [3] Mock News Headlines (5 articles)
        │
        ├──▶ [4] Gemini: analyzeStockSentiment()
        │         → BULLISH / BEARISH / NEUTRAL + keyFactors[]
        │
        ├──▶ [5] Gemini: generateTradingSignal()
        │         → BUY / SELL / HOLD + confidence + prices
        │
        ├──▶ [6] Gemini: analyzeFullStock()
        │         → summary + strengths[] + risks[]
        │           + recommendation + priceTarget + timeHorizon
        │
        ▼
    Unified Response {
      stock, technicalIndicators,
      sentiment, signal, fullAnalysis, headlines
    }
```

### AI Chat Workflow

```
User Message → POST /api/chat { message, history[] }
        │
        │  System Context:
        │  "You are an AI trading assistant for Indian
        │   stock markets (NSE/BSE). Help with stock
        │   analysis, technical indicators, sentiment,
        │   and portfolio management..."
        │
        ├──▶ Rebuild chat history from prior messages
        ├──▶ model.startChat({ history })
        ├──▶ chat.sendMessage(userMessage)
        │
        ▼
    { reply: "..." }  →  Displayed in chat UI
```

---

## 🗄️ Database Schema

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│      User       │     │    Portfolio     │     │  PortfolioItem  │
├─────────────────┤     ├──────────────────┤     ├─────────────────┤
│ id (cuid)       │──┐  │ id (cuid)        │──┐  │ id (cuid)       │
│ clerkUserId     │  │  │ userId  ─────────│──┘  │ portfolioId ───▶│
│ email           │  └─▶│ name             │  └─▶│ stockSymbol     │
│ name            │     │ createdAt        │     │ quantity        │
│ imageUrl        │     │ updatedAt        │     │ avgBuyPrice     │
│ createdAt       │     └──────────────────┘     │ currentValue    │
│ updatedAt       │                              └─────────────────┘
└────────┬────────┘
         │ 1:N
         ├──▶ Watchlist → WatchlistItem (unique: watchlistId+symbol)
         ├──▶ TradingSignal (BUY/SELL/HOLD + scores)
         ├──▶ Alert (ABOVE/BELOW/PERCENT_CHANGE conditions)
         └──▶ TradeHistory (BUY/SELL journal with timestamp)

┌──────────────────────┐    ┌─────────────────┐    ┌──────────────────┐
│    TradingSignal     │    │   NewsArticle   │    │  MacroIndicator  │
├──────────────────────┤    ├─────────────────┤    ├──────────────────┤
│ signal BUY/SELL/HOLD │    │ title, url      │    │ name, value      │
│ confidence (0-100)   │    │ source          │    │ previousValue    │
│ technicalScore       │    │ sentiment       │    │ impact H/M/L     │
│ sentimentScore       │    │ sentimentScore  │    │ category         │
│ macroScore           │    │ stockSymbols[]  │    │ MONETARY/FISCAL  │
│ targetPrice          │    │ publishedAt     │    │ TRADE/MARKET     │
│ stopLoss             │    └─────────────────┘    └──────────────────┘
│ timeframe            │
│ generatedBy          │
└──────────────────────┘
```

---

## 📁 Project Structure

```
trading-main/
│
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group (no sidebar)
│   │   ├── sign-in/page.tsx      # Clerk sign-in page
│   │   └── sign-up/page.tsx      # Clerk sign-up page
│   │
│   ├── (dashboard)/              # Protected dashboard group
│   │   ├── layout.tsx            # Sidebar + Header shell
│   │   ├── dashboard/page.tsx    # Main market dashboard
│   │   ├── stocks/
│   │   │   ├── page.tsx          # Stock screener (50 stocks)
│   │   │   └── [symbol]/page.tsx # Individual stock detail
│   │   ├── signals/page.tsx      # AI trading signals grid
│   │   ├── portfolio/page.tsx    # Portfolio P&L + allocation
│   │   ├── sentiment/page.tsx    # News sentiment analysis
│   │   ├── macro/page.tsx        # Macroeconomic indicators
│   │   └── risk/page.tsx         # Risk metrics + calculator
│   │
│   ├── api/                      # Next.js API routes
│   │   ├── stocks/
│   │   │   ├── route.ts          # GET all stocks
│   │   │   └── [symbol]/
│   │   │       ├── route.ts      # GET single stock
│   │   │       └── historical/route.ts  # GET OHLCV data
│   │   ├── signals/route.ts      # GET/POST trading signals
│   │   ├── analysis/route.ts     # POST full AI analysis
│   │   ├── chat/route.ts         # POST AI chat
│   │   ├── sentiment/route.ts    # GET market sentiment
│   │   ├── macro/route.ts        # GET/POST macro indicators
│   │   ├── portfolio/route.ts    # GET/POST/DELETE portfolio
│   │   └── watchlist/route.ts    # GET/POST/DELETE watchlist
│   │
│   ├── globals.css               # Global styles + CSS variables
│   ├── layout.tsx                # Root layout (Clerk + ThemeProvider)
│   └── page.tsx                  # Public landing page
│
├── components/
│   ├── charts/
│   │   ├── candlestick-chart.tsx # lightweight-charts OHLCV
│   │   └── technical-chart.tsx   # RSI / MACD charts
│   ├── dashboard/
│   │   ├── market-overview.tsx   # Index stats widget
│   │   ├── trading-signals-widget.tsx
│   │   ├── sentiment-widget.tsx  # Sentiment gauge
│   │   ├── top-movers.tsx        # Gainers & losers
│   │   └── portfolio-summary.tsx
│   ├── layout/
│   │   ├── sidebar.tsx           # Navigation sidebar
│   │   └── header.tsx            # Top bar + search
│   ├── signals/
│   │   └── signal-card.tsx       # Signal display card
│   ├── stocks/
│   │   ├── stock-table.tsx       # Sortable stock table
│   │   ├── stock-card.tsx
│   │   └── stock-search.tsx
│   └── ui/                       # Primitive UI components
│       ├── button.tsx            # (18 shadcn-style components)
│       ├── card.tsx
│       ├── badge.tsx
│       ├── dialog.tsx
│       └── ...
│
├── lib/
│   ├── types.ts                  # All TypeScript interfaces
│   ├── indian-stocks.ts          # 50 NSE stocks + mock data engine
│   ├── technical-analysis.ts     # SMA/EMA/RSI/MACD/BB calculations
│   ├── gemini.ts                 # Google Gemini AI helpers
│   ├── utils.ts                  # Formatters + UI helpers
│   └── prisma.ts                 # Prisma client singleton
│
├── prisma/
│   └── schema.prisma             # PostgreSQL schema
│
├── python/                       # Optional FastAPI ML backend
│   ├── main.py                   # FastAPI app + endpoints
│   ├── technical_analysis.py     # Pandas-based TA engine
│   ├── ml_models.py              # LSTM predictor + RL generator
│   ├── sentiment_analyzer.py     # Rule-based NLP sentiment
│   └── requirements.txt          # Python dependencies
│
├── middleware.ts                  # Clerk route protection
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.example                  # Environment variable template
└── package.json
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 15.x | React framework with App Router |
| [React](https://react.dev/) | 18.x | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 3.x | Utility-first styling |
| [Radix UI](https://www.radix-ui.com/) | Latest | Accessible UI primitives |
| [lightweight-charts](https://tradingview.github.io/lightweight-charts/) | 4.x | TradingView candlestick charts |
| [Recharts](https://recharts.org/) | 2.x | Pie/line/area charts |
| [Lucide React](https://lucide.dev/) | Latest | Icons |
| [next-themes](https://github.com/pacocoursey/next-themes) | 0.4.x | Dark mode |
| [date-fns](https://date-fns.org/) | 4.x | Date formatting |

### Backend & Infrastructure

| Technology | Version | Purpose |
|---|---|---|
| [Clerk](https://clerk.com/) | 6.x | Authentication & user management |
| [Prisma](https://www.prisma.io/) | 5.x | ORM for PostgreSQL |
| [NeonDB](https://neon.tech/) | Latest | Serverless PostgreSQL |
| [Google Gemini](https://deepmind.google/technologies/gemini/) | 2.5 Flash Lite | AI signal generation & analysis |
| [FastAPI](https://fastapi.tiangolo.com/) | Latest | Python ML backend |
| [pandas](https://pandas.pydata.org/) | Latest | Dataframe-based TA |
| [NumPy](https://numpy.org/) | Latest | Numerical computing |
| [uvicorn](https://www.uvicorn.org/) | Latest | ASGI server |

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **Python** >= 3.10 (optional, for ML features)
- **PostgreSQL** database (NeonDB free tier recommended)
- **Clerk** account (free tier available)
- **Google AI Studio** account for Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/trading-main.git
cd trading-main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Fill in your credentials (see [Environment Variables](#-environment-variables)).

### 4. Set Up the Database

```bash
# Push schema to your PostgreSQL database
npm run db:push

# (Optional) Open Prisma Studio to inspect data
npm run db:studio
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### 6. (Optional) Start the Python Backend

```bash
cd python
pip install -r requirements.txt
python main.py
```

The Python API will be available at [http://localhost:8000](http://localhost:8000).

---

## 🔧 Environment Variables

Create a `.env.local` file in the project root:

```env
# ─── Clerk Authentication ───────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# ─── Database ───────────────────────────────────────────────────────
# NeonDB: https://neon.tech (free tier available)
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# ─── Google Gemini AI ────────────────────────────────────────────────
# Get your key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIza...

# ─── Python Backend (Optional) ──────────────────────────────────────
PYTHON_API_URL=http://localhost:8000
```

### Where to get each key

| Variable | Where to Get |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `CLERK_SECRET_KEY` | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `DATABASE_URL` | [NeonDB Console](https://console.neon.tech) → Connection String |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) |

> **Note:** The app functions without `GEMINI_API_KEY` — all AI calls degrade gracefully to rule-based fallback responses. The Python backend (`PYTHON_API_URL`) is entirely optional.

---

## 🐍 Python Backend Setup

The Python backend is an **optional** service that provides enhanced ML-based analysis.

```bash
cd python

# Create a virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**`requirements.txt`:**
```
fastapi
uvicorn[standard]
pandas
numpy
pydantic
pytz
```

### Starting the Python Server

```bash
# Development (with hot reload)
python main.py

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Python API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/technical-analysis` | Comprehensive TA with pandas |
| `POST` | `/api/predict` | LSTM-style price prediction (5-day) |
| `POST` | `/api/rl-signal` | Reinforcement learning signal |
| `POST` | `/api/sentiment` | NLP keyword sentiment analysis |
| `GET` | `/api/market-status` | NSE/BSE open/closed status |
| `GET` | `/health` | Service health check |

### API Documentation

When running, visit [http://localhost:8000/docs](http://localhost:8000/docs) for the interactive Swagger UI.

---

## 📡 API Reference

All Next.js API routes are under `/api/`. Protected routes require a valid Clerk session cookie.

### Stocks

```http
GET /api/stocks
```
Returns all 50 NSE stocks with current price, change, volume, P/E ratio. **Public.**

```http
GET /api/stocks/:symbol
```
Returns detailed stock data including TA indicators and historical OHLCV.

```http
GET /api/stocks/:symbol/historical
```
Returns raw OHLCV data array for charting.

### Signals

```http
GET /api/signals
```
Returns cached trading signals for 20 stocks (refreshes every 5 minutes).

```http
POST /api/signals
Content-Type: application/json

{ "symbol": "RELIANCE" }        // Generate AI signal for one stock
{ "generateAll": true }          // Regenerate all signals
```

### Analysis

```http
POST /api/analysis
Content-Type: application/json

{ "symbol": "TCS" }
```
Full AI analysis: technical indicators + sentiment + trading signal + stock summary.

### Portfolio

```http
GET  /api/portfolio                          // Get portfolio with live P&L
POST /api/portfolio                          // Add stock position
DELETE /api/portfolio?symbol=RELIANCE        // Remove position
```

```json
// POST body
{
  "stockSymbol": "RELIANCE",
  "quantity": 10,
  "avgBuyPrice": 2750
}
```

### Watchlist

```http
GET    /api/watchlist              // Get watchlist with live prices
POST   /api/watchlist              // Add { "symbol": "TCS" }
DELETE /api/watchlist?symbol=TCS   // Remove
```

### AI Chat

```http
POST /api/chat
Content-Type: application/json

{
  "message": "What is the RSI of RELIANCE?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

### Sentiment

```http
GET /api/sentiment
```
Returns market sentiment scores, per-stock BULLISH/BEARISH/NEUTRAL ratings, news articles, and 30-day sentiment trend.

### Macro

```http
GET  /api/macro    // Get all 14 macro indicators
POST /api/macro    // Trigger Gemini macro impact analysis
```

---

## 🧮 Technical Analysis Engine

The TypeScript TA engine (`lib/technical-analysis.ts`) computes all indicators from raw OHLCV data:

### Indicators Computed

| Indicator | Parameters | Signal Range |
|---|---|---|
| **SMA** | 20, 50, 200 periods | Trend direction |
| **EMA** | 9, 21 periods | Short-term momentum |
| **RSI** | 14 periods | 0–100 (30=oversold, 70=overbought) |
| **MACD** | Fast=12, Slow=26, Signal=9 | Histogram crossover |
| **Bollinger Bands** | Period=20, StdDev=2 | %B: 0–1 (price position) |
| **Support / Resistance** | 20-period highs/lows | Key price levels |
| **Trend** | SMA20 vs SMA50 | UPTREND / DOWNTREND / SIDEWAYS |
| **Momentum** | 10-period ROC | % price change |
| **Volume Analysis** | 20-period average | INCREASING / DECREASING / STABLE |

### Python TA (Enhanced)

The Python backend adds:

| Indicator | Description |
|---|---|
| **Stochastic Oscillator** | %K/%D (14/3), OVERBOUGHT/OVERSOLD |
| **ATR (Average True Range)** | Volatility in absolute + % terms |
| **OBV (On Balance Volume)** | Cumulative price-volume pressure |
| **Pivot Points** | (High + Low + Close) / 3 |
| **Multi-timeframe Trend** | Short-term + Medium-term (200 SMA) |

---

## 🤖 AI Signal Generation

### Gemini Integration

The system uses **`gemini-2.5-flash-lite`** across 5 functions:

```
analyzeStockSentiment(symbol, headlines)
    └── Returns: { sentiment, score, reasoning, keyFactors[] }

generateTradingSignal(stockData)
    └── Returns: { signal, confidence, reasoning, targetPrice, stopLoss, timeframe }

analyzeMacroImpact(indicators[])
    └── Returns: { overallImpact, marketOutlook, sectors[] }

analyzeFullStock(symbol, stockData)
    └── Returns: { summary, strengths[], risks[], recommendation, priceTarget, timeHorizon }

getMarketSummary(stocks[])
    └── Returns: string (2-3 sentence market narrative)
```

### Fallback Strategy

Every Gemini call has a **graceful fallback** — if the API key is missing or the call fails, the system returns rule-based responses derived from the technical indicators. This ensures the app always works.

```
Gemini API Call
    │
    ├── ✅ Success → Return AI response
    │
    └── ❌ Error   → Rule-based fallback
                        RSI < 35 + Uptrend + MACD+  →  BUY (72%)
                        RSI > 65 + Downtrend + MACD- →  SELL (68%)
                        Otherwise                    →  HOLD (55%)
```

---

## 📊 Dashboard Pages

### `/dashboard` — Market Dashboard

Real-time market overview refreshing every **30 seconds**:
- Market index stats (NIFTY50, SENSEX proxy)
- Live trading signals widget
- Sentiment gauge
- Top 5 Gainers & Losers
- Portfolio quick summary

### `/stocks` — Stock Screener

Filter and search across all 50 NSE stocks:
- Search by symbol or company name
- Filter by sector (Banking, IT, Pharma, Auto, etc.)
- Filter by signal type (BUY / SELL / HOLD)
- Color-coded signal badges with confidence %

### `/stocks/[symbol]` — Stock Detail

Complete stock analysis page:
- Interactive **candlestick chart** with SMA/EMA overlays
- **RSI chart** with overbought/oversold zones
- **MACD chart** with histogram
- All technical indicator values in a grid
- AI analysis panel (summary, strengths, risks)
- News articles with sentiment badges

### `/signals` — Trading Signals

Signal cards grid with filtering by:
- Signal type: ALL / BUY / SELL / HOLD
- Confidence: HIGH (≥75%) / MEDIUM (50–75%) / LOW (<50%)
- "Generate New" button triggers fresh Gemini signal generation

### `/portfolio` — Portfolio Tracker

- Total value, P&L, today's P&L, invested amount
- Holdings table with qty, avg buy, CMP, P&L%, weight
- Sector allocation donut chart (Recharts)
- Add stock dialog (symbol + quantity + avg buy price)

### `/sentiment` — Market Sentiment

- Overall market sentiment gauge (BULLISH / BEARISH / NEUTRAL)
- 30-day sentiment trend line chart
- Per-stock sentiment table with news count
- Latest news articles feed

### `/macro` — Macro Indicators

- 14 key Indian economic indicators in a table
- Category grouping: Monetary · Fiscal · Trade · Market
- Impact badges: HIGH / MEDIUM / LOW
- "Analyze with AI" button → Gemini sector impact report

### `/risk` — Risk Management

- Portfolio beta, Sharpe ratio, Sortino ratio
- Maximum drawdown, VaR (95%)
- Position sizing calculator
- Stop-loss recommendation tool

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy production
vercel --prod
```

Set all environment variables in your Vercel project dashboard under **Settings → Environment Variables**.

### Docker (Self-Hosted)

```dockerfile
# Dockerfile (example)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

### Python Backend Deployment

The Python FastAPI service can be deployed as:
- **Render** free tier (recommended for demos)
- **Railway** or **Fly.io**
- Docker-based deployment alongside the Next.js app

Update `PYTHON_API_URL` in your environment to point to the deployed Python service URL.

### Database

1. Create a free project on [NeonDB](https://neon.tech)
2. Copy the **connection string** (with `?sslmode=require`)
3. Set as `DATABASE_URL` in your environment
4. Run `npm run db:push` to create all tables

---

## 🗺️ Roadmap

| Priority | Feature | Status |
|---|---|---|
| 🔴 High | Live NSE/BSE market data via API (e.g., Upstox, Zerodha) | Planned |
| 🔴 High | Persist portfolio & watchlist to PostgreSQL (Prisma) | Planned |
| 🔴 High | Price alert notifications (email / push) | Planned |
| 🟡 Medium | Real LSTM model (TensorFlow.js / Python) | Planned |
| 🟡 Medium | Real RL agent (Gymnasium environment) | Planned |
| 🟡 Medium | FinBERT-based news sentiment (HuggingFace) | Planned |
| 🟡 Medium | Real news feed integration (NewsAPI, Moneycontrol) | Planned |
| 🟡 Medium | Options chain analysis | Planned |
| 🟢 Low | Mobile app (React Native / Expo) | Research |
| 🟢 Low | Paper trading simulation | Research |
| 🟢 Low | Backtesting engine | Research |
| 🟢 Low | Multi-exchange support (US markets) | Research |

---

## 🧪 Available Scripts

```bash
# Development
npm run dev           # Start Next.js dev server on :3000

# Database
npm run db:push       # Push Prisma schema to database
npm run db:studio     # Open Prisma Studio (GUI)
npm run db:generate   # Regenerate Prisma client

# Production
npm run build         # Build Next.js app
npm run start         # Start production server

# Code Quality
npm run lint          # ESLint
```

---

## 🏛️ Design Decisions

### Why Mock Data?

Live NSE/BSE market data requires paid API subscriptions or complex web scraping, making it unsuitable for an open-source demo. The seeded pseudo-random engine (`SeededRandom` class) produces **consistent, realistic price behavior** within each trading day, making the application fully functional for demonstration and development.

### Why TypeScript + Python?

- **TypeScript** handles all user-facing API routes, TA computation, and the full UI — fast, type-safe, and deployable as serverless functions.
- **Python** is used for its superior data science ecosystem (pandas, NumPy) and future ML framework support (TensorFlow/PyTorch). It's optional and communicates via REST.

### Why Clerk?

Clerk provides production-grade authentication (OAuth, magic links, MFA) with minimal configuration, freeing development time for core trading features.

### Why Gemini 2.5 Flash Lite?

It offers the best balance of speed and quality for the frequent, structured JSON generation required by trading signals, making it suitable for real-time dashboard use without high latency.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit changes: `git commit -m 'feat: add live NSE data integration'`
4. Push to branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request**

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Formatting (no logic change)
refactor: Code refactoring
perf:     Performance improvements
test:     Adding tests
chore:    Build process or tooling changes
```

---

## ⚠️ Disclaimer

> **This application is for educational and demonstration purposes only.**
>
> - This is **NOT financial advice**. Do not make real investment decisions based on signals generated by this system.
> - All market data is **simulated** and does not reflect real NSE/BSE prices.
> - AI-generated signals are based on simulated data and algorithmic rules, not real market analysis.
> - Trading in equity markets involves significant risk. Always consult a certified financial advisor before investing.
>
> © 2024 Trade. Built for learning purposes.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for the Indian trading community**

[![GitHub Stars](https://img.shields.io/github/stars/your-username/trading-main?style=social)](../../stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/your-username/trading-main?style=social)](../../forks)

*If you found this project helpful, please consider giving it a ⭐*

</div>
