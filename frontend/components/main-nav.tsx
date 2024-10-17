"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { navConfig } from "@/config/nav";
import { cn } from "@/lib/utils";
import { VercelLogoIcon } from "@radix-ui/react-icons";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
        <VercelLogoIcon className="h-6 w-6" />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {navConfig.mainNav.map(
          (item) =>
            item.href && (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60",
                )}
              >
                {item.title}
              </Link>
            ),
        )}
      </nav>
    </div>
  );
}
