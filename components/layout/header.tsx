"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileNav } from "./mobile-nav";
import { useState } from "react";
import { useRouter } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/stocks": "Stock Screener",
  "/portfolio": "Portfolio",
  "/signals": "Trading Signals",
  "/sentiment": "Market Sentiment",
  "/macro": "Macro Indicators",
  "/risk": "Risk Management",
};

export function Header() {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const title =
    pageTitles[pathname] ||
    (pathname.startsWith("/stocks/") ? pathname.split("/").pop()?.toUpperCase() : "Dashboard");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/stocks/${searchQuery.trim().toUpperCase()}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="border-b border-border bg-card/50 px-4 sm:px-6 h-14 flex items-center gap-4 shrink-0">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden p-1.5"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Page Title */}
        <h2 className="font-semibold text-base hidden sm:block">{title}</h2>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search stock symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
              className="pl-8 h-8 bg-background border-border text-sm"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 ml-auto">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-1.5">
            <Bell className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          {/* User Button */}
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
              },
            }}
          />
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
