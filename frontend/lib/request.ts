import { StockData } from "@/types/stock";
import { UserDetailsData } from "@/types/user";

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
export const fetchStockData = async (userData: UserDetailsData) => {
  const stockPromises = userData.holdings.map(async (holding) => {
    const response = await fetch(`/api/stocks/${holding.ticker}/quote`);
    const quote: StockData = await response.json();
    return quote;
  });

  const stockDataResults = await Promise.all(stockPromises);
  return stockDataResults;
};
