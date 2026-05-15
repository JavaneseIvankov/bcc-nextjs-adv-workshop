import type { Metadata } from "next";
import { ProductDetail } from "@/components/product-detail";
import { Skeleton } from "@/components/ui/skeleton";
import { getCachedEventDetail } from "@/server/event-queries";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getCachedEventDetail(slug);

  if (!event) {
    return {
      title: "Event not found",
    };
  }

  return {
    title: event.name,
    description: event.description,
    openGraph: {
      title: event.name,
      description: event.description,
      images: [
        {
          url: event.image.src,
          alt: event.image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.name,
      description: event.description,
      images: [event.image.src],
    },
  };
}

export default function EventDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<EventDetailSkeleton />}>
      <EventDetailContent params={params} />
    </Suspense>
  );
}

async function EventDetailContent({ params }: Props) {
  const { slug } = await params;
  const event = await getCachedEventDetail(slug);

  if (!event) {
    notFound();
  }

  return <ProductDetail event={event} />;
}

function EventDetailSkeleton() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <Skeleton className="aspect-[1.2/1] w-full border" />
          <div className="flex flex-col gap-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-12 w-4/5" />
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-24 w-full" />
            <div className="border bg-card p-6">
              <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
            <Skeleton className="h-11 w-40" />
          </div>
        </div>
      </div>
    </section>
  );
}
