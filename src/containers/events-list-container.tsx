import { EventsList } from "@/components/events-list";
import { getCachedEventList } from "@/server/event-queries";

export async function EventsListContainer() {
   // Foundation: this container stays small because the cache wiring lives in
   // the server read model, which is the actual live demo surface.
   const events = await getCachedEventList()

   return (
      <EventsList eventsList={events}/>
   )
}
