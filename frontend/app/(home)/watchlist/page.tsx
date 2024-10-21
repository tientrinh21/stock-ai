"use client";

import { useAuthCheck } from "@/lib/auth-check";
import { Watchlist } from "./watchlist";

export default function WatchlistPage() {
  useAuthCheck();
  return <Watchlist />;
}
