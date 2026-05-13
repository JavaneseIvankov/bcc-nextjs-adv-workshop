import { db } from "@/lib/db/db"
import { event, payment, reservation } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export const eventRepo = {
   getAll: async () => {
      const res = await db.select().from(event)
      return res
   },
   getById: async (id: string) => {
      const res = await db.select().from(event).where(eq(event.id, id))
      return res
   },
   getBySlug: async (slug: string) => {
      const res = await db.select().from(event).where(eq(event.slug, slug))
      return res
   }
}

export const reservationRepo = {
   getOwned: async (userId: string) => {
      const res = await db
         .select()
         .from(reservation)
         .join(event)
         .on(eq(reservation.eventId, event.id))
         .where(eq(reservation.userId, userId))
      return res
   },
   getAll: async () => {
      const res = await db.select().from(reservation)
      return res
   },
   getById: async (id: string) => {
      const res = await db.select().from(reservation).where(eq(reservation.id, id))
      return res
   },
   getByEventId: async (eventId: string) => {
      const res = await db.select().from(reservation).where(eq(reservation.eventId, eventId))
      return res
   }
}

export const paymentRepo = {
   getOwned: async (userId: string) => {
      const res = await db.select().from(payment).where(eq(payment.userId, userId))
      return res
   },
   getAll: async () => {
      const res = await db.select().from(payment)
      return res
   },
}