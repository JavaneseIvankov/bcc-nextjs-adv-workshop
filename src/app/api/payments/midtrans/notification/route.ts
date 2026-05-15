import {
  getMidtransNotificationStatus,
  type MidtransNotificationPayload,
} from "@/lib/midtrans";
import { paymentRepo, reservationRepo } from "@/server/repositories";
import { NextRequest } from "next/server";

function toReservationStatus(transactionStatus: string) {
  if (transactionStatus === "paid") {
    return "paid" as const;
  }
  if (transactionStatus === "pending") {
    return "pending" as const;
  }
  return "cancelled" as const;
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as MidtransNotificationPayload;

  let notification;
  try {
    notification = await getMidtransNotificationStatus(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid Midtrans notification";

    return Response.json(
      { status: 401, message, data: null },
      { status: 401 },
    );
  }

  const resolvedStatus =
    notification.transaction_status === "settlement" ||
    (notification.transaction_status === "capture" &&
      notification.fraud_status !== "challenge")
      ? "paid"
      : notification.transaction_status === "pending"
        ? "pending"
        : "failed";

  if (!paymentRepo.isKnownStatus(resolvedStatus)) {
    return Response.json(
      { status: 400, message: "Unsupported transaction status", data: null },
      { status: 400 },
    );
  }

  const payment = await paymentRepo.getByOrderId(notification.order_id);
  if (!payment) {
    return Response.json(
      { status: 404, message: "Order not found", data: null },
      { status: 404 },
    );
  }

  // Idempotent: we always write the latest status payload for the same order id.
  const updatedPayment = await paymentRepo.updateByOrderId(notification.order_id, {
    status: resolvedStatus,
  });

  if (updatedPayment) {
    await reservationRepo.updateStatus(
      updatedPayment.reservationId,
      toReservationStatus(resolvedStatus),
    );
  }

  return Response.json({
    status: 200,
    message: "Notification processed",
    data: null,
  });
}
