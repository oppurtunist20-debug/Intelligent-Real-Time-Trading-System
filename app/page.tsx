"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  TrendingUp,
  Brain,
  BarChart3,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Activity,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Signals",
    description:
      "AI analyzes market data, news sentiment, and technical indicators to generate high-confidence trading signals.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: BarChart3,
    title: "Technical Analysis",
    description:
      "Advanced indicators including RSI, MACD, Bollinger Bands, moving averages with visual candlestick charts.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: Activity,
    title: "Real-Time Sentiment",
    description:
      "Monitor market sentiment through news analysis, FII/DII data, and social media signals for Indian stocks.",
    color: "text-chart-5",
    bg: "bg-chart-5/10",
  },
  {
    icon: Globe,
    title: "Macro Indicators",
    description:
      "Track GDP, inflation, RBI policy, interest rates, and other macroeconomic factors affecting Indian markets.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description:
      "Portfolio risk metrics, position sizing calculator, volatility analysis, and automated stop-loss recommendations.",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    icon: Zap,
    title: "50+ Indian Stocks",
    description:
      "Comprehensive coverage of NSE/BSE stocks including NIFTY 50 constituents across all major sectors.",
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
];

const stats = [
  { label: "Stocks Covered", value: "50+", suffix: "" },
  { label: "Signal Accuracy", value: "78", suffix: "%" },
  { label: "Daily Signals", value: "200+", suffix: "" },
  { label: "Market Coverage", value: "NSE + BSE", suffix: "" },
];

const mockSignals = [
  { symbol: "RELIANCE", signal: "BUY", confidence: 85, price: "₹2,890" },
  { symbol: "TCS", signal: "HOLD", confidence: 62, price: "₹4,215" },
  { symbol: "HDFCBANK", signal: "BUY", confidence: 78, price: "₹1,680" },
  { symbol: "INFY", signal: "SELL", confidence: 71, price: "₹1,890" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary">
                Trade
              </span>
            </div>

            <div className="flex items-center gap-4">
              <SignedIn>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 text-center">
        

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            <span className="text-white">
              Intelligent Real-Time
            </span>
            <br />
            <span className="text-primary">
              Trading System
            </span>
            <br />
            <span className="text-white">
              for Indian Markets
            </span>
          </h1>

          <p className="text-xl text-white/60 max-w-3xl mx-auto mb-10">
            AI-powered trading signals, real-time technical analysis, sentiment
            monitoring, and portfolio management for NSE &amp; BSE stocks. Make
            smarter trading decisions with AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignedOut>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-semibold rounded-xl"
                >
                  Start Trading Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-xl"
                >
                  Sign In to Dashboard
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-semibold rounded-xl"
                >
                  Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </SignedIn>
          </div>

          {/* Live signals preview */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {mockSignals.map((s) => (
              <div
                key={s.symbol}
                className="bg-card border border-border rounded-xl p-3 text-left"
              >
                <div className="font-bold text-sm text-white">{s.symbol}</div>
                <div className="text-white/50 text-xs">{s.price}</div>
                <div
                  className={`text-xs font-semibold mt-1 ${
                    s.signal === "BUY"
                      ? "text-chart-5"
                      : s.signal === "SELL"
                      ? "text-destructive"
                      : "text-chart-4"
                  }`}
                >
                  {s.signal} • {s.confidence}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-card/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-bold text-primary">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-white/60 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Everything You Need to Trade Smarter
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Comprehensive tools powered by AI to help you make informed
              trading decisions in Indian markets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 px-4 bg-card/30 border-y border-border">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-white/40 text-sm font-medium uppercase tracking-wider mb-8">
            Built With Industry-Leading Technology
          </h3>
          <div className="flex flex-wrap justify-center gap-4 items-center">
            {[
              "Next.js 14",
              "TypeScript",
              "AI Analytics",
              "Prisma ORM",
              "NeonDB",
              "Clerk Auth",
              "Python FastAPI",
              "Tailwind CSS",
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full bg-background border border-border text-white/60 text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-primary/10 border border-primary/20 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Ready to Trade Smarter?
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Join traders using AI-powered insights to navigate Indian markets.
              Get started free today.
            </p>
            <SignedOut>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-lg font-semibold rounded-xl"
                >
                  Get Started Free <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-lg font-semibold rounded-xl"
                >
                  Open Dashboard <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-white/50 text-sm">Trade</span>
          </div>
          <p className="text-white/50 text-sm">
            © 2024 Trade. For educational purposes only. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
