"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Dot,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  Activity,
  Search,
  PieChartIcon,
  AreaChartIcon,
} from "lucide-react";
import { StockChange } from "@/components/stock-change";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SpinnerLoading } from "@/components/spinner-loading";
import { FetchErrorAlert } from "@/components/fetch-error-alert";
import { UserDetailsData } from "@/types/user";
import { StockData } from "@/types/stock";
import { moneyFormat } from "@/lib/utils";
import { fetchStockData, fetchUserDetails } from "@/lib/request";

export function Dashboard() {
  const [userData, setUserData] = useState<UserDetailsData | null>(null);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only fetch user details once if not existed yet
        const newUserData = userData ?? (await fetchUserDetails());
        setUserData(newUserData);

        const newStockData = await fetchStockData(newUserData);
        setStockData(newStockData);
      } catch (err) {
        setError("An error occurred while fetching data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up an interval to fetch data every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <SpinnerLoading />;
  if (error || !userData) return <FetchErrorAlert error={error} />;

  // Portfolio Value calculation
  const totalPortfolioValue = userData.holdings.reduce((total, holding) => {
    const stockInfo = stockData.find(
      (stock) => stock.ticker === holding.ticker,
    );
    return total + (stockInfo ? stockInfo.currentPrice * holding.shares : 0);
  }, 0);

  const portfolioPerformance =
    stockData.reduce((total, stock) => total + stock.changePercent, 0) /
    stockData.length;

  // Total Profit calculation
  const totalInvestmentFromBuys = userData.transactions
    .filter((transaction) => transaction.transaction_type === "buy")
    .reduce(
      (total, transaction) =>
        total + transaction.price * (transaction.shares ?? 1),
      0,
    );

  const totalProceedsFromSells = userData.transactions
    .filter((transaction) => transaction.transaction_type === "sell")
    .reduce(
      (total, transaction) =>
        total + transaction.price * (transaction.shares ?? 1),
      0,
    );

  const netInvestment = totalInvestmentFromBuys - totalProceedsFromSells;
  const totalProfit = totalPortfolioValue - netInvestment;
  const totalChangePercent = (totalProfit / netInvestment) * 100;

  // Today's Change calculation
  const todaysChange = userData.holdings.reduce((total, holding) => {
    const stockInfo = stockData.find(
      (stock) => stock.ticker === holding.ticker,
    );
    return (
      total +
      (stockInfo
        ? (stockInfo.currentPrice - stockInfo.previousClose) * holding.shares
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

  // Portfolio Allocation data mapping
  const pieChartData = activePositions.map((holding) => {
    const stockInfo = stockData.find(
      (stock) => stock.ticker === holding.ticker,
    );

    return {
      name: holding.ticker,
      value: stockInfo ? stockInfo.currentPrice * holding.shares : 0,
    };
  });

  // Recent Performance data mapping
  const performanceData = userData.transactions
    .slice(-7)
    .map((transaction) => ({
      id: transaction.id,
      date: transaction.trade_date,
      value: transaction.price * (transaction.shares ?? 1),
      transactionType: transaction.transaction_type,
      fill: `var(--color-${transaction.transaction_type})`,
    }));

  const performanceChartConfig = {
    value: {
      label: "Transaction Value",
      color: "hsl(var(--chart-1))",
    },
    buy: {
      label: "Buy",
      color: "hsl(var(--chart-4))",
    },
    sell: {
      label: "Sell",
      color: "hsl(var(--chart-3))",
    },
    deposit: {
      label: "Deposit",
      color: "hsl(var(--chart-2))",
    },
    withdraw: {
      label: "Withdrawal",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  // Watchlist filtering
  const filteredWatchlist = userData?.watchlist.filter((element) => {
    const stockInfo = stockData.find(
      (stock) => stock.ticker === element.ticker,
    );

    return (
      stockInfo?.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stockInfo?.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stockInfo?.longName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mt-2 max-w-screen-2xl md:mt-6">
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
              extraText="from yesterday"
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
              Today&apos;s Change
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Portfolio Allocation</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Allocation",
                },
              }}
              className="h-[300px] w-full"
            >
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  label={({ payload, ...props }) => {
                    return (
                      <text
                        cx={props.cx}
                        cy={props.cy}
                        x={props.x}
                        y={props.y}
                        textAnchor={props.textAnchor}
                        dominantBaseline={props.dominantBaseline}
                      >
                        <tspan x={props.x} dy="0" fill={payload.fill}>
                          {payload.name}
                        </tspan>
                        <tspan
                          x={props.x}
                          dy="1.2em"
                          fill="hsla(var(--foreground))"
                        >
                          {moneyFormat(payload.value)}
                        </tspan>
                      </text>
                    );
                  }}
                  labelLine={false}
                  outerRadius={80}
                  fill="hsla(var(--foreground))"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(var(--chart-${(index + 1) % 5}))`}
                    />
                  ))}
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent hideLabel className="w-[150px]" />
                  }
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Recent Performance</CardTitle>
            <AreaChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={performanceChartConfig}
              className="h-[300px] w-full"
            >
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent className="w-[175px]" />}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  fill="var(--color-value)"
                  fillOpacity={0.2}
                  dot={({ payload, ...props }) => {
                    return (
                      <Dot
                        key={payload.id}
                        r={2}
                        cx={props.cx}
                        cy={props.cy}
                        fill={payload.fill}
                      />
                    );
                  }}
                  activeDot={({ payload, ...props }) => {
                    return (
                      <Dot
                        r={4}
                        cx={props.cx}
                        cy={props.cy}
                        fill={payload.fill}
                      />
                    );
                  }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

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
                    <TableCell className="flex flex-col font-medium">
                      <span>{element.ticker}</span>
                      <span className="text-xs font-thin">
                        {stockInfo?.shortName}
                      </span>
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
