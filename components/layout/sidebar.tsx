"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart2,
  Briefcase,
  Zap,
  MessageSquare,
  Globe,
  Shield,
  TrendingUp,
  Bot,
  X,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/stocks", label: "Stocks", icon: BarChart2 },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/signals", label: "Signals", icon: Zap },
  { href: "/sentiment", label: "Sentiment", icon: MessageSquare },
  { href: "/macro", label: "Macro", icon: Globe },
  { href: "/risk", label: "Risk", icon: Shield },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: messages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process your request. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <aside className="hidden lg:flex flex-col w-56 border-r border-border bg-card/50 shrink-0">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-white">Trade</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/20 text-white border border-primary/30"
                    : "text-white/60 hover:text-white hover:bg-muted/50"
                )}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive ? "text-primary" : ""
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* AI Chat Button + Status */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => setChatOpen((v) => !v)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              chatOpen
                ? "bg-primary/20 text-white border border-primary/30"
                : "text-white/60 hover:text-white hover:bg-muted/50"
            )}
          >
            <Bot className={cn("w-4 h-4 shrink-0", chatOpen ? "text-primary" : "")} />
            AI Assistant
          </button>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-500">Markets Open</span>
          </div>
        </div>
      </aside>

      {/* AI Chat Panel */}
      {chatOpen && (
        <div className="hidden lg:flex fixed left-56 bottom-0 z-50 flex-col w-80 h-[420px] bg-card border border-border rounded-tr-xl shadow-xl overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm text-white">
                AI Trading Assistant
              </span>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white/50 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && (
              <div className="text-center text-white/40 text-xs py-8 leading-relaxed">
                Ask me about Indian stocks, trading signals, technical analysis,
                or market conditions.
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[90%] px-3 py-2 rounded-lg text-xs leading-relaxed",
                  msg.role === "user"
                    ? "ml-auto bg-primary/20 text-white border border-primary/20"
                    : "bg-muted text-white"
                )}
              >
                {msg.content}
              </div>
            ))}
            {sending && (
              <div className="bg-muted text-white/50 px-3 py-2 rounded-lg text-xs max-w-[90%] animate-pulse">
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about markets..."
              className="flex-1 text-xs px-3 py-2 bg-background border border-border rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
