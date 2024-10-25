export interface StockQuote {
  ticker: string;
  shortName: string;
  longName: string;
  open: number;
  previousClose: number;
  currentPrice: number;
  change: number;
  changePercent: number;
}

export interface StockPrice {
  id: string;
  high_price: number;
  ticker: string;
  open_price: number;
  close_price: number;
  trade_date: string;
  low_price: number;
  volume: number;
}

export interface StockPrediction {
  trade_date: string;
  predicted_price: number;
  ticker: string;
  model: string;
}
