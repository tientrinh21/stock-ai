"use client";

import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn, moneyFormat } from "@/lib/utils";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { GitHubLogoIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth-context";
import { toast } from "sonner";
import { DollarSign, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function SiteHeader() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.info("Logged out");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MobileNav />
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-2 md:justify-end">
          <nav className="flex items-center">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "h-8 w-8 px-0",
                )}
              >
                <GitHubLogoIcon className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <ModeToggle />
            <div>
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white">
                      {user?.username}
                      <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="group flex justify-center focus:bg-transparent">
                      <DollarSign className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="font-semibold text-blue-500">
                        {moneyFormat(user?.balance ?? 0, "")}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="group flex justify-center"
                      onSelect={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4 group-hover:text-red-500" />
                      <span className="group-hover:text-red-500">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="ml-2 space-x-0.5">
                  <Link href="/login" passHref>
                    <Button variant="default" className="h-8">
                      Login
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    passHref
                    className="hidden md:inline-flex"
                  >
                    <Button
                      variant="secondary"
                      className="h-8 border border-neutral-300 hover:bg-neutral-200 dark:hover:bg-secondary/90"
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
