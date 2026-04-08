import { NextResponse } from "next/server";
import { getMockStockData } from "@/lib/indian-stocks";
import { generateHistoricalData } from "@/lib/indian-stocks";
import { calculateAllIndicators } from "@/lib/technical-analysis";

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol.toUpperCase();
    const stock = getMockStockData(symbol);
    const historicalData = generateHistoricalData(symbol, 100);
    let technicalIndicators = null;

    try {
      technicalIndicators = calculateAllIndicators(historicalData);
    } catch {
      // Not enough data for all indicators
    }

    return NextResponse.json({
      data: {
        ...stock,
        technicalIndicators,
      },
    });
  } catch (error) {
    console.error("Stock detail API error:", error);
    return NextResponse.json({ error: "Stock not found" }, { status: 404 });
  }
}
