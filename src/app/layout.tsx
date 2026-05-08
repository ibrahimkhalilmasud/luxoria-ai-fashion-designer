import type { Metadata } from "next";
import "./globals.css";
import { PwaRegistration } from "@/components/pwa-registration";

export const metadata: Metadata = {
  title: "Luxoria AI Fashion Designer",
  description: "Luxury couture design studio for online/offline garment design, patterning, and export.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-zinc-950 text-zinc-100">
        <PwaRegistration />
        {children}
      </body>
    </html>
  );
}
