import { format, startOfYesterday } from "date-fns";

import { StockPrice, StockQuote } from "@/types/stock";
import { UserDetailsData } from "@/types/user";
import { WatchlistItem } from "@/types/watchlist";
import { TransactionFormSchema } from "@/types/form-schema";

export const fetchUserDetails = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("/api/users/details", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  const data: UserDetailsData = await response.json();
  return data;
};

export const fetchStockQuotes = async (tickers: string[]) => {
  const stockPromises = tickers.map(async (ticker) => {
    const response = await fetch(`/api/stocks/${ticker}/quote`);
    const quote: StockQuote = await response.json();
    return quote;
  });

  const data: StockQuote[] = await Promise.all(stockPromises);
  return data;
};

export const fetchStockPrice = async (
  ticker: string,
  startDate?: Date,
  endDate?: Date,
) => {
  const querySymbol = startDate || endDate ? "?" : "";
  const andSymbol = startDate && endDate ? "&" : "";
  const startDateString = startDate ? format(startDate, "yyyy-MM-dd") : "";
  const endDateString = endDate ? format(endDate, "yyyy-MM-dd") : "";

  const queryString = `${querySymbol}${startDateString}${andSymbol}${endDateString}`;

  const response = await fetch(`/api/stocks/${ticker}${queryString}`);

  if (!response.ok) {
    throw new Error("Failed to fetch stock data");
  }

  const data: StockPrice[] = await response.json();
  return data;
};

export const fetchTopStocks = async () => {
  const response = await fetch(`/api/top-stocks`);

  if (!response.ok) {
    throw new Error("Failed to fetch top stocks");
  }

  const data: StockQuote[] = await response.json();
  return data;
};

export const fetchWatchlist = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("/api/watchlist", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch watchlist data");
  }

  const data: WatchlistItem[] = await response.json();
  return data;
};

export const addToWatchList = async (ticker: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`/api/watchlist?ticker=${ticker}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const removeFromWatchList = async (ticker: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`/api/watchlist/${ticker}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const createTransaction = async (values: TransactionFormSchema) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      transaction_type: values.transactionType,
      trade_date: format(values.date, "yyyy-MM-dd"),
      price: values.price,
      ticker: values.ticker,
      shares: values.shares,
    }),
  });

  return response;
};
