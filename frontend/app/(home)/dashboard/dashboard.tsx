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
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  Activity,
  Search,
} from "lucide-react";
import { moneyFormat } from "@/lib/utils";
import { StockChange } from "@/components/stock-change";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  watchlist: {
    id: string;
    user_id: string;
    ticker: string;
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

  // const filteredHoldings = userData?.holdings.filter((holding) => {
  //   const stockInfo = stockData.find(
  //     (stock) => stock.ticker === holding.ticker,
  //   );
  //
  //   return (
  //     holding.shares > 0 &&
  //     (stockInfo?.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       stockInfo?.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       stockInfo?.longName.toLowerCase().includes(searchTerm.toLowerCase()))
  //   );
  // });

  // const holdingsWithCost = userData?.holdings.map((holding) => {
  //   if (holding.shares === 0) return;
  //
  //   // Get all buy transactions for this holding
  //   const buyTransactions = userData?.transactions.filter(
  //     (transaction) =>
  //       transaction.ticker === holding.ticker &&
  //       transaction.transaction_type === "buy",
  //   );
  //
  //   // Calculate total cost and total shares bought
  //   const totalCost = buyTransactions.reduce(
  //     (total, transaction) => total + transaction.price * transaction.shares,
  //     0,
  //   );
  //
  //   const totalSharesBought = buyTransactions.reduce(
  //     (total, transaction) => total + transaction.shares,
  //     0,
  //   );
  //
  //   // Calculate the average cost per share
  //   const averageCost =
  //     totalSharesBought > 0 ? totalCost / totalSharesBought : 0;
  //
  //   return {
  //     ticker: holding.ticker,
  //     totalCost,
  //     averageCost,
  //     shares: holding.shares,
  //   };
  // });

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
        const data: UserData = await response.json();
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

  // Total Profit calculation
  const totalInvestmentFromBuys = userData.transactions
    .filter((transaction) => transaction.transaction_type === "buy")
    .reduce(
      (total, transaction) => total + transaction.price * transaction.shares,
      0,
    );

  const totalProceedsFromSells = userData.transactions
    .filter((transaction) => transaction.transaction_type === "sell")
    .reduce(
      (total, transaction) => total + transaction.price * transaction.shares,
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

  // Portfolio Composition data mapping
  const pieChartData = activePositions.map((holding) => {
    const stockInfo = stockData.find(
      (stock) => stock.ticker === holding.ticker,
    );
    if (holding.shares === 0) return null;
    return {
      name: holding.ticker,
      value: stockInfo ? stockInfo.open * holding.shares : 0,
    };
  });

  // Recent Performance data mapping
  const performanceData = userData.transactions
    .slice(-7)
    .map((transaction) => ({
      date: transaction.trade_date,
      value: transaction.price * transaction.shares,
    }));

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
            <ChartContainer
              config={{
                value: {
                  label: "Allocation",
                  color: "hsl(var(--chart-1))",
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
                          ${payload.value}
                        </tspan>
                      </text>
                    );
                  }}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Transaction Value",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px] w-full"
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
                    <TableCell>
                      ${stockInfo?.previousClose.toFixed(2)}
                    </TableCell>
                    <TableCell>${stockInfo?.open.toFixed(2)}</TableCell>
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

      {/* <Card> */}
      {/*   <CardHeader className="space-y-3"> */}
      {/*     <CardTitle>Holdings</CardTitle> */}
      {/*     <div className="flex w-full max-w-sm items-center space-x-2"> */}
      {/*       <Input */}
      {/*         type="text" */}
      {/*         placeholder="Search stocks" */}
      {/*         value={searchTerm} */}
      {/*         onChange={(e) => setSearchTerm(e.target.value)} */}
      {/*       /> */}
      {/*       <Button type="submit" size="icon"> */}
      {/*         <Search className="h-4 w-4" /> */}
      {/*       </Button> */}
      {/*     </div> */}
      {/*   </CardHeader> */}
      {/*   <CardContent> */}
      {/*     <Table> */}
      {/*       <TableHeader> */}
      {/*         <TableRow> */}
      {/*           <TableHead>Ticker</TableHead> */}
      {/*           <TableHead>Shares</TableHead> */}
      {/*           <TableHead>Current Price</TableHead> */}
      {/*           <TableHead>Avg Cost</TableHead> */}
      {/*           <TableHead>Total Cost</TableHead> */}
      {/*           <TableHead>Market Value</TableHead> */}
      {/*           <TableHead>Change</TableHead> */}
      {/*         </TableRow> */}
      {/*       </TableHeader> */}
      {/*       <TableBody> */}
      {/*         {filteredHoldings?.map((holding) => { */}
      {/*           const stockInfo = stockData.find( */}
      {/*             (stock) => stock.ticker === holding.ticker, */}
      {/*           ); */}
      {/**/}
      {/*           const costInfo = holdingsWithCost?.find( */}
      {/*             (holdingWithCost) => */}
      {/*               holdingWithCost?.ticker === holding.ticker, */}
      {/*           ); */}
      {/**/}
      {/*           return ( */}
      {/*             <TableRow key={holding.id}> */}
      {/*               <TableCell className="flex flex-col font-medium"> */}
      {/*                 <span>{holding.ticker}</span> */}
      {/*                 <span className="text-xs font-thin"> */}
      {/*                   {stockInfo?.shortName} */}
      {/*                 </span> */}
      {/*               </TableCell> */}
      {/*               <TableCell>{holding.shares}</TableCell> */}
      {/*               <TableCell>${stockInfo?.open.toFixed(2)}</TableCell> */}
      {/*               <TableCell> */}
      {/*                 {holding.shares > 0 */}
      {/*                   ? `$${costInfo?.averageCost.toFixed(2)}` */}
      {/*                   : "--"} */}
      {/*               </TableCell> */}
      {/*               <TableCell> */}
      {/*                 {holding.shares > 0 */}
      {/*                   ? `$${costInfo?.totalCost.toLocaleString()}` */}
      {/*                   : "--"} */}
      {/*               </TableCell> */}
      {/*               <TableCell> */}
      {/*                 {holding.shares > 0 */}
      {/*                   ? `$${(stockInfo */}
      {/*                       ? stockInfo.open * holding.shares */}
      {/*                       : 0 */}
      {/*                     ).toLocaleString()}` */}
      {/*                   : "--"} */}
      {/*               </TableCell> */}
      {/*               <TableCell> */}
      {/*                 <span */}
      {/*                   className={ */}
      {/*                     stockInfo && stockInfo.change >= 0 */}
      {/*                       ? "text-green-600" */}
      {/*                       : "text-red-600" */}
      {/*                   } */}
      {/*                 > */}
      {/*                   {stockInfo && stockInfo.change >= 0 ? ( */}
      {/*                     <ArrowUpRight className="mr-1 inline" /> */}
      {/*                   ) : ( */}
      {/*                     <ArrowDownRight className="mr-1 inline" /> */}
      {/*                   )} */}
      {/*                   {stockInfo */}
      {/*                     ? Math.abs(stockInfo.changePercent).toFixed(2) */}
      {/*                     : 0} */}
      {/*                   % */}
      {/*                 </span> */}
      {/*               </TableCell> */}
      {/*             </TableRow> */}
      {/*           ); */}
      {/*         })} */}
      {/*       </TableBody> */}
      {/*     </Table> */}
      {/*   </CardContent> */}
      {/* </Card> */}
    </div>
  );
}
