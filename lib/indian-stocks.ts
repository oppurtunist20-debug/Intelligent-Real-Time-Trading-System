import type { StockQuote, OHLCVData } from "./types";

export interface StockInfo {
  symbol: string;
  name: string;
  sector: string;
  exchange: "NSE" | "BSE";
  basePrice: number;
}

export const INDIAN_STOCKS: StockInfo[] = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd", sector: "Oil & Gas", exchange: "NSE", basePrice: 2890 },
  { symbol: "TCS", name: "Tata Consultancy Services Ltd", sector: "Information Technology", exchange: "NSE", basePrice: 4215 },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", sector: "Banking", exchange: "NSE", basePrice: 1680 },
  { symbol: "INFY", name: "Infosys Ltd", sector: "Information Technology", exchange: "NSE", basePrice: 1890 },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd", sector: "Banking", exchange: "NSE", basePrice: 1245 },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd", sector: "FMCG", exchange: "NSE", basePrice: 2560 },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank Ltd", sector: "Banking", exchange: "NSE", basePrice: 1890 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", sector: "Telecom", exchange: "NSE", basePrice: 1720 },
  { symbol: "ITC", name: "ITC Ltd", sector: "FMCG", exchange: "NSE", basePrice: 478 },
  { symbol: "SBIN", name: "State Bank of India", sector: "Banking", exchange: "NSE", basePrice: 812 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd", sector: "Financial Services", exchange: "NSE", basePrice: 6890 },
  { symbol: "WIPRO", name: "Wipro Ltd", sector: "Information Technology", exchange: "NSE", basePrice: 548 },
  { symbol: "HCLTECH", name: "HCL Technologies Ltd", sector: "Information Technology", exchange: "NSE", basePrice: 1680 },
  { symbol: "ASIANPAINT", name: "Asian Paints Ltd", sector: "Paints", exchange: "NSE", basePrice: 2890 },
  { symbol: "MARUTI", name: "Maruti Suzuki India Ltd", sector: "Automobile", exchange: "NSE", basePrice: 12450 },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd", sector: "Automobile", exchange: "NSE", basePrice: 978 },
  { symbol: "TATASTEEL", name: "Tata Steel Ltd", sector: "Metals", exchange: "NSE", basePrice: 167 },
  { symbol: "ONGC", name: "Oil & Natural Gas Corporation Ltd", sector: "Oil & Gas", exchange: "NSE", basePrice: 278 },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement Ltd", sector: "Cement", exchange: "NSE", basePrice: 10890 },
  { symbol: "ADANIENT", name: "Adani Enterprises Ltd", sector: "Conglomerate", exchange: "NSE", basePrice: 2450 },
  { symbol: "NTPC", name: "NTPC Ltd", sector: "Power", exchange: "NSE", basePrice: 378 },
  { symbol: "POWERGRID", name: "Power Grid Corporation of India Ltd", sector: "Power", exchange: "NSE", basePrice: 312 },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries Ltd", sector: "Pharma", exchange: "NSE", basePrice: 1890 },
  { symbol: "DRREDDY", name: "Dr. Reddy's Laboratories Ltd", sector: "Pharma", exchange: "NSE", basePrice: 6780 },
  { symbol: "CIPLA", name: "Cipla Ltd", sector: "Pharma", exchange: "NSE", basePrice: 1456 },
  { symbol: "DIVISLAB", name: "Divi's Laboratories Ltd", sector: "Pharma", exchange: "NSE", basePrice: 4890 },
  { symbol: "BAJAJFINSV", name: "Bajaj Finserv Ltd", sector: "Financial Services", exchange: "NSE", basePrice: 1780 },
  { symbol: "JSWSTEEL", name: "JSW Steel Ltd", sector: "Metals", exchange: "NSE", basePrice: 978 },
  { symbol: "GRASIM", name: "Grasim Industries Ltd", sector: "Cement", exchange: "NSE", basePrice: 2345 },
  { symbol: "BRITANNIA", name: "Britannia Industries Ltd", sector: "FMCG", exchange: "NSE", basePrice: 5670 },
  { symbol: "NESTLEIND", name: "Nestle India Ltd", sector: "FMCG", exchange: "NSE", basePrice: 22500 },
  { symbol: "TITAN", name: "Titan Company Ltd", sector: "Consumer Goods", exchange: "NSE", basePrice: 3456 },
  { symbol: "BAJAJ-AUTO", name: "Bajaj Auto Ltd", sector: "Automobile", exchange: "NSE", basePrice: 9870 },
  { symbol: "HEROMOTOCO", name: "Hero MotoCorp Ltd", sector: "Automobile", exchange: "NSE", basePrice: 4890 },
  { symbol: "EICHERMOT", name: "Eicher Motors Ltd", sector: "Automobile", exchange: "NSE", basePrice: 4567 },
  { symbol: "LT", name: "Larsen & Toubro Ltd", sector: "Infrastructure", exchange: "NSE", basePrice: 3450 },
  { symbol: "TECHM", name: "Tech Mahindra Ltd", sector: "Information Technology", exchange: "NSE", basePrice: 1678 },
  { symbol: "MPHASIS", name: "Mphasis Ltd", sector: "Information Technology", exchange: "NSE", basePrice: 2890 },
  { symbol: "PERSISTENT", name: "Persistent Systems Ltd", sector: "Information Technology", exchange: "NSE", basePrice: 5670 },
  { symbol: "COFORGE", name: "Coforge Ltd", sector: "Information Technology", exchange: "NSE", basePrice: 7890 },
  { symbol: "AXISBANK", name: "Axis Bank Ltd", sector: "Banking", exchange: "NSE", basePrice: 1190 },
  { symbol: "INDUSINDBK", name: "IndusInd Bank Ltd", sector: "Banking", exchange: "NSE", basePrice: 1456 },
  { symbol: "BANKBARODA", name: "Bank of Baroda", sector: "Banking", exchange: "NSE", basePrice: 267 },
  { symbol: "VEDL", name: "Vedanta Ltd", sector: "Metals", exchange: "NSE", basePrice: 456 },
  { symbol: "HINDALCO", name: "Hindalco Industries Ltd", sector: "Metals", exchange: "NSE", basePrice: 678 },
  { symbol: "COALINDIA", name: "Coal India Ltd", sector: "Mining", exchange: "NSE", basePrice: 456 },
  { symbol: "BPCL", name: "Bharat Petroleum Corporation Ltd", sector: "Oil & Gas", exchange: "NSE", basePrice: 345 },
  { symbol: "IOC", name: "Indian Oil Corporation Ltd", sector: "Oil & Gas", exchange: "NSE", basePrice: 178 },
  { symbol: "TATACONSUM", name: "Tata Consumer Products Ltd", sector: "FMCG", exchange: "NSE", basePrice: 1123 },
  { symbol: "AMBUJACEM", name: "Ambuja Cements Ltd", sector: "Cement", exchange: "NSE", basePrice: 589 },
  { symbol: "SHREECEM", name: "Shree Cement Ltd", sector: "Cement", exchange: "NSE", basePrice: 28900 },
];

