export type Event = {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  price: number;
};

export const events: Event[] = [
  {
    id: "1",
    title: "Workshop Advanced Next.js",
    slug: "workshop-advanced-nextjs",
    description:
      "Workshop internal BCC Frontend untuk memahami rendering strategy, authentication, SEO, dan payment flow menggunakan Next.js.",
    date: "15 Mei 2026",
    location: "Zoom Meeting",
    price: 25000,
  },
  {
    id: "2",
    title: "Frontend Internal Sharing",
    slug: "frontend-internal-sharing",
    description:
      "Sesi sharing internal tentang praktik pengembangan frontend modern dan workflow kolaborasi tim.",
    date: "20 Mei 2026",
    location: "Discord BCC",
    price: 0,
  },
  {
    id: "3",
    title: "Mini Project Review",
    slug: "mini-project-review",
    description:
      "Review mini project frontend untuk membahas struktur aplikasi, reusable component, dan deployment readiness.",
    date: "25 Mei 2026",
    location: "Google Meet",
    price: 0,
  },
];

export function getEventBySlug(slug: string) {
  return events.find((event) => event.slug === slug);
}
