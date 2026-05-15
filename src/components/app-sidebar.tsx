import { auth } from "@/lib/auth";
import { userRepo } from "@/server/repositories";
import { HouseIcon, ShieldCheck, TicketIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "./logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export async function Sidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const role = session.user.role;

  return (
    <aside className="sticky top-4 hidden w-[220px] self-start lg:block">
      <div className="border bg-card p-2">
        <nav className="flex flex-col gap-1">
          <SidebarItem icon={<HouseIcon className="size-4" />} href="/" title="Home" />
          <SidebarItem
            icon={<TicketIcon className="size-4" />}
            href="/dashboard"
            title="My Reservations"
          />
          {role === "admin" ? (
            <SidebarItem
              icon={<ShieldCheck className="size-4" />}
              href="/admin"
              title="Admin"
            />
          ) : null}
        </nav>
      </div>

      <div className="mt-3 border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={session.user.image ?? ""} />
            <AvatarFallback>{session.user.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{session.user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {role ?? "user"}
            </p>
          </div>
        </div>
        <LogoutButton variant="outline" size="sm" className="mt-3 w-full" />
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  title,
  href,
}: {
  icon: ReactNode;
  title: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-primary/5"
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
}
