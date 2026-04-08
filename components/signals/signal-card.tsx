"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, Clock, Target, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatPrice, formatTimeAgo, getSignalBgColor } from "@/lib/utils";
import type { TradingSignal } from "@/lib/types";

interface SignalCardProps {
  signal: TradingSignal;
  showDetails?: boolean;
}

export function SignalCard({ signal, showDetails = false }: SignalCardProps) {
  const SignalIcon = signal.signal === "BUY"
    ? TrendingUp
    : signal.signal === "SELL"
    ? TrendingDown
    : Minus;

  const iconColor =
    signal.signal === "BUY"
      ? "text-green-400"
      : signal.signal === "SELL"
      ? "text-red-400"
      : "text-yellow-400";

  const confidenceColor =
    signal.confidence >= 75
      ? "text-green-400"
      : signal.confidence >= 50
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <Card className="bg-card border-border hover:border-blue-500/30 transition-all">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center`}>
              <SignalIcon className={`w-4 h-4 ${iconColor}`} />
            </div>
            <div>
              <Link href={`/stocks/${signal.stockSymbol}`}>
                <div className="font-bold text-sm hover:text-primary transition-colors">
                  {signal.stockSymbol}
                </div>
              </Link>
              {signal.timeframe && (
                <div className="text-xs text-muted-foreground">{signal.timeframe}</div>
              )}
            </div>
          </div>
          <Badge
            className={`${getSignalBgColor(signal.signal)} border text-xs font-bold`}
            variant="outline"
          >
            {signal.signal}
          </Badge>
        </div>

        {/* Confidence */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Confidence</span>
            <span className={`font-semibold ${confidenceColor}`}>
              {signal.confidence}%
            </span>
          </div>
          <Progress
            value={signal.confidence}
            className="h-1.5"
          />
        </div>

        {/* Target & Stop Loss */}
        {(signal.targetPrice || signal.stopLoss) && (
          <div className="flex gap-3 mb-3">
            {signal.targetPrice && (
              <div className="flex items-center gap-1 text-xs">
                <Target className="w-3 h-3 text-green-400" />
                <span className="text-muted-foreground">Target:</span>
                <span className="text-green-400 font-medium">
                  {formatPrice(signal.targetPrice)}
                </span>
              </div>
            )}
            {signal.stopLoss && (
              <div className="flex items-center gap-1 text-xs">
                <Shield className="w-3 h-3 text-red-400" />
                <span className="text-muted-foreground">SL:</span>
                <span className="text-red-400 font-medium">
                  {formatPrice(signal.stopLoss)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Score breakdown */}
        {showDetails && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center p-2 bg-background rounded-lg">
              <div className="text-xs text-muted-foreground">Technical</div>
              <div className="text-sm font-semibold mt-0.5">
                {signal.technicalScore?.toFixed(0)}%
              </div>
            </div>
            <div className="text-center p-2 bg-background rounded-lg">
              <div className="text-xs text-muted-foreground">Sentiment</div>
              <div className="text-sm font-semibold mt-0.5">
                {signal.sentimentScore?.toFixed(0)}%
              </div>
            </div>
            <div className="text-center p-2 bg-background rounded-lg">
              <div className="text-xs text-muted-foreground">Macro</div>
              <div className="text-sm font-semibold mt-0.5">
                {signal.macroScore?.toFixed(0)}%
              </div>
            </div>
          </div>
        )}

        {/* Reasoning */}
        {signal.reasoning && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {signal.reasoning}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          {signal.createdAt && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(signal.createdAt)}
            </div>
          )}
          {signal.generatedBy && (
            <Badge variant="outline" className="text-xs border-white/10 text-muted-foreground">
              {signal.generatedBy}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
