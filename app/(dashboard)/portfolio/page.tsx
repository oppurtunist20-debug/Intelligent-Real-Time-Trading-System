"use client";

import { useEffect, useState } from "react";
import { Plus, TrendingUp, TrendingDown, RefreshCw, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice, formatChange, getChangeColor, formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { Portfolio, PortfolioItem } from "@/lib/types";

const SECTOR_COLORS = [
  "#3b82f6", "#8b5cf6", "#22c55e", "#ef4444", "#f59e0b",
  "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#a855f7",
];

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    symbol: "",
    quantity: "",
    avgBuyPrice: "",
  });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  async function fetchPortfolio() {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      setPortfolio(data.data);
    } catch (error) {
      console.error("Portfolio fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleAddStock = async () => {
    if (!addForm.symbol || !addForm.quantity || !addForm.avgBuyPrice) return;
    setAdding(true);
    setAddError("");
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockSymbol: addForm.symbol.toUpperCase(),
          quantity: parseFloat(addForm.quantity),
          avgBuyPrice: parseFloat(addForm.avgBuyPrice),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error || "Failed to add stock");
        return;
      }
      setAddDialogOpen(false);
      setAddForm({ symbol: "", quantity: "", avgBuyPrice: "" });
      await fetchPortfolio();
    } catch (error) {
      console.error("Add stock error:", error);
      setAddError("Network error. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveStock = async (symbol: string) => {
    try {
      await fetch(`/api/portfolio?symbol=${symbol}`, { method: "DELETE" });
      await fetchPortfolio();
    } catch (error) {
      console.error("Remove stock error:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  // Sector allocation data
  const sectorData = portfolio?.items?.reduce((acc: Record<string, number>, item) => {
    acc[item.sector] = (acc[item.sector] || 0) + item.currentValue;
    return acc;
  }, {});

  const pieData = Object.entries(sectorData || {}).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your investments and performance
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={(open) => { setAddDialogOpen(open); if (!open) setAddError(""); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Add Stock to Portfolio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label className="text-sm">Stock Symbol</Label>
                <Input
                  placeholder="e.g., RELIANCE"
                  value={addForm.symbol}
                  onChange={(e) => setAddForm({ ...addForm, symbol: e.target.value.toUpperCase() })}
                  className="mt-1 bg-background border-border"
                />
              </div>
              <div>
                <Label className="text-sm">Quantity</Label>
                <Input
                  type="number"
                  placeholder="Number of shares"
                  value={addForm.quantity}
                  onChange={(e) => setAddForm({ ...addForm, quantity: e.target.value })}
                  className="mt-1 bg-background border-border"
                />
              </div>
              <div>
                <Label className="text-sm">Average Buy Price (₹)</Label>
                <Input
                  type="number"
                  placeholder="Price per share"
                  value={addForm.avgBuyPrice}
                  onChange={(e) => setAddForm({ ...addForm, avgBuyPrice: e.target.value })}
                  className="mt-1 bg-background border-border"
                />
              </div>
              {addError && (
                <p className="text-destructive text-xs">{addError}</p>
              )}
              <Button
                onClick={handleAddStock}
                disabled={adding}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {adding ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Add to Portfolio
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Total Value</div>
            <div className="text-xl font-bold mt-1">
              {formatCurrency(portfolio?.totalValue || 0)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Total P&amp;L</div>
            <div className={`text-xl font-bold mt-1 ${getChangeColor(portfolio?.totalPnL || 0)}`}>
              {formatChange(portfolio?.totalPnL || 0)}
            </div>
            <div className={`text-xs mt-0.5 ${getChangeColor(portfolio?.totalPnLPercent || 0)}`}>
              {formatChange(portfolio?.totalPnLPercent || 0, true)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Today&apos;s P&amp;L</div>
            <div className={`text-xl font-bold mt-1 ${getChangeColor(portfolio?.dayPnL || 0)}`}>
              {formatChange(portfolio?.dayPnL || 0)}
            </div>
            <div className={`text-xs mt-0.5 ${getChangeColor(portfolio?.dayPnLPercent || 0)}`}>
              {formatChange(portfolio?.dayPnLPercent || 0, true)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Invested</div>
            <div className="text-xl font-bold mt-1">
              {formatCurrency(portfolio?.totalCost || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table + Sector Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Holdings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!portfolio?.items?.length ? (
                <div className="p-6 text-center text-muted-foreground">
                  No stocks in portfolio. Add your first stock to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 text-xs text-muted-foreground font-medium">STOCK</th>
                        <th className="text-right p-3 text-xs text-muted-foreground font-medium">QTY</th>
                        <th className="text-right p-3 text-xs text-muted-foreground font-medium">AVG BUY</th>
                        <th className="text-right p-3 text-xs text-muted-foreground font-medium">CMP</th>
                        <th className="text-right p-3 text-xs text-muted-foreground font-medium">P&amp;L</th>
                        <th className="text-right p-3 text-xs text-muted-foreground font-medium">VALUE</th>
                        <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.items.map((item: PortfolioItem) => (
                        <tr key={item.stockSymbol} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="p-3">
                            <div className="font-semibold text-sm">{item.stockSymbol}</div>
                            <div className="text-xs text-muted-foreground">{item.sector}</div>
                          </td>
                          <td className="p-3 text-right text-sm">{item.quantity}</td>
                          <td className="p-3 text-right text-sm">{formatPrice(item.avgBuyPrice)}</td>
                          <td className="p-3 text-right text-sm">
                            <div>{formatPrice(item.currentPrice)}</div>
                            <div className={`text-xs ${getChangeColor(item.dayChangePercent)}`}>
                              {formatChange(item.dayChangePercent, true)}
                            </div>
                          </td>
                          <td className="p-3 text-right text-sm">
                            <div className={getChangeColor(item.pnl)}>
                              {formatChange(item.pnl)}
                            </div>
                            <div className={`text-xs ${getChangeColor(item.pnlPercent)}`}>
                              {formatChange(item.pnlPercent, true)}
                            </div>
                          </td>
                          <td className="p-3 text-right text-sm font-semibold">
                            {formatCurrency(item.currentValue)}
                          </td>
                          <td className="p-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveStock(item.stockSymbol)}
                              className="text-muted-foreground hover:text-red-400 p-1 h-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sector Allocation */}
        <div>
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="text-base">Sector Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={SECTOR_COLORS[index % SECTOR_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [formatCurrency(value), "Value"]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {pieData.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: SECTOR_COLORS[index % SECTOR_COLORS.length] }}
                          />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-medium">
                          {portfolio?.totalValue ? ((item.value / portfolio.totalValue) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
                  Add stocks to see allocation
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
