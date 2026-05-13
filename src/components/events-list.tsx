import { EventItem } from "@/app/types";
import { Price, PriceValue } from "@/components/shadcnblocks/price";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

type EventCardProps = EventItem;

interface EventsListProps {
  eventsList: EventItem[];
  className?: string;
}

const EventsList = ({ className, eventsList }: EventsListProps) => {
  return (
     <section className={cn('py-6', className)}>
        <div className="container">
           <div className="grid place-items-center gap-6 md:grid-cols-2 xl:grid-cols-3">
              {eventsList.map((item, index) => (
                 <EventCard key={`events-list-${index}`} {...item} />
              ))}
           </div>
        </div>
     </section>
  );
};

const EventCard = ({
   name,
   date,
   description,
   slug,
   image,
   badge,
   price,
}: EventCardProps) => {
   const { regular, sale, currency } = price;

   return (
      <a
         href={`/events/${slug}`}
         className="block h-full w-full max-w-md transition-opacity hover:opacity-80"
      >
         <Card className="h-full overflow-hidden p-0">
            <CardHeader className="relative block p-0">
               <AspectRatio ratio={1.268115942} className="overflow-hidden">
                  <Image
                     src={image.src}
                     alt={image.alt}
                     fill
                     sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                     unoptimized
                     className="block size-full object-cover object-center"
                  />
               </AspectRatio>
            </CardHeader>
            <CardContent className="flex h-full flex-col gap-4 pb-6">
               <div className="flex flex-col gap-1">
                  <CardTitle className="text-xl font-semibold">
                     {name}
                  </CardTitle>
                  <p className="text-sm font-medium text-muted-foreground">
                     {date}
                  </p>
               </div>
               <CardDescription className="font-medium text-muted-foreground">
                  {description}
               </CardDescription>
               <div className="mt-auto">
                  <Price
                     onSale={sale != null}
                     className="text-lg font-semibold"
                  >
                     <PriceValue
                        price={sale}
                        currency={currency}
                        variant="sale"
                     />
                     <PriceValue
                        price={regular}
                        currency={currency}
                        variant="regular"
                     />
                  </Price>
               </div>
            </CardContent>
         </Card>
      </a>
   );
};

export { EventsList };
