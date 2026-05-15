"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ClientDemoPanel() {
  const [count, setCount] = useState(0);
  const [hydratedAt, setHydratedAt] = useState("Waiting for hydration...");

  useEffect(() => {
    setHydratedAt(new Date().toLocaleTimeString("en-US"));
  }, []);

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
          Client Interaction
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Hydrated at {hydratedAt}. The counter only changes in the browser.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="border px-4 py-2 text-sm font-semibold tracking-[0.2em] uppercase">
          Count {count}
        </span>
        <Button type="button" onClick={() => setCount((value) => value + 1)}>
          Increment
        </Button>
      </div>
    </div>
  );
}
