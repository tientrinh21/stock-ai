"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Search, Plus, X } from "lucide-react";

const initialWatchlist = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 150.25,
    change: 2.5,
    changePercent: 1.69,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 2800.75,
    change: -15.25,
    changePercent: -0.54,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 305.5,
    change: 3.75,
    changePercent: 1.24,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 3320.0,
    change: 28.5,
    changePercent: 0.86,
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 695.0,
    change: -8.5,
    changePercent: -1.21,
  },
];

export function Watchlist() {
  const [watchlist, setWatchlist] = useState(initialWatchlist);
  const [searchTerm, setSearchTerm] = useState("");
  const [newSymbol, setNewSymbol] = useState("");

  const filteredWatchlist = watchlist.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const addToWatchlist = () => {
    if (
      newSymbol &&
      !watchlist.some((stock) => stock.symbol === newSymbol.toUpperCase())
    ) {
      // In a real application, you would fetch the stock data from an API here
      const newStock = {
        symbol: newSymbol.toUpperCase(),
        name: "New Stock Inc.",
        price: 100.0,
        change: 0,
        changePercent: 0,
      };
      setWatchlist([...watchlist, newStock]);
      setNewSymbol("");
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter((stock) => stock.symbol !== symbol));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Watchlist</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add to Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter stock symbol"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
            />
            <Button onClick={addToWatchlist}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Watchlist</CardTitle>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Search stocks"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="h-4 w-4 text-muted-foreground" />
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWatchlist.map((stock) => (
                <TableRow key={stock.symbol}>
                  <TableCell className="font-medium">{stock.symbol}</TableCell>
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
                      ${Math.abs(stock.change).toFixed(2)} (
                      {Math.abs(stock.changePercent).toFixed(2)}%)
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromWatchlist(stock.symbol)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
