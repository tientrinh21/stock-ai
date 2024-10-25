"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";
import { addDays, subDays, format, parseISO } from "date-fns";
import { CalendarIcon, SparklesIcon } from "lucide-react";
import { cn, getDaysToPredict, rangeToStartDate } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { availableModels, periodOptions } from "@/config/stock-prediction";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { fetchStockPrice } from "@/lib/request";
import { LoadingCard } from "./loading-card";

// Simple linear regression for price prediction
const predictPrice = (
  data: { date: string; price: number }[],
  daysToPredict: number,
) => {
  const n = data.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0;

  data.forEach((point, index) => {
    sumX += index;
    sumY += point.price;
    sumXY += index * point.price;
    sumX2 += index * index;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const lastDataPoint = data[data.length - 1];
  const predictions = [
    { date: lastDataPoint.date, predictedPrice: lastDataPoint.price },
  ];

  for (let i = 1; i <= daysToPredict; i++) {
    const predictedPrice = slope * (n + i - 1) + intercept;
    const predictedDate = addDays(parseISO(lastDataPoint.date), i);
    predictions.push({
      date: format(predictedDate, "yyyy-MM-dd"),
      predictedPrice: parseFloat(predictedPrice.toFixed(2)),
    });
  }

  return predictions;
};

interface StockPriceViewerProps {
  ticker: string;
  customPredictionModel?: (
    data: { date: string; price: number }[],
    daysToPredict: number,
  ) => { date: string; predictedPrice: number }[];
}

export function StockPriceViewer({
  ticker,
  customPredictionModel,
}: StockPriceViewerProps) {
  const [timeRange, setTimeRange] = useState("1W");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [showPrediction, setShowPrediction] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date();
  const [startDate, setStartDay] = useState<Date | undefined>(
    rangeToStartDate("1W"),
  );
  const [endDate, setEndDay] = useState<Date>(today);

  const [stockData, setStockData] = useState<
    { date: string; price: number; predictedPrice?: number }[]
  >([]);

  const mappedStockData = stockData.map(({ date, price, predictedPrice }) => ({
    date,
    price: !isNaN(price) ? price : undefined,
    predictedPrice,
  }));

  const filteredStockData = stockData.filter(({ date }) => {
    const stockDate = new Date(date);
    if (!startDate) return stockDate.getTime() <= endDate.getTime();

    return (
      stockDate.getTime() >= startDate.getTime() &&
      stockDate.getTime() <= endDate.getTime()
    );
  });

  const fetchStockData = async () => {
    try {
      const stockPrice = await fetchStockPrice(ticker);
      const stockData = stockPrice.map((point) => ({
        date: point.trade_date,
        price: point.close_price,
        predictPrice: 0,
      }));
      setStockData(stockData);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchStockData();
    setShowPrediction(false);
  }, [ticker]);

  console.log(mappedStockData.slice(-5));

  const handlePrediction = () => {
    const daysToPredict = getDaysToPredict(timeRange);

    if (daysToPredict > 0) {
      const predictions = customPredictionModel
        ? customPredictionModel(stockData, daysToPredict)
        : predictPrice(stockData, daysToPredict);

      setStockData((prevData) => {
        const newData = [...prevData];
        predictions.forEach((pred) => {
          const index = newData.findIndex((d) => d.date === pred.date);
          if (index !== -1) {
            newData[index] = {
              ...newData[index],
              predictedPrice: pred.predictedPrice,
            };
          } else {
            newData.push({
              date: pred.date,
              price: NaN,
              predictedPrice: pred.predictedPrice,
            });
          }
        });
        return newData;
      });
      setShowPrediction(true);
    }
  };

  if (isLoading) return <LoadingCard />;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{ticker} Stock Price</CardTitle>
        <div className="flex gap-2.5">
          <Select>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availableModels.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            onClick={handlePrediction}
            disabled={
              showPrediction ||
              timeRange === "1D" ||
              (timeRange === "Custom" &&
                today.getTime() === dateRange?.to?.getTime())
            }
            className="group relative transform overflow-hidden bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 font-semibold text-white transition-all duration-200 ease-in-out hover:scale-110 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:shadow-lg"
          >
            <SparklesIcon className="h-4 w-4" />
            Predict
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex justify-between">
          <div className="flex space-x-2">
            {periodOptions.map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                onClick={() => {
                  setTimeRange(range);
                  setStartDay(rangeToStartDate(range));
                  setEndDay(today);
                  setShowPrediction(false);
                }}
                size={"sm"}
              >
                {range}
              </Button>
            ))}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "h-8 w-[280px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "yyyy-MM-dd")} ~{" "}
                      {format(dateRange.to, "yyyy-MM-dd")}
                    </>
                  ) : (
                    format(dateRange.from, "yyyy-MM-dd")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(newDateRange) => {
                  setDateRange(newDateRange);
                  setTimeRange("Custom");
                  setStartDay(dateRange?.from);
                  setEndDay(dateRange?.to ?? today);
                  setShowPrediction(false);
                }}
                numberOfMonths={2}
                disabled={{ after: today }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <ChartContainer
          config={{
            price: {
              label: "Stock Price",
              color: "hsl(var(--chart-1))",
            },
            predictedPrice: {
              label: "Predicted Price",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="aspect-auto h-[400px] w-full"
        >
          <AreaChart data={filteredStockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[175px]" />}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="var(--color-price)"
              strokeWidth={2}
              fillOpacity={0.2}
              connectNulls={false}
            />
            {showPrediction && (
              <Area
                type="monotone"
                dataKey="predictedPrice"
                label="predictedPrice"
                fill="var(--color-predictedPrice)"
                stroke="var(--color-predictedPrice)"
                strokeDasharray="3 3"
                strokeWidth={2}
                fillOpacity={0.2}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