// Seeded pseudo-random number generator for consistent mock data
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) & 0xffffffff;
    return (this.seed >>> 0) / 0x100000000;
  }

  nextRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  nextGaussian(): number {
    let u = 0;
    let v = 0;
    while (u === 0) u = this.next();
    while (v === 0) v = this.next();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }
}

function symbolToSeed(symbol: string): number {
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) {
    seed = (seed * 31 + symbol.charCodeAt(i)) & 0x7fffffff;
  }
  return seed;
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const MARKET_OPEN_MINUTES = 9 * 60 + 15;
const MARKET_CLOSE_MINUTES = 15 * 60 + 30;

export interface MarketStatus {
  isOpen: boolean;
  closesInMs: number | null;
}

function getISTParts(date: Date): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(date);

  const map = Object.fromEntries(
    parts
      .filter((p) => p.type !== "literal")
      .map((p) => [p.type, p.value])
  );

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    year: parseInt(map.year || "0", 10),
    month: parseInt(map.month || "1", 10),
    day: parseInt(map.day || "1", 10),
    hour: parseInt(map.hour || "0", 10),
    minute: parseInt(map.minute || "0", 10),
    weekday: weekdayMap[map.weekday || "Sun"] ?? 0,
  };
}

function getPreviousTradingDate(istMidnightUtcMs: number): Date {
  const oneDayMs = 24 * 60 * 60 * 1000;
  let candidate = new Date(istMidnightUtcMs - oneDayMs);

  while (true) {
    const p = getISTParts(candidate);
    if (p.weekday >= 1 && p.weekday <= 5) return candidate;
    candidate = new Date(candidate.getTime() - oneDayMs);
  }
}

