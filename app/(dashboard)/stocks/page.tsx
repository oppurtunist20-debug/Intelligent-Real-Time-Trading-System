"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Filter, RefreshCw } from "lucide-react";
import { StockTable } from "@/components/stocks/stock-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getSectors } from "@/lib/indian-stocks";
import type { StockQuote, TradingSignal } from "@/lib/types";

interface StockWithSignal extends StockQuote {
  signal?: TradingSignal;
}

export default function StocksPage() {
  const [stocks, setStocks] = useState<StockWithSignal[]>([]);
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("ALL");
  const [signalFilter, setSignalFilter] = useState("ALL");

  const sectors = ["ALL", ...getSectors()];
  const signalTypes = ["ALL", "BUY", "SELL", "HOLD"];

  async function fetchData() {
    try {
      const [stocksRes, signalsRes] = await Promise.all([
        fetch("/api/stocks"),
        fetch("/api/signals"),
      ]);
      const stocksData = await stocksRes.json();
      const signalsData = await signalsRes.json();

      const signalMap = new Map<string, TradingSignal>();
      (signalsData.data || []).forEach((s: TradingSignal) => {
        signalMap.set(s.stockSymbol, s);
      });

      const stocksWithSignals: StockWithSignal[] = (stocksData.data || []).map(
        (stock: StockQuote) => ({
          ...stock,
          signal: signalMap.get(stock.symbol),
        })
      );

      setStocks(stocksWithSignals);
      setSignals(signalsData.data || []);
    } catch (error) {
      console.error("Stocks fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      const matchesSearch =
        search === "" ||
        stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
        stock.name.toLowerCase().includes(search.toLowerCase());

      const matchesSector =
        sectorFilter === "ALL" || stock.sector === sectorFilter;

      const matchesSignal =
        signalFilter === "ALL" || stock.signal?.signal === signalFilter;

      return matchesSearch && matchesSector && matchesSignal;
    });
  }, [stocks, search, sectorFilter, signalFilter]);

  const signalCounts = useMemo(() => {
    const counts = { BUY: 0, SELL: 0, HOLD: 0 };
    signals.forEach((s) => {
      if (s.signal === "BUY") counts.BUY++;
      else if (s.signal === "SELL") counts.SELL++;
      else counts.HOLD++;
    });
    return counts;
  }, [signals]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Stock Screener</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {filteredStocks.length} stocks • NSE/BSE
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="border-white/10"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Signal Summary */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
          <span className="text-green-400 font-semibold text-sm">BUY</span>
          <Badge className="bg-green-500 text-white text-xs">
            {signalCounts.BUY}
          </Badge>
        </div>
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          <span className="text-red-400 font-semibold text-sm">SELL</span>
          <Badge className="bg-red-500 text-white text-xs">
            {signalCounts.SELL}
          </Badge>
        </div>
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2">
          <span className="text-yellow-400 font-semibold text-sm">HOLD</span>
          <Badge className="bg-yellow-600 text-white text-xs">
            {signalCounts.HOLD}
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search stocks by symbol or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s === "ALL" ? "All Sectors" : s}
                </option>
              ))}
            </select>
          </div>

          <select
            value={signalFilter}
            onChange={(e) => setSignalFilter(e.target.value)}
            className="bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {signalTypes.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All Signals" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stock Table */}
      <StockTable stocks={filteredStocks} />
    </div>
  );
}
