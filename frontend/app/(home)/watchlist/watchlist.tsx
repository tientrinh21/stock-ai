"use client";

import { useEffect, useState } from "react";
import { Search, Plus, X } from "lucide-react";
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
import { StockChange } from "@/components/stock-change";
import { FetchErrorAlert } from "@/components/fetch-error-alert";
import { SpinnerLoading } from "@/components/spinner-loading";
import { StockData } from "@/types/stock";
import { toast } from "sonner";
import { WatchlistItem } from "@/types/watchlist";
import {
  addToWatchList,
  fetchStockData,
  fetchWatchlist,
  removeFromWatchList,
} from "@/lib/request";

export function Watchlist() {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTicker, setNewTicker] = useState("");

  const fetchData = async () => {
    try {
      const newWatchList = await fetchWatchlist();
      setWatchlist(newWatchList);

      const tickers = newWatchList.map((item) => item.ticker);

      const newStockData = await fetchStockData(tickers);
      setStockData(newStockData);
    } catch (err) {
      setError("An error occurred while fetching data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up an interval to fetch data every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <SpinnerLoading />;
  if (error || !watchlist) return <FetchErrorAlert error={error} />;

  const filteredWatchlist = watchlist.filter((element) => {
    const stockInfo = stockData.find(
      (stock) => stock.ticker === element.ticker,
    );

    return (
      stockInfo?.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stockInfo?.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stockInfo?.longName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toastId = "watchlistToast";
    toast.loading("Adding to your watchlist...", { id: toastId });

    try {
      const response = await addToWatchList(newTicker);

      if (response.ok) {
        toast.success("Succesfully added.", { id: toastId });
        fetchData();
      } else {
        const result = await response.json();
        toast.error(result.detail || "An error occurred. Please try again.", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", { id: toastId });
      console.log(error);
    }
  };

  const handleRemoveTicker = async (ticker: string) => {
    const toastId = "watchlistToast";
    toast.loading("Removing from your watchlist...", { id: toastId });

    try {
      const response = await removeFromWatchList(ticker);

      if (response.ok) {
        toast.success("Succesfully removed.", { id: toastId });
        fetchData();
      } else {
        const result = await response.json();
        toast.error(result.detail || "An error occurred. Please try again.", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", { id: toastId });
      console.log(error);
    }
  };

  return (
    <div className="container mt-2 max-w-screen-2xl md:mt-6">
      <h1 className="mb-6 text-3xl font-bold">Watchlist</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add to Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter stock symbol"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
            />
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-3">
          <CardTitle>Your Watchlist</CardTitle>
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
                <TableHead>Ticker</TableHead>
                <TableHead className="hidden md:table-cell">Name</TableHead>
                <TableHead>Open</TableHead>
                <TableHead>Previous Close</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWatchlist?.map((element) => {
                const stockInfo = stockData.find(
                  (stock) => stock.ticker === element.ticker,
                );

                return (
                  <TableRow key={element.id}>
                    <TableCell className="font-medium md:hidden">
                      <div className="flex flex-col justify-center">
                        <span>{element.ticker}</span>
                        <span className="text-xs font-thin">
                          {stockInfo?.shortName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {element.ticker}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {stockInfo?.shortName}
                    </TableCell>
                    <TableCell>${stockInfo?.open.toFixed(2)}</TableCell>
                    <TableCell>
                      ${stockInfo?.previousClose.toFixed(2)}
                    </TableCell>
                    <TableCell>${stockInfo?.currentPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <StockChange
                        change={stockInfo?.change ?? 0}
                        percentChange={stockInfo?.changePercent ?? 0}
                        className="text-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveTicker(element.ticker)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