function getMarketTickSeed(now = new Date()): number {
  const ist = getISTParts(now);
  const minutesNow = ist.hour * 60 + ist.minute;
  const isWeekday = ist.weekday >= 1 && ist.weekday <= 5;
  const isMarketOpen =
    isWeekday &&
    minutesNow >= MARKET_OPEN_MINUTES &&
    minutesNow < MARKET_CLOSE_MINUTES;

  if (isMarketOpen) {
    return Math.floor(now.getTime() / 3000);
  }

  const istMidnightUtcMs = Date.UTC(ist.year, ist.month - 1, ist.day) - IST_OFFSET_MS;
  const closeUtcMsToday =
    Date.UTC(ist.year, ist.month - 1, ist.day, 15, 30) - IST_OFFSET_MS;

  if (isWeekday && minutesNow >= MARKET_CLOSE_MINUTES) {
    return Math.floor(closeUtcMsToday / 3000);
  }

  const previousTradingDate = getPreviousTradingDate(istMidnightUtcMs);
  const prevIst = getISTParts(previousTradingDate);
  const prevCloseUtcMs =
    Date.UTC(prevIst.year, prevIst.month - 1, prevIst.day, 15, 30) - IST_OFFSET_MS;
  return Math.floor(prevCloseUtcMs / 3000);
}

export function getIndianMarketStatus(now = new Date()): MarketStatus {
  const ist = getISTParts(now);
  const minutesNow = ist.hour * 60 + ist.minute;
  const isWeekday = ist.weekday >= 1 && ist.weekday <= 5;
  const isOpen =
    isWeekday &&
    minutesNow >= MARKET_OPEN_MINUTES &&
    minutesNow < MARKET_CLOSE_MINUTES;

  if (!isOpen) {
    return { isOpen: false, closesInMs: null };
  }

  const closeUtcMsToday =
    Date.UTC(ist.year, ist.month - 1, ist.day, 15, 30) - IST_OFFSET_MS;

  return {
    isOpen: true,
    closesInMs: Math.max(0, closeUtcMsToday - now.getTime()),
  };
}

