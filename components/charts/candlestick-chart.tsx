"use client";

import { useMemo, useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { prepareChartData } from "@/lib/technical-analysis";
import type { OHLCVData, CandlestickDataPoint } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface CandlestickChartProps {
  data: OHLCVData[];
}

type Period = "1M" | "3M" | "6M" | "1Y";

const CustomCandlestick = (props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: CandlestickDataPoint;
}) => {
  const { x = 0, y = 0, width = 0, payload } = props;
  if (!payload) return null;

  const { open, high, low, close } = payload;
  const isUp = close >= open;
  const color = isUp ? "#22c55e" : "#ef4444";

  const candleHeight = Math.abs(close - open);
  const priceDiff = high - low;
  if (priceDiff === 0) return null;

  const pixelPerPrice = Math.abs(props.height || 1) / priceDiff;
  const candleY = isUp ? y + (high - close) * pixelPerPrice : y + (high - open) * pixelPerPrice;
  const candleH = Math.max(1, candleHeight * pixelPerPrice);
  const wickX = x + width / 2;
  const highWickY = y;
  const lowWickY = y + (props.height || 0);

  return (
    <g>
      <line x1={wickX} y1={highWickY} x2={wickX} y2={lowWickY} stroke={color} strokeWidth={1} />
      <rect
        x={x + 1}
        y={candleY}
        width={Math.max(1, width - 2)}
        height={candleH}
        fill={isUp ? color : color}
        fillOpacity={isUp ? 0.8 : 0.9}
        stroke={color}
        strokeWidth={0.5}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ payload: CandlestickDataPoint }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  const isUp = data.close >= data.open;

  return (
    <div className="bg-card border border-border rounded-lg p-3 text-xs shadow-lg">
      <div className="font-semibold mb-2 text-muted-foreground">{label}</div>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Open</span>
          <span className="font-medium">{formatPrice(data.open)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">High</span>
          <span className="font-medium text-green-400">{formatPrice(data.high)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Low</span>
          <span className="font-medium text-red-400">{formatPrice(data.low)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Close</span>
          <span className={`font-medium ${isUp ? "text-green-400" : "text-red-400"}`}>
            {formatPrice(data.close)}
          </span>
        </div>
        {data.sma20 && (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">SMA20</span>
            <span className="font-medium text-primary">{formatPrice(data.sma20)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export function CandlestickChart({ data }: CandlestickChartProps) {
  const [period, setPeriod] = useState<Period>("3M");

  const periodDays: Record<Period, number> = {
    "1M": 22,
    "3M": 66,
    "6M": 132,
    "1Y": 252,
  };

  const chartData = useMemo(() => {
    const days = periodDays[period];
    const slicedData = data.slice(-days);
    return prepareChartData(slicedData);
  }, [data, period]);

  const priceMin = useMemo(
    () => Math.min(...chartData.map((d) => d.low)) * 0.998,
    [chartData]
  );
  const priceMax = useMemo(
    () => Math.max(...chartData.map((d) => d.high)) * 1.002,
    [chartData]
  );

  return (
    <div>
      {/* Period selector */}
      <div className="flex gap-1 mb-4">
        {(["1M", "3M", "6M", "1Y"] as Period[]).map((p) => (
          <Button
            key={p}
            variant={period === p ? "default" : "ghost"}
            size="sm"
            onClick={() => setPeriod(p)}
            className={`text-xs h-7 px-3 ${
              period === p ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""
            }`}
          >
            {p}
          </Button>
        ))}
      </div>

      {/* Price Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(v: string) => {
              const d = new Date(v);
              return `${d.getDate()}/${d.getMonth() + 1}`;
            }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[priceMin, priceMax]}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(v: number) => `₹${v.toFixed(0)}`}
            width={65}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Candlestick bars */}
          <Bar
            dataKey="high"
            shape={(props) => <CustomCandlestick {...props} payload={props.payload as CandlestickDataPoint} />}
            isAnimationActive={false}
          />

          {/* Moving Average Lines */}
          <Line
            type="monotone"
            dataKey="sma20"
            stroke="#3b82f6"
            strokeWidth={1.5}
            dot={false}
            connectNulls
            name="SMA 20"
          />
          <Line
            type="monotone"
            dataKey="sma50"
            stroke="#f59e0b"
            strokeWidth={1.5}
            dot={false}
            connectNulls
            name="SMA 50"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Volume Chart */}
      <ResponsiveContainer width="100%" height={80}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="date"
            tick={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(v: number) => {
              if (v >= 1000000) return `${(v / 1000000).toFixed(0)}M`;
              if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
              return v.toString();
            }}
            width={65}
          />
          <Bar
            dataKey="volume"
            fill="#3b82f6"
            fillOpacity={0.4}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-4 h-0.5 bg-[#3b82f6]" />
          <span>SMA 20</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-0.5 bg-[#f59e0b]" />
          <span>SMA 50</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-sm" />
          <span>Up candle</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-sm" />
          <span>Down candle</span>
        </div>
      </div>
    </div>
  );
}
