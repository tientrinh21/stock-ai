"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Stock {
  symbol: string;
  price: number;
  quantity: number;
  lastTradePrice: number;
  lastTradeTime: number;
}

interface TradingStrategy {
  (
    currentPrice: number,
    lastTradePrice: number,
    lastTradeTime: number,
  ): "buy" | "sell" | "hold";
}

const defaultTradingStrategy: TradingStrategy = (
  currentPrice,
  lastTradePrice,
  lastTradeTime,
) => {
  const timeSinceLastTrade = Date.now() - lastTradeTime;
  const priceChange = (currentPrice - lastTradePrice) / lastTradePrice;

  if (timeSinceLastTrade > 60000) {
    // 1 minute
    if (priceChange > 0.005) return "sell"; // 0.5% increase
    if (priceChange < -0.005) return "buy"; // 0.5% decrease
  }

  return "hold";
};

export function VirtualTradingBot() {
  const [balance, setBalance] = useState(10000);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isAutoTrading, setIsAutoTrading] = useState(false);
  const [customStrategy, setCustomStrategy] = useState<TradingStrategy | null>(
    null,
  );

  const updateStockPrices = useCallback(() => {
    setStocks((prevStocks) =>
      prevStocks.map((stock) => ({
        ...stock,
        price: Math.max(0.01, stock.price + (Math.random() - 0.5) * 2),
      })),
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateStockPrices();
      if (isAutoTrading) {
        autoTrade();
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoTrading, updateStockPrices]);

  const addStock = (symbol: string) => {
    if (!stocks.find((s) => s.symbol === symbol)) {
      setStocks([
        ...stocks,
        {
          symbol,
          price: 100,
          quantity: 0,
          lastTradePrice: 100,
          lastTradeTime: Date.now(),
        },
      ]);
    }
  };

  const buyStock = (symbol: string) => {
    setStocks((prevStocks) =>
      prevStocks.map((stock) =>
        stock.symbol === symbol
          ? {
              ...stock,
              quantity: stock.quantity + 1,
              lastTradePrice: stock.price,
              lastTradeTime: Date.now(),
            }
          : stock,
      ),
    );
    setBalance(
      (prevBalance) =>
        prevBalance - stocks.find((s) => s.symbol === symbol)!.price,
    );
  };

  const sellStock = (symbol: string) => {
    setStocks((prevStocks) =>
      prevStocks.map((stock) =>
        stock.symbol === symbol && stock.quantity > 0
          ? {
              ...stock,
              quantity: stock.quantity - 1,
              lastTradePrice: stock.price,
              lastTradeTime: Date.now(),
            }
          : stock,
      ),
    );
    setBalance(
      (prevBalance) =>
        prevBalance + stocks.find((s) => s.symbol === symbol)!.price,
    );
  };

  const autoTrade = () => {
    stocks.forEach((stock) => {
      const action = (customStrategy || defaultTradingStrategy)(
        stock.price,
        stock.lastTradePrice,
        stock.lastTradeTime,
      );
      if (action === "buy" && balance >= stock.price) {
        buyStock(stock.symbol);
      } else if (action === "sell" && stock.quantity > 0) {
        sellStock(stock.symbol);
      }
    });
  };

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Virtual Trading Bot</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="auto-trading">Auto Trading</Label>
          <Switch
            id="auto-trading"
            checked={isAutoTrading}
            onCheckedChange={setIsAutoTrading}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="balance">Balance: ${balance.toFixed(2)}</Label>
        </div>
        <div className="mb-4 flex space-x-2">
          <Input
            id="add-stock"
            placeholder="Enter stock symbol"
            onKeyPress={(e) =>
              e.key === "Enter" && addStock(e.currentTarget.value)
            }
          />
          <Button
            onClick={() =>
              addStock(
                (document.getElementById("add-stock") as HTMLInputElement)
                  .value,
              )
            }
          >
            Add Stock
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell>{stock.symbol}</TableCell>
                <TableCell>${stock.price.toFixed(2)}</TableCell>
                <TableCell>{stock.quantity}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => buyStock(stock.symbol)}
                    disabled={balance < stock.price}
                    className="mr-2"
                  >
                    Buy
                  </Button>
                  <Button
                    onClick={() => sellStock(stock.symbol)}
                    disabled={stock.quantity === 0}
                    variant="outline"
                  >
                    Sell
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
