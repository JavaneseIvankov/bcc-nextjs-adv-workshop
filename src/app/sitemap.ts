import type { MetadataRoute } from "next";
import { eventRepo } from "@/server/repositories";
import { env } from "@/lib/env.client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const events = await eventRepo.getAll();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const eventRoutes: MetadataRoute.Sitemap = events.map((item) => ({
    url: `${baseUrl}/events/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...eventRoutes];
}
