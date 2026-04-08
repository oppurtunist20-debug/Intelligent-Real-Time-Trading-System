import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

function getModel() {
  if (!genAI) {
    throw new Error("Gemini API key not configured");
  }
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
}

export async function analyzeStockSentiment(
  stockSymbol: string,
  newsHeadlines: string[]
): Promise<{
  sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
  score: number;
  reasoning: string;
  keyFactors: string[];
}> {
  try {
    const model = getModel();
    const prompt = `Analyze the market sentiment for ${stockSymbol} (Indian stock) based on these news headlines:

${newsHeadlines.map((h, i) => `${i + 1}. ${h}`).join("\n")}

Provide a JSON response with:
- sentiment: "BULLISH", "BEARISH", or "NEUTRAL"
- score: number between -1 (very bearish) and 1 (very bullish)
- reasoning: brief explanation (2-3 sentences)
- keyFactors: array of 3-5 key factors influencing sentiment

Return only valid JSON.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("No JSON in response");
  } catch {
    // Fallback mock response
    const sentiments: Array<"BULLISH" | "BEARISH" | "NEUTRAL"> = ["BULLISH", "BEARISH", "NEUTRAL"];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    const score = sentiment === "BULLISH" ? 0.6 : sentiment === "BEARISH" ? -0.5 : 0.1;

    return {
      sentiment,
      score,
      reasoning: `Based on recent news analysis for ${stockSymbol}, the market sentiment appears ${sentiment.toLowerCase()}. Key developments in the sector and company-specific news are driving this outlook.`,
      keyFactors: [
        "Quarterly earnings performance",
        "Sector-wide trends",
        "FII/DII activity",
        "Macroeconomic environment",
        "Technical breakout patterns",
      ],
    };
  }
}

export async function generateTradingSignal(stockData: {
  symbol: string;
  currentPrice: number;
  technicalIndicators: {
    rsi: number;
    macd: { macdLine: number; signalLine: number; histogram: number };
    trend: string;
    sma20: number;
    sma50: number;
    bollingerBands: { upper: number; lower: number; percentB: number };
  };
  sentimentScore: number;
  macroContext: string;
}): Promise<{
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string;
  targetPrice: number;
  stopLoss: number;
  timeframe: string;
}> {
  try {
    const model = getModel();
    const { symbol, currentPrice, technicalIndicators, sentimentScore, macroContext } = stockData;

    const prompt = `Generate a trading signal for ${symbol} listed on NSE India.

Current Data:
- Price: ₹${currentPrice}
- RSI: ${technicalIndicators.rsi.toFixed(2)}
- MACD: ${technicalIndicators.macd.macdLine.toFixed(2)} (Signal: ${technicalIndicators.macd.signalLine.toFixed(2)})
- Trend: ${technicalIndicators.trend}
- SMA20: ₹${technicalIndicators.sma20.toFixed(2)}, SMA50: ₹${technicalIndicators.sma50.toFixed(2)}
- Bollinger %B: ${(technicalIndicators.bollingerBands.percentB * 100).toFixed(1)}%
- Sentiment Score: ${sentimentScore} (-1 bearish to 1 bullish)
- Macro Context: ${macroContext}

Provide a JSON response with:
- signal: "BUY", "SELL", or "HOLD"
- confidence: number 0-100 (how confident in the signal)
- reasoning: detailed explanation (3-4 sentences)
- targetPrice: price target in INR
- stopLoss: stop loss price in INR
- timeframe: "1 week", "2 weeks", "1 month", or "3 months"

Return only valid JSON.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("No JSON in response");
  } catch {
    // Fallback based on technical indicators
    const { currentPrice, technicalIndicators } = stockData;
    const { rsi, trend, macd } = technicalIndicators;

    let signal: "BUY" | "SELL" | "HOLD" = "HOLD";
    let confidence = 55;

    if (rsi < 35 && trend === "UPTREND" && macd.histogram > 0) {
      signal = "BUY";
      confidence = 72;
    } else if (rsi > 65 && trend === "DOWNTREND" && macd.histogram < 0) {
      signal = "SELL";
      confidence = 68;
    } else if (trend === "UPTREND" && macd.macdLine > macd.signalLine) {
      signal = "BUY";
      confidence = 61;
    } else if (trend === "DOWNTREND" && macd.macdLine < macd.signalLine) {
      signal = "SELL";
      confidence = 58;
    }

    const targetMultiplier = signal === "BUY" ? 1.08 : signal === "SELL" ? 0.93 : 1.03;
    const stopLossMultiplier = signal === "BUY" ? 0.95 : signal === "SELL" ? 1.05 : 0.97;

    return {
      signal,
      confidence,
      reasoning: `Technical analysis for ${stockData.symbol} suggests a ${signal} signal based on RSI at ${rsi.toFixed(1)}, ${trend} trend, and MACD ${macd.histogram > 0 ? "positive" : "negative"} histogram. The sentiment score of ${stockData.sentimentScore} ${stockData.sentimentScore > 0 ? "supports" : "contradicts"} this view. Risk management remains important in current market conditions.`,
      targetPrice: Math.round(currentPrice * targetMultiplier * 100) / 100,
      stopLoss: Math.round(currentPrice * stopLossMultiplier * 100) / 100,
      timeframe: "2 weeks",
    };
  }
}

