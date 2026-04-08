import { NextResponse } from "next/server";
import { analyzeMacroImpact } from "@/lib/gemini";
import type { MacroIndicator } from "@/lib/types";

const MACRO_INDICATORS: MacroIndicator[] = [
  // Monetary Policy
  {
    id: "repo-rate",
    name: "RBI Repo Rate",
    value: 6.5,
    previousValue: 6.5,
    unit: "%",
    date: "2024-10-09",
    impact: "HIGH",
    description: "RBI kept repo rate unchanged at 6.5% in October 2024 MPC meeting",
    category: "MONETARY",
  },
  {
    id: "reverse-repo",
    name: "Reverse Repo Rate",
    value: 3.35,
    previousValue: 3.35,
    unit: "%",
    date: "2024-10-09",
    impact: "MEDIUM",
    description: "Standing Deposit Facility rate remains at 6.25%",
    category: "MONETARY",
  },
  {
    id: "cpi-inflation",
    name: "CPI Inflation",
    value: 5.49,
    previousValue: 3.65,
    unit: "%",
    date: "2024-11-01",
    impact: "HIGH",
    description: "Consumer price inflation rose to 5.49% in October driven by food prices",
    category: "MONETARY",
  },
  {
    id: "wpi-inflation",
    name: "WPI Inflation",
    value: 2.36,
    previousValue: 1.84,
    unit: "%",
    date: "2024-11-01",
    impact: "MEDIUM",
    description: "Wholesale price index inflation at 2.36% in October 2024",
    category: "MONETARY",
  },

  // Fiscal Policy
  {
    id: "gdp-growth",
    name: "GDP Growth Rate",
    value: 6.7,
    previousValue: 6.9,
    unit: "%",
    date: "2024-11-29",
    impact: "HIGH",
    description: "India GDP growth at 6.7% in Q2 FY25, moderating from 6.9% in Q1",
    category: "FISCAL",
  },
  {
    id: "fiscal-deficit",
    name: "Fiscal Deficit",
    value: 5.1,
    previousValue: 5.9,
    unit: "% of GDP",
    date: "2024-11-01",
    impact: "MEDIUM",
    description: "Fiscal deficit target at 5.1% of GDP for FY25, improvement from prior year",
    category: "FISCAL",
  },
  {
    id: "iip",
    name: "Industrial Production (IIP)",
    value: 3.1,
    previousValue: 4.9,
    unit: "% YoY",
    date: "2024-10-11",
    impact: "MEDIUM",
    description: "IIP growth at 3.1% in September, slowdown from 4.9% in August",
    category: "FISCAL",
  },

  // Trade
  {
    id: "forex-reserves",
    name: "Forex Reserves",
    value: 682.1,
    previousValue: 700.5,
    unit: "USD Bn",
    date: "2024-11-22",
    impact: "MEDIUM",
    description: "India forex reserves at USD 682.1 billion as of November 2024",
    category: "TRADE",
  },
  {
    id: "trade-deficit",
    name: "Trade Deficit",
    value: -27.1,
    previousValue: -20.8,
    unit: "USD Bn",
    date: "2024-11-01",
    impact: "HIGH",
    description: "Trade deficit widened to USD 27.1 billion in October on higher gold imports",
    category: "TRADE",
  },
  {
    id: "usdinr",
    name: "USD/INR Exchange Rate",
    value: 84.48,
    previousValue: 83.92,
    unit: "₹",
    date: "2024-11-29",
    impact: "HIGH",
    description: "Rupee weakened to 84.48 against USD on FII outflows and dollar strength",
    category: "TRADE",
  },

  // Market
  {
    id: "india-vix",
    name: "India VIX",
    value: 14.85,
    previousValue: 13.72,
    unit: "",
    date: "2024-11-29",
    impact: "MEDIUM",
    description: "Volatility index at 14.85, indicating moderate market uncertainty",
    category: "MARKET",
  },
  {
    id: "fii-flows",
    name: "FII Net Flows (Nov)",
    value: -25536,
    previousValue: -94017,
    unit: "Cr",
    date: "2024-11-29",
    impact: "HIGH",
    description: "FIIs sold ₹25,536 Cr in November, smaller outflow than October's ₹94,017 Cr",
    category: "MARKET",
  },
  {
    id: "dii-flows",
    name: "DII Net Flows (Nov)",
    value: 22765,
    previousValue: 103940,
    unit: "Cr",
    date: "2024-11-29",
    impact: "MEDIUM",
    description: "DIIs bought ₹22,765 Cr in November, cushioning FII selling impact",
    category: "MARKET",
  },
  {
    id: "10yr-yield",
    name: "10-Year G-Sec Yield",
    value: 6.77,
    previousValue: 6.85,
    unit: "%",
    date: "2024-11-29",
    impact: "MEDIUM",
    description: "10-year government bond yield at 6.77%, easing from recent highs",
    category: "MARKET",
  },
];

export async function GET() {
  try {
    return NextResponse.json({ data: { indicators: MACRO_INDICATORS, analysis: null } });
  } catch (error) {
    console.error("Macro GET error:", error);
    return NextResponse.json({ error: "Failed to fetch macro indicators" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const analysis = await analyzeMacroImpact(MACRO_INDICATORS);
    return NextResponse.json({ data: analysis });
  } catch (error) {
    console.error("Macro analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze macro indicators" }, { status: 500 });
  }
}
