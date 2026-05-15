import { relations } from "drizzle-orm";
import { bigint, index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export * from "./auth-schema";

export const ROLES = ["admin", "user"] as const;
export type Role = (typeof ROLES)[number];

export const RESERVATION_STATUSES = ["pending", "paid", "cancelled"] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const PAYMENT_STATUSES = ["pending", "paid", "failed"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const event = pgTable(
  "event",
  {
    id: text("id").primaryKey(),
    imageUrl: text("image_url").notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    date: text("date").notNull(),
    location: text("location").notNull(),
    priceIDR: bigint("price_idr", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("event_slug_unique").on(table.slug)],
);

export const reservation = pgTable(
  "reservation",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: text("status")
      .$type<ReservationStatus>()
      .default("pending")
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("reservation_user_event_unique").on(table.userId, table.eventId),
  ],
);

export const payment = pgTable(
  "payment",
  {
    id: text("id").primaryKey(),
    reservationId: text("reservation_id")
      .notNull()
      .references(() => reservation.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    orderId: text("order_id").notNull().unique(),
    redirectUrl: text("redirect_url"),
    amountIDR: bigint("amount_idr", { mode: "number" }).notNull(),
    status: text("status").$type<PaymentStatus>().default("pending").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("payment_reservation_id_idx").on(table.reservationId),
    index("payment_user_id_idx").on(table.userId),
  ],
);

export const eventRelations = relations(event, ({ many }) => ({
  reservations: many(reservation),
}));

export const reservationRelations = relations(reservation, ({ one, many }) => ({
  event: one(event, {
    fields: [reservation.eventId],
    references: [event.id],
  }),
  user: one(user, {
    fields: [reservation.userId],
    references: [user.id],
  }),
  payments: many(payment),
}));

export const paymentRelations = relations(payment, ({ one }) => ({
  user: one(user, {
    fields: [payment.userId],
    references: [user.id],
  }),
  reservation: one(reservation, {
    fields: [payment.reservationId],
    references: [reservation.id],
  }),
}));
