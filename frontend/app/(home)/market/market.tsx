"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, Search } from "lucide-react";
import { StockPriceViewer } from "@/components/stock-price-viewer";
import { VirtualTradingBot } from "@/components/virtual-trading-bot";
import { MarketIndexCard } from "@/components/market-index-card";

const topStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 150.25, change: 2.5 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 2800.75, change: -0.5 },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 305.5, change: 1.2 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 3320.0, change: 0.8 },
];

export function Market() {
  const [symbol, setSymbol] = useState("AAPL");
  const [inputSymbol, setInputSymbol] = useState("AAPL");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSymbol(e.target.value.toUpperCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSymbol(inputSymbol);
  };

  const filteredStocks = topStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container mt-2 max-w-screen-2xl md:mt-6">
      <h1 className="mb-6 text-3xl font-bold">Market Overview</h1>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <MarketIndexCard />
        <Card>
          <CardHeader className="space-y-3">
            <CardTitle>Top Stocks</CardTitle>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                placeholder="Search stocks"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.map((stock) => (
                  <TableRow key={stock.symbol}>
                    <TableCell className="font-medium">
                      {stock.symbol}
                    </TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell>${stock.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={
                          stock.change >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {stock.change >= 0 ? (
                          <ArrowUpRight className="inline h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="inline h-4 w-4" />
                        )}
                        {Math.abs(stock.change)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
          <div className="h-[400px]">
            <StockPriceViewer symbol={symbol} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Virtual Trading Bot</CardTitle>
        </CardHeader>
        <CardContent>
          <VirtualTradingBot />
        </CardContent>
      </Card>
    </div>
  );
}
