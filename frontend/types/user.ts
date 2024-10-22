import { Holding } from "@/types/holding";
import { Transaction } from "@/types/transaction";
import { WatchlistItem } from "@/types/watchlist";

export interface UserData {
  id: string;
  username: string;
  email: string;
  balance: number;
}

export interface UserDetailsData {
  user: UserData;
  holdings: Holding[];
  transactions: Transaction[];
  watchlist: WatchlistItem[];
}
