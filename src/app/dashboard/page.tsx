import { requireSession } from "@/lib/authz";
import { reservationRepo } from "@/server/repositories";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Suspense } from "react";

function statusLabel(status: string | null) {
  if (!status) return "pending";
  return status.replaceAll("_", " ");
}

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">My Reservations</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        This is the dynamic server-component example because it reads the
        signed-in user's reservation data.
      </p>
      <Suspense fallback={<ReservationsSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const session = await requireSession();
  const reservations = await reservationRepo.getOwnedDetailed(session.user.id);

  if (reservations.length === 0) {
    return (
      <div className="mt-6 border bg-card p-6">
        <p className="text-muted-foreground">No reservations yet.</p>
        <Link href="/" className="mt-3 inline-block underline">
          Browse events
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {reservations.map((item) => (
        <article key={item.reservationId} className="border bg-card p-4">
          <h2 className="font-semibold">{item.eventTitle}</h2>
          <p className="text-sm text-muted-foreground">{item.eventDate}</p>
          <p className="text-sm text-muted-foreground">{item.eventLocation}</p>
          <div className="mt-3 grid gap-1 text-sm">
            <p>
              Reservation:{" "}
              <span className="font-medium">{statusLabel(item.reservationStatus)}</span>
            </p>
            <p>
              Payment:{" "}
              <span className="font-medium">
                {statusLabel(item.paymentStatus ?? "pending")}
              </span>
            </p>
            <p>
              Order ID:{" "}
              <span className="font-mono text-xs">{item.paymentOrderId ?? "-"}</span>
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

function ReservationsSkeleton() {
  return (
    <div className="mt-6 flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <article key={idx} className="border bg-card p-4">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </article>
      ))}
    </div>
  );
}
