import { EventsList } from "@/components/events-list";
import { getCachedEventList } from "@/server/event-queries";

export async function EventsListContainer() {
   const events = await getCachedEventList()

   return (
      <EventsList eventsList={events}/>
   )
}
