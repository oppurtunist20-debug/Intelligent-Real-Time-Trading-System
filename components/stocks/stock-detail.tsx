"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatChange, getChangeColor, formatVolume, getSignalBgColor } from "@/lib/utils";
import type { StockQuote, TradingSignal, TechnicalIndicators } from "@/lib/types";

interface StockDetailProps {
  stock: StockQuote;
  signal?: TradingSignal;
  indicators?: TechnicalIndicators;
}

export function StockDetail({ stock, signal, indicators }: StockDetailProps) {
  const isPositive = stock.changePercent >= 0;

  return (
    <div className="space-y-4">
      {/* Price Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{stock.symbol}</h2>
            <Badge variant="outline" className="border-white/20 text-gray-400 text-xs">
              {stock.exchange}
            </Badge>
            {signal && (
              <Badge
                className={`${getSignalBgColor(signal.signal)} border text-xs font-bold`}
                variant="outline"
              >
                {signal.signal}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">{stock.name}</p>
          <p className="text-xs text-muted-foreground">{stock.sector}</p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold">{formatPrice(stock.currentPrice)}</div>
          <div className={`flex items-center justify-end gap-1 text-sm font-semibold mt-0.5 ${getChangeColor(stock.changePercent)}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{formatChange(stock.change)} ({formatChange(stock.changePercent, true)})</span>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: "Day High", value: formatPrice(stock.dayHigh) },
          { label: "Day Low", value: formatPrice(stock.dayLow) },
          { label: "Volume", value: formatVolume(stock.volume) },
          { label: "Prev Close", value: formatPrice(stock.previousClose) },
        ].map((item) => (
          <Card key={item.label} className="bg-background border-border">
            <CardContent className="p-3">
              <div className="text-xs text-muted-foreground">{item.label}</div>
              <div className="font-semibold text-sm mt-1">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Technical Indicators Summary */}
      {indicators && (
        <div className="grid grid-cols-3 gap-2">
          <Card className="bg-background border-border">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-muted-foreground">RSI</div>
              <div className={`text-lg font-bold mt-0.5 ${
                indicators.rsi > 70 ? "text-red-400" : indicators.rsi < 30 ? "text-green-400" : "text-white"
              }`}>
                {indicators.rsi.toFixed(1)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background border-border">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-muted-foreground">Trend</div>
              <div className={`text-sm font-bold mt-0.5 ${
                indicators.trend === "UPTREND" ? "text-green-400" :
                indicators.trend === "DOWNTREND" ? "text-red-400" : "text-yellow-400"
              }`}>
                {indicators.trend}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background border-border">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-muted-foreground">MACD</div>
              <div className={`text-sm font-bold mt-0.5 ${
                indicators.macd.histogram > 0 ? "text-green-400" : "text-red-400"
              }`}>
                {indicators.macd.histogram > 0 ? "Bullish" : "Bearish"}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Full Details Link */}
      <Link
        href={`/stocks/${stock.symbol}`}
        className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
      >
        View Full Analysis
        <ExternalLink className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
