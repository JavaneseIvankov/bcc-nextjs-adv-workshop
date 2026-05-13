import type { EventItem } from "@/app/types";
import { Price, PriceValue } from "@/components/shadcnblocks/price";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface EventDetailProps {
  event: EventItem;
  className?: string;
}

const EventDetail = ({ event, className }: EventDetailProps) => {
  const { name, date, description, image, badge, price } = event;
  const hasSalePrice = price.sale != null;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <div className="overflow-hidden  border bg-muted/30">
            <AspectRatio ratio={1.2}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                unoptimized
                className="block size-full object-cover object-center"
              />
            </AspectRatio>
          </div>

          <div className="space-y-8">
            <div className="space-y-5">
              {badge?.text ? (
                <Badge variant="secondary" className="w-fit">
                  {badge.text}
                </Badge>
              ) : null}

              <div className="space-y-3">
                <p className="text-sm font-medium tracking-[0.18em] text-muted-foreground uppercase">
                  Event reservation
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-balance lg:text-5xl">
                  {name}
                </h1>
                <p className="text-base font-medium text-muted-foreground">
                  {date}
                </p>
              </div>

              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                {description}
              </p>
            </div>

            <div className=" border bg-card p-6">
              <p className="text-sm font-medium tracking-[0.18em] text-muted-foreground uppercase">
                Ticket price
              </p>
              <Price
                onSale={hasSalePrice}
                className="mt-3 text-3xl font-semibold tracking-tight"
              >
                <PriceValue
                  price={price.sale}
                  currency={price.currency}
                  variant="sale"
                />
                <PriceValue
                  price={price.regular}
                  currency={price.currency}
                  variant="regular"
                />
              </Price>

              <div className="mt-6 grid gap-4 border-t pt-6 sm:grid-cols-2">
                <DetailItem label="Schedule" value={date} />
                <DetailItem
                  label="Reservation"
                  value={badge?.text ?? "Open for booking"}
                />
              </div>
            </div>

            <Button size="lg" className="w-full sm:w-auto" asChild>
               <Link href={`/checkout/${event.slug}`}>
                  Reserve Now
               </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-semibold">{value}</p>
    </div>
  );
};

export { EventDetail, EventDetail as ProductDetail };
