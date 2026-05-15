import { AdminEventManagerContainer } from "@/components/admin-event-manager-container";
import { Skeleton } from "@/components/ui/skeleton";
import { requireAdmin } from "@/lib/authz";
import { formatIDR } from '@/lib/utils';
import { eventRepo, paymentRepo, reservationRepo } from "@/server/repositories";
import { Suspense } from "react";

export default function AdminPage() {
  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold">Admin Console</h1>
      <p className="mt-2 text-muted-foreground">
        Manage events and monitor reservations and earnings.
      </p>
      <Suspense fallback={<AdminSkeleton />}>
        <AdminContent />
      </Suspense>
    </main>
  );
}

async function AdminContent() {
  await requireAdmin();

  const [events, reservations, totalEarnings] = await Promise.all([
    eventRepo.getAll(),
    reservationRepo.getAllWithUserEvent(),
    paymentRepo.getTotalSuccessfulAmountIDR(),
  ]);

  return (
    <>
      <div className="mt-6 border bg-card p-4">
        <h2 className="text-lg font-semibold">Total Earnings</h2>
        <p className="mt-1 text-3xl font-bold">{formatIDR(totalEarnings)}</p>
        <p className="text-sm text-muted-foreground">
          Counted from successful payments only.
        </p>
      </div>

      <div className="mt-8">
        <AdminEventManagerContainer events={events} />
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Reservations</h2>
        <div className="mt-3 overflow-x-auto border">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-2 text-left">Event</th>
                <th className="px-3 py-2 text-left">User</th>
                <th className="px-3 py-2 text-left">Reservation</th>
                <th className="px-3 py-2 text-left">Payment</th>
                <th className="px-3 py-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((item) => (
                <tr key={item.reservationId} className="border-t">
                  <td className="px-3 py-2">{item.eventTitle}</td>
                  <td className="px-3 py-2">
                    <p>{item.userName}</p>
                    <p className="text-xs text-muted-foreground">{item.userEmail}</p>
                  </td>
                  <td className="px-3 py-2">{item.reservationStatus}</td>
                  <td className="px-3 py-2">{item.paymentStatus ?? "-"}</td>
                  <td className="px-3 py-2">
                    {item.paymentAmountIDR ? formatIDR(item.paymentAmountIDR) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function AdminSkeleton() {
  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="border bg-card p-4">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full" />
          ))}
        </div>
      </div>

      <div className="border bg-card p-4">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
