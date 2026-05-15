"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/demo", label: "Overview" },
  { href: "/demo/static", label: "Static" },
  { href: "/demo/dynamic", label: "Dynamic" },
  { href: "/demo/client", label: "Client" },
];

export function DemoNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Demo navigation" className="border-y">
      <div className="container flex flex-wrap gap-x-6 gap-y-3 py-4">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xs font-semibold tracking-[0.2em] uppercase transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
