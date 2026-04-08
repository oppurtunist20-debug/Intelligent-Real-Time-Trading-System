"use client";

import { useEffect, useState, useMemo } from "react";
import { RefreshCw, Zap } from "lucide-react";
import { SignalCard } from "@/components/signals/signal-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { TradingSignal } from "@/lib/types";

export default function SignalsPage() {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [signalFilter, setSignalFilter] = useState("ALL");
  const [confidenceFilter, setConfidenceFilter] = useState("ALL");
  const [generating, setGenerating] = useState(false);

  async function fetchSignals() {
    try {
      const res = await fetch("/api/signals");
      const data = await res.json();
      setSignals(data.data || []);
    } catch (error) {
      console.error("Signals fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchSignals();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSignals();
  };

  const handleGenerateAll = async () => {
    setGenerating(true);
    try {
      await fetch("/api/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generateAll: true }),
      });
      await fetchSignals();
    } catch (error) {
      console.error("Generate signals error:", error);
    } finally {
      setGenerating(false);
    }
  };

  const filteredSignals = useMemo(() => {
    return signals.filter((signal) => {
      const matchesSignal = signalFilter === "ALL" || signal.signal === signalFilter;
      const matchesConfidence =
        confidenceFilter === "ALL" ||
        (confidenceFilter === "HIGH" && signal.confidence >= 75) ||
        (confidenceFilter === "MEDIUM" && signal.confidence >= 50 && signal.confidence < 75) ||
        (confidenceFilter === "LOW" && signal.confidence < 50);
      return matchesSignal && matchesConfidence;
    });
  }, [signals, signalFilter, confidenceFilter]);

  const counts = useMemo(() => ({
    BUY: signals.filter((s) => s.signal === "BUY").length,
    SELL: signals.filter((s) => s.signal === "SELL").length,
    HOLD: signals.filter((s) => s.signal === "HOLD").length,
    highConfidence: signals.filter((s) => s.confidence >= 75).length,
  }), [signals]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Trading Signals</h1>
          <p className="text-muted-foreground text-sm mt-1">
            AI-generated signals for NSE/BSE stocks
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleGenerateAll}
            disabled={generating}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {generating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            Generate New
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
          <span className="text-green-400 font-semibold text-sm">BUY</span>
          <Badge className="bg-green-500 text-white text-xs">{counts.BUY}</Badge>
        </div>
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          <span className="text-red-400 font-semibold text-sm">SELL</span>
          <Badge className="bg-red-500 text-white text-xs">{counts.SELL}</Badge>
        </div>
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2">
          <span className="text-yellow-400 font-semibold text-sm">HOLD</span>
          <Badge className="bg-yellow-600 text-white text-xs">{counts.HOLD}</Badge>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2">
          <span className="text-primary font-semibold text-sm">High Confidence</span>
          <Badge className="bg-primary text-primary-foreground text-xs">{counts.highConfidence}</Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex gap-1">
          {["ALL", "BUY", "SELL", "HOLD"].map((f) => (
            <button
              key={f}
              onClick={() => setSignalFilter(f)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                signalFilter === f
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-white/10 text-muted-foreground hover:border-white/20"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {[
            { key: "ALL", label: "All Confidence" },
            { key: "HIGH", label: "High (75%+)" },
            { key: "MEDIUM", label: "Medium (50-75%)" },
            { key: "LOW", label: "Low (<50%)" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setConfidenceFilter(f.key)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                confidenceFilter === f.key
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-white/10 text-muted-foreground hover:border-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Signal Cards Grid */}
      {filteredSignals.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No signals match the current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSignals.map((signal) => (
            <SignalCard
              key={signal.id || signal.stockSymbol}
              signal={signal}
              showDetails
            />
          ))}
        </div>
      )}
    </div>
  );
}
