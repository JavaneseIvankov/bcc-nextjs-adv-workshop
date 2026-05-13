import type { EventItem } from "@/app/types"
import { ProductDetail } from "@/components/product-detail"
import { eventRepo } from "@/server/repositories"
import { notFound } from "next/navigation"

export default async function EventDetailPage({
   params 
}: {
   params: Promise<{slug: string}>
}) {
   const { slug } = await params
   const event = await eventRepo.getBySlug(slug)

   if (event.length === 0) {
      notFound()
   }

   const eventDetail = {
      name: event[0].title,
      date: event[0].date,
      image: {
         src: event[0].imageUrl,
         alt: event[0].title,
      },
      slug: event[0].slug,
      description: event[0].description,
      price: {
         regular: event[0].priceIDR,
         currency: "IDR",
      },
   } satisfies EventItem

   return (
      <ProductDetail event={eventDetail} />
   )
}
