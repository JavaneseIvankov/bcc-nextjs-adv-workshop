import type { ReactNode } from "react";
import { DemoNav } from "./_components/demo-nav";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(26,26,26,0.03),transparent_24%),linear-gradient(90deg,rgba(26,26,26,0.04)_1px,transparent_1px),linear-gradient(rgba(26,26,26,0.04)_1px,transparent_1px)] bg-[size:auto,28px_28px,28px_28px]">
      <section className="border-b bg-background/90">
        <div className="container py-12">
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-muted-foreground">
            Dedicated Demo Segment
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight">
            Three routes, one UI shell, three different rendering boundaries.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            This segment stays separate from the public app chrome and focuses only on how
            Next.js 16 renders static server, dynamic server, and client routes.
          </p>
        </div>
      </section>
      <DemoNav />
      {children}
    </main>
  );
}
