"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatChange, getChangeColor, getSignalBgColor, formatVolume } from "@/lib/utils";
import type { StockQuote, TradingSignal } from "@/lib/types";

interface StockCardProps {
  stock: StockQuote;
  signal?: TradingSignal;
}

export function StockCard({ stock, signal }: StockCardProps) {
  const isPositive = stock.changePercent >= 0;

  return (
    <Link href={`/stocks/${stock.symbol}`}>
      <Card className="bg-card border-border hover:border-blue-500/50 transition-all cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-bold text-sm">{stock.symbol}</div>
              <div className="text-xs text-muted-foreground mt-0.5 max-w-28 truncate">
                {stock.name}
              </div>
            </div>
            {signal && (
              <Badge
                className={`${getSignalBgColor(signal.signal)} border text-xs font-bold`}
                variant="outline"
              >
                {signal.signal}
              </Badge>
            )}
          </div>

          <div className="flex items-end justify-between">
            <div className="text-xl font-bold">{formatPrice(stock.currentPrice)}</div>
            <div className={`flex items-center gap-1 ${getChangeColor(stock.changePercent)}`}>
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span className="text-sm font-semibold">
                {formatChange(stock.changePercent, true)}
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{stock.sector}</span>
            <span>Vol: {formatVolume(stock.volume)}</span>
          </div>

          {/* Day range bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{formatPrice(stock.dayLow)}</span>
              <span>{formatPrice(stock.dayHigh)}</span>
            </div>
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                style={{
                  width: `${
                    stock.dayHigh !== stock.dayLow
                      ? ((stock.currentPrice - stock.dayLow) /
                          (stock.dayHigh - stock.dayLow)) *
                        100
                      : 50
                  }%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
