import midtransClient from "midtrans-client";

import { env } from "@/lib/env.server";

export type MidtransNotificationPayload = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  transaction_id?: string;
  transaction_status: string;
  signature_key?: string;
  fraud_status?: string;
};

type MidtransTransactionStatus = {
  order_id: string;
  transaction_status: string;
  fraud_status?: string;
};

const snap = new midtransClient.Snap({
  isProduction: env.MIDTRANS_IS_PRODUCTION,
  serverKey: env.MIDTRANS_SERVER_KEY,
});

function getMidtransErrorMessage(error: unknown) {
  if (error instanceof Error) {
    const maybeApiError = error as Error & {
      ApiResponse?: {
        status_message?: string;
      };
    };

    return (
      maybeApiError.ApiResponse?.status_message ??
      error.message ??
      "Unable to create Midtrans transaction"
    );
  }

  return "Unable to create Midtrans transaction";
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
  try {
    const transaction = await snap.createTransaction({
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
    });

    if (!transaction.redirect_url) {
      throw new Error("Unable to create Midtrans transaction");
    }

    return {
      redirectUrl: transaction.redirect_url,
    };
  } catch (error) {
    throw new Error(getMidtransErrorMessage(error));
  }
}

export async function getMidtransNotificationStatus(
  payload: MidtransNotificationPayload,
): Promise<MidtransTransactionStatus> {
  if (!payload.transaction_id) {
    throw new Error("Missing transaction_id in Midtrans notification");
  }

  return snap.transaction.notification(payload);
}
