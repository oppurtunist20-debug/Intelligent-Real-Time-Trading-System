"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CandlestickChart } from "@/components/charts/candlestick-chart";
import { TechnicalIndicatorsChart } from "@/components/charts/technical-indicators-chart";
import { SignalCard } from "@/components/signals/signal-card";
import { formatPrice, formatChange, formatVolume, getChangeColor, formatCurrency } from "@/lib/utils";
import type { OHLCVData, TradingSignal, TechnicalIndicators } from "@/lib/types";

interface StockDetailData {
  symbol: string;
  name: string;
  sector: string;
  exchange: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  marketCap?: number;
  peRatio?: number;
  weekHigh52?: number;
  weekLow52?: number;
  technicalIndicators?: TechnicalIndicators;
  historicalData?: OHLCVData[];
  signal?: TradingSignal;
}

export default function StockDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const [stock, setStock] = useState<StockDetailData | null>(null);
  const [historicalData, setHistoricalData] = useState<OHLCVData[]>([]);
  const [signal, setSignal] = useState<TradingSignal | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    async function fetchStockDetail(includeHistory = false) {
      try {
        const stockRes = await fetch(`/api/stocks/${symbol}`, {
          cache: "no-store",
        });

        const stockData = await stockRes.json();
        setStock(stockData.data);

        if (includeHistory) {
          const histRes = await fetch(`/api/stocks/${symbol}/historical`, {
            cache: "no-store",
          });
          const histData = await histRes.json();
          setHistoricalData(histData.data || []);
        }
      } catch (error) {
        console.error("Stock detail fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStockDetail(true);
    const interval = setInterval(() => fetchStockDetail(false), 3000);
    return () => clearInterval(interval);
  }, [symbol]);

  const handleGenerateSignal = async () => {
    setAnalysisLoading(true);
    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol }),
      });
      const data = await res.json();
      setSignal(data.data?.signal || null);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setAnalysisLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-4 items-start">
          <Skeleton className="h-16 w-64" />
        </div>
        <Skeleton className="h-80 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Stock not found: {symbol}</p>
        <Link href="/stocks">
          <Button className="mt-4">Back to Stocks</Button>
        </Link>
      </div>
    );
  }

  const isPositive = stock.change >= 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/stocks">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Stocks
        </Button>
      </Link>

      {/* Stock Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{stock.symbol}</h1>
            <Badge variant="outline" className="border-white/20 text-gray-400">
              {stock.exchange}
            </Badge>
            <Badge variant="outline" className="border-white/20 text-gray-400">
              {stock.sector}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{stock.name}</p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-white">
            {formatPrice(stock.currentPrice)}
          </div>
          <div
            className={`flex items-center justify-end gap-1 mt-1 ${getChangeColor(
              stock.change
            )}`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-semibold">
              {formatChange(stock.change)} ({formatChange(stock.changePercent, true)})
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: "Day High", value: formatPrice(stock.dayHigh) },
          { label: "Day Low", value: formatPrice(stock.dayLow) },
          { label: "Volume", value: formatVolume(stock.volume) },
          { label: "Prev Close", value: formatPrice(stock.previousClose) },
          { label: "52W High", value: stock.weekHigh52 ? formatPrice(stock.weekHigh52) : "N/A" },
          { label: "52W Low", value: stock.weekLow52 ? formatPrice(stock.weekLow52) : "N/A" },
        ].map((metric) => (
          <Card key={metric.label} className="bg-card border-border">
            <CardContent className="p-3">
              <div className="text-xs text-muted-foreground">{metric.label}</div>
              <div className="font-semibold text-sm mt-1">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Analysis */}
      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="chart">Price Chart</TabsTrigger>
          <TabsTrigger value="indicators">Technical Indicators</TabsTrigger>
          <TabsTrigger value="signal">AI Signal</TabsTrigger>
          <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Price History - {stock.symbol}</CardTitle>
            </CardHeader>
            <CardContent>
              {historicalData.length > 0 ? (
                <CandlestickChart data={historicalData} />
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No historical data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indicators">
          <div className="space-y-4">
            {/* Current Indicator Values */}
            {stock.technicalIndicators && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground">RSI (14)</div>
                    <div
                      className={`text-2xl font-bold mt-1 ${
                        stock.technicalIndicators.rsi > 70
                          ? "text-red-400"
                          : stock.technicalIndicators.rsi < 30
                          ? "text-green-400"
                          : "text-white"
                      }`}
                    >
                      {stock.technicalIndicators.rsi.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {stock.technicalIndicators.rsi > 70
                        ? "Overbought"
                        : stock.technicalIndicators.rsi < 30
                        ? "Oversold"
                        : "Neutral"}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground">MACD</div>
                    <div
                      className={`text-2xl font-bold mt-1 ${
                        stock.technicalIndicators.macd.histogram > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {stock.technicalIndicators.macd.histogram.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {stock.technicalIndicators.macd.histogram > 0
                        ? "Bullish"
                        : "Bearish"}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground">Trend</div>
                    <div
                      className={`text-xl font-bold mt-1 ${
                        stock.technicalIndicators.trend === "UPTREND"
                          ? "text-green-400"
                          : stock.technicalIndicators.trend === "DOWNTREND"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {stock.technicalIndicators.trend}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Momentum: {stock.technicalIndicators.momentum.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground">BB %B</div>
                    <div className="text-2xl font-bold mt-1">
                      {(stock.technicalIndicators.bollingerBands.percentB * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      BW: {(stock.technicalIndicators.bollingerBands.bandwidth * 100).toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">RSI &amp; MACD</CardTitle>
              </CardHeader>
              <CardContent>
                {historicalData.length > 0 ? (
                  <TechnicalIndicatorsChart data={historicalData} />
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Moving Averages */}
            {stock.technicalIndicators && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Moving Averages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {[
                      { label: "EMA 9", value: stock.technicalIndicators.ema9, current: stock.currentPrice },
                      { label: "EMA 21", value: stock.technicalIndicators.ema21, current: stock.currentPrice },
                      { label: "SMA 20", value: stock.technicalIndicators.sma20, current: stock.currentPrice },
                      { label: "SMA 50", value: stock.technicalIndicators.sma50, current: stock.currentPrice },
                      { label: "SMA 200", value: stock.technicalIndicators.sma200 || 0, current: stock.currentPrice },
                    ].map((ma) => (
                      <div key={ma.label} className="text-center p-3 bg-background rounded-lg">
                        <div className="text-xs text-muted-foreground">{ma.label}</div>
                        <div className="font-semibold text-sm mt-1">
                          {formatPrice(ma.value)}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            ma.current > ma.value ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {ma.current > ma.value ? "Above" : "Below"}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="signal">
          <div className="space-y-4">
            {signal ? (
              <SignalCard signal={signal} showDetails />
            ) : stock.technicalIndicators ? (
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <Activity className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">
                    Generate AI Trading Signal
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Use AI to analyze {symbol} and generate a trading signal
                    based on technical indicators, sentiment, and market
                    conditions.
                  </p>
                  <Button
                    onClick={handleGenerateSignal}
                    disabled={analysisLoading}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {analysisLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Activity className="w-4 h-4 mr-2" />
                        Generate Signal
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="fundamentals">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Key Fundamentals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Market Cap", value: stock.marketCap ? formatCurrency(stock.marketCap * 1000000) : "N/A" },
                  { label: "P/E Ratio", value: stock.peRatio ? stock.peRatio.toFixed(2) : "N/A" },
                  { label: "Exchange", value: stock.exchange },
                  { label: "Sector", value: stock.sector },
                  { label: "52W High", value: stock.weekHigh52 ? formatPrice(stock.weekHigh52) : "N/A" },
                  { label: "52W Low", value: stock.weekLow52 ? formatPrice(stock.weekLow52) : "N/A" },
                ].map((item) => (
                  <div key={item.label} className="p-3 bg-background rounded-lg">
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                    <div className="font-semibold mt-1">{item.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
