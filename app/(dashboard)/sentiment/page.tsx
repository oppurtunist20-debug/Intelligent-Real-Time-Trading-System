"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { formatTimeAgo, getSentimentColor } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { StockSentiment, NewsArticle } from "@/lib/types";

interface SentimentData {
  overall: "BULLISH" | "BEARISH" | "NEUTRAL";
  score: number;
  stocks: StockSentiment[];
  news: NewsArticle[];
  trendData: Array<{ date: string; score: number }>;
}

export default function SentimentPage() {
  const [data, setData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSentiment() {
      try {
        const res = await fetch("/api/sentiment");
        const json = await res.json();
        setData(json.data);
      } catch (error) {
        console.error("Sentiment fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSentiment();
  }, []);

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case "BULLISH": return "bg-green-500/10 border-green-500/20 text-green-400";
      case "BEARISH": return "bg-red-500/10 border-red-500/20 text-red-400";
      default: return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const sentimentPercent = data ? Math.round((data.score + 1) * 50) : 50;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Market Sentiment</h1>
        <p className="text-muted-foreground text-sm mt-1">
          AI-powered sentiment analysis for Indian markets
        </p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Sentiment Gauge */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Overall Market Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Bearish</span>
              <Badge className={getSentimentBg(data?.overall || "NEUTRAL")}>
                {data?.overall || "NEUTRAL"}
              </Badge>
              <span className="text-sm text-muted-foreground">Bullish</span>
            </div>
            <div className="relative">
              <Progress value={sentimentPercent} className="h-4 rounded-full" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>Neutral (50)</span>
                <span>100</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className={`text-4xl font-bold ${getSentimentColor(data?.overall || "NEUTRAL")}`}>
                {sentimentPercent}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Sentiment Score</div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: "Bullish", count: data?.stocks?.filter(s => s.sentiment === "BULLISH").length || 0, color: "text-green-400" },
                { label: "Neutral", count: data?.stocks?.filter(s => s.sentiment === "NEUTRAL").length || 0, color: "text-yellow-400" },
                { label: "Bearish", count: data?.stocks?.filter(s => s.sentiment === "BEARISH").length || 0, color: "text-red-400" },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 bg-background rounded-lg">
                  <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Trend */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Sentiment Trend (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data?.trendData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis
                  domain={[-1, 1]}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stock Sentiment Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Stock-wise Sentiment</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">STOCK</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">SENTIMENT</th>
                  <th className="text-right p-3 text-xs text-muted-foreground font-medium">SCORE</th>
                  <th className="text-right p-3 text-xs text-muted-foreground font-medium">NEWS COUNT</th>
                </tr>
              </thead>
              <tbody>
                {(data?.stocks || []).slice(0, 15).map((stock) => (
                  <tr key={stock.symbol} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3">
                      <div className="font-semibold text-sm">{stock.symbol}</div>
                      <div className="text-xs text-muted-foreground">{stock.name}</div>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className={getSentimentBg(stock.sentiment)} variant="outline">
                        {stock.sentiment}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className={`font-semibold text-sm ${getSentimentColor(stock.sentiment)}`}>
                        {stock.score.toFixed(2)}
                      </div>
                      <Progress
                        value={Math.round((stock.score + 1) * 50)}
                        className="h-1 mt-1 w-24 ml-auto"
                      />
                    </td>
                    <td className="p-3 text-right text-sm text-muted-foreground">
                      {stock.articles?.length || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent News */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Recent Market News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(data?.news || []).slice(0, 10).map((article, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-background rounded-lg">
                <Badge
                  className={`shrink-0 mt-0.5 ${getSentimentBg(article.sentiment)}`}
                  variant="outline"
                >
                  {article.sentiment}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug">{article.title}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(article.publishedAt)}</span>
                    {article.stockSymbols?.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{article.stockSymbols.slice(0, 3).join(", ")}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
