"use client";

import { useEffect, useState } from "react";
import { Shield, AlertTriangle, TrendingDown, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { formatPrice, formatCurrency } from "@/lib/utils";
import type { RiskMetrics } from "@/lib/types";

interface RiskData {
  metrics: RiskMetrics;
  alerts: Array<{
    type: string;
    severity: "HIGH" | "MEDIUM" | "LOW";
    message: string;
    symbol?: string;
  }>;
  topRisks: Array<{
    symbol: string;
    risk: string;
    contribution: number;
  }>;
}

interface PositionCalc {
  symbol: string;
  entryPrice: string;
  stopLoss: string;
  riskAmount: string;
}

export default function RiskPage() {
  const [data, setData] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [posCalc, setPosCalc] = useState<PositionCalc>({
    symbol: "RELIANCE",
    entryPrice: "2890",
    stopLoss: "2750",
    riskAmount: "10000",
  });
  const [calcResult, setCalcResult] = useState<{
    quantity: number;
    riskPercent: number;
    targetPrice: number;
    riskReward: number;
  } | null>(null);

  useEffect(() => {
    // Generate mock risk data
    const mockData: RiskData = {
      metrics: {
        beta: 1.12,
        sharpeRatio: 1.45,
        maxDrawdown: -18.3,
        volatility: 22.4,
        var95: -2.8,
        calmarRatio: 0.78,
        sortinoRatio: 1.89,
      },
      alerts: [
        {
          type: "CONCENTRATION",
          severity: "MEDIUM",
          message: "IT sector concentration at 35% - above recommended 30%",
        },
        {
          type: "VOLATILITY",
          severity: "LOW",
          message: "Portfolio volatility within acceptable range",
        },
        {
          type: "DRAWDOWN",
          severity: "LOW",
          message: "Current drawdown within risk tolerance",
        },
      ],
      topRisks: [
        { symbol: "RELIANCE", risk: "Oil price volatility", contribution: 18.5 },
        { symbol: "TCS", risk: "USD/INR exposure", contribution: 14.2 },
        { symbol: "HDFCBANK", risk: "NPA concerns", contribution: 12.1 },
        { symbol: "BAJFINANCE", risk: "Credit growth slowdown", contribution: 9.8 },
        { symbol: "INFY", risk: "Deal pipeline uncertainty", contribution: 8.5 },
      ],
    };
    setData(mockData);
    setLoading(false);
  }, []);

  const handleCalculate = () => {
    const entry = parseFloat(posCalc.entryPrice);
    const stop = parseFloat(posCalc.stopLoss);
    const risk = parseFloat(posCalc.riskAmount);

    if (!entry || !stop || !risk || stop >= entry) return;

    const riskPerShare = entry - stop;
    const quantity = Math.floor(risk / riskPerShare);
    const riskPercent = (riskPerShare / entry) * 100;
    const targetPrice = entry + riskPerShare * 2; // 1:2 risk reward
    const riskReward = (targetPrice - entry) / (entry - stop);

    setCalcResult({
      quantity,
      riskPercent,
      targetPrice,
      riskReward,
    });
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "HIGH": return "bg-red-500/10 border-red-500/20 text-red-400";
      case "MEDIUM": return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      case "LOW": return "bg-green-500/10 border-green-500/20 text-green-400";
      default: return "bg-gray-500/10 border-gray-500/20 text-gray-400";
    }
  };

  const getRiskRating = (beta: number) => {
    if (beta < 0.8) return { label: "Low Risk", color: "text-green-400" };
    if (beta < 1.2) return { label: "Moderate Risk", color: "text-yellow-400" };
    return { label: "High Risk", color: "text-red-400" };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  const riskRating = getRiskRating(data?.metrics.beta || 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Risk Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Portfolio risk metrics and position sizing tools
        </p>
      </div>

      {/* Risk Rating Banner */}
      <Card className={`border ${data?.metrics.beta && data.metrics.beta > 1.2 ? "border-red-500/30 bg-red-500/5" : "border-yellow-500/30 bg-yellow-500/5"}`}>
        <CardContent className="p-4 flex items-center gap-3">
          <Shield className={`w-8 h-8 ${riskRating.color}`} />
          <div>
            <div className={`font-bold text-lg ${riskRating.color}`}>{riskRating.label}</div>
            <div className="text-sm text-muted-foreground">
              Portfolio Beta: {data?.metrics.beta} • Sharpe: {data?.metrics.sharpeRatio} • Max Drawdown: {data?.metrics.maxDrawdown}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Beta",
            value: data?.metrics.beta.toFixed(2),
            desc: "Market sensitivity",
            color: data?.metrics.beta && data.metrics.beta > 1 ? "text-red-400" : "text-green-400",
          },
          {
            label: "Sharpe Ratio",
            value: data?.metrics.sharpeRatio.toFixed(2),
            desc: "Risk-adj return",
            color: data?.metrics.sharpeRatio && data.metrics.sharpeRatio > 1 ? "text-green-400" : "text-yellow-400",
          },
          {
            label: "Max Drawdown",
            value: `${data?.metrics.maxDrawdown}%`,
            desc: "Peak to trough",
            color: "text-red-400",
          },
          {
            label: "Volatility",
            value: `${data?.metrics.volatility}%`,
            desc: "Annual volatility",
            color: data?.metrics.volatility && data.metrics.volatility > 25 ? "text-red-400" : "text-yellow-400",
          },
          {
            label: "VaR (95%)",
            value: `${data?.metrics.var95}%`,
            desc: "Daily risk at 95%",
            color: "text-red-400",
          },
          {
            label: "Sortino Ratio",
            value: data?.metrics.sortinoRatio.toFixed(2),
            desc: "Downside adj return",
            color: data?.metrics.sortinoRatio && data.metrics.sortinoRatio > 1.5 ? "text-green-400" : "text-yellow-400",
          },
          {
            label: "Calmar Ratio",
            value: data?.metrics.calmarRatio.toFixed(2),
            desc: "Return/Max drawdown",
            color: data?.metrics.calmarRatio && data.metrics.calmarRatio > 1 ? "text-green-400" : "text-yellow-400",
          },
        ].map((metric) => (
          <Card key={metric.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{metric.label}</div>
              <div className={`text-2xl font-bold mt-1 ${metric.color}`}>{metric.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{metric.desc}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Alerts */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <CardTitle className="text-base">Risk Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.alerts.map((alert, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${getAlertColor(alert.severity)}`}
                >
                  <Badge variant="outline" className={`text-xs shrink-0 ${getAlertColor(alert.severity)}`}>
                    {alert.severity}
                  </Badge>
                  <div>
                    <div className="text-xs font-semibold">{alert.type}</div>
                    <div className="text-xs mt-0.5 opacity-80">{alert.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Risk Contributors */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <CardTitle className="text-base">Risk Contributors</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.topRisks.map((risk) => (
                <div key={risk.symbol} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">{risk.symbol}</span>
                    <span className="text-muted-foreground">{risk.contribution}%</span>
                  </div>
                  <Progress value={risk.contribution} className="h-1.5" />
                  <div className="text-xs text-muted-foreground">{risk.risk}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Position Sizing Calculator */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Position Sizing Calculator</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Stock Symbol</Label>
                <Input
                  value={posCalc.symbol}
                  onChange={(e) => setPosCalc({ ...posCalc, symbol: e.target.value.toUpperCase() })}
                  className="mt-1 bg-background border-border"
                  placeholder="e.g., RELIANCE"
                />
              </div>
              <div>
                <Label className="text-sm">Entry Price (₹)</Label>
                <Input
                  type="number"
                  value={posCalc.entryPrice}
                  onChange={(e) => setPosCalc({ ...posCalc, entryPrice: e.target.value })}
                  className="mt-1 bg-background border-border"
                />
              </div>
              <div>
                <Label className="text-sm">Stop Loss Price (₹)</Label>
                <Input
                  type="number"
                  value={posCalc.stopLoss}
                  onChange={(e) => setPosCalc({ ...posCalc, stopLoss: e.target.value })}
                  className="mt-1 bg-background border-border"
                />
              </div>
              <div>
                <Label className="text-sm">Risk Amount (₹)</Label>
                <Input
                  type="number"
                  value={posCalc.riskAmount}
                  onChange={(e) => setPosCalc({ ...posCalc, riskAmount: e.target.value })}
                  className="mt-1 bg-background border-border"
                  placeholder="Max amount you want to risk"
                />
              </div>
              <Button
                onClick={handleCalculate}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Position
              </Button>
            </div>

            {calcResult && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  Results
                </h3>
                {[
                  { label: "Recommended Quantity", value: `${calcResult.quantity} shares`, color: "text-primary" },
                  { label: "Total Investment", value: formatPrice(calcResult.quantity * parseFloat(posCalc.entryPrice)), color: "text-white" },
                  { label: "Risk per Share", value: formatPrice(parseFloat(posCalc.entryPrice) - parseFloat(posCalc.stopLoss)), color: "text-red-400" },
                  { label: "Risk %", value: `${calcResult.riskPercent.toFixed(2)}%`, color: "text-yellow-400" },
                  { label: "Target Price (1:2)", value: formatPrice(calcResult.targetPrice), color: "text-green-400" },
                  { label: "Risk:Reward", value: `1:${calcResult.riskReward.toFixed(1)}`, color: "text-green-400" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center p-3 bg-background rounded-lg">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className={`font-semibold text-sm ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
