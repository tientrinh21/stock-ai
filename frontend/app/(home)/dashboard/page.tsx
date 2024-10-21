"use client";

import { useAuthCheck } from "@/lib/auth-check";
import { Dashboard } from "./dashboard";

export default function DashboardPage() {
  useAuthCheck();
  return <Dashboard />;
}
