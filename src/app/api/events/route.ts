import { EventItem } from "@/app/types";
import { eventRepo } from "@/server/repositories";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest) {
   const events = await eventRepo.getAll()
   const eventItems= events.map((evt) => ({
      name: evt.title,
      date: evt.date,
      image: {
         src: evt.imageUrl,
         alt: evt.title
      },
      slug: evt.slug,
      description: evt.description,
      price: {
         regular: evt.priceIDR,
         currency: "IDR"
      },
   }))

   return Response.json({
      status: 200,
      message: "Succefully fetched events",
      data: eventItems
   }) 
}