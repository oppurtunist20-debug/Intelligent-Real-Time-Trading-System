"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSignalBgColor, formatPrice, formatTimeAgo } from "@/lib/utils";
import type { TradingSignal } from "@/lib/types";

interface TradingSignalsWidgetProps {
  signals: TradingSignal[];
}

export function TradingSignalsWidget({ signals }: TradingSignalsWidgetProps) {
  const topSignals = signals
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Active Signals</CardTitle>
          </div>
          <Link href="/signals">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {topSignals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No signals available
          </div>
        ) : (
          topSignals.map((signal) => (
            <Link key={signal.id || signal.stockSymbol} href={`/stocks/${signal.stockSymbol}`}>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <Badge
                    className={`${getSignalBgColor(signal.signal)} border text-xs font-bold w-12 justify-center`}
                    variant="outline"
                  >
                    {signal.signal}
                  </Badge>
                  <div>
                    <div className="font-semibold text-sm">{signal.stockSymbol}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Confidence: {signal.confidence}%
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {signal.targetPrice && (
                    <div className="text-xs text-green-400 font-medium">
                      T: {formatPrice(signal.targetPrice)}
                    </div>
                  )}
                  {signal.stopLoss && (
                    <div className="text-xs text-red-400">
                      SL: {formatPrice(signal.stopLoss)}
                    </div>
                  )}
                  {signal.createdAt && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {formatTimeAgo(signal.createdAt)}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
