"use client";

import { useEffect, useState } from "react";
import { MarketOverviewWidget } from "@/components/dashboard/market-overview";
import { TradingSignalsWidget } from "@/components/dashboard/trading-signals-widget";
import { SentimentWidget } from "@/components/dashboard/sentiment-widget";
import { TopMovers } from "@/components/dashboard/top-movers";
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary";
import { Skeleton } from "@/components/ui/skeleton";
import type { StockQuote, TradingSignal } from "@/lib/types";

interface DashboardData {
  stocks: StockQuote[];
  signals: TradingSignal[];
  marketSentiment: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [stocksRes, signalsRes] = await Promise.all([
          fetch("/api/stocks"),
          fetch("/api/signals"),
        ]);

        const stocksData = await stocksRes.json();
        const signalsData = await signalsRes.json();

        setData({
          stocks: stocksData.data || [],
          signals: signalsData.data || [],
          marketSentiment: 0.35,
        });
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-72 lg:col-span-2 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  const gainers = (data?.stocks || [])
    .filter((s) => s.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);

  const losers = (data?.stocks || [])
    .filter((s) => s.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Market Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time overview of Indian markets • NSE &amp; BSE
        </p>
      </div>

      {/* Market Overview */}
      <MarketOverviewWidget stocks={data?.stocks || []} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Signals */}
        <div className="lg:col-span-2">
          <TradingSignalsWidget signals={data?.signals || []} />
        </div>

        {/* Sentiment Widget */}
        <div>
          <SentimentWidget
            score={data?.marketSentiment || 0}
            stocks={data?.stocks || []}
          />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Movers */}
        <div className="lg:col-span-2">
          <TopMovers gainers={gainers} losers={losers} />
        </div>

        {/* Portfolio Summary */}
        <div>
          <PortfolioSummary />
        </div>
      </div>
    </div>
  );
}
