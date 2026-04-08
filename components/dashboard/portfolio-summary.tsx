"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatChange, getChangeColor } from "@/lib/utils";
import type { Portfolio } from "@/lib/types";

export function PortfolioSummary() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch("/api/portfolio");
        const data = await res.json();
        setPortfolio(data.data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  if (loading) {
    return (
      <Card className="bg-card border-border h-full">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 mb-3" />
          <Skeleton className="h-12" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Portfolio</CardTitle>
          </div>
          <Link href="/portfolio">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              Manage <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {!portfolio || portfolio.items.length === 0 ? (
          <div className="text-center py-6">
            <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No holdings</p>
            <Link href="/portfolio">
              <Button size="sm" className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
                Add Stocks
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-background rounded-lg">
              <div className="text-xs text-muted-foreground">Total Value</div>
              <div className="text-2xl font-bold mt-1">
                {formatCurrency(portfolio.totalValue)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-background rounded-lg">
                <div className="text-xs text-muted-foreground">Total P&amp;L</div>
                <div className={`text-sm font-bold mt-0.5 ${getChangeColor(portfolio.totalPnL)}`}>
                  {formatChange(portfolio.totalPnL)}
                </div>
                <div className={`text-xs ${getChangeColor(portfolio.totalPnLPercent)}`}>
                  {formatChange(portfolio.totalPnLPercent, true)}
                </div>
              </div>
              <div className="p-2.5 bg-background rounded-lg">
                <div className="text-xs text-muted-foreground">Today</div>
                <div className={`text-sm font-bold mt-0.5 ${getChangeColor(portfolio.dayPnL)}`}>
                  {formatChange(portfolio.dayPnL)}
                </div>
                <div className={`text-xs ${getChangeColor(portfolio.dayPnLPercent)}`}>
                  {formatChange(portfolio.dayPnLPercent, true)}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2">Holdings</div>
              <div className="space-y-1.5">
                {portfolio.items.slice(0, 3).map((item) => (
                  <div
                    key={item.stockSymbol}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="font-medium">{item.stockSymbol}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{item.quantity} shares</span>
                      <span className={getChangeColor(item.pnlPercent)}>
                        {formatChange(item.pnlPercent, true)}
                      </span>
                    </div>
                  </div>
                ))}
                {portfolio.items.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center pt-1">
                    +{portfolio.items.length - 3} more
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
