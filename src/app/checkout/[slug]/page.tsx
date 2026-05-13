import { Checkout } from "@/components/checkout";
import { eventRepo } from "@/server/repositories";
import { notFound } from "next/navigation";

export default async function CheckoutPage({
   params
}: {
   params: Promise<{slug: string}>
}) {
   const { slug } = await params
   const event = await eventRepo.getBySlug(slug)

   if (event.length === 0) {
      notFound()
   }

   return <Checkout/>
}