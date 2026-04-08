import { NextResponse } from "next/server";
import { getMockStockData, INDIAN_STOCKS } from "@/lib/indian-stocks";
import type { Portfolio, PortfolioItem } from "@/lib/types";

// In-memory portfolio storage (in production, use Prisma/DB)
let portfolioItems: Array<{
  stockSymbol: string;
  quantity: number;
  avgBuyPrice: number;
}> = [
  { stockSymbol: "RELIANCE", quantity: 10, avgBuyPrice: 2750 },
  { stockSymbol: "TCS", quantity: 5, avgBuyPrice: 4000 },
  { stockSymbol: "HDFCBANK", quantity: 20, avgBuyPrice: 1600 },
  { stockSymbol: "INFY", quantity: 15, avgBuyPrice: 1800 },
  { stockSymbol: "ICICIBANK", quantity: 25, avgBuyPrice: 1150 },
];

export async function GET() {
  try {
    const items: PortfolioItem[] = portfolioItems.map((item) => {
      let stockData;
      try {
        stockData = getMockStockData(item.stockSymbol);
      } catch {
        const stockInfo = INDIAN_STOCKS.find((s) => s.symbol === item.stockSymbol);
        stockData = {
          currentPrice: item.avgBuyPrice,
          previousClose: item.avgBuyPrice,
          name: stockInfo?.name || item.stockSymbol,
          sector: stockInfo?.sector || "Unknown",
          changePercent: 0,
          change: 0,
        };
      }

      const currentValue = stockData.currentPrice * item.quantity;
      const investedValue = item.avgBuyPrice * item.quantity;
      const pnl = currentValue - investedValue;
      const pnlPercent = (pnl / investedValue) * 100;
      const dayChange = (stockData.change || 0) * item.quantity;
      const dayChangePercent = stockData.changePercent || 0;

      return {
        stockSymbol: item.stockSymbol,
        stockName: stockData.name || item.stockSymbol,
        sector: stockData.sector || "Unknown",
        quantity: item.quantity,
        avgBuyPrice: item.avgBuyPrice,
        currentPrice: stockData.currentPrice,
        currentValue,
        investedValue,
        pnl,
        pnlPercent,
        dayChange,
        dayChangePercent,
        weight: 0, // Will be calculated below
      };
    });

    const totalValue = items.reduce((sum, item) => sum + item.currentValue, 0);
    const totalCost = items.reduce((sum, item) => sum + item.investedValue, 0);
    const totalPnL = totalValue - totalCost;
    const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;
    const dayPnL = items.reduce((sum, item) => sum + item.dayChange, 0);
    const dayPnLPercent = totalValue > 0 ? (dayPnL / totalValue) * 100 : 0;

    // Calculate weights
    items.forEach((item) => {
      item.weight = totalValue > 0 ? (item.currentValue / totalValue) * 100 : 0;
    });

    const portfolio: Portfolio = {
      id: "portfolio-1",
      name: "My Portfolio",
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercent,
      dayPnL,
      dayPnLPercent,
      items,
    };

    return NextResponse.json({ data: portfolio });
  } catch (error) {
    console.error("Portfolio GET error:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stockSymbol, quantity, avgBuyPrice } = body;

    if (!stockSymbol || !quantity || !avgBuyPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingIndex = portfolioItems.findIndex(
      (item) => item.stockSymbol === stockSymbol.toUpperCase()
    );

    if (existingIndex >= 0) {
      // Update existing position (average down/up)
      const existing = portfolioItems[existingIndex];
      const totalQty = existing.quantity + quantity;
      const newAvg =
        (existing.quantity * existing.avgBuyPrice + quantity * avgBuyPrice) / totalQty;
      portfolioItems[existingIndex] = {
        stockSymbol: stockSymbol.toUpperCase(),
        quantity: totalQty,
        avgBuyPrice: Math.round(newAvg * 100) / 100,
      };
    } else {
      portfolioItems.push({
        stockSymbol: stockSymbol.toUpperCase(),
        quantity,
        avgBuyPrice,
      });
    }

    return NextResponse.json({ message: "Added to portfolio" });
  } catch (error) {
    console.error("Portfolio POST error:", error);
    return NextResponse.json({ error: "Failed to add to portfolio" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json({ error: "Symbol required" }, { status: 400 });
    }

    portfolioItems = portfolioItems.filter(
      (item) => item.stockSymbol !== symbol.toUpperCase()
    );

    return NextResponse.json({ message: "Removed from portfolio" });
  } catch (error) {
    console.error("Portfolio DELETE error:", error);
    return NextResponse.json({ error: "Failed to remove from portfolio" }, { status: 500 });
  }
}
