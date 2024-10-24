import { format } from "date-fns";

import { StockData } from "@/types/stock";
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

// Fetch real-time stock data for holdings
export const fetchStockData = async (tickers: string[]) => {
  const stockPromises = tickers.map(async (ticker) => {
    const response = await fetch(`/api/stocks/${ticker}/quote`);
    const quote: StockData = await response.json();
    return quote;
  });

  const stockDataResults = await Promise.all(stockPromises);
  return stockDataResults;
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
