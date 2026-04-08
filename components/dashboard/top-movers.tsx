"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice, formatChange, getChangeColor, formatVolume } from "@/lib/utils";
import type { StockQuote } from "@/lib/types";

interface TopMoversProps {
  gainers: StockQuote[];
  losers: StockQuote[];
}

function StockRow({ stock }: { stock: StockQuote }) {
  return (
    <Link href={`/stocks/${stock.symbol}`}>
      <div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold">
            {stock.symbol.slice(0, 2)}
          </div>
          <div>
            <div className="font-semibold text-sm">{stock.symbol}</div>
            <div className="text-xs text-muted-foreground">{stock.sector}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold">{formatPrice(stock.currentPrice)}</div>
          <div className={`text-xs font-medium ${getChangeColor(stock.changePercent)}`}>
            {formatChange(stock.changePercent, true)}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function TopMovers({ gainers, losers }: TopMoversProps) {
  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Top Movers</CardTitle>
          <Link href="/stocks">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              All Stocks <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gainers">
          <TabsList className="bg-background border border-border w-full mb-3">
            <TabsTrigger value="gainers" className="flex-1 text-xs data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              Top Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="flex-1 text-xs data-[state=active]:bg-red-600/20 data-[state=active]:text-red-400">
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
              Top Losers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gainers" className="mt-0">
            <div className="space-y-0.5">
              {gainers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No gainers today
                </div>
              ) : (
                gainers.slice(0, 5).map((stock) => (
                  <StockRow key={stock.symbol} stock={stock} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="losers" className="mt-0">
            <div className="space-y-0.5">
              {losers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No losers today
                </div>
              ) : (
                losers.slice(0, 5).map((stock) => (
                  <StockRow key={stock.symbol} stock={stock} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
