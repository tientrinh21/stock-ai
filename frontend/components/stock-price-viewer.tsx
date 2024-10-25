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
import { LoadingCard } from "@/components/loading-card";
import { XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";
import { subDays, format } from "date-fns";
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
} from "@/components/ui/select";
import { fetchStockPredictions, fetchStockPrice } from "@/lib/request";
import { toast } from "sonner";

interface StockPriceViewerProps {
  ticker: string;
}

export function StockPriceViewer({ ticker }: StockPriceViewerProps) {
  const [timeRange, setTimeRange] = useState("1W");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [showPrediction, setShowPrediction] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedModel, setSeletecedModel] = useState<string>();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [startDate, setStartDay] = useState<Date | undefined>(
    rangeToStartDate("1W"),
  );
  const [endDate, setEndDay] = useState<Date>(today);

  const [stockData, setStockData] = useState<
    { date: string; price: number; predictedPrice?: number }[]
  >([]);
  const [originStockData, setOriginStockData] = useState<
    { date: string; price: number; predictedPrice?: number }[]
  >([]);

  const mappedStockData = stockData.map(({ date, price, predictedPrice }) => ({
    date,
    price: !isNaN(price) ? price : undefined,
    predictedPrice,
  }));

  const filteredStockData = mappedStockData.filter(
    ({ date, predictedPrice }) => {
      const stockDate = new Date(date);
      stockDate.setHours(0, 0, 0, 0);

      if (predictedPrice) return true;
      if (!startDate) return stockDate <= endDate;

      return stockDate >= startDate && stockDate <= endDate;
    },
  );

  const fetchStockData = async () => {
    try {
      const stockPrice = await fetchStockPrice(ticker);
      const stockData = stockPrice.map((point) => ({
        date: point.trade_date,
        price: point.close_price,
      }));

      setStockData(stockData);
      setOriginStockData(stockData);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPredictionData = async (
    ticker: string,
    model: string,
    daysToPredict: number,
  ) => {
    const toastId = "predictToast";
    toast.loading("Making predictions...", { id: toastId });

    try {
      const predictedData = await fetchStockPredictions(
        ticker,
        model,
        daysToPredict,
      );
      const predictions = predictedData.map((point) => ({
        date: format(point.trade_date, "yyyy-MM-dd"),
        predictedPrice: point.predicted_price,
      }));

      toast.success("Done! I hope you find it helpful ^^", { id: toastId });
      return predictions;
    } catch (err) {
      toast.error("Something went wrong, please try again!", { id: toastId });
      console.error(err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchStockData();
    setShowPrediction(false);
  }, [ticker]);

  const handlePrediction = async () => {
    const daysToPredict = getDaysToPredict(timeRange);

    if (!selectedModel || selectedModel === "") {
      toast.error("Please select a model first");
      return;
    }

    if (daysToPredict > 0) {
      const predictions = await fetchPredictionData(
        ticker,
        selectedModel!,
        daysToPredict,
      );

      setStockData(() => {
        const newData = [...originStockData];
        predictions?.forEach((pred) => {
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
          <Select
            value={selectedModel}
            onValueChange={(value) => {
              setSeletecedModel(value);
              setShowPrediction(false);
              setStockData(originStockData);
            }}
          >
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
              (timeRange === "Custom" && (dateRange?.to ?? today) < today)
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
                  setStockData(originStockData);
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
                  setStartDay(newDateRange?.from);
                  setEndDay(newDateRange?.to ?? today);
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
              connectNulls={true}
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
                connectNulls={true}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
