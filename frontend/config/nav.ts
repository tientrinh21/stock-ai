import { MainNavItem } from "@/types/nav";

export interface NavConfig {
  mainNav: MainNavItem[];
}

export const navConfig: NavConfig = {
  mainNav: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Market", href: "/market" },
    { title: "Portfolio", href: "/portfolio" },
    { title: "Watchlist", href: "/watchlist" },
  ],
};
