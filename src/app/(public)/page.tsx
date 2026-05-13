import { EventsListContainer } from "@/containers/events-list-container";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="border-b bg-muted/30">
        <div className="container py-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
            BCC Next.js Advanced Workshop
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight">
            One small app, seven core Next.js concepts.
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Browse an event, sign in, book a ticket, pay with Midtrans, then
            check your reservation. Admins can create events and view earnings.
          </p>
          <ol className="mt-6 grid gap-2 text-sm text-muted-foreground">
            <li>1. `/about` demonstrates a static server page.</li>
            <li>2. `/dashboard` demonstrates a dynamic server page.</li>
            <li>3. Login and checkout demonstrate client components.</li>
          </ol>
        </div>
      </section>
      <Suspense fallback={<EventsListSkeleton />}>
        <EventsListContainer />
      </Suspense>
    </main>
  );
}

function EventsListSkeleton() {
  return (
    <section className="py-6">
      <div className="container">
        <div className="grid place-items-center gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="w-full max-w-md border p-0">
              <Skeleton className="aspect-[1.268115942/1] w-full" />
              <div className="flex flex-col gap-3 p-6">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-7 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
