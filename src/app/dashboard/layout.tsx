import { Sidebar } from "@/components/app-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";
import { Suspense } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mt-4 flex gap-6 lg:mt-8">
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
      <main className="min-h-[60vh] flex-1 border bg-background p-6">{children}</main>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <aside className="sticky top-4 hidden w-[220px] self-start lg:block">
      <div className="border bg-card p-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 border bg-card px-4 py-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-3 w-2/5" />
        </div>
      </div>
    </aside>
  );
}
