"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StockPriceViewer } from "@/components/stock-price-viewer";
import { TopStocksCard } from "@/components/top-stocks-card";
import { MarketIndexCard } from "@/components/market-index-card";

export function Market() {
  const [symbol, setSymbol] = useState("AAPL");
  const [inputSymbol, setInputSymbol] = useState("AAPL");

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSymbol(e.target.value.toUpperCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSymbol(inputSymbol);
  };

  return (
    <div className="container mt-2 max-w-screen-2xl md:mt-6">
      <h1 className="mb-6 text-3xl font-bold">Market Overview</h1>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <MarketIndexCard />
        <TopStocksCard />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Stock Viewer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="mb-4 flex space-x-2">
            <Input
              type="text"
              value={inputSymbol}
              onChange={handleSymbolChange}
              placeholder="Enter stock symbol"
            />
            <Button type="submit">View Stock</Button>
          </form>
          <div>
            <StockPriceViewer symbol={symbol} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
