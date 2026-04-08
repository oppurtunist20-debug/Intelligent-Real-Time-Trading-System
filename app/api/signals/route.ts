import { NextResponse } from "next/server";
import { INDIAN_STOCKS, getMockStockData, generateHistoricalData } from "@/lib/indian-stocks";
import { calculateAllIndicators, generateTechnicalSignal } from "@/lib/technical-analysis";
import { generateTradingSignal } from "@/lib/gemini";
import type { TradingSignal } from "@/lib/types";

function generateMockSignals(): TradingSignal[] {
  const signals: TradingSignal[] = [];

  for (const stockInfo of INDIAN_STOCKS.slice(0, 20)) {
    try {
      const historical = generateHistoricalData(stockInfo.symbol, 100);
      const indicators = calculateAllIndicators(historical);
      const { signal, score, reasons } = generateTechnicalSignal(indicators);
      const stockData = getMockStockData(stockInfo.symbol);

      const sentimentScore = (Math.random() - 0.4) * 1.5;
      const macroScore = 50 + (Math.random() - 0.5) * 30;
      const technicalScore = score;

      const overallConfidence = (technicalScore * 0.5 + (sentimentScore + 1) * 25 + (macroScore / 100) * 25);
      const confidence = Math.round(Math.max(40, Math.min(95, overallConfidence)));

      const targetMultiplier = signal === "BUY" ? 1.08 : signal === "SELL" ? 0.93 : 1.02;
      const stopMultiplier = signal === "BUY" ? 0.95 : signal === "SELL" ? 1.05 : 0.97;

      signals.push({
        id: `signal-${stockInfo.symbol}-${Date.now()}`,
        stockSymbol: stockInfo.symbol,
        signal,
        confidence,
        reasoning: reasons.slice(0, 3).join(". ") + ".",
        technicalScore,
        sentimentScore: Math.round((sentimentScore + 1) * 50),
        macroScore,
        targetPrice: Math.round(stockData.currentPrice * targetMultiplier * 100) / 100,
        stopLoss: Math.round(stockData.currentPrice * stopMultiplier * 100) / 100,
        timeframe: "2 weeks",
        generatedBy: "TECHNICAL",
        createdAt: new Date().toISOString(),
      });
    } catch {
      // Skip stocks with insufficient data
    }
  }

  return signals;
}

let cachedSignals: TradingSignal[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    const now = Date.now();
    if (!cachedSignals || !cacheTimestamp || (now - cacheTimestamp) > CACHE_DURATION) {
      cachedSignals = generateMockSignals();
      cacheTimestamp = now;
    }
    return NextResponse.json({ data: cachedSignals });
  } catch (error) {
    console.error("Signals API error:", error);
    return NextResponse.json({ error: "Failed to fetch signals" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symbol, generateAll } = body;

    // Handle "generate all" — regenerate the cached signals
    if (generateAll || !symbol) {
      cachedSignals = generateMockSignals();
      cacheTimestamp = Date.now();
      return NextResponse.json({ data: cachedSignals });
    }

    const historical = generateHistoricalData(symbol.toUpperCase(), 100);
    const indicators = calculateAllIndicators(historical);
    const stockData = getMockStockData(symbol.toUpperCase());

    const sentimentScore = (Math.random() - 0.4);
    const macroContext = "RBI maintains repo rate at 6.5%. FII flows mixed. India VIX at 15.2.";

    const geminiSignal = await generateTradingSignal({
      symbol: symbol.toUpperCase(),
      currentPrice: stockData.currentPrice,
      technicalIndicators: {
        rsi: indicators.rsi,
        macd: indicators.macd,
        trend: indicators.trend,
        sma20: indicators.sma20,
        sma50: indicators.sma50,
        bollingerBands: indicators.bollingerBands,
      },
      sentimentScore,
      macroContext,
    });

    const signal: TradingSignal = {
      id: `signal-${symbol}-${Date.now()}`,
      stockSymbol: symbol.toUpperCase(),
      signal: geminiSignal.signal,
      confidence: geminiSignal.confidence,
      reasoning: geminiSignal.reasoning,
      technicalScore: 60,
      sentimentScore: Math.round((sentimentScore + 1) * 50),
      macroScore: 55,
      targetPrice: geminiSignal.targetPrice,
      stopLoss: geminiSignal.stopLoss,
      timeframe: geminiSignal.timeframe,
      generatedBy: "GEMINI",
      createdAt: new Date().toISOString(),
    };

    // Invalidate cache
    cachedSignals = null;

    return NextResponse.json({ data: signal });
  } catch (error) {
    console.error("Signal generation error:", error);
    return NextResponse.json({ error: "Failed to generate signal" }, { status: 500 });
  }
}
