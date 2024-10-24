import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { StockPrice } from "@/types/stock";
import { Loader2 } from "lucide-react";
import { fetchStockPrice } from "@/lib/request";
import { StockChange } from "./stock-change";
import { moneyFormat } from "@/lib/utils";

export function MarketIndexCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [marketIndex, setMarketIndex] = useState<StockPrice[]>([]);

  const fetchData = async () => {
    try {
      const stockPrice = await fetchStockPrice("^GSPC");
      setMarketIndex(stockPrice);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const marketOverviewData = marketIndex.map((item) => ({
    date: item.trade_date,
    value: item.close_price,
  }));

  const lastPrice = marketIndex.at(-1)?.close_price ?? 0;
  const secondLastPrice = marketIndex.at(-2)?.close_price ?? 0;
  const changePercent = (lastPrice / secondLastPrice - 1) * 100;

  if (isLoading)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Index</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] w-full items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle>Market Index</CardTitle>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold">
            {moneyFormat(lastPrice, "")}
          </span>
          <StockChange change={changePercent} unit="%" className="text-sm" />
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer
          config={{
            value: {
              label: "S&P 500",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-full w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={marketOverviewData}>
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
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
