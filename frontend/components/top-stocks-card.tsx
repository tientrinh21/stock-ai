import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingCard } from "@/components/loading-card";
import { StockChange } from "@/components/stock-change";
import { StockQuote } from "@/types/stock";
import { fetchTopStocks } from "@/lib/request";
import { moneyFormat } from "@/lib/utils";
import { Search } from "lucide-react";

// const topStocks = [
//   { symbol: "AAPL", name: "Apple Inc.", price: 150.25, change: 2.5 },
//   { symbol: "GOOGL", name: "Alphabet Inc.", price: 2800.75, change: -0.5 },
//   { symbol: "MSFT", name: "Microsoft Corporation", price: 305.5, change: 1.2 },
//   { symbol: "AMZN", name: "Amazon.com Inc.", price: 3320.0, change: 0.8 },
// ];

export function TopStocksCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [topStocks, setTopStocks] = useState<StockQuote[]>([]);

  const fetchData = async () => {
    try {
      const newTopStocks = await fetchTopStocks();
      setTopStocks(newTopStocks);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTopStocks = topStocks
    .filter(
      (stock) =>
        stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.shortName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .slice(0, 5);

  if (isLoading) return <LoadingCard />;

  return (
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
            {filteredTopStocks.map((stock) => (
              <TableRow key={stock.ticker}>
                <TableCell className="font-medium">{stock.ticker}</TableCell>
                <TableCell>{stock.shortName}</TableCell>
                <TableCell>{moneyFormat(stock.currentPrice)}</TableCell>
                <TableCell>
                  <StockChange
                    change={stock.change}
                    percentChange={stock.changePercent}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
