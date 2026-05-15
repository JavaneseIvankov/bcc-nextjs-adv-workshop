/* eslint-disable @typescript-eslint/no-unused-vars */
declare module "midtrans-client" {
  type MidtransConfig = {
    isProduction?: boolean;
    serverKey?: string;
    clientKey?: string;
  };

  type MidtransTransactionParameter = {
    transaction_details: {
      order_id: string;
      gross_amount: number;
    };
    item_details?: Array<{
      id?: string;
      price: number;
      quantity: number;
      name: string;
    }>;
    customer_details?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
    };
    credit_card?: {
      secure?: boolean;
    };
  };

  type MidtransTransactionResponse = {
    token?: string;
    redirect_url?: string;
    order_id: string;
    transaction_id?: string;
    transaction_status: string;
    fraud_status?: string;
    status_message?: string;
  };

  class MidtransError extends Error {
    httpStatusCode?: number | null;
    ApiResponse?: MidtransTransactionResponse;
    rawHttpClientData?: unknown;
  }

  class Snap {
    constructor(config?: MidtransConfig);

    createTransaction(
      parameter: MidtransTransactionParameter,
    ): Promise<MidtransTransactionResponse>;

    transaction: {
      notification(
        notification:
          | string
          | {
              transaction_id?: string;
              order_id?: string;
              transaction_status?: string;
              fraud_status?: string;
            },
      ): Promise<MidtransTransactionResponse>;
    };
  }

  const midtransClient: {
    Snap: typeof Snap;
    MidtransError: typeof MidtransError;
  };

  export default midtransClient;
}
