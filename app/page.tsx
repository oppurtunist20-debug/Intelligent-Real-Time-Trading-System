"use client";
import { useState } from "react";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  LineChart,
  Smartphone,
  ChevronRight,
  Plus,
  ArrowLeft,
  Cpu,
  Radar,
  Landmark,
  ShieldCheck,
  Layers,
  Triangle,
  Braces,
  Database,
  Box,
  Wind
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Timeline } from "@/components/ui/timeline";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

const features = [
  {
    icon: Cpu,
    title: "AI-Powered Signals",
    description:
      "AI analyzes market data, news sentiment, and technical indicators to generate high-confidence trading signals.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: LineChart,
    title: "Technical Analysis",
    description:
      "Advanced indicators including RSI, MACD, Bollinger Bands, moving averages with visual candlestick charts.",
    color: "text-chart-5",
    bg: "bg-accent/10",
  },
  {
    icon: Radar,
    title: "Real-Time Sentiment",
    description:
      "Monitor market sentiment through news analysis, FII/DII data, and social media signals for Indian stocks.",
    color: "text-chart-5",
    bg: "bg-chart-5/10",
  },
  {
    icon: Landmark,
    title: "Macro Indicators",
    description:
      "Track GDP, inflation, RBI policy, interest rates, and other macroeconomic factors affecting Indian markets.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: ShieldCheck,
    title: "Risk Management",
    description:
      "Portfolio risk metrics, position sizing calculator, volatility analysis, and automated stop-loss recommendations.",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    icon: Layers,
    title: "50+ Indian Stocks",
    description:
      "Comprehensive coverage of NSE/BSE stocks including NIFTY 50 constituents across all major sectors.",
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
];

const stats = [
  { value: "10+", suffix: "", label: "Years analyzing the markets and building intelligent trading models." },
  { value: "100k+", suffix: "", label: "Trades executed securely through our proprietary market signals." },
  { value: "100%", suffix: "", label: "Platform uptime ensuring you never miss a critical market move." },
  { value: "100+", suffix: "", label: "Technical indicators tracking every possible price action anomaly." },
];

const mockSignals = [
  { symbol: "RELIANCE", name: "Reliance Industries", signal: "BUY", confidence: 85, price: "₹2,890.50", change: "+1.45%" },
  { symbol: "TCS", name: "Tata Consultancy", signal: "HOLD", confidence: 62, price: "₹4,215.10", change: "+0.25%" },
  { symbol: "HDFCBANK", name: "HDFC Bank", signal: "BUY", confidence: 78, price: "₹1,680.00", change: "+0.85%" },
  { symbol: "INFY", name: "Infosys", signal: "SELL", confidence: 71, price: "₹1,890.30", change: "-1.20%" },
  { symbol: "ICICIBANK", name: "ICICI Bank", signal: "BUY", confidence: 88, price: "₹1,050.20", change: "+1.10%" },
  { symbol: "SBIN", name: "State Bank of India", signal: "HOLD", confidence: 55, price: "₹765.40", change: "+0.15%" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", signal: "BUY", confidence: 92, price: "₹1,120.60", change: "+2.30%" },
  { symbol: "ITC", name: "ITC Limited", signal: "HOLD", confidence: 65, price: "₹450.80", change: "-0.40%" },
  { symbol: "LT", name: "Larsen & Toubro", signal: "BUY", confidence: 81, price: "₹3,450.00", change: "+1.65%" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", signal: "SELL", confidence: 75, price: "₹7,120.50", change: "-1.80%" },
  { symbol: "MARUTI", name: "Maruti Suzuki", signal: "BUY", confidence: 79, price: "₹11,450.00", change: "+0.95%" },
  { symbol: "WIPRO", name: "Wipro", signal: "HOLD", confidence: 58, price: "₹520.30", change: "+0.10%" },
];

const techStack1 = [
  { name: "Next.js 14", icon: Triangle, color: "text-white fill-white/10" },
  { name: "TypeScript", icon: Braces, color: "text-[#3178C6]" },
  { name: "AI Analytics", icon: Cpu, color: "text-[#f0b90b]" },
  { name: "Prisma ORM", icon: Box, color: "text-[#5A67D8] fill-[#5A67D8]/20" },
];

const techStack2 = [
  { name: "NeonDB", icon: Database, color: "text-[#00E599]" },
  { name: "Clerk Auth", icon: ShieldCheck, color: "text-[#6C47FF]" },
  { name: "FastAPI", icon: Zap, color: "text-[#059669] fill-[#059669]/20" },
  { name: "Tailwind", icon: Wind, color: "text-[#38BDF8]" },
];

export default function LandingPage() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const typewriterWords = [
    { text: "Ready" },
    { text: "to" },
    { text: "Trade" },
    { text: "Smarter?", className: "text-[#f0b90b]" },
  ];

  const timelineData = features.map((feature) => ({
    title: feature.title,
    content: (
      <div className="mb-10 pr-2">
        <p className="text-[#8A8F98] text-base sm:text-lg font-medium leading-relaxed">
          {feature.description}
        </p>
      </div>
    ),
  }));

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
            <span className="bg-gradient-to-b from-gray-100 via-gray-300 to-gray-500 bg-clip-text text-transparent drop-shadow-sm">
              Intelligent Real-Time
            </span>
            <br />
            <span className="text-primary drop-shadow-md">
              Trading System
            </span>
            <br />
            <span className="bg-gradient-to-b from-gray-100 via-gray-300 to-gray-500 bg-clip-text text-transparent drop-shadow-sm">
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
          <div className="mt-16 sm:mt-24 w-full flex justify-center flex-col items-center max-w-[100vw] overflow-hidden">
             <div className="text-sm font-medium text-white/40 uppercase tracking-widest mb-6">Live AI Market Signals</div>
             <InfiniteMovingCards items={mockSignals} direction="right" speed="slow" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden bg-[#0B0E11] border-y border-white/5">
        {/* Glow effect at the bottom mimicking the reference image */}
        <div className="absolute -bottom-[40%] left-0 right-0 h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/30 via-purple-900/5 to-transparent pointer-events-none blur-3xl scale-150"></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 tracking-tight">
              Trusted by traders all over the world
            </h2>
            <p className="text-[#8A8F98] max-w-2xl mx-auto text-lg leading-relaxed">
              We are a team of experienced traders and engineers who are passionate about helping you grow your portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-[#181A20] border border-white/5 rounded-2xl p-8 hover:bg-[#1C1F26] transition-colors relative group"
              >
                <div className="text-4xl font-bold text-white mb-4 tracking-tight drop-shadow-sm group-hover:-translate-y-0.5 transition-transform duration-300">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-[#8A8F98] text-base leading-relaxed pr-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-white max-w-2xl leading-[1.1] tracking-tight">
              Built for Fast Moving Traders That Need Control.
            </h2>
            <p className="text-[#8A8F98] text-lg max-w-md leading-relaxed lg:mb-1 text-left">
              AI agents work inside your dashboard with real-time approvals, technical indicators, and full market audibility. Every signal is tracked, every trade accountable.
            </p>
          </div>

          <div className="block md:hidden mt-0 w-full">
            <Timeline data={timelineData} />
          </div>

          <div className="hidden md:block relative min-h-[400px]">
            {/* 1. Base Grid Layer */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${expandedFeature ? 'opacity-0 scale-[0.98] blur-[2px] pointer-events-none' : 'opacity-100 scale-100'}`}>
            {features.map((feature) => {
              const isExpanded = expandedFeature === feature.title;
              const isHidden = expandedFeature !== null && !isExpanded;

              return (
                <div
                  key={feature.title}
                  className={`group relative flex flex-col bg-[#1A1D21] rounded-3xl transition-all duration-500 overflow-hidden ${isHidden ? 'hidden opacity-0 scale-95' : 'flex opacity-100 scale-100'
                    } ${isExpanded ? 'min-h-[400px] lg:min-h-[500px] flex-col lg:flex-row' : 'hover:bg-[#1E2226]'}`}
                >
                  {/* Visual Area */}
                  <div className={`${isExpanded ? 'lg:w-1/2 h-64 lg:h-auto' : 'h-40'} m-2 rounded-[20px] bg-gradient-to-b from-[#242930] to-[#1A1D21] border border-white/5 flex items-center justify-center relative overflow-hidden shadow-inner shrink-0`}>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <feature.icon className={`w-16 h-16 ${feature.color} drop-shadow-2xl scale-100 ${!isExpanded && 'group-hover:scale-110'} transition-transform duration-500 ease-out`} strokeWidth={1} />
                  </div>

                  {/* Content Area */}
                  <div className={`p-6 md:p-8 flex ${isExpanded ? 'flex-col justify-center' : 'flex-row items-end justify-between'} grow gap-4`}>
                    <div className="grow">
                      <h3 className={`font-bold text-white mb-2 leading-tight tracking-tight ${isExpanded ? 'text-3xl sm:text-4xl' : 'text-[19px]'}`}>
                        {feature.title}
                      </h3>
                      {isExpanded ? (
                        <div className="mt-6 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                          <p className="text-[#8A8F98] text-lg sm:text-xl leading-relaxed max-w-xl">
                            {feature.description}
                          </p>
                          {/* Back button */}
                          <button
                            onClick={() => setExpandedFeature(null)}
                            className="flex items-center gap-2 text-[#8A8F98] hover:text-white transition-colors self-start px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/5 font-medium text-sm"
                          >
                            <ArrowLeft className="w-4 h-4" /> Go Back
                          </button>
                        </div>
                      ) : (
                        <p className="text-[#8A8F98] text-sm leading-relaxed transition-colors group-hover:text-[#A0A5B0]">
                          {feature.description}
                        </p>
                      )}
                    </div>
                    {!isExpanded && (
                      <button
                        onClick={() => setExpandedFeature(feature.title)}
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-1 group-hover:bg-white/10 transition-all text-white/50 group-hover:text-white z-10"
                      >
                        <Plus className="w-5 h-5 cursor-pointer" strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section (Brands with a Spotlight) */}
      <section className="relative py-32 px-4 bg-[#0B0E11] overflow-hidden border-y border-white/5">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[70%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0052FF]/20 via-transparent to-transparent blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 drop-shadow-sm tracking-tight inline-block">
            Built With Industry-Leading Technology
          </h2>
          <p className="text-[#8A8F98] text-sm md:text-base font-medium mb-20 max-w-2xl mx-auto">
            Trading velocity requires serious infrastructure. Our platform is powered by the best in the ecosystem.
          </p>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-4 gap-x-8 gap-y-14 items-center justify-items-center opacity-90 mx-auto max-w-4xl">
            {[...techStack1, ...techStack2].map((tech, i) => (
              <div key={`desktop-${i}`} className="flex items-center gap-3">
                <tech.icon className={`w-7 h-7 ${tech.color}`} strokeWidth={2} />
                <span className="text-white font-bold text-lg tracking-tight">{tech.name}</span>
              </div>
            ))}
          </div>

          {/* Mobile Infinite Scroll */}
          <div className="flex w-[100vw] relative left-1/2 -translate-x-1/2 md:hidden flex-col gap-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] mt-4">
             <div className="flex shrink-0 gap-10 w-max flex-nowrap animate-scroll items-center" style={{ '--animation-duration': '20s' } as React.CSSProperties}>
                {[...techStack1, ...techStack1, ...techStack1, ...techStack1].map((tech, i) => (
                  <div key={`mobile-req1-${i}`} className="flex items-center gap-3 shrink-0">
                    <tech.icon className={`w-6 h-6 ${tech.color}`} strokeWidth={2} />
                    <span className="text-white font-bold text-base tracking-tight">{tech.name}</span>
                  </div>
                ))}
             </div>
             <div className="flex shrink-0 gap-10 w-max flex-nowrap animate-scroll items-center" style={{ '--animation-duration': '25s', '--animation-direction': 'reverse' } as React.CSSProperties}>
                {[...techStack2, ...techStack2, ...techStack2, ...techStack2].map((tech, i) => (
                  <div key={`mobile-req2-${i}`} className="flex items-center gap-3 shrink-0">
                    <tech.icon className={`w-6 h-6 ${tech.color}`} strokeWidth={2} />
                    <span className="text-white font-bold text-base tracking-tight">{tech.name}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 border-t border-white/5 bg-[#0B0E11]">
        <div className="flex flex-col items-center justify-center min-h-[30rem]">
          <p className="text-[#8A8F98] text-xs sm:text-base mb-2 uppercase tracking-widest font-medium">
            The road to financial freedom starts here
          </p>
          <TypewriterEffectSmooth words={typewriterWords} />
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-8">
            <SignedOut>
              <Link href="/sign-up">
                <button className="w-40 h-12 rounded-xl bg-[#f0b90b] text-black font-semibold text-sm hover:bg-[#f0b90b]/90 transition-colors">
                  Join Now
                </button>
              </Link>
              <Link href="/sign-in">
                <button className="w-40 h-12 rounded-xl bg-transparent text-white border border-white/20 hover:bg-white/5 transition-colors text-sm font-semibold">
                  Sign In
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                 <button className="w-48 h-12 rounded-xl bg-[#f0b90b] text-black font-semibold text-sm hover:bg-[#f0b90b]/90 transition-colors">
                  Open Dashboard
                </button>
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
