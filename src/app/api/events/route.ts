import { getCachedEventList } from "@/server/event-queries";

export async function GET() {
   const eventItems = await getCachedEventList()

   return Response.json({
      status: 200,
      message: "Successfully fetched events",
      data: eventItems
   }) 
}
