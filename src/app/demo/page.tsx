import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    href: "/demo/static",
    title: "Static Server Component",
    description:
      "A cached server render that keeps the same timestamp and fingerprint until invalidation.",
  },
  {
    href: "/demo/dynamic",
    title: "Dynamic Server Component",
    description:
      "A request-time server render that becomes dynamic by reading headers() inside the page.",
  },
  {
    href: "/demo/client",
    title: "Client Component",
    description:
      "A prerendered client route that hydrates in the browser and exposes interactive state.",
  },
];

export default function DemoIndexPage() {
  return (
    <section className="container py-10">
      <div className="grid gap-6 lg:grid-cols-3">
        {demos.map((demo) => (
          <Card key={demo.href} className="border">
            <CardHeader className="border-b">
              <CardTitle className="text-2xl tracking-tight normal-case">{demo.title}</CardTitle>
              <CardDescription>{demo.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <p className="text-sm leading-relaxed text-muted-foreground">
                The internal layout stays constant so the rendering behavior is the only variable
                you need to compare.
              </p>
            </CardContent>
            <CardFooter className="border-t pt-8">
              <Button asChild className="w-full justify-between">
                <Link href={demo.href}>
                  Open demo
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
