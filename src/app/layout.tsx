import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Evently",
    template: "%s | Evently",
  },
  description: "Minimal event booking system for BCC Next.js advanced workshop",
  openGraph: {
    title: "Evently",
    description: "Book curated events with secure checkout flow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evently",
    description: "Book curated events with secure checkout flow",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", figtree.variable)}
    >
      <body className="min-h-full flex flex-col">
         <Providers>
         {children}
         </Providers>
      </body>
    </html>
  );
}
