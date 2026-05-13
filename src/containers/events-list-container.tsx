import { EventsList } from "@/components/events-list";
import { env } from "@/lib/env";

export async function EventsListContainer() {
   const res = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/events`)
   const data = await res.json()

   return (
      <EventsList eventsList={data.data}/>
   )
}