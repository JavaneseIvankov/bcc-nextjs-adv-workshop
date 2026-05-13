import type { ReactNode } from "react";
import { Suspense } from "react";
import { AppHeader } from "@/components/app-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={<HeaderFallback />}>
        <AppHeader />
      </Suspense>
      {children}
    </>
  );
}

function HeaderFallback() {
  return (
    <header className="border-b bg-background">
      <div className="container flex items-center justify-between py-4">
        <Skeleton className="h-8 w-28" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </header>
  );
}
