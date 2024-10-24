import { cn, moneyFormat } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function StockChange({
  change,
  percentChange,
  unit = "$",
  extraText = "",
  className,
}: {
  change: number;
  percentChange?: number;
  unit?: string;
  extraText?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-xs",
        change >= 0 ? "text-green-600" : "text-red-600",
        className,
      )}
    >
      <div className="inline-flex items-baseline">
        {change >= 0 ? (
          <ArrowUpRight className="inline h-4 w-4 place-self-center" />
        ) : (
          <ArrowDownRight className="inline h-4 w-4 place-self-end" />
        )}
        <span>
          {moneyFormat(Math.abs(change), unit !== "%" ? unit : "")}
          {unit === "%" && unit}
        </span>
      </div>
      <span>
        {percentChange ? ` (${Math.abs(percentChange).toFixed(2)}%)` : ""}
      </span>

      <span className="text-muted-foreground">
        {extraText ? ` ${extraText}` : ""}
      </span>
    </span>
  );
}
