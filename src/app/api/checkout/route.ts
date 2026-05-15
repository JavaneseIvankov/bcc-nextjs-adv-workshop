import { auth } from "@/lib/auth";
import { db } from "@/lib/db/db";
import { payment, reservation } from "@/lib/db/schema";
import { createSnapTransaction } from "@/lib/midtrans";
import { eventRepo } from "@/server/repositories";
import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

type Body = {
  slug?: string;
};

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json(
      {
        status: 401,
        message: "Unauthorized",
        data: null,
      },
      { status: 401 },
    );
  }

  const body = (await request.json()) as Body;
  if (!body.slug) {
    return Response.json(
      { status: 400, message: "slug is required", data: null },
      { status: 400 },
    );
  }

  const targetEvent = await eventRepo.getBySlug(body.slug);
  if (!targetEvent) {
    return Response.json(
      { status: 404, message: "Event not found", data: null },
      { status: 404 },
    );
  }

  const reservationId = crypto.randomUUID();
  const paymentId = crypto.randomUUID();
  const orderId = `EVT-${Date.now()}-${reservationId.slice(0, 8)}`;
  let transaction: { redirectUrl: string };

  try {
    transaction = await createSnapTransaction({
      orderId,
      grossAmount: targetEvent.priceIDR,
      itemName: targetEvent.title,
      customer: {
        firstName: session.user.name,
        email: session.user.email,
      },
    });

    await db.transaction(async (tx) => {
      const existingReservation = await tx
        .select({ id: reservation.id })
        .from(reservation)
        .where(
          and(
            eq(reservation.userId, session.user.id),
            eq(reservation.eventId, targetEvent.id),
          ),
        )
        .limit(1);

      if (existingReservation.length > 0) {
        throw new Error("DUPLICATE_RESERVATION");
      }

      await tx.insert(reservation).values({
        id: reservationId,
        eventId: targetEvent.id,
        userId: session.user.id,
        status: "pending",
      });

      await tx.insert(payment).values({
        id: paymentId,
        reservationId,
        userId: session.user.id,
        amountIDR: targetEvent.priceIDR,
        orderId,
        redirectUrl: transaction.redirectUrl,
        status: "pending",
      });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "DUPLICATE_RESERVATION") {
      return Response.json(
        {
          status: 409,
          message: "You have already booked this event",
          data: null,
        },
        { status: 409 },
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to create payment";
    return Response.json(
      { status: 502, message, data: null },
      { status: 502 },
    );
  }

  return Response.json({
    status: 200,
    message: "Checkout created",
    data: {
      orderId,
      redirectUrl: transaction.redirectUrl,
    },
  });
}
