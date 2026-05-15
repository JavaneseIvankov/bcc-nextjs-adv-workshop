import { auth } from "@/lib/auth"
import { db } from "./db"
import * as schema from "./schema"
import { EventItem } from "@/app/types"
import { userRepo } from "@/server/repositories"

type SeedUser = {
   name: string
   email: string
   password: string
   image?: string
}

const SEED_USERS: SeedUser[] = [
   {
      name: "Admin BCC",
      email: "admin@bcc.local",
      password: "Admin12345!",
      image: "https://i.pravatar.cc/300?img=12",
   },
   {
      name: "Alya Pratama",
      email: "alya@bcc.local",
      password: "Alya12345!",
      image: "https://i.pravatar.cc/300?img=32",
   },
   {
      name: "Bima Nugraha",
      email: "bima@bcc.local",
      password: "Bima12345!",
      image: "https://i.pravatar.cc/300?img=53",
   },
]

export const EVENTS_LIST: EventItem[] = [
  {
    name: "React & Next.js Masterclass 2026",
    date: "12-13 Agustus 2026",
    image: {
      src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      alt: "Logo React di layar laptop"
    },
    slug: "react-masterclass",
    description: "Workshop intensif 2 hari untuk menguasai modern web development bersama para tech lead dari industri.",
    price: {
      regular: 1500000,
      sale: 999000,
      currency: "IDR"
    },
    badge: {
      text: "Early Bird",
      color: "#34C759" // Hijau
    }
  },
  {
    name: "Stand Up Comedy Festival",
    date: "20 September 2026",
    image: {
      src: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80",
      alt: "Mikrofon di atas panggung dengan latar belakang gelap"
    },
    slug: "stand-up-fest",
    description: "Tertawa semalaman suntuk bersama komika-komika papan atas Indonesia dalam satu panggung megah.",
    price: {
      regular: 450000,
      currency: "IDR"
    }
  },
  {
    name: "Marathon Kota Malang 10K",
    date: "4 Oktober 2026",
    image: {
      src: "https://images.unsplash.com/photo-1530143311094-34d807799e8f?w=800&q=80",
      alt: "Orang-orang sedang berlari marathon di jalan raya"
    },
    slug: "malang-marathon-10k",
    description: "Bergabunglah dalam event lari tahunan terbesar di Jawa Timur. Nikmati rute sejuk melintasi ikon-ikon kota.",
    price: {
      regular: 250000,
      currency: "IDR"
    },
  }
];


function getAuthHeaders() {
   const host = new URL(auth.options.baseURL).host
   return new Headers({
      host,
   })
}

function resolvePriceIDR(price: { regular: number; sale?: number; currency: string }) {
   if (price.currency !== "IDR") {
      throw new Error(`Unsupported currency for seed: ${price.currency}`)
   }

   return price.sale ?? price.regular
}

async function createAuthUsers() {
   const headers = getAuthHeaders()
   const users: Array<{ id: string; email: string; name: string }> = []

   for (const seedUser of SEED_USERS) {
      const result = await auth.api.signUpEmail({
         headers,
         body: seedUser,
      })

      if (seedUser.email === "admin@bcc.local") {
         await userRepo.setRole(seedUser.email, "admin")
      }

      users.push({
         id: result.user.id,
         email: result.user.email,
         name: result.user.name,
      })
   }

   return users
}

async function createEvents() {
   const eventRows = EVENTS_LIST.map((item) => ({
      id: crypto.randomUUID(),
      imageUrl: item.image.src,
      title: item.name,
      slug: item.slug,
      description: item.description,
      date: item.date,
      location: item.image.alt,
      priceIDR: resolvePriceIDR(item.price),
   }))

   await db.insert(schema.event).values(eventRows)
   return eventRows
}

async function createReservationsAndPayments(params: {
   users: Array<{ id: string }>
   events: Array<{ id: string; priceIDR: number }>
}) {
   const reservations = params.users.flatMap((user, userIndex) => {
      return params.events
         .filter((_, eventIndex) => eventIndex !== userIndex % params.events.length)
         .slice(0, 2)
         .map((event) => ({
            id: crypto.randomUUID(),
            eventId: event.id,
            userId: user.id,
         }))
   })

   const paymentByEventId = new Map(params.events.map((event) => [event.id, event.priceIDR]))
   const payments = reservations.map((reservation) => ({
      id: crypto.randomUUID(),
      reservationId: reservation.id,
      userId: reservation.userId,
      orderId: `SEED-${reservation.id}`,
      amountIDR: paymentByEventId.get(reservation.eventId) ?? 0,
      status: "paid" as const,
   }))

   await db.insert(schema.reservation).values(reservations)
   await db.insert(schema.payment).values(payments)

   return { reservations, payments }
}

async function seed() {
   console.log("Seeding db...")
   try {
      console.log("Deleting data...")
      await db.delete(schema.payment)
      await db.delete(schema.reservation)
      await db.delete(schema.event)
      await db.delete(schema.session)
      await db.delete(schema.account)
      await db.delete(schema.verification)
      await db.delete(schema.user)
      console.log("Data deleted\n")

      console.log("Inserting data...")
      const users = await createAuthUsers()
      const events = await createEvents()
      const { reservations, payments } = await createReservationsAndPayments({
         users,
         events,
      })

      console.log(`Seeded ${users.length} users`)
      console.log(`Seeded ${events.length} events`)
      console.log(`Seeded ${reservations.length} reservations`)
      console.log(`Seeded ${payments.length} payments`)
   } catch (error) {
      console.error("Failed to seed db")
      console.error(error)
      process.exitCode = 1
   }
}

void seed()
