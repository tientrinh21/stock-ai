export interface Transaction {
  id: string;
  user_id: string;
  transaction_type: string;
  ticker?: string;
  shares?: number;
  price: number;
  trade_date: string;
}
