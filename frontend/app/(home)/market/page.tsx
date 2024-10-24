"use client";

import { useAuthCheck } from "@/lib/auth-check";
import { Market } from "./market";

export default function MarketPage() {
  useAuthCheck();
  return <Market />;
}
