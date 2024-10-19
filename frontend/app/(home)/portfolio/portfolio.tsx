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
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  PieChart as PieChartIcon,
  TrendingDown,
} from "lucide-react";

const portfolioSummary = {
  totalValue: 52750.25,
  totalGain: 2750.25,
  totalGainPercentage: 5.5,
};

const portfolioHoldings = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    quantity: 50,
    avgCost: 130,
    currentPrice: 150.25,
    totalValue: 7512.5,
    gain: 1012.5,
    gainPercentage: 15.6,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    quantity: 10,
    avgCost: 2500,
    currentPrice: 2800.75,
    totalValue: 28007.5,
    gain: 3007.5,
    gainPercentage: 12.0,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    quantity: 30,
    avgCost: 280,
    currentPrice: 305.5,
    totalValue: 9165.0,
    gain: 765.0,
    gainPercentage: 9.1,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    quantity: 5,
    avgCost: 3100,
    currentPrice: 3320.0,
    totalValue: 16600.0,
    gain: 1100.0,
    gainPercentage: 7.1,
  },
];

const portfolioAllocation = [
  { name: "AAPL", value: 7512.5 },
  { name: "GOOGL", value: 28007.5 },
  { name: "MSFT", value: 9165.0 },
  { name: "AMZN", value: 16600.0 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function Portfolio() {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);

  const sortedHoldings = [...portfolioHoldings].sort((a, b) => {
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
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Portfolio</h1>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${portfolioSummary.totalValue.toLocaleString()}
            </div>
          </CardContent>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Gain/Loss
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${portfolioSummary.totalGain.toLocaleString()}
            </div>
            <p
              className={`text-xs ${portfolioSummary.totalGainPercentage >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {portfolioSummary.totalGainPercentage >= 0 ? (
                <ArrowUpRight className="inline h-4 w-4" />
              ) : (
                <ArrowDownRight className="inline h-4 w-4" />
              )}
              {Math.abs(portfolioSummary.totalGainPercentage)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AAPL</div>
            <p
              className={`text-xs ${2.5 >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {2.5 >= 0 ? (
                <ArrowUpRight className="inline h-4 w-4" />
              ) : (
                <ArrowDownRight className="inline h-4 w-4" />
              )}
              {Math.abs(2.5)}% today
            </p>
          </CardContent>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Worst Performer
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GOOGL</div>
            <p
              className={`text-xs ${-1.2 >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {-1.2 >= 0 ? (
                <ArrowUpRight className="inline h-4 w-4" />
              ) : (
                <ArrowDownRight className="inline h-4 w-4" />
              )}
              {Math.abs(-1.2)}% today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Portfolio Allocation
            </CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Allocation",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[200px] w-full"
            >
              <PieChart>
                <Pie
                  data={portfolioAllocation}
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
                          {payload.value}
                        </tspan>
                      </text>
                    );
                  }}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioAllocation.map((entry, index) => (
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
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("symbol")}
                >
                  Symbol
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  Name
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("quantity")}
                >
                  Quantity
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("avgCost")}
                >
                  Avg Cost
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("currentPrice")}
                >
                  Current Price
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("totalValue")}
                >
                  Total Value
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("gain")}
                >
                  Gain/Loss
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHoldings.map((holding) => (
                <TableRow key={holding.symbol}>
                  <TableCell className="font-medium">
                    {holding.symbol}
                  </TableCell>
                  <TableCell>{holding.name}</TableCell>
                  <TableCell>{holding.quantity}</TableCell>
                  <TableCell>${holding.avgCost.toFixed(2)}</TableCell>
                  <TableCell>${holding.currentPrice.toFixed(2)}</TableCell>
                  <TableCell>${holding.totalValue.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        holding.gain >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      ${holding.gain.toFixed(2)} ({holding.gainPercentage}%)
                    </span>
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
