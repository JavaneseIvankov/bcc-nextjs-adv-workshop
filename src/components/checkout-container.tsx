"use client";

import { useState } from "react";

import { CheckoutView } from "./checkout-view";

type CheckoutContainerProps = {
  eventSlug: string;
  eventName: string;
  eventDate: string;
  priceIDR: number;
};

type CheckoutResponse =
  | {
      status: 200;
      message: string;
      data: { redirectUrl: string; orderId: string };
    }
  | {
      status: number;
      message: string;
      data: null;
    };

export function CheckoutContainer({
  eventSlug,
  eventName,
  eventDate,
  priceIDR,
}: CheckoutContainerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: eventSlug }),
      });

      const payload = (await response.json()) as CheckoutResponse;
      if (!response.ok || payload.data == null) {
        setError(payload.message ?? "Failed to create transaction");
        return;
      }

      window.location.href = payload.data.redirectUrl;
    } catch {
      setError("Unexpected error while creating payment.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CheckoutView
      eventName={eventName}
      eventDate={eventDate}
      priceIDR={priceIDR}
      error={error}
      isLoading={isLoading}
      onCheckout={handleCheckout}
    />
  );
}
