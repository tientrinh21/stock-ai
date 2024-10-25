"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StockPriceViewer } from "@/components/stock-price-viewer";
import { TopStocksCard } from "@/components/top-stocks-card";
import { MarketIndexCard } from "@/components/market-index-card";

export function Market() {
  const [ticker, setTicker] = useState("AAPL");
  const [inputTicker, setInputTicker] = useState("AAPL");

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTicker(e.target.value.toUpperCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicker(inputTicker);
  };

  return (
    <div className="container mt-2 max-w-screen-2xl md:mt-6">
      <h1 className="mb-6 text-3xl font-bold">Market Overview</h1>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <MarketIndexCard />
        <TopStocksCard />
      </div>

      <div>
        <Card>
          <CardHeader className="space-y-3">
            <CardTitle>Stock Viewer</CardTitle>
            <form onSubmit={handleSubmit} className="mb-4 flex space-x-2">
              <Input
                type="text"
                value={inputTicker}
                onChange={handleSymbolChange}
                placeholder="Enter stock symbol"
              />
              <Button type="submit">View Stock</Button>
            </form>
          </CardHeader>
          <CardContent>
            <StockPriceViewer ticker={ticker} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
