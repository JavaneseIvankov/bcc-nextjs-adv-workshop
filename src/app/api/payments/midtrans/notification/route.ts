import {
  type MidtransNotificationPayload,
  verifyMidtransSignature,
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

  if (!verifyMidtransSignature(payload)) {
    return Response.json(
      { status: 401, message: "Invalid signature", data: null },
      { status: 401 },
    );
  }

  const resolvedStatus =
    payload.transaction_status === "settlement" ||
    payload.transaction_status === "capture"
      ? "paid"
      : payload.transaction_status === "pending"
        ? "pending"
        : "failed";

  if (!paymentRepo.isKnownStatus(resolvedStatus)) {
    return Response.json(
      { status: 400, message: "Unsupported transaction status", data: null },
      { status: 400 },
    );
  }

  const payment = await paymentRepo.getByOrderId(payload.order_id);
  if (!payment) {
    return Response.json(
      { status: 404, message: "Order not found", data: null },
      { status: 404 },
    );
  }

  // Idempotent: we always write the latest status payload for the same order id.
  const updatedPayment = await paymentRepo.updateByOrderId(payload.order_id, {
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
