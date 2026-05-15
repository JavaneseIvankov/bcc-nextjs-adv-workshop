import type { EventItem } from "@/app/types";
import { eventRepo } from "@/server/repositories";
import { cacheLife, cacheTag } from "next/cache";

function toEventItem(input: {
  title: string;
  date: string;
  imageUrl: string;
  slug: string;
  description: string;
  priceIDR: number;
}): EventItem {
  return {
    name: input.title,
    date: input.date,
    image: {
      src: input.imageUrl,
      alt: input.title,
    },
    slug: input.slug,
    description: input.description,
    price: {
      regular: input.priceIDR,
      currency: "IDR",
    },
  };
}

export async function getCachedEventList() {
  "use cache";
  cacheLife("hours");
  cacheTag("events");

  const events = await eventRepo.getAll();
  return events.map(toEventItem);
}

export async function getCachedEventDetail(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("events");

  const event = await eventRepo.getBySlug(slug);
  if (!event) {
    return null;
  }

  return toEventItem({
    title: event.title,
    date: event.date,
    imageUrl: event.imageUrl,
    slug: event.slug,
    description: event.description,
    priceIDR: event.priceIDR,
  });
}
