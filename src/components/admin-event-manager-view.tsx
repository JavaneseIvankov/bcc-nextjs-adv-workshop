"use client";

type EventRow = {
  id: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  priceIDR: number;
};

type AdminEventManagerViewProps = {
  events: EventRow[];
  error?: string | null;
  isCreating?: boolean;
  deletingId?: string | null;
  onCreateEvent: (formData: FormData) => Promise<void> | void;
  onDeleteEvent: (id: string) => Promise<void> | void;
};

export function AdminEventManagerView({
  events,
  error,
  isCreating = false,
  deletingId = null,
  onCreateEvent,
  onDeleteEvent,
}: AdminEventManagerViewProps) {
  return (
    <section className="space-y-6">
      <form action={onCreateEvent} className="grid gap-3 border bg-card p-4">
        <h2 className="text-lg font-semibold">Create Event</h2>
        <p className="text-sm text-muted-foreground">
          Keep the form simple so the workshop can focus on cache invalidation
          after create and delete.
        </p>
        <input name="title" placeholder="Title" required className="border px-3 py-2" />
        <input name="slug" placeholder="slug" required className="border px-3 py-2" />
        <textarea
          name="description"
          placeholder="Description"
          required
          className="border px-3 py-2"
        />
        <input name="date" placeholder="Date text" required className="border px-3 py-2" />
        <input name="location" placeholder="Location" required className="border px-3 py-2" />
        <input name="imageUrl" placeholder="Image URL" required className="border px-3 py-2" />
        <input
          name="priceIDR"
          type="number"
          min={0}
          placeholder="Price IDR"
          required
          className="border px-3 py-2"
        />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          disabled={isCreating}
          type="submit"
          className="rounded bg-primary px-4 py-2 text-primary-foreground disabled:opacity-60"
        >
          {isCreating ? "Creating..." : "Create Event"}
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Existing Events</h2>
        {events.map((item) => (
          <article key={item.id} className="flex items-center justify-between border p-3">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.slug} • {item.date} • {item.location}
              </p>
            </div>
            <button
              type="button"
              className="rounded border px-3 py-1 text-sm"
              disabled={deletingId === item.id}
              onClick={() => onDeleteEvent(item.id)}
            >
              {deletingId === item.id ? "Removing..." : "Remove"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
