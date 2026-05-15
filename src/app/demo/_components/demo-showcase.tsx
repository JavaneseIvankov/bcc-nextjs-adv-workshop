import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DemoMetric = {
  label: string;
  value: string;
};

type DemoShowcaseProps = {
  strategy: string;
  title: string;
  summary: string;
  notes: string[];
  metrics: DemoMetric[];
  interactiveSlot?: ReactNode;
  className?: string;
};

export function DemoShowcase({
  strategy,
  title,
  summary,
  notes,
  metrics,
  interactiveSlot,
  className,
}: DemoShowcaseProps) {
  return (
    <section className={cn("container py-10", className)}>
      <Card className="border bg-background/95 backdrop-blur-sm">
        <CardHeader className="border-b">
          <Badge variant="secondary">{strategy}</Badge>
          <CardTitle className="text-3xl tracking-tight normal-case">{title}</CardTitle>
          <CardDescription className="max-w-2xl">{summary}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 pt-8 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="border bg-muted/20 p-5"
              >
                <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-3 text-sm leading-relaxed">{metric.value}</p>
              </div>
            ))}
          </div>
          <div className="border bg-primary/[0.03] p-5">
            <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              What To Inspect
            </p>
            <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-muted-foreground">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </CardContent>
        {interactiveSlot ? (
          <CardFooter className="border-t pt-8">{interactiveSlot}</CardFooter>
        ) : null}
      </Card>
    </section>
  );
}
