import { NextResponse } from "next/server";
import { INDIAN_STOCKS } from "@/lib/indian-stocks";
import { analyzeStockSentiment } from "@/lib/gemini";
import { generateMockNewsHeadlines } from "@/lib/utils";
import type { StockSentiment, NewsArticle } from "@/lib/types";

const NEWS_SOURCES = [
  "Economic Times",
  "Business Standard",
  "Mint",
  "Moneycontrol",
  "NDTV Profit",
  "Financial Express",
  "Reuters India",
  "Bloomberg India",
];

const NEWS_TEMPLATES = [
  "Q3 results beat expectations, profit up {n}%",
  "Announces expansion plans, targets new markets",
  "Analysts upgrade to 'Buy', raise target price",
  "Signs strategic partnership for digital transformation",
  "Board approves ₹{n}00 Cr buyback at premium",
  "Reports strong order book growth of {n}%",
  "Management guidance positive for FY25",
  "FII increases stake to {n}-year high",
  "Launches new product line targeting premium segment",
  "Wins major government contract worth ₹{n}000 Cr",
  "Concerns over margin pressure in Q4",
  "Faces regulatory headwinds in key segment",
  "Competition intensifying in core market",
  "Global slowdown may impact export revenues",
  "Rising input costs could dent profitability",
];

function generateNews(stockSymbols: string[]): NewsArticle[] {
  const articles: NewsArticle[] = [];
  const now = new Date();

  for (const symbol of stockSymbols.slice(0, 8)) {
    const count = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const template = NEWS_TEMPLATES[Math.floor(Math.random() * NEWS_TEMPLATES.length)];
      const n = Math.floor(Math.random() * 20) + 5;
      const title = `${symbol}: ${template.replace("{n}", n.toString())}`;
      const isBullish = !title.toLowerCase().includes("concern") &&
        !title.toLowerCase().includes("headwind") &&
        !title.toLowerCase().includes("competition") &&
        !title.toLowerCase().includes("slowdown") &&
        !title.toLowerCase().includes("rising input");

      const sentimentScore = isBullish
        ? 0.3 + Math.random() * 0.6
        : -0.6 + Math.random() * 0.3;

      const hoursAgo = Math.floor(Math.random() * 48);
      const publishedAt = new Date(now.getTime() - hoursAgo * 3600000);

      articles.push({
        id: `news-${symbol}-${i}`,
        title,
        url: `https://example.com/news/${symbol.toLowerCase()}-${i}`,
        source: NEWS_SOURCES[Math.floor(Math.random() * NEWS_SOURCES.length)],
        publishedAt: publishedAt.toISOString(),
        sentiment: sentimentScore > 0.2 ? "BULLISH" : sentimentScore < -0.2 ? "BEARISH" : "NEUTRAL",
        sentimentScore: Math.round(sentimentScore * 100) / 100,
        stockSymbols: [symbol],
        summary: title,
      });
    }
  }

  // Sort by published date
  return articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

function generateSentimentTrend(): Array<{ date: string; score: number }> {
  const data = [];
  let score = 0.2;
  const now = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 86400000);
    score += (Math.random() - 0.5) * 0.1;
    score = Math.max(-0.8, Math.min(0.8, score));

    data.push({
      date: date.toISOString().split("T")[0],
      score: Math.round(score * 100) / 100,
    });
  }

  return data;
}

export async function GET() {
  try {
    const symbols = INDIAN_STOCKS.slice(0, 15).map((s) => s.symbol);
    const news = generateNews(symbols);
    const trendData = generateSentimentTrend();

    // Generate stock sentiments
    const stockSentiments: StockSentiment[] = INDIAN_STOCKS.slice(0, 15).map((stock) => {
      const stockNews = news.filter((n) => n.stockSymbols.includes(stock.symbol));
      const avgScore =
        stockNews.length > 0
          ? stockNews.reduce((sum, n) => sum + n.sentimentScore, 0) / stockNews.length
          : (Math.random() - 0.4) * 0.8;

      const sentiment =
        avgScore > 0.2 ? "BULLISH" : avgScore < -0.2 ? "BEARISH" : "NEUTRAL";

      return {
        symbol: stock.symbol,
        name: stock.name,
        sentiment: sentiment as "BULLISH" | "BEARISH" | "NEUTRAL",
        score: Math.round(avgScore * 100) / 100,
        articles: stockNews,
      };
    });

    const overallScore =
      stockSentiments.reduce((sum, s) => sum + s.score, 0) / stockSentiments.length;
    const overall =
      overallScore > 0.2 ? "BULLISH" : overallScore < -0.2 ? "BEARISH" : "NEUTRAL";

    return NextResponse.json({
      data: {
        overall: overall as "BULLISH" | "BEARISH" | "NEUTRAL",
        score: Math.round(overallScore * 100) / 100,
        stocks: stockSentiments,
        news,
        trendData,
      },
    });
  } catch (error) {
    console.error("Sentiment API error:", error);
    return NextResponse.json({ error: "Failed to fetch sentiment" }, { status: 500 });
  }
}
