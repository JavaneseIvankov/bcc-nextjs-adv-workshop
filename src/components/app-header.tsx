import Link from "next/link";
import { auth } from "@/lib/auth";
import { userRepo } from "@/server/repositories";
import { headers } from "next/headers";
import { LogoutButton } from "./logout-button";

export async function AppHeader() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session ? await userRepo.getRoleById(session.user.id) : null;

  return (
    <header className="border-b bg-background">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-bold">
          Evently
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/about" className="underline-offset-4 hover:underline">
            About
          </Link>
          {session && role !== "admin" ? (
            <Link href="/dashboard" className="underline-offset-4 hover:underline">
              My Reservations
            </Link>
          ) : null}
          {role === "admin" ? (
            <Link href="/admin" className="underline-offset-4 hover:underline">
              Admin
            </Link>
          ) : null}
          {!session ? (
            <Link href="/login" className="underline-offset-4 hover:underline">
              Login
            </Link>
          ) : (
            <LogoutButton
              variant="ghost"
              size="sm"
              className="h-auto px-0 text-sm font-normal tracking-normal normal-case underline-offset-4 hover:underline"
            />
          )}
        </nav>
      </div>
    </header>
  );
}
