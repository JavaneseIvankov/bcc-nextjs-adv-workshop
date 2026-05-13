"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type BrowserTimings = {
  initialHtmlReceivedAt: string;
  renderedAt: string;
  dataDisplayedAt: string;
};

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "long",
});

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

export default function SsrBrowserTimes() {
  const [timings, setTimings] = useState<BrowserTimings | null>(null);

  useEffect(() => {
    const initialHtmlReceivedAt = readInitialHtmlReceivedAt();
    const frame = window.requestAnimationFrame(() => {
      setTimings({
        initialHtmlReceivedAt,
        renderedAt: formatTimestamp(new Date()),
        dataDisplayedAt: initialHtmlReceivedAt,
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Browser Timing</CardTitle>
        <CardDescription>
          The payload already exists in the HTML response for this request.
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
              {timings ? timings.dataDisplayedAt : "Already in HTML; waiting for browser timing..."}
            </dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter>
        <p className="text-sm leading-relaxed text-muted-foreground">
          For SSR, data visibility tracks the initial document response because
          the HTML already includes the payload.
        </p>
      </CardFooter>
    </Card>
  );
}
