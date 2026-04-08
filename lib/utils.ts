import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "INR"): string {
  if (currency === "INR") {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
    return `₹${value.toFixed(2)}`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPrice(value: number): string {
  return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatChange(value: number, isPercent = false): string {
  const sign = value >= 0 ? "+" : "";
  if (isPercent) {
    return `${sign}${value.toFixed(2)}%`;
  }
  return `${sign}₹${Math.abs(value).toFixed(2)}`;
}

export function formatVolume(volume: number): string {
  if (volume >= 10000000) {
    return `${(volume / 10000000).toFixed(2)}Cr`;
  } else if (volume >= 100000) {
    return `${(volume / 100000).toFixed(2)}L`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  return volume.toString();
}

export function formatMarketCap(value: number): string {
  if (value >= 1000000000000) {
    return `₹${(value / 1000000000000).toFixed(2)}T`;
  } else if (value >= 10000000000) {
    return `₹${(value / 10000000000).toFixed(2)}K Cr`;
  } else if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(0)} Cr`;
  }
  return formatCurrency(value);
}

export function getChangeColor(value: number): string {
  if (value > 0) return "text-green-500";
  if (value < 0) return "text-red-500";
  return "text-gray-400";
}

export function getSignalColor(signal: string): string {
  switch (signal) {
    case "BUY":
      return "text-green-500";
    case "SELL":
      return "text-red-500";
    case "HOLD":
      return "text-yellow-500";
    default:
      return "text-gray-400";
  }
}

export function getSignalBgColor(signal: string): string {
  switch (signal) {
    case "BUY":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "SELL":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "HOLD":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

export function getSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case "BULLISH":
      return "text-green-500";
    case "BEARISH":
      return "text-red-500";
    case "NEUTRAL":
      return "text-yellow-500";
    default:
      return "text-gray-400";
  }
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTimeAgo(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function generateMockNewsHeadlines(symbol: string): string[] {
  const templates = [
    `${symbol} Q3 results beat analyst estimates, profit up 18%`,
    `${symbol} announces major expansion in renewable energy segment`,
    `Analysts upgrade ${symbol} to 'Buy' with revised target price`,
    `${symbol} signs strategic partnership deal worth ₹2000 Crore`,
    `${symbol} management guides for strong growth in FY25`,
    `${symbol} board approves ₹500 Cr buyback at premium`,
    `Foreign investors increase stake in ${symbol} to 5-year high`,
    `${symbol} wins large government contract for infrastructure project`,
    `${symbol} announces dividend of ₹15 per share`,
    `${symbol} stock hits 52-week high on strong fundamentals`,
  ];

  const shuffled = templates.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
