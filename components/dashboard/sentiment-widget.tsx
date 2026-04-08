"use client";

import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StockQuote } from "@/lib/types";

interface SentimentWidgetProps {
  score: number; // -1 to 1
  stocks: StockQuote[];
}

export function SentimentWidget({ score, stocks }: SentimentWidgetProps) {
  const sentiment = score > 0.2 ? "BULLISH" : score < -0.2 ? "BEARISH" : "NEUTRAL";
  const sentimentPercent = Math.round((score + 1) * 50);

  const sentimentColor =
    sentiment === "BULLISH"
      ? "text-green-400"
      : sentiment === "BEARISH"
      ? "text-red-400"
      : "text-yellow-400";

  const sentimentBg =
    sentiment === "BULLISH"
      ? "bg-green-500/10 border-green-500/20 text-green-400"
      : sentiment === "BEARISH"
      ? "bg-red-500/10 border-red-500/20 text-red-400"
      : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";

  // Calculate from stocks
  const gainers = stocks.filter((s) => s.changePercent > 1).length;
  const losers = stocks.filter((s) => s.changePercent < -1).length;
  const neutral = stocks.length - gainers - losers;

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Market Sentiment</CardTitle>
          </div>
          <Link href="/sentiment">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              Details <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {/* Gauge */}
        <div className="flex flex-col items-center mb-4">
          {/* SVG Arc Gauge */}
          <svg viewBox="0 0 120 70" className="w-full max-w-36">
            {/* Background arc */}
            <path
              d="M 10 65 A 50 50 0 0 1 110 65"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Bearish zone */}
            <path
              d="M 10 65 A 50 50 0 0 1 45 22"
              fill="none"
              stroke="#ef4444"
              strokeWidth="12"
              strokeLinecap="round"
              opacity={0.6}
            />
            {/* Neutral zone */}
            <path
              d="M 45 22 A 50 50 0 0 1 75 22"
              fill="none"
              stroke="#eab308"
              strokeWidth="12"
              strokeLinecap="round"
              opacity={0.6}
            />
            {/* Bullish zone */}
            <path
              d="M 75 22 A 50 50 0 0 1 110 65"
              fill="none"
              stroke="#22c55e"
              strokeWidth="12"
              strokeLinecap="round"
              opacity={0.6}
            />

            {/* Needle */}
            {(() => {
              const angle = (sentimentPercent / 100) * 180 - 90; // -90 to 90 degrees
              const rad = (angle * Math.PI) / 180;
              const x = 60 + 35 * Math.cos(rad - Math.PI / 2);
              const y = 65 + 35 * Math.sin(rad - Math.PI / 2);
              return (
                <g>
                  <line
                    x1={60}
                    y1={65}
                    x2={x}
                    y2={y}
                    stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                  <circle cx={60} cy={65} r={3} fill="white" />
                </g>
              );
            })()}
          </svg>

          <div className={`text-2xl font-bold ${sentimentColor}`}>
            {sentimentPercent}
          </div>
          <Badge className={`mt-1 ${sentimentBg}`} variant="outline">
            {sentiment}
          </Badge>
        </div>

        {/* Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-green-400">Bullish</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${stocks.length > 0 ? (gainers / stocks.length) * 100 : 0}%` }}
                />
              </div>
              <span className="text-muted-foreground w-6 text-right">{gainers}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-yellow-400">Neutral</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${stocks.length > 0 ? (neutral / stocks.length) * 100 : 0}%` }}
                />
              </div>
              <span className="text-muted-foreground w-6 text-right">{neutral}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-red-400">Bearish</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${stocks.length > 0 ? (losers / stocks.length) * 100 : 0}%` }}
                />
              </div>
              <span className="text-muted-foreground w-6 text-right">{losers}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
