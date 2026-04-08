"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus, RefreshCw, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { MacroIndicator, MacroAnalysis } from "@/lib/types";

interface MacroData {
  indicators: MacroIndicator[];
  analysis: MacroAnalysis | null;
}

export default function MacroPage() {
  const [data, setData] = useState<MacroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  async function fetchMacro() {
    try {
      const res = await fetch("/api/macro");
      const json = await res.json();
      setData(json.data);
    } catch (error) {
      console.error("Macro fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMacro();
  }, []);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/macro", { method: "POST" });
      const json = await res.json();
      setData((prev) => prev ? { ...prev, analysis: json.data } : null);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "HIGH": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "MEDIUM": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "LOW": return "bg-green-500/10 text-green-400 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "MONETARY": return "text-primary";
      case "FISCAL": return "text-secondary";
      case "TRADE": return "text-accent";
      case "MARKET": return "text-green-400";
      default: return "text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const categories = ["MONETARY", "FISCAL", "TRADE", "MARKET"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Macro Indicators</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Key macroeconomic indicators affecting Indian markets
          </p>
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {analyzing ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Brain className="w-4 h-4 mr-2" />
          )}
          AI Analysis
        </Button>
      </div>

      {/* AI Analysis Card */}
      {data?.analysis && (
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <CardTitle className="text-base text-white">AI Macro Analysis</CardTitle>
              <Badge className={
                data.analysis.overallImpact === "POSITIVE"
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : data.analysis.overallImpact === "NEGATIVE"
                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                  : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
              }>
                {data.analysis.overallImpact}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              {data.analysis.marketOutlook}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {data.analysis.sectors?.map((sector) => (
                <div
                  key={sector.sector}
                  className="text-center p-2 bg-muted/50 rounded-lg"
                >
                  <div className="text-xs font-semibold">{sector.sector}</div>
                  <div className={`text-xs mt-1 ${
                    sector.impact === "Positive" ? "text-green-400" :
                    sector.impact === "Negative" ? "text-red-400" : "text-yellow-400"
                  }`}>
                    {sector.impact}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Indicators by Category */}
      {categories.map((category) => {
        const categoryIndicators = data?.indicators?.filter(
          (ind) => ind.category === category
        ) || [];
        if (categoryIndicators.length === 0) return null;

        return (
          <div key={category}>
            <h2 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${getCategoryColor(category)}`}>
              {category} Policy
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryIndicators.map((indicator) => {
                const change = indicator.value - indicator.previousValue;
                const changePercent = indicator.previousValue
                  ? (change / indicator.previousValue) * 100
                  : 0;
                const isPositive = change > 0;
                const isNeutral = change === 0;

                return (
                  <Card key={indicator.id || indicator.name} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground">{indicator.name}</div>
                          <div className="text-2xl font-bold mt-1">
                            {indicator.value}
                            {indicator.unit && (
                              <span className="text-sm font-normal text-muted-foreground ml-1">
                                {indicator.unit}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {isNeutral ? (
                              <Minus className="w-3 h-3 text-gray-400" />
                            ) : isPositive ? (
                              <TrendingUp className="w-3 h-3 text-green-400" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-red-400" />
                            )}
                            <span className={`text-xs ${
                              isNeutral ? "text-gray-400" :
                              isPositive ? "text-green-400" : "text-red-400"
                            }`}>
                              {isPositive ? "+" : ""}{change.toFixed(2)}
                              {indicator.unit} ({changePercent > 0 ? "+" : ""}{changePercent.toFixed(1)}%)
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 leading-snug">
                            {indicator.description}
                          </p>
                        </div>
                        <Badge
                          className={`text-xs ml-2 shrink-0 ${getImpactColor(indicator.impact)}`}
                          variant="outline"
                        >
                          {indicator.impact}
                        </Badge>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/50 flex justify-between text-xs text-muted-foreground">
                        <span>Prev: {indicator.previousValue}{indicator.unit}</span>
                        <span>{formatDate(indicator.date)}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