export function getMockStockData(symbol: string): StockQuote {
  const stockInfo = INDIAN_STOCKS.find((s) => s.symbol === symbol);
  if (!stockInfo) {
    throw new Error(`Stock ${symbol} not found`);
  }

  // Keep all API responses aligned to a shared 3-second market tick,
  // but only advance ticks during Indian market hours.
  const marketTick = getMarketTickSeed();
  const rng = new SeededRandom(symbolToSeed(symbol) + marketTick);
  const basePrice = stockInfo.basePrice;

  // Daily variation ±3%
  const changePercent = rng.nextGaussian() * 1.5;
  const change = (basePrice * changePercent) / 100;
  const currentPrice = basePrice + change;
  const previousClose = basePrice;

  const dayRange = basePrice * 0.03;
  const dayHigh = currentPrice + rng.nextRange(0, dayRange);
  const dayLow = currentPrice - rng.nextRange(0, dayRange);

  const baseVolume = basePrice < 500 ? 5000000 : basePrice < 2000 ? 1000000 : 500000;
  const volume = Math.floor(baseVolume * rng.nextRange(0.5, 2.5));

  return {
    symbol: stockInfo.symbol,
    name: stockInfo.name,
    exchange: stockInfo.exchange,
    sector: stockInfo.sector,
    currentPrice: Math.round(currentPrice * 100) / 100,
    previousClose: Math.round(previousClose * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    dayHigh: Math.round(dayHigh * 100) / 100,
    dayLow: Math.round(dayLow * 100) / 100,
    volume,
    marketCap: Math.round(currentPrice * volume * 200) / 100,
    peRatio: Math.round(rng.nextRange(12, 45) * 100) / 100,
    eps: Math.round((currentPrice / rng.nextRange(12, 45)) * 100) / 100,
    weekHigh52: Math.round(basePrice * rng.nextRange(1.1, 1.4) * 100) / 100,
    weekLow52: Math.round(basePrice * rng.nextRange(0.6, 0.9) * 100) / 100,
  };
}

export function getAllMockStocks(): StockQuote[] {
  return INDIAN_STOCKS.map((stock) => getMockStockData(stock.symbol));
}

export function generateHistoricalData(symbol: string, days = 365): OHLCVData[] {
  const stockInfo = INDIAN_STOCKS.find((s) => s.symbol === symbol);
  if (!stockInfo) {
    throw new Error(`Stock ${symbol} not found`);
  }

  const rng = new SeededRandom(symbolToSeed(symbol));
  const data: OHLCVData[] = [];
  let price = stockInfo.basePrice * 0.75; // Start from lower price ~9 months ago

  const baseVolume = stockInfo.basePrice < 500 ? 5000000 : stockInfo.basePrice < 2000 ? 1000000 : 500000;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Skip weekends
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const dailyVolatility = 0.015;
    const drift = 0.0003; // slight upward drift
    const dailyReturn = drift + rng.nextGaussian() * dailyVolatility;

    const open = price;
    price = price * (1 + dailyReturn);

    const intraRange = price * rng.nextRange(0.005, 0.025);
    const high = price + intraRange * rng.nextRange(0.3, 1.0);
    const low = price - intraRange * rng.nextRange(0.3, 1.0);
    const close = price;

    const volume = Math.floor(baseVolume * rng.nextRange(0.4, 2.5));

    data.push({
      date: date.toISOString().split("T")[0],
      open: Math.round(open * 100) / 100,
      high: Math.round(Math.max(open, close, high) * 100) / 100,
      low: Math.round(Math.min(open, close, low) * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume,
    });
  }

  return data;
}

export function getStocksBySector(sector: string): StockInfo[] {
  return INDIAN_STOCKS.filter((s) => s.sector === sector);
}

export function getSectors(): string[] {
  return [...new Set(INDIAN_STOCKS.map((s) => s.sector))].sort();
}

export function searchStocks(query: string): StockInfo[] {
  const lowerQuery = query.toLowerCase();
  return INDIAN_STOCKS.filter(
    (s) =>
      s.symbol.toLowerCase().includes(lowerQuery) ||
      s.name.toLowerCase().includes(lowerQuery) ||
      s.sector.toLowerCase().includes(lowerQuery)
  );
}

export function getTopMovers(): {
  gainers: StockQuote[];
  losers: StockQuote[];
  mostActive: StockQuote[];
} {
  const allStocks = getAllMockStocks();
  const sorted = [...allStocks].sort((a, b) => b.changePercent - a.changePercent);

  return {
    gainers: sorted.slice(0, 5),
    losers: sorted.slice(-5).reverse(),
    mostActive: [...allStocks].sort((a, b) => b.volume - a.volume).slice(0, 5),
  };
}
