import { connection } from "next/server";
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
import SsrBrowserTimes from "./browser-times";

export const dynamic = "force-dynamic";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "long",
});

function formatTimestamp(value: Date) {
  return timeFormatter.format(value);
}

function createPayload() {
  return {
    generatedAt: formatTimestamp(new Date()),
    token: Math.random().toString(36).slice(2, 10),
    source: "Generated on the server for this request",
    quote: "Refresh the route and every payload value should change.",
    inventoryCount: 100 + Math.floor(Math.random() * 900),
  };
}

export default async function SsrDemoPage() {
  await connection();
  const payload = createPayload();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 md:px-10">
      <div className="flex flex-col gap-3">
        <Badge>SSR</Badge>
        <h1 className="font-heading text-3xl font-semibold tracking-wider uppercase">
          Server-Side Rendering
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          This route renders on the server for every request. The payload below
          is embedded directly in the HTML response.
        </p>
      </div>

      <Alert>
        <AlertTitle>What should show up in page source</AlertTitle>
        <AlertDescription>
          You should see the payload token, quote, count, and generated
          timestamp in the initial HTML. Refreshing the route should change all
          of them.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <SsrBrowserTimes />

        <Card>
          <CardHeader>
            <CardTitle>Payload</CardTitle>
            <CardDescription>
              Generated on the server during this request.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
