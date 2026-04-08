"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatChange, getChangeColor } from "@/lib/utils";
import type { StockQuote } from "@/lib/types";

interface MarketOverviewProps {
  stocks: StockQuote[];
}

function IndexCard({
  name,
  symbol,
  value,
  change,
  changePercent,
}: {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
}) {
  const isPositive = change >= 0;
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-muted-foreground">{name}</div>
            <div className="text-xl font-bold mt-1">{value.toLocaleString("en-IN")}</div>
          </div>
          <div className={`flex items-center gap-1 text-sm font-semibold ${getChangeColor(change)}`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </div>
        </div>
        <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${getChangeColor(change)}`}>
          <span>{formatChange(change)}</span>
          <span>({formatChange(changePercent, true)})</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function MarketOverviewWidget({ stocks }: MarketOverviewProps) {
  // Calculate mock index values
  const avgChange = stocks.length > 0
    ? stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length
    : 0;

  const nifty50 = {
    name: "NIFTY 50",
    symbol: "NIFTY",
    value: Math.round(24200 * (1 + avgChange / 100) * 100) / 100,
    change: Math.round(24200 * avgChange / 100 * 100) / 100,
    changePercent: Math.round(avgChange * 100) / 100,
  };

  const sensex = {
    name: "BSE SENSEX",
    symbol: "SENSEX",
    value: Math.round(80300 * (1 + avgChange / 100) * 100) / 100,
    change: Math.round(80300 * avgChange / 100 * 100) / 100,
    changePercent: Math.round(avgChange * 100) / 100,
  };

  const niftyBank = {
    name: "NIFTY BANK",
    symbol: "BANKNIFTY",
    value: Math.round(52100 * (1 + (avgChange * 1.15) / 100) * 100) / 100,
    change: Math.round(52100 * (avgChange * 1.15) / 100 * 100) / 100,
    changePercent: Math.round(avgChange * 1.15 * 100) / 100,
  };

  const gainers = stocks.filter((s) => s.changePercent > 0).length;
  const losers = stocks.filter((s) => s.changePercent < 0).length;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <IndexCard {...nifty50} />
        <IndexCard {...sensex} />
        <IndexCard {...niftyBank} />
      </div>

      {/* Market Breadth */}
      <div className="bg-card border border-border rounded-lg p-3 flex items-center gap-4 text-sm">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
          Market Breadth
        </span>
        <div className="flex items-center gap-1">
          <span className="text-green-400 font-semibold">{gainers}</span>
          <span className="text-muted-foreground text-xs">Advances</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-red-400 font-semibold">{losers}</span>
          <span className="text-muted-foreground text-xs">Declines</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-400 font-semibold">
            {stocks.length - gainers - losers}
          </span>
          <span className="text-muted-foreground text-xs">Unchanged</span>
        </div>

        {/* Visual bar */}
        <div className="flex-1 h-2 rounded-full bg-border overflow-hidden max-w-48">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
            style={{
              width: `${stocks.length > 0 ? (gainers / stocks.length) * 100 : 50}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
