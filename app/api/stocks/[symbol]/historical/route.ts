import { NextResponse } from "next/server";
import { generateHistoricalData } from "@/lib/indian-stocks";

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol.toUpperCase();
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "365");

    const historicalData = generateHistoricalData(symbol, Math.min(days, 365));

    return NextResponse.json({ data: historicalData });
  } catch (error) {
    console.error("Historical data API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical data" },
      { status: 500 }
    );
  }
}
