import { clsx, type ClassValue } from "clsx";
import { subWeeks, subMonths, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function moneyFormat(amount: number, currency: string = "$") {
  const formattedAmound = Math.abs(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sign = amount >= 0 ? "" : "-";

  return `${sign}${currency}${formattedAmound}`;
}

export function setStartDay(timeRange: string, dateRange?: DateRange) {
  let startDate: Date | undefined;
  let endDate = new Date();

  switch (timeRange) {
    case "1W":
      startDate = subWeeks(endDate, 1);
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
    case "All":
      startDate = undefined;
      break;
    case "Custom":
      startDate = dateRange?.from || subDays(endDate, 30);
      endDate = dateRange?.to || endDate;
      break;
    default:
      startDate = subDays(endDate, 30);
  }

  return startDate;
}
