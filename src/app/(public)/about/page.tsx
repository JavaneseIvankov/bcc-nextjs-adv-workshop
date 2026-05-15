import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Evently workshop demo app",
};

export default function AboutPage() {
  return (
    <main className="container py-12">
      <h1 className="text-3xl font-bold">About Evently</h1>
      <div className="mt-4 max-w-2xl space-y-4 text-muted-foreground">
        <p>
          Evently is a teaching project for the BCC Next.js advanced workshop.
          It stays intentionally small so each requirement is easy to point at
          in the codebase.
        </p>
        <p>
          This page is the static server-component example. The rest of the app
          shows authentication with better-auth, route guard with `proxy.ts`,
          cached event data, event SEO metadata, and a minimal Midtrans payment
          flow.
        </p>
      </div>
    </main>
  );
}
