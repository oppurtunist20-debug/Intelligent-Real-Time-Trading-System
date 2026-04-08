"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Bar,
  ComposedChart,
} from "recharts";
import { prepareRSIData, prepareMACDData } from "@/lib/technical-analysis";
import type { OHLCVData } from "@/lib/types";

interface TechnicalIndicatorsChartProps {
  data: OHLCVData[];
}

const RSITooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const rsi = payload[0]?.value;
  return (
    <div className="bg-card border border-border rounded-lg p-2 text-xs shadow-lg">
      <div className="text-muted-foreground">{label}</div>
      <div className={`font-semibold mt-1 ${
        rsi > 70 ? "text-red-400" : rsi < 30 ? "text-green-400" : "text-white"
      }`}>
        RSI: {rsi?.toFixed(2)}
      </div>
      <div className="text-muted-foreground text-xs mt-0.5">
        {rsi > 70 ? "Overbought" : rsi < 30 ? "Oversold" : "Neutral"}
      </div>
    </div>
  );
};

const MACDTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-2 text-xs shadow-lg">
      <div className="text-muted-foreground mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value?.toFixed(2)}
        </div>
      ))}
    </div>
  );
};

export function TechnicalIndicatorsChart({ data }: TechnicalIndicatorsChartProps) {
  const recentData = data.slice(-66); // Last 3 months

  const rsiData = useMemo(() => prepareRSIData(recentData), [recentData]);
  const macdData = useMemo(() => prepareMACDData(recentData), [recentData]);

  const tickFormatter = (v: string) => {
    const d = new Date(v);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  return (
    <div className="space-y-6">
      {/* RSI Chart */}
      <div>
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          RSI (14)
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={rsiData} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={tickFormatter}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              width={35}
              ticks={[0, 30, 50, 70, 100]}
            />
            <Tooltip content={<RSITooltip />} />
            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.7} label={{ value: "OB", fill: "#ef4444", fontSize: 10, position: "insideLeft" }} />
            <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="4 4" strokeOpacity={0.7} label={{ value: "OS", fill: "#22c55e", fontSize: 10, position: "insideLeft" }} />
            <ReferenceLine y={50} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 4" strokeOpacity={0.4} />
            <Line
              type="monotone"
              dataKey="rsi"
              stroke="#a855f7"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* MACD Chart */}
      <div>
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          MACD (12, 26, 9)
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <ComposedChart data={macdData} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={tickFormatter}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              width={45}
              tickFormatter={(v: number) => v.toFixed(0)}
            />
            <Tooltip content={<MACDTooltip />} />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} />

            {/* Histogram */}
            <Bar
              dataKey="histogram"
              name="Histogram"
              fill="#3b82f6"
              fillOpacity={0.5}
              isAnimationActive={false}
            />

            {/* MACD Line */}
            <Line
              type="monotone"
              dataKey="macd"
              name="MACD"
              stroke="#3b82f6"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />

            {/* Signal Line */}
            <Line
              type="monotone"
              dataKey="signal"
              name="Signal"
              stroke="#f97316"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* MACD Legend */}
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5 bg-[#3b82f6]" />
            <span>MACD</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5 bg-[#f97316]" />
            <span>Signal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#3b82f6] opacity-50 rounded-sm" />
            <span>Histogram</span>
          </div>
        </div>
      </div>
    </div>
  );
}
