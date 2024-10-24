"use client";

import { FetchErrorAlert } from "@/components/fetch-error-alert";
import { SpinnerLoading } from "@/components/spinner-loading";
import { StockChange } from "@/components/stock-change";
import { TransactionDialog } from "@/components/transaction-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
import { moneyFormat } from "@/lib/utils";
import { StockData } from "@/types/stock";
import { UserDetailsData } from "@/types/user";
import {
  Activity,
  AreaChartIcon,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  DollarSign,
  PieChart as PieChartIcon,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Dot,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

export function Portfolio() {
  const [userData, setUserData] = useState<UserDetailsData | null>(null);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAllPerformance, setShowAllPerformace] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const response = await fetch("/api/users/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data: UserDetailsData = await response.json();
        setUserData(data);

        // Fetch real-time stock data for holdings
        const stockPromises = data.holdings.map(async (holding) => {
          const response = await fetch(`/api/stocks/${holding.ticker}/quote`);
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

  if (isLoading) return <SpinnerLoading />;
  if (error || !userData) return <FetchErrorAlert error={error} />;

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

  // Best and Worst Performer by Percentage Change
  const bestPerformer = stockData.reduce((best: StockData | null, stock) => {
    const holding = userData.holdings.find((h) => h.ticker === stock.ticker);
    if (!holding || holding.shares === 0) return best;
    return stock.changePercent > (best?.changePercent || -Infinity)
      ? stock
      : best;
  }, null);

  const worstPerformer = stockData.reduce((worst: StockData | null, stock) => {
    const holding = userData.holdings.find((h) => h.ticker === stock.ticker);
    if (!holding) return worst;
    return stock.changePercent < (worst?.changePercent || Infinity)
      ? stock
      : worst;
  }, null);

  // Portfolio Allocation data mapping
  const pieChartData = activePositions.map((holding) => {
    const stockInfo = stockData.find(
      (stock) => stock.ticker === holding.ticker,
    );

    return {
      name: holding.ticker,
      value: stockInfo ? stockInfo.open * holding.shares : 0,
    };
  });

  // Recent Performance data mapping
  const performanceData = userData.transactions
    .slice(showAllPerformance ? 0 : -7)
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

  // Holdings calculation
  const filteredHoldings = userData?.holdings.filter((holding) => {
    const stockInfo = stockData.find(
      (stock) => stock.ticker === holding.ticker,
    );

    return (
      holding.shares > 0 &&
      (stockInfo?.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stockInfo?.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stockInfo?.longName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const calculatedHoldings = filteredHoldings.map((holding) => {
    // Get all buy transactions for this holding
    const buyTransactions = userData?.transactions.filter(
      (transaction) =>
        transaction.ticker === holding.ticker &&
        transaction.transaction_type === "buy",
    );

    // Calculate total cost and total shares bought
    const totalCost = buyTransactions.reduce(
      (total, transaction) => total + transaction.price * transaction.shares!,
      0,
    );

    const totalSharesBought = buyTransactions.reduce(
      (total, transaction) => total + transaction.shares!,
      0,
    );

    // Calculate the average cost per share
    const averageCost =
      totalSharesBought > 0 ? totalCost / totalSharesBought : 0;

    const stockInfo = stockData.find(
      (stock) => stock.ticker === holding.ticker,
    );

    const marketValue = stockInfo ? stockInfo.open * holding.shares : -Infinity;
    const gain = marketValue ? marketValue - totalCost : -Infinity;

    return {
      ticker: holding.ticker,
      shortName: stockInfo ? stockInfo.shortName : "",
      shares: holding.shares,
      open: stockInfo ? stockInfo.open : -Infinity,
      averageCost,
      totalCost,
      marketValue,
      gain,
    };
  });

  // Holdings table column sorting
  const sortedHoldings = [...calculatedHoldings].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];
    if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container mt-2 max-w-screen-2xl md:mt-6">
      <h1 className="mb-6 text-3xl font-bold">Portfolio</h1>

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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
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
              className="aspect-auto h-[220px] w-full"
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <CardTitle>Top/Worst</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            {bestPerformer!.change >= 0 ? (
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bestPerformer!.ticker}</div>
            <StockChange
              change={bestPerformer!.change}
              percentChange={bestPerformer!.changePercent}
              extraText="from yesterday"
            />
          </CardContent>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Worst Performer
            </CardTitle>
            {worstPerformer!.change >= 0 ? (
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{worstPerformer!.ticker}</div>
            <StockChange
              change={worstPerformer!.change}
              percentChange={worstPerformer!.changePercent}
              extraText="from yesterday"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <CardTitle>Recent Performance</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="show-all" className="text-xs">
                  Show all
                </Label>
                <Switch
                  id="show-all"
                  checked={showAllPerformance}
                  onCheckedChange={setShowAllPerformace}
                />
              </div>
              <AreaChartIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={performanceChartConfig}
              className="aspect-auto h-[300px] w-full"
            >
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[175px]"
                      nameKey="transactionType"
                    />
                  }
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
          <CardTitle>Holdings</CardTitle>
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
                <SortingTableHead
                  sortKey="ticker"
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                >
                  Ticker
                </SortingTableHead>
                <SortingTableHead
                  sortKey="shares"
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                >
                  Shares
                </SortingTableHead>
                <SortingTableHead
                  sortKey="open"
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                >
                  Current Price
                </SortingTableHead>
                <SortingTableHead
                  sortKey="averageCost"
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                >
                  Avg Cost
                </SortingTableHead>
                <SortingTableHead
                  sortKey="totalCost"
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                >
                  Total Cost
                </SortingTableHead>
                <SortingTableHead
                  sortKey="marketValue"
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                >
                  Market Value
                </SortingTableHead>
                <SortingTableHead
                  sortKey="gain"
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                >
                  Gain/Loss
                </SortingTableHead>

                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHoldings?.map((holding) => {
                return (
                  <TableRow key={holding.ticker}>
                    <TableCell className="font-medium md:hidden">
                      <div className="flex flex-col justify-center">
                        <span>{holding.ticker}</span>
                        <span className="text-xs font-thin">
                          {holding.shortName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{holding.shares}</TableCell>
                    <TableCell>
                      {holding.shares > 0 && holding.open !== -Infinity
                        ? moneyFormat(holding.open)
                        : "--"}
                    </TableCell>
                    <TableCell>
                      {holding.shares > 0 && holding.averageCost !== -Infinity
                        ? moneyFormat(holding.averageCost)
                        : "--"}
                    </TableCell>
                    <TableCell>
                      {holding.shares > 0 && holding.totalCost !== -Infinity
                        ? moneyFormat(holding.totalCost)
                        : "--"}
                    </TableCell>
                    <TableCell>
                      {holding.shares > 0 && holding.marketValue !== -Infinity
                        ? moneyFormat(holding.marketValue)
                        : "--"}
                    </TableCell>
                    <TableCell>
                      {holding.shares > 0 &&
                      holding.gain !== -Infinity &&
                      holding.totalCost !== -Infinity ? (
                        <StockChange
                          change={holding.gain}
                          percentChange={holding.gain / holding.totalCost}
                          className="text-sm"
                        />
                      ) : (
                        "--"
                      )}
                    </TableCell>
                    <TableCell>
                      <TransactionDialog ticker={holding.ticker} size="icon" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TransactionDialog className="fixed bottom-5 right-5" />
    </div>
  );
}

interface ISortingTableHead {
  sortKey: string;
  children: React.ReactNode;
  sortConfig: {
    key: string;
    direction: "ascending" | "descending";
  } | null;
  requestSort: (key: string) => void;
}

function SortingTableHead({
  children,
  sortKey,
  sortConfig,
  requestSort,
}: ISortingTableHead) {
  return (
    <TableHead
      className="cursor-pointer hover:bg-secondary"
      onClick={() => requestSort(sortKey)}
    >
      <div className="flex items-end justify-between">
        {children}

        {sortConfig && sortConfig.key === sortKey ? (
          sortConfig.direction === "ascending" ? (
            <ArrowDownWideNarrow className="h-4 w-4" />
          ) : (
            <ArrowUpNarrowWide className="h-4 w-4" />
          )
        ) : null}
      </div>
    </TableHead>
  );
}
