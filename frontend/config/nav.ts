import { title } from "process";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  label?: string;
}
export interface MainNavItem extends NavItem {}

export interface DocsConfig {
  mainNav: MainNavItem[];
}

export const navConfig: DocsConfig = {
  mainNav: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Market", href: "/market" },
    { title: "Portfolio", href: "/portfolio" },
    { title: "Watchlist", href: "/watchlist" },
  ],
};
