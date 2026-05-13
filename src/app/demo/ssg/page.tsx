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
import SsgBrowserTimes from "./browser-times";

export const dynamic = "error";

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
    source: "Generated during static prerender/build",
    quote: "Refresh the route in production and these payload values stay fixed until rebuild.",
    inventoryCount: 300 + Math.floor(Math.random() * 400),
  };
}

export default function SsgDemoPage() {
  const payload = createPayload();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 md:px-10">
      <div className="flex flex-col gap-3">
        <Badge>SSG</Badge>
        <h1 className="font-heading text-3xl font-semibold tracking-wider uppercase">
          Static Site Generation
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          This route is intended to be prerendered ahead of time. The payload
          below is generated during the build and reused until the site is
          rebuilt.
        </p>
      </div>

      <Alert>
        <AlertTitle>Production verification matters here</AlertTitle>
        <AlertDescription>
          Next.js renders on demand in development. To confirm true static
          behavior, check this route with <code>pnpm build</code> and{" "}
          <code>pnpm start</code>.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <SsgBrowserTimes />

        <Card>
          <CardHeader>
            <CardTitle>Payload</CardTitle>
            <CardDescription>
              Prerendered into the HTML ahead of time.
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
