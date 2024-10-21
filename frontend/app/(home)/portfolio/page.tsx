"use client";

import { useAuthCheck } from "@/lib/auth-check";
import { Portfolio } from "./portfolio";

export default function PortfolioPage() {
  useAuthCheck();
  return <Portfolio />;
}
