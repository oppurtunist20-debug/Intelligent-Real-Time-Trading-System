import { NextResponse } from "next/server";
import { getAllMockStocks } from "@/lib/indian-stocks";

export async function GET() {
  try {
    const stocks = getAllMockStocks();
    return NextResponse.json({ data: stocks });
  } catch (error) {
    console.error("Stocks API error:", error);
    return NextResponse.json({ error: "Failed to fetch stocks" }, { status: 500 });
  }
}
