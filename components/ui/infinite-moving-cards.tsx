"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    symbol: string;
    name: string;
    signal: string;
    confidence: number;
    price: string;
    change: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty("--animation-direction", "forwards");
      } else {
        containerRef.current.style.setProperty("--animation-direction", "reverse");
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-fit max-w-[100vw] overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)] pt-2 pb-4",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((s, idx) => {
          const isPositive = s.change.startsWith("+");
          return (
            <li
              key={s.symbol + idx}
              className="w-[220px] sm:w-[260px] max-w-full relative shrink-0"
            >
                <div
                  className="bg-[#1A1D21] border border-white/5 hover:border-white/10 rounded-2xl p-4 text-left transition-all duration-300 flex flex-col justify-between group cursor-default shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-[15px] text-foreground tracking-tight flex items-center gap-1.5">
                        {s.symbol}
                      </div>
                      <div className="text-muted-foreground text-xs line-clamp-1">{s.name}</div>
                    </div>
                    <div
                      className={`text-[10px] whitespace-nowrap font-bold px-2 py-0.5 rounded ${
                        s.signal === "BUY"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : s.signal === "SELL"
                          ? "bg-destructive/10 text-destructive border border-destructive/20"
                          : "bg-primary/10 text-primary border border-primary/20"
                      }`}
                    >
                      {s.signal} {s.confidence}%
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-end">
                    <div className="font-semibold text-[17px] text-foreground tabular-nums tracking-tight">
                      {s.price}
                    </div>
                    <div className={`text-xs font-semibold flex items-center gap-0.5 ${isPositive ? 'text-emerald-500' : 'text-destructive'}`}>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {s.change}
                    </div>
                  </div>
                </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
