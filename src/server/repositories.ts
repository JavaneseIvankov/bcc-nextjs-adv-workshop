import { db } from "@/lib/db/db";
import {
  event,
  payment,
  PAYMENT_STATUSES,
  reservation,
  type PaymentStatus,
  type ReservationStatus,
  type Role,
  user,
} from "@/lib/db/schema";
import { and, desc, eq, inArray, sql } from "drizzle-orm";

export const eventRepo = {
  async getAll() {
    return db.select().from(event).orderBy(desc(event.createdAt));
  },

  async getById(id: string) {
    const rows = await db.select().from(event).where(eq(event.id, id)).limit(1);
    return rows[0] ?? null;
  },

  async getBySlug(slug: string) {
    const rows = await db
      .select()
      .from(event)
      .where(eq(event.slug, slug))
      .limit(1);
    return rows[0] ?? null;
  },

  async create(input: {
    title: string;
    slug: string;
    description: string;
    date: string;
    location: string;
    imageUrl: string;
    priceIDR: number;
  }) {
    const rows = await db
      .insert(event)
      .values({
        id: crypto.randomUUID(),
        ...input,
      })
      .returning();

    return rows[0];
  },

  async removeById(id: string) {
    const rows = await db
      .delete(event)
      .where(eq(event.id, id))
      .returning({ id: event.id });
    return rows[0] ?? null;
  },
};

export const reservationRepo = {
  async getOwnedDetailed(userId: string) {
    return db
      .select({
        reservationId: reservation.id,
        reservationStatus: reservation.status,
        reservationCreatedAt: reservation.createdAt,
        eventId: event.id,
        eventTitle: event.title,
        eventSlug: event.slug,
        eventDate: event.date,
        eventLocation: event.location,
        eventPriceIDR: event.priceIDR,
        paymentStatus: payment.status,
        paymentOrderId: payment.orderId,
      })
      .from(reservation)
      .innerJoin(event, eq(reservation.eventId, event.id))
      .leftJoin(payment, eq(payment.reservationId, reservation.id))
      .where(eq(reservation.userId, userId))
      .orderBy(desc(reservation.createdAt));
  },

  async getById(id: string) {
    const rows = await db
      .select()
      .from(reservation)
      .where(eq(reservation.id, id))
      .limit(1);
    return rows[0] ?? null;
  },

  async getByUserAndEvent(userId: string, eventId: string) {
    const rows = await db
      .select()
      .from(reservation)
      .where(and(eq(reservation.userId, userId), eq(reservation.eventId, eventId)))
      .limit(1);
    return rows[0] ?? null;
  },

  async create(input: {
    eventId: string;
    userId: string;
    status?: ReservationStatus;
  }) {
    const rows = await db
      .insert(reservation)
      .values({
        id: crypto.randomUUID(),
        eventId: input.eventId,
        userId: input.userId,
        status: input.status ?? "pending",
      })
      .returning();

    return rows[0];
  },

  async updateStatus(id: string, status: ReservationStatus) {
    const rows = await db
      .update(reservation)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(reservation.id, id))
      .returning();

    return rows[0] ?? null;
  },

  async getAllWithUserEvent() {
    return db
      .select({
        reservationId: reservation.id,
        reservationStatus: reservation.status,
        reservationCreatedAt: reservation.createdAt,
        eventTitle: event.title,
        eventDate: event.date,
        userName: user.name,
        userEmail: user.email,
        paymentAmountIDR: payment.amountIDR,
        paymentStatus: payment.status,
      })
      .from(reservation)
      .innerJoin(event, eq(reservation.eventId, event.id))
      .innerJoin(user, eq(reservation.userId, user.id))
      .leftJoin(payment, eq(payment.reservationId, reservation.id))
      .orderBy(desc(reservation.createdAt));
  },
};

export const paymentRepo = {
  async createPending(input: {
    reservationId: string;
    userId: string;
    amountIDR: number;
    orderId: string;
    redirectUrl: string;
  }) {
    const rows = await db
      .insert(payment)
      .values({
        id: crypto.randomUUID(),
        reservationId: input.reservationId,
        userId: input.userId,
        amountIDR: input.amountIDR,
        orderId: input.orderId,
        redirectUrl: input.redirectUrl,
        status: "pending",
      })
      .returning();

    return rows[0];
  },

  async getByOrderId(orderId: string) {
    const rows = await db
      .select()
      .from(payment)
      .where(eq(payment.orderId, orderId))
      .limit(1);
    return rows[0] ?? null;
  },

  async updateByOrderId(
    orderId: string,
    input: {
      status: PaymentStatus;
    },
  ) {
    const rows = await db
      .update(payment)
      .set({
        status: input.status,
        updatedAt: new Date(),
      })
      .where(eq(payment.orderId, orderId))
      .returning();

    return rows[0] ?? null;
  },

  async getOwned(userId: string) {
    return db.select().from(payment).where(eq(payment.userId, userId));
  },

  async getAll() {
    return db.select().from(payment).orderBy(desc(payment.createdAt));
  },

  async getTotalSuccessfulAmountIDR() {
    const rows = await db
      .select({
        total: sql<number>`coalesce(sum(${payment.amountIDR}), 0)::bigint`,
      })
      .from(payment)
      .where(inArray(payment.status, ["paid"]));

    return Number(rows[0]?.total ?? 0);
  },

  isKnownStatus(status: string): status is PaymentStatus {
    return (PAYMENT_STATUSES as readonly string[]).includes(status);
  },
};

export const userRepo = {
  async setRole(email: string, role: Role) {
    const rows = await db
      .update(user)
      .set({ role, updatedAt: new Date() })
      .where(eq(user.email, email))
      .returning({ id: user.id, role: user.role });

    return rows[0] ?? null;
  },

  async getRoleById(id: string) {
    const rows = await db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    return rows[0]?.role ?? null;
  },
};
