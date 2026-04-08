import { NextResponse } from "next/server";
import { getMockStockData, generateHistoricalData } from "@/lib/indian-stocks";
import { calculateAllIndicators } from "@/lib/technical-analysis";
import { generateTradingSignal, analyzeStockSentiment, analyzeFullStock } from "@/lib/gemini";
import { generateMockNewsHeadlines } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symbol } = body;

    if (!symbol) {
      return NextResponse.json({ error: "Symbol required" }, { status: 400 });
    }

    const upperSymbol = symbol.toUpperCase();

    // Get stock data
    const stockData = getMockStockData(upperSymbol);
    const historicalData = generateHistoricalData(upperSymbol, 100);
    const indicators = calculateAllIndicators(historicalData);

    // Get news and sentiment
    const headlines = generateMockNewsHeadlines(upperSymbol);
    const sentimentResult = await analyzeStockSentiment(upperSymbol, headlines);

    // Generate trading signal
    const macroContext = "RBI repo rate at 6.5%. India GDP growth at 6.7%. FII net outflows in November. USD/INR at 84.48. India VIX at 14.85.";

    const tradingSignal = await generateTradingSignal({
      symbol: upperSymbol,
      currentPrice: stockData.currentPrice,
      technicalIndicators: {
        rsi: indicators.rsi,
        macd: indicators.macd,
        trend: indicators.trend,
        sma20: indicators.sma20,
        sma50: indicators.sma50,
        bollingerBands: indicators.bollingerBands,
      },
      sentimentScore: sentimentResult.score,
      macroContext,
    });

    // Full stock analysis
    const fullAnalysis = await analyzeFullStock(upperSymbol, {
      currentPrice: stockData.currentPrice,
      change: stockData.change,
      changePercent: stockData.changePercent,
      sector: stockData.sector,
      technicalIndicators: indicators,
      historicalData: historicalData.slice(-10),
    });

    return NextResponse.json({
      data: {
        stock: stockData,
        technicalIndicators: indicators,
        sentiment: sentimentResult,
        signal: {
          ...tradingSignal,
          stockSymbol: upperSymbol,
          id: `analysis-${upperSymbol}-${Date.now()}`,
          createdAt: new Date().toISOString(),
          generatedBy: "GEMINI",
          technicalScore: indicators.rsi,
          sentimentScore: Math.round((sentimentResult.score + 1) * 50),
          macroScore: 55,
        },
        fullAnalysis,
        headlines,
      },
    });
  } catch (error) {
    console.error("Analysis API error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
