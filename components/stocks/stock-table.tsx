"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatChange, formatVolume, getChangeColor, getSignalBgColor } from "@/lib/utils";
import type { StockQuote, TradingSignal } from "@/lib/types";

interface StockWithSignal extends StockQuote {
  signal?: TradingSignal;
}

interface StockTableProps {
  stocks: StockWithSignal[];
}

type SortKey = "symbol" | "currentPrice" | "changePercent" | "volume" | "sector";
type SortDir = "asc" | "desc";

export function StockTable({ stocks }: StockTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("changePercent");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = useMemo(() => {
    return [...stocks].sort((a, b) => {
      let valA: string | number = a[sortKey] ?? 0;
      let valB: string | number = b[sortKey] ?? 0;

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [stocks, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 text-muted-foreground" />;
    return sortDir === "asc"
      ? <ArrowUp className="w-3 h-3 text-primary" />
      : <ArrowDown className="w-3 h-3 text-primary" />;
  };

  const cols: Array<{ key: SortKey; label: string; align: "left" | "right" }> = [
    { key: "symbol", label: "SYMBOL", align: "left" },
    { key: "sector", label: "SECTOR", align: "left" },
    { key: "currentPrice", label: "PRICE", align: "right" },
    { key: "changePercent", label: "CHANGE", align: "right" },
    { key: "volume", label: "VOLUME", align: "right" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background/50">
              {cols.map((col) => (
                <th
                  key={col.key}
                  className={`p-3 text-xs text-muted-foreground font-medium cursor-pointer hover:text-foreground transition-colors ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                  onClick={() => handleSort(col.key)}
                >
                  <div className={`flex items-center gap-1 ${col.align === "right" ? "justify-end" : ""}`}>
                    {col.label}
                    <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
              <th className="p-3 text-xs text-muted-foreground font-medium text-center">SIGNAL</th>
              <th className="p-3 text-xs text-muted-foreground font-medium text-right">52W RANGE</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((stock) => (
              <tr
                key={stock.symbol}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="p-3">
                  <Link href={`/stocks/${stock.symbol}`} className="group">
                    <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {stock.symbol}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-36">
                      {stock.name}
                    </div>
                  </Link>
                </td>
                <td className="p-3">
                  <span className="text-xs text-muted-foreground">{stock.sector}</span>
                </td>
                <td className="p-3 text-right">
                  <div className="font-semibold text-sm">{formatPrice(stock.currentPrice)}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    H: {formatPrice(stock.dayHigh)} L: {formatPrice(stock.dayLow)}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className={`font-semibold text-sm ${getChangeColor(stock.changePercent)}`}>
                    {formatChange(stock.changePercent, true)}
                  </div>
                  <div className={`text-xs ${getChangeColor(stock.change)}`}>
                    {formatChange(stock.change)}
                  </div>
                </td>
                <td className="p-3 text-right text-sm text-muted-foreground">
                  {formatVolume(stock.volume)}
                </td>
                <td className="p-3 text-center">
                  {stock.signal ? (
                    <Badge
                      className={`${getSignalBgColor(stock.signal.signal)} border text-xs font-bold`}
                      variant="outline"
                    >
                      {stock.signal.signal}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  {stock.weekHigh52 && stock.weekLow52 ? (
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {formatPrice(stock.weekLow52)} – {formatPrice(stock.weekHigh52)}
                      </div>
                      {/* 52W range bar */}
                      <div className="w-20 h-1 bg-border rounded-full overflow-hidden mt-1 ml-auto">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${
                              ((stock.currentPrice - stock.weekLow52) /
                                (stock.weekHigh52 - stock.weekLow52)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sorted.length === 0 && (
        <div className="py-12 text-center text-muted-foreground text-sm">
          No stocks match the current filters.
        </div>
      )}
    </div>
  );
}
