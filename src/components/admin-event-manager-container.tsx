"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AdminEventManagerView } from "./admin-event-manager-view";

type EventRow = {
  id: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  priceIDR: number;
};

type AdminEventManagerContainerProps = {
  events: EventRow[];
};

export function AdminEventManagerContainer({
  events,
}: AdminEventManagerContainerProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateEvent(formData: FormData) {
    setIsCreating(true);
    setError(null);

    try {
      const payload = Object.fromEntries(formData.entries());

      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(result.message ?? "Failed to create event");
        return;
      }

      router.refresh();
    } catch {
      setError("Unexpected error while creating event");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteEvent(id: string) {
    setDeletingId(id);
    setError(null);

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      });

      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(result.message ?? "Failed to delete event");
        return;
      }

      router.refresh();
    } catch {
      setError("Unexpected error while deleting event");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminEventManagerView
      events={events}
      error={error}
      isCreating={isCreating}
      deletingId={deletingId}
      onCreateEvent={handleCreateEvent}
      onDeleteEvent={handleDeleteEvent}
    />
  );
}
