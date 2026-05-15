import { CheckoutContainer } from "@/components/checkout-container";
import { Skeleton } from "@/components/ui/skeleton";
import { requireSession } from "@/lib/authz";
import { eventRepo } from "@/server/repositories";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

export default function CheckoutPage({ params }: Props) {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutContent params={params} />
    </Suspense>
  );
}

async function CheckoutContent({ params }: Props) {
  await requireSession();
  const { slug } = await params;
  const event = await eventRepo.getBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <CheckoutContainer
      eventSlug={event.slug}
      eventName={event.title}
      eventDate={event.date}
      priceIDR={event.priceIDR}
    />
  );
}

function CheckoutSkeleton() {
  return (
    <main className="container py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 border bg-card p-6">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-11 w-36" />
      </div>
    </main>
  );
}
