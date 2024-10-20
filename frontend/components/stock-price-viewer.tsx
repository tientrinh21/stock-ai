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
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  addDays,
  subDays,
  subMonths,
  format,
  differenceInDays,
  parseISO,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock function to generate stock data
const generateStockData = (startDate: Date, endDate: Date) => {
  const data = [];
  let currentDate = startDate;
  let price = 100; // Starting price

  while (currentDate <= endDate) {
    price += (Math.random() - 0.5) * 5; // Random price change
    data.push({
      date: format(currentDate, "yyyy-MM-dd"),
      price: parseFloat(price.toFixed(2)),
    });
    currentDate = addDays(currentDate, 1);
  }
  return data;
};

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

  const predictions = [];
  const lastDataPoint = data[data.length - 1];
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
  symbol: string;
  customPredictionModel?: (
    data: { date: string; price: number }[],
    daysToPredict: number,
  ) => { date: string; predictedPrice: number }[];
}

export function StockPriceViewer({
  symbol,
  customPredictionModel,
}: StockPriceViewerProps) {
  const [timeRange, setTimeRange] = useState("1D");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [stockData, setStockData] = useState<
    { date: string; price: number; predictedPrice?: number }[]
  >([]);
  const [showPrediction, setShowPrediction] = useState(false);

  useEffect(() => {
    let startDate: Date;
    let endDate = new Date();

    switch (timeRange) {
      case "1D":
        startDate = subDays(endDate, 1);
        break;
      case "5D":
        startDate = subDays(endDate, 5);
        break;
      case "1M":
        startDate = subMonths(endDate, 1);
        break;
      case "6M":
        startDate = subMonths(endDate, 6);
        break;
      case "1Y":
        startDate = subMonths(endDate, 12);
        break;
      case "Custom":
        startDate = dateRange.from || subDays(endDate, 30);
        endDate = dateRange.to || endDate;
        break;
      default:
        startDate = subDays(endDate, 30);
    }

    const newData = generateStockData(startDate, endDate);
    setStockData(newData);
    setShowPrediction(false);
  }, [timeRange, dateRange]);

  const handlePrediction = () => {
    let daysToPredict: number;

    switch (timeRange) {
      case "5D":
        daysToPredict = 1;
        break;
      case "1M":
        daysToPredict = 7;
        break;
      case "6M":
      case "1Y":
        daysToPredict = 30;
        break;
      case "Custom":
        daysToPredict = Math.min(
          30,
          Math.max(
            7,
            Math.floor(
              differenceInDays(
                dateRange.to || new Date(),
                dateRange.from || subDays(new Date(), 30),
              ) / 4,
            ),
          ),
        );
        break;
      default:
        daysToPredict = 0;
    }

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPrediction = !isNaN(data.predictedPrice);
      return (
        <div className="rounded border border-gray-300 bg-white p-2 shadow">
          <p className="label">{`Date: ${label}`}</p>
          <p
            className="value"
            style={{
              color: isPrediction
                ? "var(--color-prediction)"
                : "var(--color-price)",
            }}
          >
            {`${isPrediction ? "Predicted " : ""}Price: $${isPrediction ? data.predictedPrice.toFixed(2) : data.price.toFixed(2)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{symbol} Stock Price</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(newDateRange) => {
                  setDateRange(newDateRange);
                  setTimeRange("Custom");
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between">
          <div className="flex space-x-2">
            {["1D", "5D", "1M", "6M", "1Y"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
          <Button
            onClick={handlePrediction}
            disabled={showPrediction || timeRange === "1D"}
          >
            Predict Future Prices
          </Button>
        </div>
        <ChartContainer
          config={{
            price: {
              label: "Stock Price",
              color: "hsl(var(--chart-1))",
            },
            prediction: {
              label: "Predicted Price",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="var(--color-price)"
                strokeWidth={2}
                dot={false}
              />
              {showPrediction && (
                <Line
                  type="monotone"
                  dataKey="predictedPrice"
                  stroke="var(--color-prediction)"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
