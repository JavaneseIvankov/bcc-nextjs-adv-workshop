import { auth } from '@/lib/auth';
import { session } from '@/lib/db/schema';
import { env } from '@/lib/env';
import { reservationRepo } from '@/server/repositories';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { EventItem } from '../types';

export default function DashboardPage() {
   return <div>hello from dashboard page</div>;
}

export async function MyReservationsContainer() {
   const session = await auth.api.getSession({
      headers: await headers(),
   });

   if (!session) {
      redirect('/login');
   }

   const res = await reservationRepo.getOwned(session.user.id);

   if (res.length === 0) {
      redirect('/dashboard');
   }

   if (res[0].userId !== session.user.id) {
      redirect('/dashboard');
   }

   return <MyReservations reservations={data.data} />;
}

export function MyReservationsError() {
   return (
      <div className="border bg-card">
         <h1>Something went wrong</h1>
      </div>
   );
}

type ReservationItem = {
   id: string;
   eventId: string;
   event: EventItem;
   userId: string;
   amountIDR: number;
   createdAt: string;
};

export function MyReservations({
   reservations,
}: {
   reservations: ReservationItem[];
}) {}
