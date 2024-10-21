"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";
import { moneyFormat } from "@/lib/utils";
import { StockChange } from "@/components/stock-change";

interface UserData {
  user: {
    id: string;
    username: string;
    email: string;
    balance: number;
  };
  holdings: {
    id: string;
    user_id: string;
    ticker: string;
    shares: number;
  }[];
  transactions: {
    id: string;
    user_id: string;
    transaction_type: string;
    ticker: string;
    shares: number;
    price: number;
    trade_date: string;
  }[];
}

interface StockData {
  ticker: string;
  shortName: string;
  longName: string;
  open: number;
  previousClose: number;
  change: number;
  changePercent: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredStocks = stockData.filter((stock) =>
    stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/users/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data: UserData = await response.json();
        setUserData(data);

        // Fetch real-time stock data for holdings
        const stockPromises = data.holdings.map(async (holding) => {
          const response = await fetch(
            `http://localhost:8000/stocks/${holding.ticker}/quote`,
          );
          const quote: StockData = await response.json();
          return quote;
        });
        const stockDataResults = await Promise.all(stockPromises);

        setStockData(stockDataResults);
      } catch (err) {
        setError("An error occurred while fetching data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error || !userData) {
    return (
      <div className="container mx-auto p-4">
        Error: {error || "Failed to load data"}
      </div>
    );
  }

  // Portfolio Value calculation
  const totalPortfolioValue = userData.holdings.reduce((total, holding) => {
    const stockInfo = stockData.find(
      (stock) => stock.ticker === holding.ticker,
    );
    return total + (stockInfo ? stockInfo.open * holding.shares : 0);
  }, 0);

  const portfolioPerformance =
    stockData.reduce((total, stock) => total + stock.changePercent, 0) /
    stockData.length;

  const pieChartData = userData.holdings.map((holding) => {
    const stockInfo = stockData.find(
      (stock) => stock.ticker === holding.ticker,
    );
    return {
      name: holding.ticker,
      value: stockInfo ? stockInfo.open * holding.shares : 0,
    };
  });

  const performanceData = userData.transactions
    .slice(-7)
    .map((transaction) => ({
      date: transaction.trade_date,
      value: transaction.price * transaction.shares,
    }));

  // Total Profit calculation
  const totalInvestment = userData.transactions
    .filter((transaction) => transaction.transaction_type === "buy")
    .reduce(
      (total, transaction) => total + transaction.price * transaction.shares,
      0,
    );

  const totalProfit = totalPortfolioValue - totalInvestment;
  const totalChangePercent = (totalProfit / totalInvestment) * 100;

  // Today's Change calculation
  const todaysChange = userData.holdings.reduce((total, holding) => {
    const stockInfo = stockData.find(
      (stock) => stock.ticker === holding.ticker,
    );
    return (
      total +
      (stockInfo
        ? (stockInfo.open - stockInfo.previousClose) * holding.shares
        : 0)
    );
  }, 0);

  const todaysChangePercent = (todaysChange / totalPortfolioValue) * 100;

  // Active Positions calculation
  const activePositions = userData.holdings.filter(
    (holding) => holding.shares > 0,
  );
  const numberOfActivePositions = activePositions.length;
  const numberOfStocks = new Set(
    userData.holdings.map((holding) => holding.ticker),
  ).size;

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Portfolio Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {moneyFormat(totalPortfolioValue)}
            </div>
            <StockChange
              change={portfolioPerformance}
              unit="%"
              extraText="from today"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {moneyFormat(userData.user.balance)}
            </div>
            <span className="text-xs text-muted-foreground">
              Available for trading
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {moneyFormat(totalPortfolioValue + userData.user.balance)}
            </div>
            <span className="text-xs text-muted-foreground">
              Portfolio + Balance
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moneyFormat(totalProfit)}</div>
            <StockChange
              change={totalChangePercent}
              unit="%"
              extraText="from initial investment"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Change
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {moneyFormat(todaysChange)}
            </div>
            <StockChange
              change={todaysChangePercent}
              unit="%"
              extraText="from yesterday"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Positions
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{numberOfActivePositions}</div>
            <span className="text-xs text-muted-foreground">
              Across {numberOfStocks} different stocks
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Composition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  value: {
                    label: "Transaction Value",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-full w-full"
              >
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-value)"
                    fill="var(--color-value)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Shares</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Market Value</TableHead>
                <TableHead>Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData.holdings.map((holding) => {
                const stockInfo = stockData.find(
                  (stock) => stock.ticker === holding.ticker,
                );
                return (
                  <TableRow key={holding.id}>
                    <TableCell className="font-medium">
                      {holding.ticker}
                    </TableCell>
                    <TableCell>{holding.shares}</TableCell>
                    <TableCell>${stockInfo?.open.toFixed(2)}</TableCell>
                    <TableCell>
                      $
                      {(stockInfo
                        ? stockInfo.open * holding.shares
                        : 0
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          stockInfo && stockInfo.change >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {stockInfo && stockInfo.change >= 0 ? (
                          <ArrowUpRight className="mr-1 inline" />
                        ) : (
                          <ArrowDownRight className="mr-1 inline" />
                        )}
                        {stockInfo
                          ? Math.abs(stockInfo.changePercent).toFixed(2)
                          : 0}
                        %
                      </span>
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
