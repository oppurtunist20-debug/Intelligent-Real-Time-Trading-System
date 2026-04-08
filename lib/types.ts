// Stock Data Types
export interface StockQuote {
  symbol: string;
  name: string;
  exchange: "NSE" | "BSE";
  sector: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  marketCap?: number;
  peRatio?: number;
  eps?: number;
  weekHigh52?: number;
  weekLow52?: number;
}

export interface OHLCVData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockDetail extends StockQuote {
  historicalData: OHLCVData[];
  technicalIndicators: TechnicalIndicators;
  signal?: TradingSignal;
}

// Technical Analysis Types
export interface TechnicalIndicators {
  sma20: number;
  sma50: number;
  sma200: number;
  ema9: number;
  ema21: number;
  rsi: number;
  macd: MACDData;
  bollingerBands: BollingerBands;
  volume: VolumeAnalysis;
  support: number;
  resistance: number;
  trend: "UPTREND" | "DOWNTREND" | "SIDEWAYS";
  momentum: number;
}

export interface MACDData {
  macdLine: number;
  signalLine: number;
  histogram: number;
}

export interface BollingerBands {
  upper: number;
  middle: number;
  lower: number;
  bandwidth: number;
  percentB: number;
}

export interface VolumeAnalysis {
  current: number;
  average20: number;
  ratio: number;
  trend: "INCREASING" | "DECREASING" | "STABLE";
}

export interface MovingAverages {
  sma: Record<number, number>;
  ema: Record<number, number>;
}

// Trading Signal Types
export interface TradingSignal {
  id?: string;
  stockSymbol: string;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string;
  technicalScore: number;
  sentimentScore: number;
  macroScore: number;
  targetPrice?: number;
  stopLoss?: number;
  timeframe?: string;
  generatedBy?: string;
  createdAt?: string;
}

// Sentiment Analysis Types
export interface SentimentAnalysis {
  overall: "BULLISH" | "BEARISH" | "NEUTRAL";
  score: number; // -1 to 1
  reasoning: string;
  keyFactors: string[];
  newsCount?: number;
}

export interface StockSentiment {
  symbol: string;
  name: string;
  sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
  score: number;
  articles: NewsArticle[];
}

export interface NewsArticle {
  id?: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
  sentimentScore: number;
  stockSymbols: string[];
  summary?: string;
}

// Macro Indicator Types
export interface MacroIndicator {
  id?: string;
  name: string;
  value: number;
  previousValue: number;
  unit?: string;
  date: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  description: string;
  category: "MONETARY" | "FISCAL" | "TRADE" | "MARKET";
  change?: number;
  changePercent?: number;
}

export interface MacroAnalysis {
  overallImpact: string;
  marketOutlook: string;
  sectors: SectorImpact[];
  recommendations: string[];
}

export interface SectorImpact {
  sector: string;
  impact: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  reasoning: string;
}

// Portfolio Types
export interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPercent: number;
  dayPnL: number;
  dayPnLPercent: number;
  items: PortfolioItem[];
}

export interface PortfolioItem {
  id?: string;
  stockSymbol: string;
  stockName: string;
  sector: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  currentValue: number;
  investedValue: number;
  pnl: number;
  pnlPercent: number;
  dayChange: number;
  dayChangePercent: number;
  weight: number;
}

// Risk Metrics Types
export interface RiskMetrics {
  beta: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  var95: number; // Value at Risk 95%
  calmarRatio: number;
  sortinoRatio: number;
}

export interface PositionSizing {
  symbol: string;
  recommendedQuantity: number;
  maxRisk: number;
  entryPrice: number;
  stopLoss: number;
  targetPrice: number;
  riskRewardRatio: number;
}

// Market Overview Types
export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
}

export interface MarketMover {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface MarketOverview {
  indices: MarketIndex[];
  topGainers: MarketMover[];
  topLosers: MarketMover[];
  mostActive: MarketMover[];
  marketBreadth: {
    advances: number;
    declines: number;
    unchanged: number;
  };
}

// Watchlist Types
export interface WatchlistItem {
  stockSymbol: string;
  stockData?: StockQuote;
  addedAt?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Chart Data Types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface CandlestickDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  sma50?: number;
}

export interface RSIDataPoint {
  date: string;
  rsi: number;
}

export interface MACDDataPoint {
  date: string;
  macd: number;
  signal: number;
  histogram: number;
}
