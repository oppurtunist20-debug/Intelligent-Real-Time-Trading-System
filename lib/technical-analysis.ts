import type {
  OHLCVData,
  TechnicalIndicators,
  MACDData,
  BollingerBands,
  VolumeAnalysis,
  RSIDataPoint,
  MACDDataPoint,
  CandlestickDataPoint,
} from "./types";

// Simple Moving Average
export function calculateSMA(data: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / period);
    }
  }
  return result;
}

// Exponential Moving Average
export function calculateEMA(data: number[], period: number): number[] {
  const result: number[] = [];
  const multiplier = 2 / (period + 1);

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      result.push(data[0]);
    } else if (i < period - 1) {
      // Use SMA for initial EMA
      const sum = data.slice(0, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / (i + 1));
    } else {
      const ema = (data[i] - result[i - 1]) * multiplier + result[i - 1];
      result.push(ema);
    }
  }
  return result;
}

// Relative Strength Index
export function calculateRSI(data: number[], period = 14): number[] {
  const result: number[] = new Array(period).fill(NaN);
  const changes = data.slice(1).map((val, i) => val - data[i]);

  let avgGain =
    changes.slice(0, period).filter((c) => c > 0).reduce((a, b) => a + b, 0) / period;
  let avgLoss =
    changes
      .slice(0, period)
      .filter((c) => c < 0)
      .reduce((a, b) => a + Math.abs(b), 0) / period;

  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  result.push(100 - 100 / (1 + rs));

  for (let i = period; i < changes.length; i++) {
    const gain = changes[i] > 0 ? changes[i] : 0;
    const loss = changes[i] < 0 ? Math.abs(changes[i]) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    const rsiValue = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    result.push(rsiValue);
  }

  return result;
}

// MACD
export function calculateMACD(
  data: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): { macd: number[]; signal: number[]; histogram: number[] } {
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);

  const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
  const signalLine = calculateEMA(
    macdLine.filter((v) => !isNaN(v)),
    signalPeriod
  );

  // Pad signal line with NaN
  const signalPadded = new Array(macdLine.length - signalLine.length).fill(NaN).concat(signalLine);
  const histogram = macdLine.map((m, i) => m - signalPadded[i]);

  return {
    macd: macdLine,
    signal: signalPadded,
    histogram,
  };
}

// Bollinger Bands
export function calculateBollingerBands(
  data: number[],
  period = 20,
  multiplier = 2
): { upper: number[]; middle: number[]; lower: number[] } {
  const sma = calculateSMA(data, period);
  const upper: number[] = [];
  const lower: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const mean = sma[i];
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
      const stdDev = Math.sqrt(variance);
      upper.push(mean + multiplier * stdDev);
      lower.push(mean - multiplier * stdDev);
    }
  }

  return { upper, middle: sma, lower };
}

// Support and Resistance levels
export function calculateSupportResistance(
  highs: number[],
  lows: number[],
  period = 20
): { support: number; resistance: number } {
  const recentHighs = highs.slice(-period);
  const recentLows = lows.slice(-period);

  return {
    resistance: Math.max(...recentHighs),
    support: Math.min(...recentLows),
  };
}

// Detect trend
export function detectTrend(
  closes: number[],
  shortPeriod = 20,
  longPeriod = 50
): "UPTREND" | "DOWNTREND" | "SIDEWAYS" {
  if (closes.length < longPeriod) return "SIDEWAYS";

  const shortSMA = calculateSMA(closes, shortPeriod);
  const longSMA = calculateSMA(closes, longPeriod);

  const lastShort = shortSMA[shortSMA.length - 1];
  const lastLong = longSMA[longSMA.length - 1];
  const lastClose = closes[closes.length - 1];

  if (lastShort > lastLong && lastClose > lastShort) return "UPTREND";
  if (lastShort < lastLong && lastClose < lastShort) return "DOWNTREND";
  return "SIDEWAYS";
}

// Calculate momentum
export function calculateMomentum(closes: number[], period = 10): number {
  if (closes.length < period + 1) return 0;
  const current = closes[closes.length - 1];
  const previous = closes[closes.length - 1 - period];
  return ((current - previous) / previous) * 100;
}

// Volume analysis
export function analyzeVolume(volumes: number[]): VolumeAnalysis {
  const current = volumes[volumes.length - 1];
  const avg20 = volumes.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, volumes.length);
  const ratio = current / avg20;

  const recentAvg = volumes.slice(-5).reduce((a, b) => a + b, 0) / 5;
  const olderAvg = volumes.slice(-20, -5).reduce((a, b) => a + b, 0) / 15;

  let trend: "INCREASING" | "DECREASING" | "STABLE";
  if (recentAvg > olderAvg * 1.1) trend = "INCREASING";
  else if (recentAvg < olderAvg * 0.9) trend = "DECREASING";
  else trend = "STABLE";

  return { current, average20: avg20, ratio, trend };
}

