import { env } from "@/lib/env";
import { createHash } from "node:crypto";

const SNAP_BASE_URL = env.MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com"
  : "https://app.sandbox.midtrans.com";

export type MidtransNotificationPayload = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  transaction_id?: string;
  transaction_status: string;
  signature_key?: string;
  fraud_status?: string;
};

function getAuthHeader() {
  const encoded = Buffer.from(`${env.MIDTRANS_SERVER_KEY}:`).toString("base64");
  return `Basic ${encoded}`;
}

export async function createSnapTransaction(input: {
  orderId: string;
  grossAmount: number;
  itemName: string;
  customer: {
    firstName: string;
    email: string;
  };
}) {
  const response = await fetch(`${SNAP_BASE_URL}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: input.orderId,
        gross_amount: input.grossAmount,
      },
      item_details: [
        {
          id: input.orderId,
          price: input.grossAmount,
          quantity: 1,
          name: input.itemName.slice(0, 50),
        },
      ],
      customer_details: {
        first_name: input.customer.firstName,
        email: input.customer.email,
      },
      credit_card: {
        secure: true,
      },
    }),
  });

  const payload = (await response.json()) as
    | {
        token: string;
        redirect_url: string;
      }
    | {
        status_message?: string;
      };

  if (!response.ok || !("token" in payload) || !("redirect_url" in payload)) {
    const message =
      "status_message" in payload
        ? payload.status_message
        : "Unable to create Midtrans transaction";
    throw new Error(message ?? "Unable to create Midtrans transaction");
  }

  return {
    redirectUrl: payload.redirect_url,
  };
}

export function verifyMidtransSignature(payload: MidtransNotificationPayload) {
  if (!payload.signature_key) {
    return false;
  }

  const raw = `${payload.order_id}${payload.status_code}${payload.gross_amount}${env.MIDTRANS_SERVER_KEY}`;
  const signature = createHash("sha512").update(raw).digest("hex");
  return signature === payload.signature_key;
}
