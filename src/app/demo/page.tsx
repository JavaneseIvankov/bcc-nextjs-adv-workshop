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

const demos = [
  {
    href: "/demo/csr",
    title: "CSR",
    badge: "Client-Side Rendering",
    description:
      "The page shell arrives first. The payload appears later in the browser after hydration.",
  },
  {
    href: "/demo/ssr",
    title: "SSR",
    badge: "Server-Side Rendering",
    description:
      "The server generates fresh payload data on every request and includes it in the HTML response.",
  },
  {
    href: "/demo/ssg",
    title: "SSG",
    badge: "Static Site Generation",
    description:
      "The payload is generated during prerender/build time and stays stable until the site is rebuilt.",
  },
];

export default function DemoIndexPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 md:px-10">
      <div className="flex flex-col gap-3">
        <Badge variant="secondary">Rendering Demo</Badge>
        <h1 className="font-heading text-3xl font-semibold tracking-wider uppercase">
          Compare First-Load Rendering
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Open each route with a full page load, then inspect Network and View
          Source. The pages intentionally duplicate structure so their initial
          HTML stays easy to compare.
        </p>
      </div>

      <Alert>
        <AlertTitle>How to inspect the difference</AlertTitle>
        <AlertDescription>
          Use normal anchor navigation or paste the route directly into the
          address bar. That keeps the document request visible and makes the
          browser timing rows meaningful.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-3">
        {demos.map((demo) => (
          <Card key={demo.href}>
            <CardHeader>
              <CardTitle>{demo.title}</CardTitle>
              <CardDescription>{demo.badge}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {demo.description}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <a href={demo.href}>Open {demo.title}</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
