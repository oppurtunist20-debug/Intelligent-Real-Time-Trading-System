import { NextResponse } from "next/server";
import { getMockStockData } from "@/lib/indian-stocks";

// In-memory watchlist storage
let watchlistItems: string[] = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK"];

export async function GET() {
  try {
    const watchlistData = watchlistItems.map((symbol) => {
      try {
        const stockData = getMockStockData(symbol);
        return {
          stockSymbol: symbol,
          stockData,
          addedAt: new Date().toISOString(),
        };
      } catch {
        return { stockSymbol: symbol, addedAt: new Date().toISOString() };
      }
    });

    return NextResponse.json({ data: watchlistData });
  } catch (error) {
    console.error("Watchlist GET error:", error);
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symbol } = body;

    if (!symbol) {
      return NextResponse.json({ error: "Symbol required" }, { status: 400 });
    }

    const upperSymbol = symbol.toUpperCase();

    if (watchlistItems.includes(upperSymbol)) {
      return NextResponse.json({ message: "Already in watchlist" });
    }

    try {
      getMockStockData(upperSymbol);
    } catch {
      return NextResponse.json({ error: "Invalid stock symbol" }, { status: 400 });
    }

    watchlistItems.push(upperSymbol);
    return NextResponse.json({ message: "Added to watchlist" });
  } catch (error) {
    console.error("Watchlist POST error:", error);
    return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json({ error: "Symbol required" }, { status: 400 });
    }

    watchlistItems = watchlistItems.filter((s) => s !== symbol.toUpperCase());
    return NextResponse.json({ message: "Removed from watchlist" });
  } catch (error) {
    console.error("Watchlist DELETE error:", error);
    return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 });
  }
}
