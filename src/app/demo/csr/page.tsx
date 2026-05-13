"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ClientPayload = {
  generatedAt: string;
  token: string;
  source: string;
  quote: string;
  inventoryCount: number;
};

type BrowserTimings = {
  initialHtmlReceivedAt: string;
  renderedAt: string;
  dataDisplayedAt: string | null;
};

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "long",
});

const quotes = [
  "Client data can only appear after hydration finishes.",
  "The browser now owns both data creation and rendering.",
  "This payload did not exist in the initial HTML response.",
];

function formatTimestamp(value: Date | number) {
  return timeFormatter.format(value);
}

function readInitialHtmlReceivedAt() {
  const navigationEntry = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming | undefined;

  if (!navigationEntry) {
    return "Browser timing unavailable";
  }

  return formatTimestamp(performance.timeOrigin + navigationEntry.responseEnd);
}

export default function CsrDemoPage() {
  const [payload, setPayload] = useState<ClientPayload | null>(null);
  const [timings, setTimings] = useState<BrowserTimings | null>(null);

  useEffect(() => {
    const initialHtmlReceivedAt = readInitialHtmlReceivedAt();
    const renderedAt = formatTimestamp(new Date());
    const frame = window.requestAnimationFrame(() => {
      setTimings({
        initialHtmlReceivedAt,
        renderedAt,
        dataDisplayedAt: null,
      });
    });

    const timer = window.setTimeout(() => {
      const generatedAt = formatTimestamp(new Date());

      setPayload({
        generatedAt,
        token: crypto.randomUUID().slice(0, 8),
        source: "Generated in useEffect after hydration",
        quote: quotes[Math.floor(Math.random() * quotes.length)],
        inventoryCount: 12 + Math.floor(Math.random() * 90),
      });


      setTimings({
        initialHtmlReceivedAt,
        renderedAt,
        dataDisplayedAt: formatTimestamp(new Date()),
      });
    }, 900);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 md:px-10">
      <div className="flex flex-col gap-3">
        <Badge>CSR</Badge>
        <h1 className="font-heading text-3xl font-semibold tracking-wider uppercase">
          Client-Side Rendering
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          This page is a client entrypoint. The initial HTML contains only the
          shell and placeholders. The payload is created later in the browser.
        </p>
      </div>

      <Alert>
        <AlertTitle>What should show up in page source</AlertTitle>
        <AlertDescription>
          You should see the card structure and loading placeholders, but not
          the payload token, quote, or generated timestamp.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Browser Timing</CardTitle>
            <CardDescription>
              These values are measured after the browser receives the document.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 border border-border p-4">
                <dt className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                  Initial HTML received at
                </dt>
                <dd className="font-mono text-sm">
                  {timings ? timings.initialHtmlReceivedAt : "Waiting for browser timing..."}
                </dd>
              </div>

              <div className="flex flex-col gap-1 border border-border p-4">
                <dt className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                  Rendered at
                </dt>
                <dd className="font-mono text-sm">
                  {timings ? timings.renderedAt : "Waiting for hydration..."}
                </dd>
              </div>

              <div className="flex flex-col gap-1 border border-border p-4">
                <dt className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                  Data displayed at
                </dt>
                <dd className="font-mono text-sm">
                  {timings?.dataDisplayedAt ?? "Payload not visible yet"}
                </dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            <p className="text-sm leading-relaxed text-muted-foreground">
              In CSR, the data appears strictly after hydration because the
              browser generates it.
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payload</CardTitle>
            <CardDescription>
              This card stays empty in the initial HTML response.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {payload ? (
              <dl className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 border border-border p-4">
                  <dt className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                    Generated at
                  </dt>
                  <dd className="font-mono text-sm">{payload.generatedAt}</dd>
                </div>
                <div className="flex flex-col gap-1 border border-border p-4">
                  <dt className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                    Token
                  </dt>
                  <dd className="font-mono text-sm">{payload.token}</dd>
                </div>
                <div className="flex flex-col gap-1 border border-border p-4">
                  <dt className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                    Source
                  </dt>
                  <dd className="text-sm leading-relaxed">{payload.source}</dd>
                </div>
                <div className="flex flex-col gap-1 border border-border p-4">
                  <dt className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                    Quote
                  </dt>
                  <dd className="text-sm leading-relaxed">{payload.quote}</dd>
                </div>
                <div className="flex flex-col gap-1 border border-border p-4">
                  <dt className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                    Inventory count
                  </dt>
                  <dd className="font-mono text-sm">{payload.inventoryCount}</dd>
                </div>
              </dl>
            ) : (
              <div className="flex flex-col gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <a href="/demo">Back to demos</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
