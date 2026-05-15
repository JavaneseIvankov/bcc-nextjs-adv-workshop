"use client";

import { formatIDR } from "@/lib/utils";

type CheckoutViewProps = {
  eventName: string;
  eventDate: string;
  priceIDR: number;
  isLoading?: boolean;
  error?: string | null;
  onCheckout: () => Promise<void> | void;
};

export function CheckoutView({
  eventName,
  eventDate,
  priceIDR,
  isLoading = false,
  error,
  onCheckout,
}: CheckoutViewProps) {
  return (
    <main className="container py-10">
      <div className="mx-auto max-w-2xl border bg-card p-6">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="mt-2 text-muted-foreground">
          This page keeps the payment flow intentionally small: one ticket, one
          reservation, one Midtrans redirect.
        </p>

        <div className="mt-6 space-y-2 border p-4">
          <p className="font-semibold">{eventName}</p>
          <p className="text-sm text-muted-foreground">{eventDate}</p>
          <p className="text-lg font-bold">{formatIDR(priceIDR)}</p>
        </div>

        {error ? (
          <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <button
          type="button"
          onClick={onCheckout}
          disabled={isLoading}
          className="mt-6 w-full bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-60"
        >
          {isLoading ? "Creating payment..." : "Pay with Midtrans"}
        </button>
      </div>
    </main>
  );
}