// Generate trading signal based on technical indicators
export function generateTechnicalSignal(indicators: TechnicalIndicators): {
  signal: "BUY" | "SELL" | "HOLD";
  score: number;
  reasons: string[];
} {
  let score = 0;
  const reasons: string[] = [];

  // RSI analysis
  if (indicators.rsi < 30) {
    score += 25;
    reasons.push("RSI oversold (<30) - bullish signal");
  } else if (indicators.rsi > 70) {
    score -= 25;
    reasons.push("RSI overbought (>70) - bearish signal");
  } else if (indicators.rsi < 45) {
    score += 10;
    reasons.push("RSI below midline - mild bullish");
  } else if (indicators.rsi > 55) {
    score -= 10;
    reasons.push("RSI above midline - mild bearish");
  }

  // MACD analysis
  if (indicators.macd.histogram > 0 && indicators.macd.macdLine > indicators.macd.signalLine) {
    score += 20;
    reasons.push("MACD bullish crossover");
  } else if (indicators.macd.histogram < 0 && indicators.macd.macdLine < indicators.macd.signalLine) {
    score -= 20;
    reasons.push("MACD bearish crossover");
  }

  // Bollinger Bands
  if (indicators.bollingerBands.percentB < 0.2) {
    score += 15;
    reasons.push("Price near lower Bollinger Band - potential reversal");
  } else if (indicators.bollingerBands.percentB > 0.8) {
    score -= 15;
    reasons.push("Price near upper Bollinger Band - potential reversal");
  }

  // Trend analysis
  if (indicators.trend === "UPTREND") {
    score += 20;
    reasons.push("Price in uptrend");
  } else if (indicators.trend === "DOWNTREND") {
    score -= 20;
    reasons.push("Price in downtrend");
  }

  // Moving average analysis
  if (indicators.sma20 > indicators.sma50) {
    score += 10;
    reasons.push("Short-term MA above long-term MA - golden cross area");
  } else {
    score -= 10;
    reasons.push("Short-term MA below long-term MA - death cross area");
  }

  // Volume analysis
  if (indicators.volume.ratio > 1.5 && indicators.trend === "UPTREND") {
    score += 10;
    reasons.push("High volume confirms uptrend");
  } else if (indicators.volume.ratio > 1.5 && indicators.trend === "DOWNTREND") {
    score -= 10;
    reasons.push("High volume confirms downtrend");
  }

  let signal: "BUY" | "SELL" | "HOLD";
  if (score >= 30) signal = "BUY";
  else if (score <= -30) signal = "SELL";
  else signal = "HOLD";

  // Normalize score to 0-100
  const normalizedScore = Math.min(100, Math.max(0, (score + 100) / 2));

  return { signal, score: normalizedScore, reasons };
}

// Calculate all technical indicators from OHLCV data
export function calculateAllIndicators(data: OHLCVData[]): TechnicalIndicators {
  if (data.length < 50) {
    throw new Error("Insufficient data for technical analysis");
  }

  const closes = data.map((d) => d.close);
  const highs = data.map((d) => d.high);
  const lows = data.map((d) => d.low);
  const volumes = data.map((d) => d.volume);

  const sma20Values = calculateSMA(closes, 20);
  const sma50Values = calculateSMA(closes, 50);
  const sma200Values = calculateSMA(closes, 200);
  const ema9Values = calculateEMA(closes, 9);
  const ema21Values = calculateEMA(closes, 21);
  const rsiValues = calculateRSI(closes, 14);
  const macdData = calculateMACD(closes);
  const bbData = calculateBollingerBands(closes, 20, 2);

  const lastIdx = closes.length - 1;
  const lastClose = closes[lastIdx];

  const bbUpper = bbData.upper[lastIdx];
  const bbLower = bbData.lower[lastIdx];
  const bbMiddle = bbData.middle[lastIdx];

  const percentB = (lastClose - bbLower) / (bbUpper - bbLower);
  const bandwidth = (bbUpper - bbLower) / bbMiddle;

  const { support, resistance } = calculateSupportResistance(highs, lows, 20);
  const trend = detectTrend(closes, 20, 50);
  const momentum = calculateMomentum(closes, 10);
  const volumeAnalysis = analyzeVolume(volumes);

  return {
    sma20: sma20Values[lastIdx],
    sma50: sma50Values[lastIdx],
    sma200: sma200Values[lastIdx] || 0,
    ema9: ema9Values[lastIdx],
    ema21: ema21Values[lastIdx],
    rsi: rsiValues[lastIdx],
    macd: {
      macdLine: macdData.macd[lastIdx],
      signalLine: macdData.signal[lastIdx],
      histogram: macdData.histogram[lastIdx],
    },
    bollingerBands: {
      upper: bbUpper,
      middle: bbMiddle,
      lower: bbLower,
      bandwidth,
      percentB: isNaN(percentB) ? 0.5 : percentB,
    },
    volume: volumeAnalysis,
    support,
    resistance,
    trend,
    momentum,
  };
}

// Prepare chart data with technical overlays
export function prepareChartData(data: OHLCVData[]): CandlestickDataPoint[] {
  const closes = data.map((d) => d.close);
  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);

  return data.map((d, i) => ({
    date: d.date,
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
    volume: d.volume,
    sma20: isNaN(sma20[i]) ? undefined : Math.round(sma20[i] * 100) / 100,
    sma50: isNaN(sma50[i]) ? undefined : Math.round(sma50[i] * 100) / 100,
  }));
}

export function prepareRSIData(data: OHLCVData[]): RSIDataPoint[] {
  const closes = data.map((d) => d.close);
  const rsiValues = calculateRSI(closes, 14);

  return data.map((d, i) => ({
    date: d.date,
    rsi: isNaN(rsiValues[i]) ? 50 : Math.round(rsiValues[i] * 100) / 100,
  }));
}

export function prepareMACDData(data: OHLCVData[]): MACDDataPoint[] {
  const closes = data.map((d) => d.close);
  const macdData = calculateMACD(closes);

  return data.map((d, i) => ({
    date: d.date,
    macd: isNaN(macdData.macd[i]) ? 0 : Math.round(macdData.macd[i] * 100) / 100,
    signal: isNaN(macdData.signal[i]) ? 0 : Math.round(macdData.signal[i] * 100) / 100,
    histogram: isNaN(macdData.histogram[i]) ? 0 : Math.round(macdData.histogram[i] * 100) / 100,
  }));
}