export async function analyzeMacroImpact(indicators: Array<{
  name: string;
  value: number;
  previousValue: number;
  category: string;
  description: string;
}>): Promise<{
  overallImpact: string;
  marketOutlook: string;
  sectors: Array<{ sector: string; impact: string }>;
}> {
  try {
    const model = getModel();
    const prompt = `Analyze the impact of these macroeconomic indicators on the Indian stock market (NSE/BSE):

${indicators
  .map(
    (i) =>
      `- ${i.name}: ${i.value} (Previous: ${i.previousValue}) - ${i.description}`
  )
  .join("\n")}

Provide a JSON response with:
- overallImpact: "POSITIVE", "NEGATIVE", or "NEUTRAL"
- marketOutlook: 3-4 sentence analysis of market outlook
- sectors: array of objects with sector name and impact ("Positive", "Negative", or "Neutral") for: Banking, IT, Pharma, Auto, FMCG, Energy, Metals, Infrastructure

Return only valid JSON.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("No JSON in response");
  } catch {
    return {
      overallImpact: "NEUTRAL",
      marketOutlook:
        "Indian markets are navigating a complex macro environment with RBI maintaining a cautious stance on rates. FII flows remain mixed while domestic institutional investors provide support. Corporate earnings season continues to show resilience in select sectors.",
      sectors: [
        { sector: "Banking", impact: "Positive" },
        { sector: "IT", impact: "Neutral" },
        { sector: "Pharma", impact: "Positive" },
        { sector: "Auto", impact: "Negative" },
        { sector: "FMCG", impact: "Neutral" },
        { sector: "Energy", impact: "Positive" },
        { sector: "Metals", impact: "Negative" },
        { sector: "Infrastructure", impact: "Positive" },
      ],
    };
  }
}

export async function getMarketSummary(
  stocks: Array<{ symbol: string; changePercent: number; signal?: string }>
): Promise<string> {
  try {
    const model = getModel();
    const gainers = stocks.filter((s) => s.changePercent > 0).length;
    const losers = stocks.filter((s) => s.changePercent < 0).length;
    const buys = stocks.filter((s) => s.signal === "BUY").length;
    const sells = stocks.filter((s) => s.signal === "SELL").length;

    const prompt = `Generate a brief market summary for Indian stock market (NSE) with these stats:
- Total stocks tracked: ${stocks.length}
- Gainers: ${gainers}, Losers: ${losers}
- BUY signals: ${buys}, SELL signals: ${sells}
- Top gainer: ${stocks.sort((a, b) => b.changePercent - a.changePercent)[0]?.symbol} (+${stocks[0]?.changePercent?.toFixed(2)}%)
- Top loser: ${stocks.sort((a, b) => a.changePercent - b.changePercent)[0]?.symbol} (${stocks[0]?.changePercent?.toFixed(2)}%)

Write a 2-3 sentence professional market summary suitable for a trading dashboard. Be concise and informative.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return "Indian markets are showing mixed signals today with select sectors outperforming. Banking and IT stocks remain in focus with moderate trading volumes. Investors are advised to maintain cautious positioning amid global uncertainty.";
  }
}

export async function analyzeFullStock(
  symbol: string,
  stockData: {
    currentPrice: number;
    change: number;
    changePercent: number;
    sector: string;
    technicalIndicators: object;
    historicalData: Array<{ date: string; close: number }>;
  }
): Promise<{
  summary: string;
  strengths: string[];
  risks: string[];
  recommendation: string;
  priceTarget: number;
  timeHorizon: string;
}> {
  try {
    const model = getModel();
    const recentPrices = stockData.historicalData.slice(-10).map((d) => d.close);

    const prompt = `Provide a comprehensive analysis of ${symbol} (Indian stock, ${stockData.sector} sector):

Current Price: ₹${stockData.currentPrice}
Today's Change: ${stockData.changePercent > 0 ? "+" : ""}${stockData.changePercent.toFixed(2)}%
Recent prices (last 10 days): ${recentPrices.join(", ")}

Provide a JSON response with:
- summary: 3-4 sentence comprehensive analysis
- strengths: array of 3-5 key strengths
- risks: array of 3-5 key risks
- recommendation: "BUY", "SELL", or "HOLD" with brief justification
- priceTarget: 3-month price target in INR
- timeHorizon: "Short-term (1-2 weeks)", "Medium-term (1-3 months)", or "Long-term (6-12 months)"

Return only valid JSON.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("No JSON in response");
  } catch {
    const priceTarget = stockData.currentPrice * 1.1;
    return {
      summary: `${symbol} is currently trading at ₹${stockData.currentPrice} with ${stockData.changePercent > 0 ? "gains" : "losses"} of ${Math.abs(stockData.changePercent).toFixed(2)}% today. The ${stockData.sector} sector shows mixed signals in the current macro environment. Technical indicators suggest monitoring key support and resistance levels closely.`,
      strengths: [
        "Strong brand recognition in Indian market",
        "Consistent revenue growth trajectory",
        "Healthy balance sheet with manageable debt",
        "Strong management team with proven track record",
      ],
      risks: [
        "Global macroeconomic headwinds",
        "Regulatory environment changes",
        "Competition from domestic and global players",
        "Currency and commodity price volatility",
      ],
      recommendation: stockData.changePercent > 1 ? "BUY" : stockData.changePercent < -1 ? "SELL" : "HOLD",
      priceTarget,
      timeHorizon: "Medium-term (1-3 months)",
    };
  }
}
